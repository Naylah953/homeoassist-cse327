import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { PRESCRIBED_PRESCRIPTIONS } from '../../data/doctorMockData'

// ── Prescriptions ─────────────────────────────────────────────────────────────

interface Props {
  onProfileClick?: () => void
}

export function PrescriptionsView({ onProfileClick }: Props) {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Active', 'Dispensed']
  const shown = filter === 'All' ? PRESCRIBED_PRESCRIPTIONS : PRESCRIBED_PRESCRIPTIONS.filter(rx => rx.status === filter.toLowerCase())

  return (
    <div>
      <TopBar title="Prescriptions" sub="Digital prescriptions with QR verification" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR"/>
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[16px] font-medium transition-all"
                style={filter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[16px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.plus} size={20} /> New Prescription
          </button>
        </div>

        <Card>
          <div className="px-5 py-3 grid text-[15px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '140px 1fr 1fr 110px 100px 90px', borderBottom: '5px solid #153e00', color: '#063204' }}>
            <span>Rx ID</span><span>Patient</span><span>Medicines</span><span>Date</span><span>Status</span><span>Actions</span>
          </div>
          {shown.map((rx, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '130px 1fr 1fr 110px 100px 90px', borderBottom: i < shown.length - 1 ? '1px solid #23612e' : 'none' }}>
              <span className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{rx.id}</span>
              <span className="text-[16px] font-medium" style={{ color: '#1b2d20' }}>{rx.patient}</span>
              <span className="text-[15px] truncate" style={{ color: '#1b2d20' }}>{rx.medicines}</span>
              <span className="text-[15px]" style={{ color: '#7a7468' }}>{rx.date}</span>
              <Badge label={rx.status === 'dispensed' ? 'Dispensed' : 'Active'} variant={rx.status === 'dispensed' ? 'success' : 'accent'} />
              <div className="flex items-center gap-1">
                {[IC.eye, IC.download, IC.qr].map((ic, j) => (
                  <button key={j}
                    className="p-1.5 rounded-lg transition-colors hover:bg-[#ede9e3]"
                    style={{ color: j === 2 && rx.verified ? '#2d6a4f' : '#7a7468' }}>
                    <Ico d={ic} size={15} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}