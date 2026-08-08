import { TopBar } from '../../components/layout/Topbar'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { SCHEDULE } from '../../data/doctorMockData'

interface Props {
  onProfileClick?: () => void
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function DocDashboardView( { onProfileClick }: Props) {
  return (
    <div>
      <TopBar 
        title="Good morning, Dr. Rahman" 
        sub="Thursday, 11 July 2025 · 10:30 AM" 
        onProfileClick={onProfileClick} 
        avatarBg="var(--color-primary)" 
        defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Today's Appointments" value={8}   sub="3 completed · 5 remaining" />
          <StatCard label="Total Patients"        value={247} sub="+12 this month" gold />
          <StatCard label="Prescriptions Today"   value={12}  sub="All digitally signed" />
          <StatCard label="Active Emergency"       value={1}   sub="EC-004 — routing now" />
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px' }}>
          {/* Schedule */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Today's Schedule</h2>
              <Badge label="8 appointments" />
            </div>
            <div>
              {SCHEDULE.map((a, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < SCHEDULE.length - 1 ? '1px solid #ede9e3' : 'none' }}>
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
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {/* AI Activity */}
            <Card>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
                <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>AI Activity</h2>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {[
                  { event: 'Symptom summary ready', patient: 'Fahmida Akter', time: '10:28', color: '#2d6a4f' },
                  { event: 'Chat in progress',      patient: 'Raisa Hossain',   time: '10:15', color: '#c9913d' },
                  { event: 'Prescription validated', patient: 'Shourob Ahmed',   time: '09:52', color: '#2d6a4f' },
                  { event: 'Emergency triaged',      patient: 'Ramesh Tiwari',  time: '09:43', color: '#c0392b' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{item.event}</p>
                      <p className="text-[11px]" style={{ color: '#7a7468' }}>{item.patient}</p>
                    </div>
                    <p className="text-[10px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{item.time}</p>
                  </div>
                ))}
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