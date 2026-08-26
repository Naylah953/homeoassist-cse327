import { TopBar } from '../../components/layout/Topbar'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'

interface Props {
  doctor?: {
    name?: string
    appointments?: any[]
    totalPatients?: number
    prescriptionsToday?: number
    activeEmergency?: number
    aiActivities?: any[]
  }
  onProfileClick?: () => void
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function DocDashboardView({ doctor, onProfileClick }: Props) {
  // Extract data with safe defaults for new accounts
  const doctorName = doctor?.name || 'Doctor'
  const schedule = doctor?.appointments || []
  const totalPatients = doctor?.totalPatients || 0
  const prescriptionsToday = doctor?.prescriptionsToday || 0
  const activeEmergency = doctor?.activeEmergency || 0
  const aiActivities = doctor?.aiActivities || []

  // Dynamic Initials (e.g., "Dr. Anika Rahman" -> "AR")
  const getInitials = (name: string) => {
    const parts = name.replace(/^Dr\.\s*/i, '').trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div>
      <TopBar 
        title={`Good morning, ${doctorName}`} 
        sub={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 
        onProfileClick={onProfileClick} 
        avatarBg="var(--color-primary)" 
        defaultInitials={getInitials(doctorName)} 
      />
      
      <div className="p-8 flex flex-col gap-6">
        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            label="Today's Appointments" 
            value={schedule.length}   
            sub={`${schedule.filter(a => a.status === 'completed').length} completed · ${schedule.filter(a => a.status !== 'completed').length} remaining`} 
          />
          <StatCard label="Total Patients"        value={totalPatients} sub="+0 this month" gold />
          <StatCard label="Prescriptions Today"   value={prescriptionsToday}  sub="All digitally signed" />
          <StatCard label="Active Emergency"       value={activeEmergency}   sub={activeEmergency > 0 ? "Routing now" : "None active"} />
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px' }}>
          {/* Schedule Section */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Today's Schedule</h2>
              <Badge label={`${schedule.length} appointments`} />
            </div>

            <div>
              {schedule.length === 0 ? (
                <div className="p-8 text-center text-[12px]" style={{ color: '#7a7468' }}>
                  <p className="font-semibold text-[13px] mb-1" style={{ color: '#1b2d20' }}>No appointments scheduled for today</p>
                  <p>Upcoming patient bookings will appear here.</p>
                </div>
              ) : (
                schedule.map((a, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
                    style={{ borderBottom: i < schedule.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                    <span className="text-[11px] w-11 flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{a.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{a.patient}</p>
                      <p className="text-[11px] truncate" style={{ color: '#7a7468' }}>{a.condition}</p>
                    </div>
                    {a.type === 'new' && <Badge label="New" variant="new" />}
                    <Badge
                      label={a.status === 'in-progress' ? 'In Progress' : a.status === 'completed' ? 'Done' : 'Upcoming'}
                      variant={a.status === 'in-progress' ? 'accent' : a.status === 'completed' ? 'success' : 'default'}
                    />
                  </div>
                ))
              )}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {/* AI Activity Section */}
            <Card>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
                <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>AI Activity</h2>
              </div>
              
              <div className="p-4 flex flex-col gap-3">
                {aiActivities.length === 0 ? (
                  <p className="text-[12px] text-center py-4" style={{ color: '#7a7468' }}>No recent AI activity</p>
                ) : (
                  aiActivities.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{item.event}</p>
                        <p className="text-[11px]" style={{ color: '#7a7468' }}>{item.patient}</p>
                      </div>
                      <p className="text-[10px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{item.time}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h2 className="text-[13px] font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'New Prescription',  icon: IC.plus     },
                  { label: 'Add Patient',        icon: IC.users    },
                  { label: 'Medicine Lookup',    icon: IC.pill     },
                  { label: 'View Analytics',     icon: IC.activity },
                ].map((a, i) => (
                  <button key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium w-full text-left transition-colors hover:bg-[#f5f2ed]"
                    style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                    <span style={{ color: 'var(--color-primary)' }}><Ico d={a.icon} size={14} /></span>
                    {a.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}