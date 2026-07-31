import { useState } from 'react'

// In your main file
import { AView } from './types';
import { Ico, IC } from './components/ui/Ico';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { StatCard } from './components/ui/StatCard';
import { TopBar } from './components/layout/Topbar';
import { Sidebar, NavItem } from './components/layout/Sidebar';

import { PENDING_DOCTORS, VERIFIED_DOCTORS, ALL_PATIENTS, COMPLAINTS, PLANS, RECENT_PAYMENTS } from './data/adminMockData';

// ── Types ─────────────────────────────────────────────────────────────────────

// ── Icons ─────────────────────────────────────────────────────────────────────

// ── Utilities ─────────────────────────────────────────────────────────────────

// ── Mock Data ─────────────────────────────────────────────────────────────────

// ── Sidebar ───────────────────────────────────────────────────────────────────

function AdminSidebar({ active, onChange, onLogout }: { active: AView; onChange: (v: AView) => void; onLogout: () => void }) {
  const openCount = COMPLAINTS.filter(c => c.status === 'open').length
  const pendingCount = PENDING_DOCTORS.length

  const navItems: NavItem<AView>[] = [
    { id: 'dashboard',  label: 'Dashboard',            icon: IC.grid },
    { id: 'doctors',    label: 'Doctor Management',    icon: IC.shield, badge: pendingCount, badgeColor: '#c0392b' },
    { id: 'patients',   label: 'Patient Management',   icon: IC.users },
    { id: 'complaints', label: 'Complaints & Feedback', icon: IC.flag,  badge: openCount,    badgeColor: '#c9913d' },
    { id: 'revenue',    label: 'Revenue & Plans',      icon: IC.coin },
    { id: 'settings',   label: 'System Settings',      icon: IC.settings },
  ]

  return (
    <Sidebar
      portalLabel="Admin Console"
      navItems={navItems}
      active={active}
      onChange={onChange}
      onLogout={onLogout}
      profile={{ name: 'Super Admin', subtext: 'admin@homeoassist.in', initials: 'SA' }}
    />
  )
}

