/**
 * routes/medicines.js
 * Search, browse, and manage homeopathic medicines
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET /api/medicines ────────────────────────────────────
// Public. Query params: search, featured, page, limit
router.get('/', async (req, res) => {
  try {
    const { search, featured, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(m_txt ILIKE $${params.length} OR m_btxt ILIKE $${params.length})`);
    }
    if (featured === 'true') {
      conditions.push('m_du = true');
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count query
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM medicines ${where}`, params
    );

    // Data query with pagination
    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT m_id, m_txt, m_btxt, m_du FROM medicines ${where}
       ORDER BY m_id ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      success: true,
      total: parseInt(countResult.rows[0].count),
      page:  parseInt(page),
      limit: parseInt(limit),
      data:  dataResult.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/medicines/:id ────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT m_id, m_txt, m_btxt, m_du FROM medicines WHERE m_id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/medicines — Admin only ──────────────────────
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { m_txt, m_btxt, m_du } = req.body;
  if (!m_txt)
    return res.status(400).json({ success: false, error: 'm_txt (English name) is required' });

  try {
    const result = await pool.query(
      `INSERT INTO medicines (m_txt, m_btxt, m_du) VALUES ($1,$2,$3) RETURNING *`,
      [m_txt.trim(), m_btxt || null, m_du === true]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/medicines/:id — Admin only ─────────────────
router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { m_txt, m_btxt, m_du } = req.body;
  try {
    const result = await pool.query(
      `UPDATE medicines
       SET m_txt  = COALESCE($1, m_txt),
           m_btxt = COALESCE($2, m_btxt),
           m_du   = COALESCE($3, m_du)
       WHERE m_id = $4 RETURNING *`,
      [m_txt || null, m_btxt || null, m_du ?? null, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/medicines/:id — Admin only ────────────────
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM medicines WHERE m_id = $1 RETURNING m_id', [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    res.json({ success: true, message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
