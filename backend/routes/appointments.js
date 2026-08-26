/**
 * routes/appointments.js
 * Book, view, update and cancel appointments
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET /api/appointments ─────────────────────────────────
// Query: patient_id, doctor_id, status, page, limit
router.get('/', authenticate, async (req, res) => {
  try {
    const { patient_id, doctor_id, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    // Patients can only see their own; doctors only their own
    if (req.user.role === 'patient') {
      params.push(req.user.id);
      conditions.push(`a.patient_id = $${params.length}`);
    } else if (req.user.role === 'doctor') {
      params.push(req.user.id);
      conditions.push(`a.doctor_id = $${params.length}`);
    } else {
      // admin can filter freely
      if (patient_id) { params.push(patient_id); conditions.push(`a.patient_id = $${params.length}`); }
      if (doctor_id)  { params.push(doctor_id);  conditions.push(`a.doctor_id  = $${params.length}`); }
    }

    if (status) { params.push(status); conditions.push(`a.status = $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM appointments a ${where}`, params
    );

    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT a.*,
              p.name AS patient_name,
              d.name AS doctor_name, d.specialty
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors  d ON d.id = a.doctor_id
       ${where}
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
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

// ── GET /api/appointments/:id ─────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*,
              p.name AS patient_name, p.phone AS patient_phone,
              d.name AS doctor_name,  d.specialty, d.fee
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors  d ON d.id = a.doctor_id
       WHERE a.id = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Appointment not found' });

    const appt = result.rows[0];
    // Access control
    if (req.user.role === 'patient' && req.user.id !== appt.patient_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });
    if (req.user.role === 'doctor' && req.user.id !== appt.doctor_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });

    res.json({ success: true, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/appointments — Patient books appointment ────
router.post('/', authenticate, authorize('patient', 'admin'), async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, type, notes } = req.body;

  // Patient can only book for themselves
  const pid = req.user.role === 'patient' ? req.user.id : patient_id;
  if (!pid || !doctor_id || !appointment_date || !appointment_time)
    return res.status(400).json({ success: false, error: 'patient_id, doctor_id, date and time required' });

  try {
    // Fetch doctor fee
    const doc = await pool.query('SELECT fee FROM doctors WHERE id = $1', [doctor_id]);
    if (doc.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Doctor not found' });

    const result = await pool.query(
      `INSERT INTO appointments
         (patient_id, doctor_id, appointment_date, appointment_time, type, fee, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [pid, doctor_id, appointment_date, appointment_time,
       type || 'online', doc.rows[0].fee, notes || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/appointments/:id/status ────────────────────
router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const allowed = ['upcoming', 'completed', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, error: `status must be one of: ${allowed.join(', ')}` });

  try {
    const check = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
    if (check.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Appointment not found' });

    const appt = check.rows[0];
    if (req.user.role === 'patient' && req.user.id !== appt.patient_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });
    if (req.user.role === 'doctor' && req.user.id !== appt.doctor_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });

    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/appointments/:id/pay — Mark as paid ────────
router.patch('/:id/pay', authenticate, authorize('admin', 'patient'), async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE appointments SET is_paid = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/appointments/:id — Admin only ─────────────
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 RETURNING id', [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
