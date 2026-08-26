/**
 * routes/cdss.js
 * Clinical Decision Support System (CDSS)
 * Ranks homeopathic medicines based on symptom matching
 *
 * POST /api/cdss/recommend   — get ranked medicine recommendations
 * GET  /api/cdss/rubrics     — get symptom rubric categories
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate } = require('../middleware/auth');
const OpenAI  = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── POST /api/cdss/recommend ──────────────────────────────
// Body: { symptoms: string[], session_id?: number }
// Returns ranked list of medicines with match scores
router.post('/recommend', authenticate, async (req, res) => {
  const { symptoms, session_id } = req.body;
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0)
    return res.status(400).json({ success: false, error: 'symptoms array is required' });

  try {
    let rankedMedicines = [];

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
      // AI-powered ranking
      rankedMedicines = await aiRanking(symptoms);
    } else {
      // Keyword-based fallback ranking using the medicine DB
      rankedMedicines = await keywordRanking(symptoms);
    }

    res.json({ success: true, count: rankedMedicines.length, data: rankedMedicines });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/cdss/recommend-from-session ─────────────────
// Uses AI chat session summary to generate recommendations
router.post('/recommend-from-session', authenticate, async (req, res) => {
  const { session_id } = req.body;
  if (!session_id)
    return res.status(400).json({ success: false, error: 'session_id is required' });

  try {
    // Get session summary
    const sessionResult = await pool.query(
      'SELECT summary FROM chat_sessions WHERE id = $1', [session_id]
    );
    if (sessionResult.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Session not found' });

    const summary = sessionResult.rows[0].summary;
    if (!summary)
      return res.status(400).json({ success: false, error: 'Session has no summary yet. Call /summarize first.' });

    let rankedMedicines = [];

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
      rankedMedicines = await aiRankingFromSummary(summary);
    } else {
      // Extract keywords from summary for fallback
      const words = summary.toLowerCase().split(/\W+/).filter(w => w.length > 4);
      rankedMedicines = await keywordRanking(words.slice(0, 10));
    }

    res.json({ success: true, count: rankedMedicines.length, data: rankedMedicines });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── AI Ranking via OpenAI ─────────────────────────────────
async function aiRanking(symptoms) {
  // Get all featured medicines to provide context
  const medsResult = await pool.query(
    `SELECT m_id, m_txt FROM medicines WHERE m_du = true ORDER BY m_id LIMIT 200`
  );
  const medList = medsResult.rows.map(m => `${m.m_id}. ${m.m_txt}`).join('\n');

  const prompt = `You are a homeopathic clinical decision support system.

Patient symptoms: ${symptoms.join(', ')}

From the following list of homeopathic medicines, select the TOP 5 most suitable remedies based on classical homeopathic principles (like cures like, totality of symptoms, constitution).

For each medicine, provide:
- medicine_id (number from the list)
- name
- score (0-100 match percentage)
- potency (e.g. 30C, 200C, 6C)
- dosage (e.g. "4 pills, 3×/day · 14 days")
- indications (array of 3-4 key matching symptoms)
- note (brief clinical note)

Medicine list:
${medList}

Respond ONLY with valid JSON array, no markdown:
[{"medicine_id":1,"name":"...","score":92,"potency":"30C","dosage":"...","indications":["..."],"note":"..."}]`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = JSON.parse(completion.choices[0].message.content);
    return Array.isArray(parsed) ? parsed : (parsed.recommendations || parsed.medicines || []);
  } catch {
    return [];
  }
}

async function aiRankingFromSummary(summary) {
  const medsResult = await pool.query(
    `SELECT m_id, m_txt FROM medicines WHERE m_du = true ORDER BY m_id LIMIT 200`
  );
  const medList = medsResult.rows.map(m => `${m.m_id}. ${m.m_txt}`).join('\n');

  const prompt = `You are a homeopathic CDSS. Based on this clinical summary, recommend the top 5 medicines.

Clinical Summary:
${summary}

Medicine list:
${medList}

Respond with JSON array only:
[{"medicine_id":1,"name":"...","score":92,"potency":"30C","dosage":"4 pills, 3×/day · 14 days","indications":["symptom1","symptom2","symptom3"],"note":"brief note"}]`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
    temperature: 0.2,
  });

  try {
    // Extract JSON from response
    const text = completion.choices[0].message.content;
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

// ── Keyword-based fallback ranking ────────────────────────
// Ranks medicines via the imported repertory:
// symptom keywords → complain (rubrics) → dis_medi (graded links) → medicines_mdb
async function keywordRanking(symptoms) {
  const patterns = symptoms.slice(0, 5).map(s => `%${s}%`);

  const result = await pool.query(
    `SELECT mm.m_id, mm.m_txt, mm.m_btxt,
            SUM(dm.m_v)::int            AS grade_sum,
            COUNT(DISTINCT c.s_id)::int AS matched_rubrics
     FROM complain c
     JOIN dis_medi dm      ON dm.s_id = c.s_id
     JOIN medicines_mdb mm ON mm.m_id = dm.m_id
     WHERE c.s_name ILIKE ANY($1::text[])
     GROUP BY mm.m_id, mm.m_txt, mm.m_btxt
     ORDER BY grade_sum DESC, matched_rubrics DESC
     LIMIT 10`,
    [patterns]
  );

  // Normalize grade_sum to a 0-100 confidence score relative to the top hit
  const maxGrade = result.rows.length ? result.rows[0].grade_sum : 1;
  return result.rows.map(r => ({
    medicine_id:     r.m_id,
    name:            r.m_txt,
    bengali_name:    r.m_btxt,
    score:           Math.min(98, Math.round((r.grade_sum / maxGrade) * 95) + 3),
    matched_rubrics: r.matched_rubrics,
    potency:         '30C',
    dosage:          '4 pills, 3×/day · 7 days',
    indications:     symptoms.slice(0, 3),
    note:            'Repertory-graded match. Add an OpenAI key for AI-ranked results.',
  }));
}

module.exports = router;
