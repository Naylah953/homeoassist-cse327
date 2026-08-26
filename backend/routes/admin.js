/**
 * routes/admin.js
 * Admin dashboard stats and management endpoints
 */
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// ── GET /api/admin/stats ──────────────────────────────────
// Dashboard summary stats
router.get('/stats', async (req, res) => {
  try {
    const [
      doctors,
      patients,
      appointments,
      revenue,
      complaints,
      medicines,
      recentAppts,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM doctors'),
      pool.query('SELECT COUNT(*) FROM patients'),
      pool.query(`SELECT
                    COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE status = 'upcoming')  AS upcoming,
                    COUNT(*) FILTER (WHERE status = 'completed') AS completed,
                    COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
                  FROM appointments`),
      pool.query(`SELECT
                    COALESCE(SUM(fee), 0) AS total,
                    COALESCE(SUM(fee) FILTER (WHERE is_paid = true), 0) AS collected
                  FROM appointments WHERE status = 'completed'`),
      pool.query(`SELECT COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE status = 'open') AS open
                  FROM complaints`),
      pool.query('SELECT COUNT(*) FROM medicines'),
      pool.query(`SELECT a.id, a.appointment_date, a.appointment_time, a.status,
                         p.name AS patient_name, d.name AS doctor_name
                  FROM appointments a
                  JOIN patients p ON p.id = a.patient_id
                  JOIN doctors  d ON d.id = a.doctor_id
                  ORDER BY a.created_at DESC LIMIT 5`),
    ]);

    res.json({
      success: true,
      data: {
        doctors:      parseInt(doctors.rows[0].count),
        patients:     parseInt(patients.rows[0].count),
        medicines:    parseInt(medicines.rows[0].count),
        appointments: appointments.rows[0],
        revenue:      revenue.rows[0],
        complaints:   complaints.rows[0],
        recent_appointments: recentAppts.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/admin/revenue ────────────────────────────────
// Monthly revenue breakdown
router.get('/revenue', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(appointment_date, 'YYYY-MM') AS month,
         COUNT(*)                              AS appointments,
         COALESCE(SUM(fee), 0)                AS total_revenue,
         COALESCE(SUM(fee) FILTER (WHERE is_paid = true), 0) AS collected
       FROM appointments
       WHERE status = 'completed'
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/admin/doctors — All doctors (verified + unverified) ──
router.get('/doctors', async (req, res) => {
  try {
    const { verified, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = '';

    if (verified !== undefined) {
      params.push(verified === 'true');
      where = `WHERE is_verified = $1`;
    }

    const countResult = await pool.query(`SELECT COUNT(*) FROM doctors ${where}`, params);
    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT id, name, email, reg_no, specialty, qualifications,
              experience_yrs, fee, rating, review_count,
              is_available, is_verified, created_at
       FROM doctors ${where}
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

// ── GET /api/admin/profile ─────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM admins WHERE id = $1',
      [req.user.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Admin not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/admin/profile ──────────────────────────────
router.patch('/profile', async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE admins
       SET username = COALESCE($1, username),
           email    = COALESCE($2, email)
       WHERE id = $3
       RETURNING id, username, email, created_at`,
      [username, email, req.user.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/admin/password ──────────────────────────────
router.patch('/password', async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ success: false, error: 'current_password and new_password required' });

  try {
    const result = await pool.query('SELECT password FROM admins WHERE id = $1', [req.user.id]);
    const match  = await bcrypt.compare(current_password, result.rows[0].password);
    if (!match)
      return res.status(401).json({ success: false, error: 'Current password incorrect' });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
