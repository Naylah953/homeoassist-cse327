/**
 * routes/rubrics.js
 * Symptom rubric categories (Mind, Head, Eye, etc.)
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET /api/rubrics — Public ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT sbr_id, sbr_txt, sbr_btxt FROM symptom_rubrics ORDER BY sbr_id ASC'
    );
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/rubrics/:id — Public ────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT sbr_id, sbr_txt, sbr_btxt FROM symptom_rubrics WHERE sbr_id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Rubric not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/rubrics — Admin only ───────────────────────
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { sbr_txt, sbr_btxt } = req.body;
  if (!sbr_txt)
    return res.status(400).json({ success: false, error: 'sbr_txt (English name) is required' });

  try {
    const result = await pool.query(
      `INSERT INTO symptom_rubrics (sbr_txt, sbr_btxt) VALUES ($1,$2) RETURNING *`,
      [sbr_txt.trim(), sbr_btxt || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/rubrics/:id — Admin only ──────────────────
router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { sbr_txt, sbr_btxt } = req.body;
  try {
    const result = await pool.query(
      `UPDATE symptom_rubrics
       SET sbr_txt  = COALESCE($1, sbr_txt),
           sbr_btxt = COALESCE($2, sbr_btxt)
       WHERE sbr_id = $3 RETURNING *`,
      [sbr_txt || null, sbr_btxt || null, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Rubric not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
