/**
 * routes/prescriptions.js
 * Create, view and manage prescriptions with medicines
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET /api/prescriptions ────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { patient_id, doctor_id, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (req.user.role === 'patient') {
      params.push(req.user.id);
      conditions.push(`pr.patient_id = $${params.length}`);
    } else if (req.user.role === 'doctor') {
      params.push(req.user.id);
      conditions.push(`pr.doctor_id = $${params.length}`);
    } else {
      if (patient_id) { params.push(patient_id); conditions.push(`pr.patient_id = $${params.length}`); }
      if (doctor_id)  { params.push(doctor_id);  conditions.push(`pr.doctor_id  = $${params.length}`); }
    }
    if (status) { params.push(status); conditions.push(`pr.status = $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM prescriptions pr ${where}`, params
    );

    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT pr.*,
              p.name AS patient_name,
              d.name AS doctor_name, d.specialty,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id',          pm.id,
                    'medicine_id', pm.medicine_id,
                    'name',        m.m_txt,
                    'name_bn',     m.m_btxt,
                    'potency',     pm.potency,
                    'dosage',      pm.dosage,
                    'duration',    pm.duration,
                    'notes',       pm.notes
                  )
                ) FILTER (WHERE pm.id IS NOT NULL),
                '[]'
              ) AS medicines
       FROM prescriptions pr
       JOIN patients p ON p.id = pr.patient_id
       JOIN doctors  d ON d.id = pr.doctor_id
       LEFT JOIN prescription_medicines pm ON pm.prescription_id = pr.id
       LEFT JOIN medicines m ON m.m_id = pm.medicine_id
       ${where}
       GROUP BY pr.id, p.name, d.name, d.specialty
       ORDER BY pr.created_at DESC
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

// ── GET /api/prescriptions/:id ────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*,
              p.name AS patient_name, p.age, p.gender,
              d.name AS doctor_name,  d.specialty, d.reg_no,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id',          pm.id,
                    'medicine_id', pm.medicine_id,
                    'name',        m.m_txt,
                    'name_bn',     m.m_btxt,
                    'potency',     pm.potency,
                    'dosage',      pm.dosage,
                    'duration',    pm.duration,
                    'notes',       pm.notes
                  )
                ) FILTER (WHERE pm.id IS NOT NULL),
                '[]'
              ) AS medicines
       FROM prescriptions pr
       JOIN patients p ON p.id = pr.patient_id
       JOIN doctors  d ON d.id = pr.doctor_id
       LEFT JOIN prescription_medicines pm ON pm.prescription_id = pr.id
       LEFT JOIN medicines m ON m.m_id = pm.medicine_id
       WHERE pr.id = $1
       GROUP BY pr.id, p.name, p.age, p.gender, d.name, d.specialty, d.reg_no`,
      [req.params.id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Prescription not found' });

    const rx = result.rows[0];
    if (req.user.role === 'patient' && req.user.id !== rx.patient_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });
    if (req.user.role === 'doctor' && req.user.id !== rx.doctor_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });

    res.json({ success: true, data: rx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/prescriptions — Doctor creates prescription ─
router.post('/', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  const { patient_id, doctor_id, appointment_id, diagnosis, notes, medicines } = req.body;

  const did = req.user.role === 'doctor' ? req.user.id : doctor_id;
  if (!patient_id || !did || !diagnosis)
    return res.status(400).json({ success: false, error: 'patient_id, doctor_id and diagnosis required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const prResult = await client.query(
      `INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, diagnosis, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [patient_id, did, appointment_id || null, diagnosis, notes || null]
    );
    const prescription = prResult.rows[0];

    if (Array.isArray(medicines) && medicines.length > 0) {
      for (const med of medicines) {
        if (!med.medicine_id) continue;
        await client.query(
          `INSERT INTO prescription_medicines
             (prescription_id, medicine_id, potency, dosage, duration, notes)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [prescription.id, med.medicine_id,
           med.potency || null, med.dosage || null,
           med.duration || null, med.notes || null]
        );
      }
    }

    // Mark linked appointment as completed
    if (appointment_id) {
      await client.query(
        `UPDATE appointments SET status = 'completed' WHERE id = $1`, [appointment_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// ── PATCH /api/prescriptions/:id/status ──────────────────
router.patch('/:id/status', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  const { status } = req.body;
  if (!['active', 'completed'].includes(status))
    return res.status(400).json({ success: false, error: 'status must be active or completed' });

  try {
    const result = await pool.query(
      'UPDATE prescriptions SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/prescriptions/:id — Admin only ───────────
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM prescriptions WHERE id = $1 RETURNING id', [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
