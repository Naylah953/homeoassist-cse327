/**
 * routes/pdf.js
 * PDF Prescription Generator with QR Code
 * GET /api/pdf/prescription/:id  — download prescription as PDF
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const PDFDoc  = require('pdfkit');
const QRCode  = require('qrcode');
const { authenticate } = require('../middleware/auth');

router.get('/prescription/:id', authenticate, async (req, res) => {
  try {
    // Fetch full prescription data
    const result = await pool.query(
      `SELECT pr.*,
              p.name  AS patient_name, p.age, p.gender, p.phone AS patient_phone,
              d.name  AS doctor_name,  d.specialty, d.reg_no, d.qualifications,
              d.address AS clinic_address, d.phone AS doctor_phone,
              COALESCE(
                json_agg(
                  json_build_object(
                    'name',     m.m_txt,
                    'potency',  pm.potency,
                    'dosage',   pm.dosage,
                    'duration', pm.duration,
                    'notes',    pm.notes
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
       GROUP BY pr.id, p.name, p.age, p.gender, p.phone,
                d.name, d.specialty, d.reg_no, d.qualifications, d.address, d.phone`,
      [req.params.id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: 'Prescription not found' });

    const rx = result.rows[0];

    // Access control
    if (req.user.role === 'patient' && req.user.id !== rx.patient_id)
      return res.status(403).json({ success: false, error: 'Forbidden' });

    // Generate QR code (links to verification endpoint)
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/prescription/${rx.id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
    const qrBuffer  = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    // Build PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="HomeoAssist-RX-${rx.id}.pdf"`);

    const doc = new PDFDoc({ margin: 50, size: 'A4' });
    doc.pipe(res);

    // ── Header ────────────────────────────────────────────
    doc.rect(0, 0, 595, 100).fill('#1B4332');
    doc.fill('white').fontSize(22).font('Helvetica-Bold')
       .text('HomeoAssist', 50, 25);
    doc.fontSize(9).font('Helvetica')
       .text('AI-Powered Homeopathic Clinical Platform', 50, 52);
    doc.text('North South University · Dhaka, Bangladesh', 50, 65);

    // Prescription ID top right
    doc.fontSize(8).text(`RX #${rx.id}`, 400, 35, { width: 145, align: 'right' });
    doc.text(new Date(rx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 400, 48, { width: 145, align: 'right' });

    doc.fill('black');

    // ── Doctor info ───────────────────────────────────────
    doc.moveDown(2);
    doc.fontSize(13).font('Helvetica-Bold').text(rx.doctor_name);
    doc.fontSize(9).font('Helvetica').fill('#444')
       .text(`${rx.specialty}  ·  Reg: ${rx.reg_no}`);
    if (rx.qualifications) doc.text(rx.qualifications);
    if (rx.clinic_address) doc.text(`📍 ${rx.clinic_address}`);
    if (rx.doctor_phone)   doc.text(`📞 ${rx.doctor_phone}`);

    // Divider
    doc.fill('black').moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#1B4332').lineWidth(2).stroke();

    // ── Patient info ──────────────────────────────────────
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('PATIENT DETAILS', { continued: false });
    doc.fontSize(9).font('Helvetica');
    const patLine = `${rx.patient_name}  ·  Age: ${rx.age ?? '—'}  ·  Gender: ${rx.gender ?? '—'}`;
    doc.text(patLine);
    if (rx.patient_phone) doc.text(`Phone: ${rx.patient_phone}`);

    // Divider
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#aaa').lineWidth(0.5).stroke();

    // ── Diagnosis ─────────────────────────────────────────
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('DIAGNOSIS');
    doc.fontSize(9).font('Helvetica').text(rx.diagnosis || 'As per consultation');
    if (rx.notes) {
      doc.moveDown(0.2);
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('#555').text(`Notes: ${rx.notes}`);
    }
    doc.fillColor('black');

    // Divider
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#aaa').lineWidth(0.5).stroke();

    // ── Medicines table ───────────────────────────────────
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('PRESCRIBED MEDICINES');
    doc.moveDown(0.3);

    // Table header
    const col = { no: 50, name: 80, potency: 260, dosage: 330, duration: 430 };
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#555');
    doc.text('#',       col.no,      doc.y, { continued: true, width: 25 });
    doc.text('Medicine', col.name,   doc.y, { continued: true, width: 175 });
    doc.text('Potency',  col.potency, doc.y, { continued: true, width: 65 });
    doc.text('Dosage',   col.dosage,  doc.y, { continued: true, width: 95 });
    doc.text('Duration', col.duration,doc.y, { width: 95 });

    doc.moveDown(0.2);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ccc').lineWidth(0.5).stroke();
    doc.moveDown(0.2);
    doc.fillColor('black').font('Helvetica').fontSize(9);

    (rx.medicines || []).forEach((med, i) => {
      const y = doc.y;
      doc.text(`${i + 1}.`,     col.no,      y, { continued: true, width: 25 });
      doc.text(med.name || '—', col.name,    y, { continued: true, width: 175 });
      doc.text(med.potency || '—', col.potency, y, { continued: true, width: 65 });
      doc.text(med.dosage  || '—', col.dosage,  y, { continued: true, width: 95 });
      doc.text(med.duration || '—', col.duration, y, { width: 95 });
      if (med.notes) {
        doc.fontSize(8).fillColor('#777')
           .text(`   Note: ${med.notes}`, col.name, doc.y, { width: 400 });
        doc.fillColor('black').fontSize(9);
      }
      doc.moveDown(0.3);
    });

    // ── QR Code ───────────────────────────────────────────
    const qrY = doc.y + 10;
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#1B4332').lineWidth(1).stroke();
    doc.moveDown(0.5);
    doc.image(qrBuffer, 450, qrY, { width: 90 });
    doc.fontSize(8).font('Helvetica').fillColor('#555')
       .text('Scan to verify authenticity', 430, qrY + 95, { width: 120, align: 'center' });
    doc.fillColor('#1B4332').text('HomeoAssist Verified ✓', 430, qrY + 108, { width: 120, align: 'center' });

    // Doctor signature line
    doc.fillColor('black').moveDown(0.5);
    doc.fontSize(9).font('Helvetica-Bold').text(rx.doctor_name, 50, qrY + 20);
    doc.font('Helvetica').fontSize(8).fillColor('#555').text(`${rx.specialty}  ·  Reg: ${rx.reg_no}`, 50, qrY + 34);
    doc.moveTo(50, qrY + 14).lineTo(200, qrY + 14).strokeColor('#333').lineWidth(0.5).stroke();
    doc.fillColor('#777').text('Authorised Signature', 50, qrY + 47);

    // Footer
    doc.fillColor('#888').fontSize(7)
       .text(`This prescription was digitally generated by HomeoAssist · ID: RX-${rx.id} · ${new Date().toISOString()}`, 50, 800, { width: 495, align: 'center' });

    doc.end();
  } catch (err) {
    if (!res.headersSent)
      res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
