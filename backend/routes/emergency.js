/**
 * routes/emergency.js
 * Emergency call management — REST endpoints
 * Real-time routing handled via Socket.IO (socket/handlers.js)
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET /api/emergency — List all emergency calls ─────────
router.get('/', authenticate, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = '';

    if (req.user.role === 'doctor') {
      params.push(req.user.id);
      where = `WHERE (ec.assigned_doctor = $${params.length} OR ec.status = 'waiting')`;
    } else if (status) {
      params.push(status);
      where = `WHERE ec.status = $${params.length}`;
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM emergency_calls ec ${where}`, params);
    params.push(parseInt(limit));
    params.push(offset);

    const dataRes = await pool.query(
      `SELECT ec.*, d.name AS doctor_name
       FROM emergency_calls ec
       LEFT JOIN doctors d ON d.id = ec.assigned_doctor
       ${where}
       ORDER BY ec.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      success: true,
      total: parseInt(countRes.rows[0].count),
      data: dataRes.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/emergency — File emergency via REST (fallback) ─
router.post('/', authenticate, async (req, res) => {
  const { patient_name, patient_phone, symptoms, priority } = req.body;
  const patient_id = req.user.role === 'patient' ? req.user.id : null;

  try {
    const result = await pool.query(
      `INSERT INTO emergency_calls (patient_id, patient_name, patient_phone, symptoms, priority)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [patient_id, patient_name || null, patient_phone || null, symptoms || null, priority || 'medium']
    );
    const call = result.rows[0];

    // Broadcast to connected doctors via Socket.IO
    const io = req.app.get('io');
    if (io) io.to('doctors:online').emit('emergency:incoming', call);

    res.status(201).json({ success: true, data: call });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/emergency/:id/assign ──────────────────────
router.patch('/:id/assign', authenticate, authorize('admin', 'doctor'), async (req, res) => {
  const { doctor_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE emergency_calls
       SET assigned_doctor = $1, status = 'connected'
       WHERE id = $2 RETURNING *`,
      [doctor_id || req.user.id, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Emergency call not found' });

    const io = req.app.get('io');
    if (io) io.emit('emergency:update', result.rows[0]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/emergency/:id/resolve ─────────────────────
router.patch('/:id/resolve', authenticate, authorize('admin', 'doctor'), async (req, res) => {
  const { notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE emergency_calls
       SET status = 'resolved', notes = $1, resolved_at = NOW()
       WHERE id = $2 RETURNING *`,
      [notes || null, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Emergency call not found' });

    const io = req.app.get('io');
    if (io) io.emit('emergency:update', result.rows[0]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/emergency/active ─────────────────────────────
router.get('/active', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ec.*, d.name AS doctor_name
       FROM emergency_calls ec
       LEFT JOIN doctors d ON d.id = ec.assigned_doctor
       WHERE ec.status IN ('waiting', 'routing', 'connected')
       ORDER BY
         CASE ec.priority
           WHEN 'critical' THEN 1 WHEN 'high' THEN 2
           WHEN 'medium'   THEN 3 WHEN 'low'  THEN 4
         END, ec.created_at ASC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
