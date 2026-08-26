import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { emergencyApi, EmergencyCall } from '../../api/emergency'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'

interface Props { onProfileClick?: () => void }

export function EmergencyView({ onProfileClick }: Props) {
  const { user } = useAuth()
  const { socket, connected } = useSocket()
  const [calls, setCalls]     = useState<EmergencyCall[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emergencyApi.active()
      .then(r => setCalls(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!socket) return
    // Listen for new incoming emergencies
    socket.on('emergency:incoming', (call: EmergencyCall) => {
      setCalls(prev => [call, ...prev])
    })
    socket.on('emergency:update', (updated: EmergencyCall) => {
      setCalls(prev => prev.map(c => c.id === updated.id ? updated : c))
    })
    return () => { socket.off('emergency:incoming'); socket.off('emergency:update') }
  }, [socket])

  const handleAccept = async (callId: number) => {
    if (!user?.id) return
    try {
      if (socket?.connected) {
        socket.emit('emergency:accept', { call_id: callId, doctor_id: user.id })
      } else {
        await emergencyApi.assign(callId, user.id as number)
      }
    } catch (err) { console.error(err) }
  }

  const handleResolve = async (callId: number) => {
    try {
      if (socket?.connected) {
        socket.emit('emergency:resolve', { call_id: callId, notes: 'Resolved by doctor' })
      } else {
        await emergencyApi.resolve(callId, 'Resolved by doctor')
      }
    } catch (err) { console.error(err) }
  }

  const active = calls.filter(c => c.status !== 'resolved' && c.status !== 'missed')
  const priorityColor: Record<string, string> = { critical: '#7f1d1d', high: '#c0392b', medium: '#c9913d', low: '#7a7468' }

  return (
    <div>
      <TopBar title="Emergency Call Routing" sub="Real-time AI triage and doctor routing"
        onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">

        {/* Socket status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: connected ? '#d1fae5' : '#fef3c7', border: `1px solid ${connected ? '#a7f3d0' : '#fde68a'}` }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: connected ? '#10b981' : '#f59e0b' }} />
          <p className="text-[12px] font-medium" style={{ color: connected ? '#065f46' : '#92400e' }}>
            {connected ? 'Real-time emergency routing active' : 'WebSocket offline — using REST fallback'}
          </p>
        </div>

        {/* Active emergency banner */}
        {active.filter(c => c.status === 'waiting' || c.status === 'routing').length > 0 && (
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
            style={{ background: '#fff1f2', border: '1px solid #fca5a5' }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#ef4444' }} />
            <p className="text-[13px] font-medium" style={{ color: '#b91c1c' }}>
              {active.filter(c => c.status === 'waiting').length} emergency call(s) waiting for a doctor
            </p>
          </div>
        )}

        {/* Call queue */}
        <Card>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Active Call Queue</h2>
            <Badge label={`${calls.length} total`} />
          </div>

          {loading ? (
            <p className="px-5 py-6 text-[13px]" style={{ color: '#7a7468' }}>Loading calls…</p>
          ) : calls.length === 0 ? (
            <p className="px-5 py-6 text-[13px] text-center" style={{ color: '#7a7468' }}>No active emergency calls.</p>
          ) : calls.map((call, i) => (
            <div key={call.id} className="px-5 py-4 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
              style={{ borderBottom: i < calls.length-1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[10px] font-bold px-2 py-1 rounded flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', background: '#ede9e3', color: '#7a7468' }}>#{call.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{call.patient_name || 'Anonymous'}</p>
                <p className="text-[11px] truncate" style={{ color: '#7a7468' }}>{call.symptoms || 'No symptom description'}</p>
                {call.patient_phone && <p className="text-[10px]" style={{ color: '#7a7468', fontFamily: 'var(--font-mono)' }}>{call.patient_phone}</p>}
              </div>
              <p className="text-[11px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>
                {new Date(call.created_at).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })}
              </p>
              <Badge label={call.priority} variant={call.priority === 'high' || call.priority === 'critical' ? 'danger' : call.priority === 'medium' ? 'warning' : 'default'} />
              <Badge
                label={call.status === 'waiting' ? 'Waiting' : call.status === 'connected' ? 'Connected' : call.status === 'resolved' ? 'Resolved' : 'Routing…'}
                variant={call.status === 'waiting' ? 'danger' : call.status === 'connected' ? 'accent' : 'success'}
              />
              <div className="flex gap-2 flex-shrink-0">
                {(call.status === 'waiting' || call.status === 'routing') && (
                  <button onClick={() => handleAccept(call.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                    Accept
                  </button>
                )}
                {call.status === 'connected' && call.assigned_doctor === user?.id && (
                  <button onClick={() => handleResolve(call.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90"
                    style={{ background: '#2d6a4f', color: 'white' }}>
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
