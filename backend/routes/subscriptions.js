/**
 * routes/subscriptions.js
 * Subscription plan management (Basic / Pro / Clinic)
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const PLANS = {
  basic:  { price: 499,  features: ['2 AI chats/month', 'Standard booking', 'Prescription access'] },
  pro:    { price: 999,  features: ['Unlimited AI chats', 'Priority booking', 'Emergency SOS', '20% off fees'] },
  clinic: { price: 2499, features: ['Team access', 'Unlimited everything', 'Dedicated support', 'Analytics'] },
};

// ── GET /api/subscriptions/plans — Public ─────────────────
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: Object.entries(PLANS).map(([name, plan]) => ({ name, ...plan })),
  });
});

// ── GET /api/subscriptions/me — Patient's active sub ──────
router.get('/me', authenticate, async (req, res) => {
  const patient_id = req.user.role === 'patient' ? req.user.id : req.query.patient_id;
  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions
       WHERE patient_id = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC LIMIT 1`,
      [patient_id]
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/subscriptions — Subscribe to a plan ─────────
router.post('/', authenticate, async (req, res) => {
  const { plan, payment_ref, gateway } = req.body;
  const patient_id = req.user.role === 'patient' ? req.user.id : req.body.patient_id;

  if (!PLANS[plan])
    return res.status(400).json({ success: false, error: `plan must be: ${Object.keys(PLANS).join(', ')}` });

  try {
    // Expire any active subscription first
    await pool.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE patient_id = $1 AND status = 'active'`,
      [patient_id]
    );

    // Create new subscription — expires in 30 days
    const result = await pool.query(
      `INSERT INTO subscriptions (patient_id, plan, price, status, expires_at, payment_ref, gateway)
       VALUES ($1, $2, $3, 'active', NOW() + INTERVAL '30 days', $4, $5)
       RETURNING *`,
      [patient_id, plan, PLANS[plan].price, payment_ref || null, gateway || null]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/subscriptions/:id/cancel ───────────────────
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE subscriptions SET status = 'cancelled'
       WHERE id = $1 AND patient_id = $2 RETURNING *`,
      [req.params.id, req.user.role === 'patient' ? req.user.id : req.body.patient_id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/subscriptions — Admin: all subscriptions ─────
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { plan, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (plan)   { params.push(plan);   conditions.push(`s.plan = $${params.length}`); }
    if (status) { params.push(status); conditions.push(`s.status = $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countRes = await pool.query(`SELECT COUNT(*) FROM subscriptions s ${where}`, params);
    params.push(parseInt(limit)); params.push(offset);

    const dataRes = await pool.query(
      `SELECT s.*, p.name AS patient_name, p.email AS patient_email
       FROM subscriptions s
       JOIN patients p ON p.id = s.patient_id
       ${where}
       ORDER BY s.created_at DESC
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

module.exports = router;
