import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { ALL_PATIENTS } from '../../data/adminMockData'

// ── Patients ──────────────────────────────────────────────────────────────────

export function PatientManagementView() {
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
            <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Search by name or ID…"
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
            <span>Patient ID</span>
            <span>Name</span>
            <span>Age</span>
            <span>City</span>
            <span>Plan</span>
            <span>Joined</span>
            <span>Visits</span>
            <span>Status</span>
            <span>Actions</span>
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