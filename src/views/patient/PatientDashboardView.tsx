import { PView } from '../../types'
import { Ico, IC } from '../../components/ui/Ico'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { TopBar } from '../../components/layout/Topbar'
import { useAuth } from '@/context/AuthContext'

// ── Dashboard ─────────────────────────────────────────────────────────────────

interface PatientDashboardViewProps {
  goTo: (v: PView) => void
  onProfileClick?: () => void
  profile?: any
  appointments?: any[] // Accept appointments array
}

export function PatientDashboardView({ goTo, onProfileClick, profile, appointments = [] }: PatientDashboardViewProps) {
  const { user } = useAuth()
  
  // Use passed profile or context user
  const currentUser = user || profile
  const firstName = currentUser?.name?.split(' ')[0] || 'Patient'
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P'

  // Dynamic collections: fallback to the passed appointments array if not on user object
  const nextAppointment = currentUser?.nextAppointment || appointments[0]
  const activePrescription = currentUser?.activePrescription
  const recentActivities = currentUser?.recentActivity || []
  const appointmentsCount = appointments.length || currentUser?.appointmentsCount || 0

  // Safely extract doctor initials for the avatar badge
  const docInitials = nextAppointment?.doctorInitials || 
    (nextAppointment?.doctorName 
      ? nextAppointment.doctorName.replace(/^Dr\.\s*/i, '').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      : 'DR')

  return (
    <div>
      <TopBar 
        title={`Welcome back, ${firstName}`} 
        sub={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 
        onProfileClick={onProfileClick} 
        profile={currentUser}
        avatarBg="var(--color-accent)"
        defaultInitials={initials}
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
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(224,235,226,0.55)' }}>
              Your health, your pace
            </p>
            <h2 className="text-[22px] font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: '#e0ebe2', fontStyle: 'italic' }}>
              How are you feeling today?
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => goTo('chat')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: 'white' }}
              >
                <Ico d={IC.chat} size={15} /> Start AI Chat
              </button>
              <button 
                onClick={() => goTo('emergency')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-white/15"
                style={{ border: '1px solid rgba(255,255,255,0.25)', color: '#e0ebe2' }}
              >
                <Ico d={IC.zap} size={15} /> Emergency SOS
              </button>
            </div>
          </div>
          <div className="relative text-right hidden lg:block">
            <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(224,235,226,0.45)' }}>Current Plan</p>
            <p className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#c9913d' }}>
              {currentUser?.plan || 'Free Plan'}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(224,235,226,0.55)' }}>Standard AI Chats · Online Consultations</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-5">
          {/* Next Appointment */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Next Appointment</p>
              {nextAppointment ? (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}
                    >
                      {docInitials}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                        {nextAppointment.doctorName}
                      </p>
                      <p className="text-[11px]" style={{ color: '#7a7468' }}>{nextAppointment.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4 text-[12px]" style={{ color: '#1b2d20' }}>
                    <span className="flex items-center gap-1.5"><Ico d={IC.calendar} size={13} /> {nextAppointment.date}</span>
                    <span className="flex items-center gap-1.5"><Ico d={IC.clock} size={13} /> {nextAppointment.time}</span>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-[12px]" style={{ color: '#7a7468' }}>
                  No upcoming appointments scheduled
                </div>
              )}
            </div>
            <button 
              onClick={() => goTo('appointments')}
              className="w-full py-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}
            >
              <Ico d={IC.video} size={14} /> {nextAppointment ? 'View Appointments' : 'Book Appointment'}
            </button>
          </Card>

          {/* Active Prescription */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Active Prescription</p>
              {activePrescription ? (
                <>
                  <div className="mb-3">
                    <p className="text-[13px] font-semibold mb-1" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{activePrescription.id}</p>
                    <p className="text-[11px] mb-1" style={{ color: '#7a7468' }}>Issued by {activePrescription.doctorName} · {activePrescription.date}</p>
                    <p className="text-[11px]" style={{ color: '#1b2d20' }}>{activePrescription.medicines}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge label="Active" variant="success" />
                    <Badge label="QR Verified" variant="gold" />
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-[12px]" style={{ color: '#7a7468' }}>
                  No active prescriptions found
                </div>
              )}
            </div>
            <button 
              onClick={() => goTo('records')}
              className="w-full py-2 rounded-lg text-[12px] font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#f5f2ed]"
              style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}
            >
              <Ico d={IC.download} size={14} /> {activePrescription ? 'Download PDF' : 'View Records'}
            </button>
          </Card>

          {/* Subscription & Stats */}
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Subscription</p>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                  {currentUser?.plan || 'Free Plan'}
                </p>
                <Badge label="Active" variant="success" />
              </div>
              <div className="text-[11px] flex flex-col gap-1" style={{ color: '#7a7468' }}>
                {['AI symptom chats', 'Appointment booking', 'Emergency doctor routing'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #ede9e3', paddingTop: 12 }}>
              <div className="flex justify-between text-[11px]">
                {[
                  ['Appointments', appointmentsCount], 
                  ['AI Chats', currentUser?.aiChatsCount ?? 0], 
                  ['Prescriptions', currentUser?.prescriptionsCount ?? 0]
                ].map(([l, v]) => (
                  <div key={l as string} className="text-center">
                    <p className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{v}</p>
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
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
          </div>
          <div>
            {recentActivities.length > 0 ? (
              recentActivities.map((item: any, i: number) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]" style={{ borderBottom: i < recentActivities.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: (item.color || '#2d6a4f') + '18', color: item.color || '#2d6a4f' }}>
                    <Ico d={item.icon || IC.chat} size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{item.label}</p>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{item.sub}</p>
                  </div>
                  <p className="text-[10px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{item.time}</p>
                </div>
              ))
            ) : (
              <div className="px-5 py-6 text-center text-[12px]" style={{ color: '#7a7468' }}>
                No recent activity recorded yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}