// ── Top Bar ───────────────────────────────────────────────────────────────────

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ goTo }: { goTo: (v: AView) => void }) {
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

// ── Doctors ───────────────────────────────────────────────────────────────────

function DoctorManagement() {
  const [tab, setTab] = useState<'pending' | 'verified' | 'declined'>('pending')
  const [declineModal, setDeclineModal] = useState<typeof PENDING_DOCTORS[0] | null>(null)
  const [approved, setApproved] = useState<string[]>([])
  const [declined, setDeclined] = useState<string[]>([])
  const [declineReason, setDeclineReason] = useState('')

  const pending  = PENDING_DOCTORS.filter(d => !approved.includes(d.reg) && !declined.includes(d.reg))
  const verified = [...VERIFIED_DOCTORS, ...PENDING_DOCTORS.filter(d => approved.includes(d.reg)).map(d => ({
    name: d.name, initials: d.initials, reg: d.reg, specialty: d.specialty, exp: d.exp,
    patients: 0, joined: 'Just now', status: 'active' as const,
  }))]

  return (
    <div>
      <TopBar title="Doctor Management" sub={`${PENDING_DOCTORS.length} pending · ${VERIFIED_DOCTORS.length} verified`} defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex gap-2">
          {(['pending', 'verified', 'declined'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize relative"
              style={tab === t
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {t === 'pending' ? 'Pending Review' : t === 'verified' ? 'Verified Doctors' : 'Declined'}
              {t === 'pending' && pending.length > 0 && (
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#c0392b', color: 'white' }}>{pending.length}</span>
              )}
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.download} size={13} /> Export List
          </button>
        </div>

        {tab === 'pending' && (
          <div className="flex flex-col gap-4">
            {pending.length === 0
              ? <p className="text-[13px] text-center py-12" style={{ color: '#7a7468' }}>No pending verifications.</p>
              : pending.map((doc, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{doc.name}</h3>
                        <Badge label="Pending Review" variant="warning" />
                        {!doc.docs && <Badge label="Documents Incomplete" variant="danger" />}
                      </div>
                      <p className="text-[12px] mb-1" style={{ color: '#7a7468' }}>{doc.qual} · {doc.specialty} · {doc.exp} yrs experience</p>
                      <div className="flex items-center gap-4 text-[11px]" style={{ color: '#7a7468' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontWeight: 600 }}>{doc.reg}</span>
                        <span>📍 {doc.city}</span>
                        <span>Submitted {doc.submitted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-lg mb-4" style={{ background: '#f5f2ed', border: '1px solid #ede9e3' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Registration Note</p>
                    <p className="text-[12px]" style={{ color: '#1b2d20' }}>{doc.note}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                      <Ico d={IC.eye} size={13} /> View Full Application
                    </button>
                    <button onClick={() => setDeclineModal(doc)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                      style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>
                      <Ico d={IC.x} size={13} /> Decline
                    </button>
                    <button onClick={() => setApproved(a => [...a, doc.reg])}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
                      style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                      <Ico d={IC.check} size={13} /> Approve & Verify
                    </button>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab === 'verified' && (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '180px 80px 1fr 100px 90px 80px 90px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Doctor</span><span>Reg. No.</span><span>Specialty</span><span>Joined</span><span>Patients</span><span>Status</span><span>Actions</span>
            </div>
            {verified.map((doc, i) => (
              <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '180px 80px 1fr 100px 90px 80px 90px', borderBottom: i < verified.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                  <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{doc.name}</span>
                </div>
                <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{doc.reg}</span>
                <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.exp} yrs</span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{doc.joined}</span>
                <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{doc.patients}</span>
                <Badge label={doc.status === 'active' ? 'Active' : 'Suspended'} variant={doc.status === 'active' ? 'success' : 'danger'} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.eye} size={13} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.edit} size={13} /></button>
                </div>
              </div>
            ))}
          </Card>
        )}

        {tab === 'declined' && (
          <div className="text-center py-16" style={{ color: '#7a7468' }}>
            <Ico d={IC.doc} size={32} />
            <p className="text-[13px] mt-3">No declined applications on record.</p>
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(27,45,32,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeclineModal(null)}>
          <div className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <div>
                <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Decline Application</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{declineModal.name}</p>
              </div>
              <button onClick={() => setDeclineModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f2ed]" style={{ color: '#7a7468' }}>
                <Ico d={IC.x} size={16} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Reason for Decline</p>
                <textarea value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                  placeholder="Provide a reason (this will be shared with the applicant)…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none"
                  style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20', fontFamily: 'var(--font-sans)' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeclineModal(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Cancel</button>
                <button onClick={() => { setDeclined(d => [...d, declineModal.reg]); setDeclineModal(null); setDeclineReason('') }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: '#c0392b', color: 'white' }}>Confirm Decline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Patients ──────────────────────────────────────────────────────────────────

function PatientManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const shown = ALL_PATIENTS.filter(p => {
    const q = query.toLowerCase()
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchF = filter === 'All' || (filter === 'Active' && p.status === 'active') || (filter === 'Pending' && p.status === 'pending')
    return matchQ && matchF
  })

  return (
    <div>
      <TopBar title="Patient Management" sub={`${ALL_PATIENTS.length} total patients registered`} defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}><Ico d={IC.search} size={14} /></span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or ID…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={filter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.download} size={13} /> Export
          </button>
        </div>

        <Card>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '110px 160px 60px 80px 80px 80px 70px 80px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>Patient ID</span><span>Name</span><span>Age</span><span>City</span><span>Plan</span><span>Joined</span><span>Visits</span><span>Status</span><span>Actions</span>
          </div>
          {shown.map((p, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '110px 160px 60px 80px 80px 80px 70px 80px 80px', borderBottom: i < shown.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{p.id}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{p.initials}</div>
                <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{p.name}</span>
              </div>
              <span className="text-[12px]" style={{ color: '#7a7468' }}>{p.age}{p.gender}</span>
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{p.city}</span>
              <Badge label={p.plan} variant={p.plan === 'Pro' ? 'accent' : p.plan === 'Clinic' ? 'gold' : 'default'} />
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{p.joined}</span>
              <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{p.visits}</span>
              <Badge label={p.status === 'active' ? 'Active' : 'Pending'} variant={p.status === 'active' ? 'success' : 'warning'} />
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.eye} size={12} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.trash} size={12} /></button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ── Complaints ────────────────────────────────────────────────────────────────

function Complaints() {
  const [typeFilter, setTypeFilter]     = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter]     = useState('All')
  const [expanded, setExpanded]         = useState<string | null>(null)

  const shown = COMPLAINTS.filter(c => {
    const matchT = typeFilter  === 'All' || c.type === typeFilter.toLowerCase()
    const matchS = statusFilter === 'All' || c.status === statusFilter.toLowerCase().replace(' ', '-')
    const matchR = roleFilter  === 'All' || c.role === roleFilter.toLowerCase()
    return matchT && matchS && matchR
  })

  const priorityColor: Record<string, string> = { high: '#c0392b', medium: '#c9913d', low: '#7a7468' }
  const typeLabel: Record<string, string> = { bug: 'Bug', feature: 'Feature Request', feedback: 'Feedback' }

  return (
    <div>
      <TopBar title="Complaints & Feedback" sub="Submitted via in-app feedback widget" defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1.5">
            {['All', 'Bug', 'Feature', 'Feedback'].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={typeFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {['All', 'Open', 'In Review', 'Resolved'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={statusFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {['All', 'Doctor', 'Patient'].map(f => (
              <button key={f} onClick={() => setRoleFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={roleFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <p className="ml-auto text-[11px] self-center" style={{ color: '#7a7468' }}>{shown.length} results</p>
        </div>

        <div className="flex flex-col gap-3">
          {shown.map((c, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="px-5 py-4 cursor-pointer transition-colors hover:bg-[#f5f2ed]"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: priorityColor[c.priority] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>{c.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: '#7a7468' }}>
                      <span className="font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: 10 }}>{c.id}</span>
                      <span>·</span>
                      <span>{c.from}</span>
                      <Badge label={c.role === 'doctor' ? 'Doctor' : 'Patient'} variant={c.role === 'doctor' ? 'new' : 'default'} />
                      <span>·</span>
                      <span>{c.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge label={typeLabel[c.type]} variant={c.type === 'bug' ? 'danger' : c.type === 'feature' ? 'new' : 'default'} />
                    <Badge
                      label={c.status === 'open' ? 'Open' : c.status === 'in-review' ? 'In Review' : 'Resolved'}
                      variant={c.status === 'open' ? 'danger' : c.status === 'in-review' ? 'accent' : 'success'}
                    />
                    <Badge label={`${c.priority.charAt(0).toUpperCase() + c.priority.slice(1)} Priority`}
                      variant={c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warning' : 'default'} />
                  </div>
                </div>
              </div>

              {expanded === c.id && (
                <div className="px-5 py-4 flex flex-col gap-4" style={{ borderTop: '1px solid #ede9e3', background: '#fafaf9' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7a7468' }}>User Message</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: '#1b2d20' }}>{c.message}</p>
                  </div>
                  {c.adminNote && (
                    <div className="px-4 py-3 rounded-lg" style={{ background: '#d8f3dc', border: '1px solid #a7d9b4' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>Admin Note</p>
                      <p className="text-[12px]" style={{ color: '#1b2d20' }}>{c.adminNote}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {c.status !== 'resolved' && (
                      <button className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                        Mark Resolved
                      </button>
                    )}
                    {c.status === 'open' && (
                      <button className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-amber-50"
                        style={{ border: '1px solid #f59e0b', color: '#92400e' }}>
                        Move to In Review
                      </button>
                    )}
                    <button className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>
                      Add Note
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Revenue ───────────────────────────────────────────────────────────────────

function Revenue() {
  const totalRev = PLANS.reduce((s, p) => s + p.revenue, 0)
  const totalSubs = PLANS.reduce((s, p) => s + p.subscribers, 0)

  return (
    <div>
      <TopBar title="Revenue & Plans" sub="Subscription analytics and payment history" defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Monthly Revenue" value={`₹${(totalRev/100000).toFixed(2)}L`} sub="All active subscriptions" gold />
          <StatCard label="Total Subscribers"      value={totalSubs}  sub={`Across ${PLANS.length} plans`} />
          <StatCard label="Avg. Revenue / Subscriber" value={`₹${Math.round(totalRev/totalSubs)}`} sub="ARPU this month" />
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[15px] font-bold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.name}</p>
                  <p className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                    ₹{plan.price}<span className="text-[12px] font-normal text-[#7a7468]">/mo</span>
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>Edit Plan</button>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{f}</p>
                  </div>
                ))}
              </div>
              <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #ede9e3' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7a7468' }}>Subscribers</p>
                  <p className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.subscribers}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7a7468' }}>Monthly</p>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>₹{plan.revenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Payments */}
        <Card>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Payments</h2>
          </div>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>Patient</span><span>Plan</span><span>Amount</span><span>Date</span><span>Gateway</span>
          </div>
          {RECENT_PAYMENTS.map((p, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: i < RECENT_PAYMENTS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{p.patient}</span>
              <Badge label={p.plan} variant={p.plan === 'Pro' ? 'accent' : p.plan === 'Clinic' ? 'gold' : 'default'} />
              <span className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>₹{p.amount}</span>
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{p.date}</span>
              <Badge label={p.gateway} variant="success" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ── Settings ──────────────────────────────────────────────────────────────────

function Settings() {
  const [toggles, setToggles] = useState({
    aiChat: true, aiEmergency: true, aiCDSS: true,
    emailNotifs: true, smsNotifs: false, inAppNotifs: true,
    maintenanceMode: false, newRegistrations: true, onlinePayments: true,
  })

  const toggle = (key: keyof typeof toggles) => setToggles(t => ({ ...t, [key]: !t[key] }))

  const Toggle = ({ k, label, desc }: { k: keyof typeof toggles; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #ede9e3' }}>
      <div>
        <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{label}</p>
        <p className="text-[11px]" style={{ color: '#7a7468' }}>{desc}</p>
      </div>
      <button onClick={() => toggle(k)}
        className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative"
        style={{ background: toggles[k] ? 'var(--color-primary)' : '#d6d0c8' }}>
        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
          style={{ left: toggles[k] ? 'calc(100% - 22px)' : '2px' }} />
      </button>
    </div>
  )

  return (
    <div>
      <TopBar title="System Settings" sub="Platform-wide configuration — admin only" defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* AI Features */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>AI Features</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Control AI-powered modules platform-wide</p>
          <Toggle k="aiChat"      label="AI Symptom Chat"          desc="Patient-facing AI chat assistant before consultations" />
          <Toggle k="aiEmergency" label="AI Emergency Routing"     desc="Automatic triage and doctor routing for SOS calls" />
          <Toggle k="aiCDSS"      label="Clinical Decision Support" desc="Medicine recommendations for doctors (CDSS)" />
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Delivery channels for alerts and reminders</p>
          <Toggle k="emailNotifs"  label="Email Notifications"  desc="Appointment confirmations, receipts, reminders" />
          <Toggle k="smsNotifs"    label="SMS Notifications"    desc="OTP, emergency alerts, appointment reminders" />
          <Toggle k="inAppNotifs"  label="In-App Notifications" desc="Dashboard alerts and real-time updates" />
        </Card>

        {/* Platform Controls */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Platform Controls</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Core platform availability settings</p>
          <Toggle k="newRegistrations" label="New Registrations"   desc="Allow new doctors and patients to register" />
          <Toggle k="onlinePayments"   label="Online Payments"     desc="Enable UPI, card and net banking payments" />
          <Toggle k="maintenanceMode"  label="Maintenance Mode"    desc="Take platform offline for scheduled updates" />
        </Card>

        {/* Data Export */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Data & Exports</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Download platform reports and backups</p>
          <div className="flex flex-col gap-2">
            {[
              'All Doctor Registrations (CSV)',
              'All Patient Records (CSV)',
              'Complaint & Feedback Log (CSV)',
              'Revenue Report — July 2025 (PDF)',
              'Emergency Call Logs — July 2025 (CSV)',
              'Prescription Audit Log (CSV)',
            ].map((item, i) => (
              <button key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-medium w-full text-left transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                <span style={{ color: 'var(--color-primary)' }}><Ico d={IC.download} size={13} /></span>
                {item}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── Admin App ─────────────────────────────────────────────────────────────────

export default function Admin_Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<AView>('dashboard')

  // Handler to handle sign out with fallback routing
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Fallback redirect if no custom handler is passed
      window.location.href = '/'
    }
  }

  const views: Record<AView, React.ReactNode> = {
    dashboard:  <Dashboard goTo={setView} />,
    doctors:    <DoctorManagement />,
    patients:   <PatientManagement />,
    complaints: <Complaints />,
    revenue:    <Revenue />,
    settings:   <Settings />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f2ed' }}>
      {/* 1. Sidebar */}
      <AdminSidebar 
      active={view} 
      onChange={setView}
      onLogout={handleLogout}  
      />
      {/* 2. Main View Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {views[view]}
        </div>
      </main>
    </div>
  )
}
