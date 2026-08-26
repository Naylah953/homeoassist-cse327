/**
 * socket/handlers.js
 * Real-time Socket.IO event handlers
 * Events:
 *   chat:join          — patient joins their chat session room
 *   chat:message       — broadcast new chat message to session room
 *   emergency:new      — patient fires emergency alert
 *   emergency:assign   — admin/system assigns doctor to emergency
 *   emergency:resolve  — doctor resolves emergency
 *   doctor:status      — doctor updates their availability status
 */

const pool = require('../db');

module.exports = function (io) {

  // Track connected doctors: { socketId → doctorId }
  const onlineDoctors = new Map();

  io.on('connection', (socket) => {

    // ── Chat session room ──────────────────────────────────
    socket.on('chat:join', ({ session_id }) => {
      socket.join(`chat:${session_id}`);
    });

    socket.on('chat:message', ({ session_id, role, content }) => {
      // Broadcast to everyone in the session room (doctor monitoring)
      io.to(`chat:${session_id}`).emit('chat:message', { role, content, time: new Date() });
    });

    // ── Doctor presence ────────────────────────────────────
    socket.on('doctor:online', ({ doctor_id }) => {
      onlineDoctors.set(socket.id, doctor_id);
      socket.join('doctors:online');
      io.emit('doctor:status', { doctor_id, is_available: true });
    });

    socket.on('doctor:busy', ({ doctor_id }) => {
      io.emit('doctor:status', { doctor_id, is_available: false });
    });

    // ── Emergency call routing ─────────────────────────────
    socket.on('emergency:new', async ({ patient_id, patient_name, patient_phone, symptoms, priority }) => {
      try {
        // Persist emergency call to DB
        const result = await pool.query(
          `INSERT INTO emergency_calls
             (patient_id, patient_name, patient_phone, symptoms, priority)
           VALUES ($1,$2,$3,$4,$5) RETURNING *`,
          [patient_id || null, patient_name, patient_phone, symptoms, priority || 'medium']
        );
        const call = result.rows[0];

        // Broadcast to all connected doctors
        io.to('doctors:online').emit('emergency:incoming', call);

        // Notify patient their call is queued
        socket.emit('emergency:queued', { call_id: call.id, message: 'Your emergency has been sent. A doctor will connect shortly.' });

        console.log(`🚨 Emergency #${call.id} — ${priority} priority — ${patient_name}`);
      } catch (err) {
        socket.emit('emergency:error', { message: err.message });
      }
    });

    socket.on('emergency:accept', async ({ call_id, doctor_id }) => {
      try {
        const result = await pool.query(
          `UPDATE emergency_calls
           SET status = 'connected', assigned_doctor = $1
           WHERE id = $2 AND status IN ('waiting', 'routing')
           RETURNING *`,
          [doctor_id, call_id]
        );
        if (result.rowCount > 0) {
          io.emit('emergency:update', result.rows[0]);
          console.log(`✅ Emergency #${call_id} accepted by doctor ${doctor_id}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('emergency:resolve', async ({ call_id, notes }) => {
      try {
        const result = await pool.query(
          `UPDATE emergency_calls
           SET status = 'resolved', notes = $1, resolved_at = NOW()
           WHERE id = $2 RETURNING *`,
          [notes || null, call_id]
        );
        if (result.rowCount > 0) {
          io.emit('emergency:update', result.rows[0]);
        }
      } catch (err) {
        console.error(err);
      }
    });

    // ── Disconnect ─────────────────────────────────────────
    socket.on('disconnect', () => {
      const doctorId = onlineDoctors.get(socket.id);
      if (doctorId) {
        onlineDoctors.delete(socket.id);
        io.emit('doctor:status', { doctor_id: doctorId, is_available: false });
      }
    });
  });
};
