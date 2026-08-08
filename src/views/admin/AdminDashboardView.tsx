import { AView } from '../../types'
import { TopBar } from '../../components/layout/Topbar'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { COMPLAINTS, PENDING_DOCTORS, PLANS } from '../../data/adminMockData'

// ── Dashboard ─────────────────────────────────────────────────────────────────

interface AdminDashboardViewProps {
  goTo: (v: AView) => void
}


export function AdminDashboardView({ goTo }: AdminDashboardViewProps) {
  const openComplaints = COMPLAINTS.filter(c => c.status === 'open').length
  const totalRev = PLANS.reduce((s, p) => s + p.revenue, 0)

  return (
    <div>
      <TopBar title="Admin Dashboard" sub="Thursday, 11 July 2025 · Platform Overview" defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard label="Registered Doctors" value={47}     sub="6 specialties"         />
          <StatCard label="Registered Patients" value="1,284" sub="+31 this week" gold     />
          <StatCard label="Pending Verifications" value={PENDING_DOCTORS.length} sub="Doctors awaiting review" warn />
          <StatCard label="Open Complaints"      value={openComplaints} sub="Requires attention" warn />
          <StatCard label="Monthly Revenue"      value={`₹${(totalRev/100000).toFixed(1)}L`} sub="All active plans" gold />
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Pending Doctor Verifications */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Pending Doctor Verifications</h2>
              <button onClick={() => goTo('doctors')} className="text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-primary)' }}>View all →</button>
            </div>
            <div>
              {PENDING_DOCTORS.map((doc, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < PENDING_DOCTORS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.city}</p>
                  </div>
                  {!doc.docs && <Badge label="Docs missing" variant="danger" />}
                  <Badge label="Pending" variant="warning" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Complaints */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Complaints</h2>
              <button onClick={() => goTo('complaints')} className="text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-primary)' }}>View all →</button>
            </div>
            <div>
              {COMPLAINTS.slice(0, 4).map((c, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < 3 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: c.priority === 'high' ? '#c0392b' : c.priority === 'medium' ? '#c9913d' : '#7a7468' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{c.subject}</p>
                    <p className="text-[10px]" style={{ color: '#7a7468' }}>{c.from} · {c.role}</p>
                  </div>
                  <Badge
                    label={c.status === 'open' ? 'Open' : c.status === 'in-review' ? 'In Review' : 'Resolved'}
                    variant={c.status === 'open' ? 'danger' : c.status === 'in-review' ? 'accent' : 'success'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.name} Plan</p>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>₹{plan.price}<span className="text-[10px] font-normal text-[#7a7468]">/mo</span></span>
              </div>
              <p className="text-[28px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : '#1b2d20' }}>{plan.subscribers}</p>
              <p className="text-[11px] mb-3" style={{ color: '#7a7468' }}>subscribers</p>
              <div className="pt-3" style={{ borderTop: '1px solid #ede9e3' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Monthly Revenue</p>
                <p className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>₹{plan.revenue.toLocaleString('en-IN')}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
