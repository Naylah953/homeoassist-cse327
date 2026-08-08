import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { ON_CALL_DOCTORS } from '../../data/patientMockData'

// ── Emergency SOS ─────────────────────────────────────────────────────────────

interface EmergencyProps {
  onProfileClick?: () => void
  profile?: any
}

export function EmergencyView({ onProfileClick, profile }: EmergencyProps) {
  const [called, setCalled] = useState(false)

  return (
  <div>
    <TopBar 
      title="Emergency SOS" 
      sub="Immediate access to on-call certified doctors" 
      onProfileClick={onProfileClick} 
      profile={profile}
      avatarBg="var(--color-accent)"
      defaultInitials="RH"
    />
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
            <p className="text-[13px] mb-6 max-w-sm" style={{ color: 'rgba(224,235,226,0.6)', lineHeight: 1.6 }}>
              Tap below to connect instantly with the AI triage assistant. You'll be routed to the first available on-call doctor.
            </p>
            <button onClick={() => setCalled(true)}
              className="px-10 py-3.5 rounded-2xl text-[14px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ background: '#c0392b', color: 'white', boxShadow: '0 0 24px rgba(192,57,43,0.5)' }}>
              Initiate Emergency Call
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: '#d1fae5' }}>
              <Ico d={IC.check} size={28} />
            </div>
            <h2 className="text-[20px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#b91c1c' }}>Connecting you now…</h2>
            <p className="text-[13px] mb-4" style={{ color: '#7a7468' }}>AI triage assistant is collecting your details. Estimated wait: &lt; 2 minutes.</p>
            <button onClick={() => setCalled(false)}
              className="text-[12px] font-medium transition-colors hover:opacity-70 cursor-pointer"
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
          <div className="divide-y" style={{ borderColor: '#ede9e3' }}>
            {ON_CALL_DOCTORS.map((doc, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                  <p className="text-[10px]" style={{ color: '#7a7468' }}>{doc.specialty} Homeopathy</p>
                </div>
                <div className="text-right">
                  <Badge label={doc.status === 'available' ? 'Available' : 'Busy'} variant={doc.status === 'available' ? 'success' : 'warning'} />
                  <p className="text-[10px] mt-1" style={{ color: '#7a7468', fontFamily: 'var(--font-mono)' }}>{doc.wait}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Helpline & info */}
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Emergency Helpline</p>
            <a href="tel:18001234567"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[18px] transition-colors hover:opacity-90"
              style={{ background: '#d8f3dc', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
              <Ico d={IC.phone} size={18} />
              1800-123-4567
            </a>
            <p className="text-[10px] mt-2" style={{ color: '#7a7468' }}>Toll-free · Available 24×7 · All Bangladesh</p>
          </div>

          <div style={{ borderTop: '1px solid #ede9e3', paddingTop: 16 }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>How It Works</p>
            {['Call or tap the SOS button above', 'AI voice assistant collects your symptoms', 'Priority matched to next available doctor', 'Doctor connects within minutes'].map((step, i) => (
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
  )
}