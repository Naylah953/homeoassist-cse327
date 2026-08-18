import { PView } from '../../types'
import { Ico, IC } from '../../components/ui/Ico'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { TopBar } from '../../components/layout/Topbar'

// ── Dashboard ─────────────────────────────────────────────────────────────────

interface PatientDashboardViewProps {
  goTo: (v: PView) => void
  onProfileClick?: () => void
  profile?: any
}

export function PatientDashboardView({ goTo, onProfileClick, profile }: PatientDashboardViewProps) {
  return (
    <div>
      <TopBar 
        title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Raisa'}`} 
        sub="Thursday, 11 July 2025" 
        onProfileClick={onProfileClick} 
        profile={profile}
        avatarBg="var(--color-accent)"
        defaultInitials="RH"
      />
      <div className="p-8 flex flex-col gap-6">

        {/* Greeting Banner */}
        <div 
          className="rounded-xl p-6 flex items-center justify-between overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1b2d20 0%, #2d6a4f 100%)' }}
        >
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1.2px)', backgroundSize: '24px 24px' }} 
          />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(224,235,226,0.55)' }}>
              Your health, your pace
            </p>
            <h2 className="text-[24px] font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: '#e0ebe2'}}>
              How are you feeling today?
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => goTo('chat')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: 'white' }}
              >
                <Ico d={IC.chat} size={20} /> Start AI Chat
              </button>
              <button 
                onClick={() => goTo('emergency')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors hover:bg-white/15"
                style={{ border: '1px solid rgba(255,255,255,0.25)', color: '#e0ebe2' }}
              >
                <Ico d={IC.zap} size={20} /> Emergency SOS
              </button>
            </div>
          </div>
          <div className="relative text-right hidden lg:block">
            <p className="text-[15px] uppercase tracking-wider mb-1" style={{ color: 'rgba(224,235,226,0.45)' }}>Current Plan</p>
            <p className="text-[25px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#c9913d' }}>Pro Plan</p>
            <p className="text-[14px] mt-0.5" style={{ color: 'rgba(224,235,226,0.55)' }}>Unlimited AI Chats · Priority Booking</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-5">
          {/* Next Appointment */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[15px] font-bold uppercase tracking-widest mb-3" style={{ color: '#aa6900' }}>Next Appointment</p>
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}
                >
                  AR
                </div>
                <div>
                  <p className="text-[18px] font-semibold" style={{ color: '#1b2d20' }}>
                    Dr. Anika Rahman
                  </p>
                  <p className="text-[14px]" style={{ color: '#7a7468' }}>Allergies & Respiratory · Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4 text-[15px] font-medium" style={{ color: '#1b2d20' }}>
                <span className="flex items-center gap-1.5"><Ico d={IC.calendar} size={15} /> 16 Jul 2025</span>
                <span className="flex items-center gap-1.5"><Ico d={IC.clock} size={15} /> 09:00 AM</span>
              </div>
            </div>
            <button 
              onClick={() => goTo('appointments')}
              className="w-full py-2 rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}
            >
              <Ico d={IC.video} size={20} /> Join Video Call
            </button>
          </Card>

          {/* Active Prescription */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[15px] font-bold uppercase tracking-widest mb-3" style={{ color: '#aa6900' }}>Active Prescription</p>
              <div className="mb-3">
                <p className="text-[18px] font-semibold mb-1" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>RX-2025-0089</p>
                <p className="text-[15px] mb-1" style={{ color: '#7a7468' }}>Issued by Dr. Anika Rahman · 2 Jul 2025</p>
                <p className="text-[15px] font-medium" style={{ color: '#1b2d20' }}>Arsenicum Album 30C · Allium Cepa 6C</p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge label="Active" variant="success" />
                <Badge label="QR Verified" variant="gold" />
              </div>
            </div>
            <button 
              onClick={() => goTo('records')}
              className="w-full py-2 rounded-lg text-[15px] font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#f5f2ed]"
              style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}
            >
              <Ico d={IC.download} size={20} /> Download PDF
            </button>
          </Card>

          {/* Subscription & Stats */}
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#aa6900' }}>Subscription</p>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[18px] font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>Pro Plan</p>
                <Badge label="Active" variant="success" />
              </div>
              <div className="text-[15px] flex flex-col gap-1" style={{ color: '#7a7468' }}>
                {['Unlimited AI symptom chats', 'Priority appointment booking', 'Emergency doctor routing', '20% off consultation fees'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #915700', paddingTop: 12 }}>
              <div className="flex justify-between text-[14px]">
                {[['Appointments', '14'], ['AI Chats', '31'], ['Prescriptions', '3']].map(([l, v]) => (
                  <div key={l} className="text-center">
                    <p className="text-[20px] font-bold" style={{ color: '#1b2d20' }}>{v}</p>
                    <p style={{ color: '#7a7468' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
          </div>
          <div>
            {[
              { icon: IC.chat,     label: 'AI symptom chat completed',         sub: 'Summary sent to Dr. Anika Rahman',   time: 'Today, 08:51 AM',    color: '#2d6a4f' },
              { icon: IC.calendar, label: 'Appointment confirmed',             sub: 'Dr. Anika Rahman · 16 Jul · Online', time: 'Today, 09:00 AM',    color: '#c9913d' },
              { icon: IC.file,     label: 'Prescription RX-2025-0089 issued',  sub: 'Dr. Anika Rahman · 2 Jul 2025',      time: '2 Jul, 09:45 AM',    color: '#2d6a4f' },
              { icon: IC.receipt,  label: 'Payment ₹800 confirmed',            sub: 'APT-0031 · UPI · PhonePe',           time: '10 Jul, 11:20 AM',   color: '#7a7468' },
            ].map((item, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]" style={{ borderBottom: i < 3 ? '1px solid #ede9e3' : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.color + '18', color: item.color }}>
                  <Ico d={item.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium" style={{ color: '#1b2d20' }}>{item.label}</p>
                  <p className="text-[14px]" style={{ color: '#7a7468' }}>{item.sub}</p>
                </div>
                <p className="text-[16px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#882b00' }}>{item.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}