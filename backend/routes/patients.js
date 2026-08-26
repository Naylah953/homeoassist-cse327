/**
 * routes/patients.js
 * Patient profile & admin management
 */
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const PUBLIC_FIELDS = 'id, name, email, phone, age, gender, address, created_at';

// ── GET /api/patients — Admin only ───────────────────────
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = '';

    if (search) {
      params.push(`%${search}%`);
      where = `WHERE name ILIKE $1 OR email ILIKE $1`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM patients ${where}`, params
    );
    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM patients ${where}
       ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
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

// ── GET /api/patients/:id ─────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  if (req.user.role === 'patient' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ success: false, error: 'Forbidden' });

  try {
    const result = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM patients WHERE id = $1`, [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/patients/:id ───────────────────────────────
router.patch('/:id', authenticate, async (req, res) => {
  if (req.user.role === 'patient' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ success: false, error: 'Forbidden' });

  const { name, phone, age, gender, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE patients
       SET name    = COALESCE($1, name),
           phone   = COALESCE($2, phone),
           age     = COALESCE($3, age),
           gender  = COALESCE($4, gender),
           address = COALESCE($5, address)
       WHERE id = $6
       RETURNING ${PUBLIC_FIELDS}`,
      [name, phone, age, gender, address, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/patients/:id/password ─────────────────────
router.patch('/:id/password', authenticate, async (req, res) => {
  if (req.user.role === 'patient' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ success: false, error: 'Forbidden' });

  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ success: false, error: 'current_password and new_password required' });

  try {
    const result = await pool.query('SELECT password FROM patients WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Patient not found' });

    const match = await bcrypt.compare(current_password, result.rows[0].password);
    if (!match)
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE patients SET password = $1 WHERE id = $2', [hashed, req.params.id]);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/patients/:id — Admin only ─────────────────
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
