import { useEffect, useState } from 'react'
import { AView } from '../../types'
import { TopBar } from '../../components/layout/Topbar'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { adminApi, AdminStats } from '../../api/admin'
import { complaintsApi, Complaint } from '../../api/complaints'
import { doctorsApi, Doctor } from '../../api/doctors'

interface AdminDashboardViewProps {
  goTo: (v: AView) => void
}

export function AdminDashboardView({ goTo }: AdminDashboardViewProps) {
  const [stats, setStats]           = useState<AdminStats | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [pending, setPending]       = useState<Doctor[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.stats(),
      complaintsApi.list({ page: 1 }),
      adminApi.doctors({ verified: false }),
    ]).then(([statsRes, cRes, docRes]) => {
      setStats(statsRes.data)
      setComplaints(cRes.data.slice(0, 4))
      setPending((docRes.data as Doctor[]).slice(0, 3))
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-[13px]" style={{ color: '#7a7468' }}>
        Loading dashboard…
      </div>
    )
  }

  const openComplaints = stats ? parseInt(stats.complaints.open) : 0

  return (
    <div>
      <TopBar
        title="Admin Dashboard"
        sub="Platform Overview"
        defaultInitials="SA"
        avatarBg="#b4654a"
      />
      <div className="p-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard label="Registered Doctors"    value={stats?.doctors ?? 0}   sub="Verified practitioners" />
          <StatCard label="Registered Patients"   value={stats?.patients ?? 0}  sub="All time"       gold />
          <StatCard label="Pending Verifications" value={pending.length}         sub="Awaiting review" warn />
          <StatCard label="Open Complaints"       value={openComplaints}         sub="Requires attention" warn />
          <StatCard label="Total Medicines"       value={stats?.medicines ?? 0}  sub="In database"    gold />
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Pending Doctor Verifications */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Pending Doctor Verifications</h2>
              <button onClick={() => goTo('doctors')} className="text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-primary)' }}>View all →</button>
            </div>
            <div>
              {pending.length === 0 ? (
                <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>No pending verifications.</p>
              ) : pending.map((doc, i) => (
                <div key={doc.id} className="px-5 py-3.5 flex items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < pending.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                    {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.reg_no}</p>
                  </div>
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
              {complaints.length === 0 ? (
                <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>No complaints yet.</p>
              ) : complaints.map((c, i) => (
                <div key={c.id} className="px-5 py-3 flex items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < complaints.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: c.status === 'open' ? '#c0392b' : '#2d6a4f' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{c.subject}</p>
                    <p className="text-[10px]" style={{ color: '#7a7468' }}>{c.filed_by} · #{c.id}</p>
                  </div>
                  <Badge
                    label={c.status === 'open' ? 'Open' : c.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                    variant={c.status === 'open' ? 'danger' : 'success'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue Summary */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7a7468' }}>Total Appointments</p>
              <p className="text-[28px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{stats.appointments.total}</p>
              <p className="text-[11px] mt-1" style={{ color: '#7a7468' }}>Upcoming: {stats.appointments.upcoming} · Done: {stats.appointments.completed}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7a7468' }}>Total Revenue</p>
              <p className="text-[28px] font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                ৳{parseFloat(stats.revenue.total).toLocaleString()}
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#7a7468' }}>Collected: ৳{parseFloat(stats.revenue.collected).toLocaleString()}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7a7468' }}>Recent Activity</p>
              <div className="flex flex-col gap-1.5 mt-1">
                {stats.recent_appointments.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[11px] truncate" style={{ color: '#1b2d20' }}>{a.patient_name}</span>
                    <Badge label={a.status} variant={a.status === 'upcoming' ? 'default' : 'success'} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
