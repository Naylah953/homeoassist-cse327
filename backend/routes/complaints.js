/**
 * routes/complaints.js
 * File, view and manage complaints
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET /api/complaints — Admin sees all; users see own ───
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (req.user.role !== 'admin') {
      params.push(req.user.role);
      params.push(req.user.id);
      conditions.push(`(filed_by = $${params.length - 1} AND filer_id = $${params.length})`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM complaints ${where}`, params
    );
    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT * FROM complaints ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
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

// ── GET /api/complaints/:id ───────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM complaints WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Complaint not found' });

    const c = result.rows[0];
    if (req.user.role !== 'admin' &&
        !(c.filed_by === req.user.role && c.filer_id === req.user.id))
      return res.status(403).json({ success: false, error: 'Forbidden' });

    res.json({ success: true, data: c });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/complaints — Any logged-in user ─────────────
router.post('/', authenticate, async (req, res) => {
  const { against, against_id, subject, description } = req.body;
  if (!against || !against_id || !subject || !description)
    return res.status(400).json({ success: false, error: 'against, against_id, subject and description required' });

  try {
    const result = await pool.query(
      `INSERT INTO complaints (filed_by, filer_id, against, against_id, subject, description)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.role, req.user.id, against, against_id, subject, description]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/complaints/:id/status — Admin only ─────────
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  if (!['open', 'resolved', 'dismissed'].includes(status))
    return res.status(400).json({ success: false, error: 'status must be open | resolved | dismissed' });

  try {
    const result = await pool.query(
      'UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/complaints/:id — Admin only ───────────────
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM complaints WHERE id = $1 RETURNING id', [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
