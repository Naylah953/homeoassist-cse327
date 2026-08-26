/**
 * routes/auth.js
 * Login + Registration for all roles
 */
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');

const SECRET = process.env.JWT_SECRET || 'homeoassist_secret';

// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ success: false, error: 'email, password and role are required' });

  const tableMap = { admin: 'admins', doctor: 'doctors', patient: 'patients' };
  const table = tableMap[role];
  if (!table)
    return res.status(400).json({ success: false, error: 'Invalid role. Use: admin | doctor | patient' });

  try {
    const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
    if (result.rowCount === 0)
      return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, error: 'Invalid credentials' });

    delete user.password;

    const token = jwt.sign({ id: user.id, role }, SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, role, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/auth/register/patient ───────────────────────
router.post('/register/patient', async (req, res) => {
  const { name, email, password, phone, age, gender, address } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, error: 'name, email and password are required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO patients (name, email, password, phone, age, gender, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, name, email, phone, age, gender`,
      [name, email, hashed, phone || null, age || null, gender || null, address || null]
    );
    const user  = result.rows[0];
    const token = jwt.sign({ id: user.id, role: 'patient' }, SECRET, { expiresIn: '24h' });
    res.status(201).json({ success: true, token, role: 'patient', user });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, error: 'Email already registered' });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/auth/register/doctor ────────────────────────
router.post('/register/doctor', async (req, res) => {
  const { name, email, password, reg_no, specialty, qualifications, phone, address, bio } = req.body;
  if (!name || !email || !password || !reg_no)
    return res.status(400).json({ success: false, error: 'name, email, password and reg_no are required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO doctors (name, email, password, reg_no, specialty, qualifications, phone, address, bio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name, email, reg_no, specialty`,
      [name, email, hashed, reg_no, specialty || null, qualifications || null,
       phone || null, address || null, bio || null]
    );
    const user  = result.rows[0];
    const token = jwt.sign({ id: user.id, role: 'doctor' }, SECRET, { expiresIn: '24h' });
    res.status(201).json({ success: true, token, role: 'doctor', user });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, error: 'Email or registration number already in use' });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────
router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ success: false, error: 'No token' });

  try {
    const payload   = jwt.verify(header.split(' ')[1], SECRET);
    const tableMap  = { admin: 'admins', doctor: 'doctors', patient: 'patients' };
    const table     = tableMap[payload.role];
    const result    = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [payload.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'User not found' });

    const user = result.rows[0];
    delete user.password;
    res.json({ success: true, role: payload.role, user });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

module.exports = router;
