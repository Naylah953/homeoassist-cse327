/**
 * routes/chat.js
 * AI Symptom Collection Chatbot — powered by OpenAI
 *
 * POST /api/chat/session          — start a new session
 * POST /api/chat/session/:id/message — send a message, get AI reply
 * POST /api/chat/session/:id/summarize — generate structured summary
 * GET  /api/chat/session/:id      — get session + all messages
 * GET  /api/chat/sessions         — list patient's sessions
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate } = require('../middleware/auth');
const OpenAI  = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are HomeoBot, an AI symptom collection assistant for HomeoAssist, a homeopathic healthcare platform.

Your job is to:
1. Greet the patient warmly
2. Ask about their chief complaint
3. Ask structured follow-up questions: onset, duration, severity (1-10), location, what makes it better/worse, associated symptoms, sleep, appetite, emotional state, any past treatment
4. Keep questions short (one at a time)
5. Be empathetic and use simple language
6. Do NOT diagnose or suggest medicines — that is the doctor's job
7. After 8-12 exchanges, offer to generate a summary

Always respond in the same language the patient uses.`;

// ── POST /api/chat/session ─────────────────────────────────
router.post('/session', authenticate, async (req, res) => {
  const patient_id = req.user.role === 'patient' ? req.user.id : req.body.patient_id;
  const { doctor_id, appointment_id } = req.body;

  try {
    // Create session
    const session = await pool.query(
      `INSERT INTO chat_sessions (patient_id, doctor_id, appointment_id)
       VALUES ($1,$2,$3) RETURNING *`,
      [patient_id, doctor_id || null, appointment_id || null]
    );

    // Insert initial AI greeting
    const greeting = "Hello! I'm HomeoBot, your symptom assistant. I'll help gather your health information before your consultation. What's been troubling you lately? Please describe your main concern.";

    await pool.query(
      `INSERT INTO chat_messages (session_id, role, content) VALUES ($1, 'assistant', $2)`,
      [session.rows[0].id, greeting]
    );

    res.status(201).json({
      success: true,
      data: { ...session.rows[0], greeting }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/chat/session/:id/message ────────────────────
router.post('/session/:id/message', authenticate, async (req, res) => {
  const { content } = req.body;
  if (!content?.trim())
    return res.status(400).json({ success: false, error: 'content is required' });

  try {
    // Verify session exists and belongs to patient
    const sessionResult = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1', [req.params.id]
    );
    if (sessionResult.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Session not found' });

    const session = sessionResult.rows[0];
    if (req.user.role === 'patient' && session.patient_id !== req.user.id)
      return res.status(403).json({ success: false, error: 'Forbidden' });

    // Save user message
    await pool.query(
      `INSERT INTO chat_messages (session_id, role, content) VALUES ($1, 'user', $2)`,
      [session.id, content]
    );

    // Get conversation history
    const history = await pool.query(
      `SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC`,
      [session.id]
    );

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.rows.map(m => ({ role: m.role, content: m.content })),
    ];

    // Call OpenAI
    let aiReply = '';
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      });
      aiReply = completion.choices[0].message.content;
    } else {
      // Fallback when no API key — simple rule-based responses
      aiReply = generateFallbackResponse(history.rows.length, content);
    }

    // Save AI reply
    await pool.query(
      `INSERT INTO chat_messages (session_id, role, content) VALUES ($1, 'assistant', $2)`,
      [session.id, aiReply]
    );

    // Update session timestamp
    await pool.query(
      'UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1', [session.id]
    );

    // Emit to Socket.IO room if doctor is monitoring
    const io = req.app.get('io');
    if (io) {
      io.to(`chat:${session.id}`).emit('chat:message', { role: 'assistant', content: aiReply, time: new Date() });
    }

    res.json({ success: true, data: { role: 'assistant', content: aiReply } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/chat/session/:id/summarize ──────────────────
router.post('/session/:id/summarize', authenticate, async (req, res) => {
  try {
    const history = await pool.query(
      `SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC`,
      [req.params.id]
    );

    const transcript = history.rows
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.content}`)
      .join('\n');

    let summary = '';

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a medical summarizer for a homeopathic clinic. Given a symptom chat transcript, 
produce a structured clinical summary with these sections:
- Chief Complaint
- Duration & Onset
- Symptom Details (location, character, severity)
- Aggravating Factors
- Ameliorating Factors
- Associated Symptoms
- General (sleep, appetite, mood, energy)
- Previous Treatment

Be concise and clinical. Use bullet points. Format for a doctor to read quickly.`
          },
          { role: 'user', content: `Transcript:\n\n${transcript}` }
        ],
        max_tokens: 600,
        temperature: 0.3,
      });
      summary = completion.choices[0].message.content;
    } else {
      summary = generateFallbackSummary(history.rows);
    }

    // Save summary to session
    await pool.query(
      `UPDATE chat_sessions SET summary = $1, status = 'completed' WHERE id = $2`,
      [summary, req.params.id]
    );

    res.json({ success: true, data: { summary } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/chat/session/:id ─────────────────────────────
router.get('/session/:id', authenticate, async (req, res) => {
  try {
    const session = await pool.query(
      `SELECT cs.*, p.name AS patient_name, d.name AS doctor_name
       FROM chat_sessions cs
       LEFT JOIN patients p ON p.id = cs.patient_id
       LEFT JOIN doctors  d ON d.id = cs.doctor_id
       WHERE cs.id = $1`,
      [req.params.id]
    );
    if (session.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Session not found' });

    const messages = await pool.query(
      `SELECT role, content, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...session.rows[0], messages: messages.rows } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/chat/sessions ────────────────────────────────
router.get('/sessions', authenticate, async (req, res) => {
  try {
    const patient_id = req.user.role === 'patient' ? req.user.id : req.query.patient_id;
    const where = patient_id ? 'WHERE cs.patient_id = $1' : '';
    const params = patient_id ? [patient_id] : [];

    const result = await pool.query(
      `SELECT cs.id, cs.status, cs.summary, cs.created_at, cs.updated_at,
              p.name AS patient_name
       FROM chat_sessions cs
       LEFT JOIN patients p ON p.id = cs.patient_id
       ${where}
       ORDER BY cs.created_at DESC`,
      params
    );
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Fallback responses when no OpenAI key ─────────────────
function generateFallbackResponse(msgCount, lastMsg) {
  const questions = [
    "Thank you. How long have you been experiencing this? When did it start?",
    "On a scale of 1 to 10, how would you rate the severity?",
    "Does anything make it better or worse — like temperature, movement, time of day?",
    "Are you experiencing any other symptoms alongside this main concern?",
    "How has your sleep been lately — deep, restless, any unusual dreams?",
    "How is your appetite and thirst? Any cravings or aversions?",
    "How are you feeling emotionally — any stress, anxiety, or mood changes?",
    "Have you tried any treatment for this? If so, what helped or didn't help?",
    "Is there anything else you'd like your doctor to know before the consultation?",
    "Thank you — I have enough information now. Would you like me to generate a structured summary for your doctor?",
  ];
  const idx = Math.min(Math.floor(msgCount / 2), questions.length - 1);
  return questions[idx];
}

function generateFallbackSummary(messages) {
  const userMsgs = messages.filter(m => m.role === 'user').map(m => m.content);
  return `**Clinical Symptom Summary (Auto-generated)**\n\n` +
    `Chief Complaint: ${userMsgs[0] || 'Not specified'}\n\n` +
    `Patient Responses:\n${userMsgs.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\n` +
    `Note: Full AI summary requires OpenAI API key configuration.`;
}

module.exports = router;
