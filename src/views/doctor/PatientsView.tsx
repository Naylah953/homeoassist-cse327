import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { PATIENTS } from '../../data/doctorMockData'

// ── Patients ──────────────────────────────────────────────────────────────────

interface Props {
  onProfileClick?: () => void
}

export function PatientsView({ onProfileClick }: Props) {
  const [query, setQuery] = useState('')
  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.condition.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <TopBar title="Patients" sub={`${PATIENTS.length} registered patients`} onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}><Ico d={IC.search} size={20} /></span>
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search patients or conditions…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[15px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[16px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.plus} size={20} /> New Patient
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-5 hover:border-[#2d6a4f]/40 transition-all cursor-pointer">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className="text-[18px] font-semibold" style={{ color: '#1b2d20' }}>{p.name}</h3>
                    <Badge
                      label={p.status === 'new' ? 'New' : p.status === 'follow-up' ? 'Follow-up' : 'Active'}
                      variant={p.status === 'new' ? 'new' : p.status === 'follow-up' ? 'warning' : 'success'}
                    />
                  </div>
                  <p className="text-[14px]" style={{ color: '#7a7468' }}>{p.age}{p.gender} · {p.condition}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[14px] pt-3" style={{ borderTop: '1px solid #ede9e3' }}>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Last Visit</p>
                  <p style={{ color: '#1b2d20' }}>{p.lastVisit}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Next Visit</p>
                  <p style={{ color: '#1b2d20' }}>{p.nextVisit}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Visits</p>
                  <p className="font-semibold" style={{ color: '#1b2d20' }}>{p.visits}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 rounded-lg text-[16px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>View History</button>
                <button className="flex-1 py-1.5 rounded-lg text-[16px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>Prescribe</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}