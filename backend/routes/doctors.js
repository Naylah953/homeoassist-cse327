/**
 * routes/doctors.js
 * Doctor listing, profile, and management
 */
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const PUBLIC_FIELDS = `id, name, email, reg_no, specialty, qualifications,
                       bio, experience_yrs, rating, review_count, fee,
                       phone, address, is_available, is_verified, created_at`;

// ── GET /api/doctors — Public ─────────────────────────────
// Query: specialty, available, search, page, limit
router.get('/', async (req, res) => {
  try {
    const { specialty, available, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = ['is_verified = true'];

    if (specialty) {
      params.push(`%${specialty}%`);
      conditions.push(`specialty ILIKE $${params.length}`);
    }
    if (available === 'true') {
      conditions.push('is_available = true');
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR specialty ILIKE $${params.length})`);
    }

    const where = 'WHERE ' + conditions.join(' AND ');

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM doctors ${where}`, params
    );

    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM doctors ${where}
       ORDER BY rating DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
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

// ── GET /api/doctors/:id — Public ────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM doctors WHERE id = $1`, [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/doctors/:id — Doctor updates own profile ───
router.patch('/:id', authenticate, async (req, res) => {
  // Doctor can only edit their own profile; admin can edit any
  if (req.user.role === 'doctor' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ success: false, error: 'Forbidden' });

  const { name, specialty, qualifications, bio, experience_yrs, fee, phone, address, is_available } = req.body;
  try {
    const result = await pool.query(
      `UPDATE doctors
       SET name            = COALESCE($1,  name),
           specialty       = COALESCE($2,  specialty),
           qualifications  = COALESCE($3,  qualifications),
           bio             = COALESCE($4,  bio),
           experience_yrs  = COALESCE($5,  experience_yrs),
           fee             = COALESCE($6,  fee),
           phone           = COALESCE($7,  phone),
           address         = COALESCE($8,  address),
           is_available    = COALESCE($9,  is_available)
       WHERE id = $10
       RETURNING ${PUBLIC_FIELDS}`,
      [name, specialty, qualifications, bio, experience_yrs, fee, phone, address, is_available, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/doctors/:id/password ───────────────────────
router.patch('/:id/password', authenticate, async (req, res) => {
  if (req.user.role === 'doctor' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ success: false, error: 'Forbidden' });

  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ success: false, error: 'current_password and new_password required' });

  try {
    const result = await pool.query('SELECT password FROM doctors WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Doctor not found' });

    const match = await bcrypt.compare(current_password, result.rows[0].password);
    if (!match)
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE doctors SET password = $1 WHERE id = $2', [hashed, req.params.id]);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/doctors/:id/verify — Admin only ───────────
router.patch('/:id/verify', authenticate, authorize('admin'), async (req, res) => {
  const { is_verified } = req.body;
  try {
    const result = await pool.query(
      `UPDATE doctors SET is_verified = $1 WHERE id = $2 RETURNING ${PUBLIC_FIELDS}`,
      [is_verified !== false, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/doctors/:id — Admin only ─────────────────
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
