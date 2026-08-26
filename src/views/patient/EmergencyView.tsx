import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { emergencyApi } from '../../api/emergency'
import { doctorsApi, Doctor } from '../../api/doctors'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'

interface EmergencyProps {
  onProfileClick?: () => void
  profile?: Record<string, unknown>
}

export function EmergencyView({ onProfileClick, profile }: EmergencyProps) {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [called, setCalled]       = useState(false)
  const [callId, setCallId]       = useState<number | null>(null)
  const [status, setStatus]       = useState('')
  const [doctors, setDoctors]     = useState<Doctor[]>([])
  const [symptoms, setSymptoms]   = useState('')
  const [priority, setPriority]   = useState<'low'|'medium'|'high'>('medium')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    doctorsApi.list({ available: true }).then(r => setDoctors(r.data.slice(0, 3))).catch(console.error)
  }, [])

  // Listen for real-time emergency updates
  useEffect(() => {
    if (!socket) return
    socket.on('emergency:queued',  (data: { call_id: number; message: string }) => {
      setCallId(data.call_id)
      setStatus(data.message)
    })
    socket.on('emergency:update', (data: { id: number; status: string }) => {
      if (data.id === callId) setStatus(`Status: ${data.status}`)
    })
    return () => { socket.off('emergency:queued'); socket.off('emergency:update') }
  }, [socket, callId])

  const handleSOS = async () => {
    setSubmitting(true)
    try {
      if (socket && socket.connected) {
        socket.emit('emergency:new', {
          patient_id:    user?.id,
          patient_name:  (user?.name as string) ?? 'Patient',
          patient_phone: (user?.phone as string) ?? '',
          symptoms,
          priority,
        })
      } else {
        const res = await emergencyApi.create({
          patient_name:  (user?.name as string) ?? 'Patient',
          patient_phone: (user?.phone as string) ?? '',
          symptoms,
          priority,
        })
        setCallId(res.data.id)
        setStatus('Emergency filed. A doctor will contact you shortly.')
      }
      setCalled(true)
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <TopBar title="Emergency SOS" sub="Immediate access to on-call certified doctors"
        onProfileClick={onProfileClick} profile={profile}
        avatarBg="var(--color-accent)" defaultInitials="RH" />

      <div className="p-8 flex flex-col gap-5">
        {/* SOS Button */}
        <div className="flex flex-col items-center py-10 px-6 rounded-2xl text-center"
          style={{ background: called ? '#fff1f2' : '#1b2d20', border: called ? '2px solid #fca5a5' : '2px solid transparent', transition: 'all 0.3s ease' }}>
          {!called ? (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative"
                style={{ background: '#c0392b' }}>
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(192,57,43,0.35)' }} />
                <Ico d={IC.zap} size={32} />
              </div>
              <h2 className="text-[22px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#e0ebe2' }}>Emergency SOS</h2>
              <p className="text-[13px] mb-4 max-w-sm" style={{ color: 'rgba(224,235,226,0.6)', lineHeight: 1.6 }}>
                Briefly describe your situation, then tap the button below to connect instantly with an on-call doctor.
              </p>
              {/* Quick symptom input */}
              <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
                placeholder="Brief description (e.g. severe chest pain, difficulty breathing…)"
                rows={2}
                className="w-full max-w-sm px-4 py-2.5 rounded-xl text-[13px] outline-none resize-none mb-3"
                style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
              {/* Priority selector */}
              <div className="flex gap-2 mb-5">
                {(['low','medium','high'] as const).map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
                    style={priority === p
                      ? { background: p === 'high' ? '#c0392b' : p === 'medium' ? '#c9913d' : '#2d6a4f', color: 'white' }
                      : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={handleSOS} disabled={submitting}
                className="px-10 py-3.5 rounded-2xl text-[14px] font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
                style={{ background: '#c0392b', color: 'white', boxShadow: '0 0 24px rgba(192,57,43,0.5)' }}>
                {submitting ? 'Connecting…' : 'Initiate Emergency Call'}
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#d1fae5' }}>
                <Ico d={IC.check} size={28} />
              </div>
              <h2 className="text-[20px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#b91c1c' }}>Connecting you now…</h2>
              {callId && <p className="text-[11px] mb-1 font-mono" style={{ color: '#7a7468' }}>Call ID: #{callId}</p>}
              <p className="text-[13px] mb-4" style={{ color: '#7a7468' }}>{status || 'AI triage is routing your call. Estimated wait: < 2 minutes.'}</p>
              <button onClick={() => { setCalled(false); setCallId(null); setStatus('') }}
                className="text-[12px] font-medium transition-colors hover:opacity-70"
                style={{ color: '#7a7468' }}>Cancel Call</button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* On-call doctors */}
          <Card>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>On-Call Doctors</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>Real-time availability</p>
            </div>
            {doctors.length === 0 ? (
              <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>Loading doctors…</p>
            ) : doctors.map((doc, i) => (
              <div key={doc.id} className="px-5 py-3.5 flex items-center gap-3"
                style={{ borderBottom: i < doctors.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {doc.name.split(' ').slice(1).map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                  <p className="text-[10px]" style={{ color: '#7a7468' }}>{doc.specialty}</p>
                </div>
                <Badge label={doc.is_available ? 'Available' : 'Busy'} variant={doc.is_available ? 'success' : 'warning'} />
              </div>
            ))}
          </Card>

          {/* Helpline info */}
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Emergency Helpline</p>
              <a href="tel:18001234567"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[18px] transition-colors hover:opacity-90"
                style={{ background: '#d8f3dc', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
                <Ico d={IC.phone} size={18} />1800-123-4567
              </a>
              <p className="text-[10px] mt-2" style={{ color: '#7a7468' }}>Toll-free · Available 24×7</p>
            </div>
            <div style={{ borderTop: '1px solid #ede9e3', paddingTop: 16 }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>How It Works</p>
              {['Tap SOS or call the helpline', 'AI collects your symptoms', 'Routed to next available doctor', 'Doctor connects within minutes'].map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: '#131f16', color: '#e0ebe2' }}>{i + 1}</span>
                  <p className="text-[12px]" style={{ color: '#1b2d20' }}>{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
