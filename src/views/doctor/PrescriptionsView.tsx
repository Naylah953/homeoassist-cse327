import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { prescriptionsApi, Prescription } from '../../api/prescriptions'
import { API_BASE } from '../../api/client'

interface Props { onProfileClick?: () => void }

export function PrescriptionsView({ onProfileClick }: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('All')

  useEffect(() => {
    prescriptionsApi.list()
      .then(r => setPrescriptions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const shown = filter === 'All' ? prescriptions
    : prescriptions.filter(rx => rx.status === filter.toLowerCase())

  const downloadPDF = (id: number) => {
    const token = localStorage.getItem('token')
    const a     = document.createElement('a')
    a.href      = `${API_BASE}/pdf/prescription/${id}?token=${token}`
    a.download  = `HomeoAssist-RX-${id}.pdf`
    a.target    = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div>
      <TopBar title="Prescriptions" sub="Digital prescriptions with QR verification"
        onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['All','active','completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize"
                style={filter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>Loading prescriptions…</p>
        ) : shown.length === 0 ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>No prescriptions found.</p>
        ) : (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '80px 1fr 1fr 120px 100px 90px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Rx ID</span><span>Patient</span><span>Medicines</span><span>Date</span><span>Status</span><span>Actions</span>
            </div>
            {shown.map((rx, i) => (
              <div key={rx.id} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '80px 1fr 1fr 120px 100px 90px', borderBottom: i < shown.length-1 ? '1px solid #ede9e3' : 'none' }}>
                <span className="text-[11px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>RX-{rx.id}</span>
                <span className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{rx.patient_name}</span>
                <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>
                  {rx.medicines?.map(m => `${m.name} ${m.potency}`).join(', ') || '—'}
                </span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>
                  {new Date(rx.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                </span>
                <Badge label={rx.status === 'active' ? 'Active' : 'Completed'} variant={rx.status === 'active' ? 'accent' : 'success'} />
                <div className="flex items-center gap-1">
                  <button onClick={() => downloadPDF(rx.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-[#ede9e3]" style={{ color: '#7a7468' }} title="Download PDF">
                    <Ico d={IC.download} size={13} />
                  </button>
                  <button className="p-1.5 rounded-lg transition-colors hover:bg-[#ede9e3]" style={{ color: '#7a7468' }} title="QR Verify">
                    <Ico d={IC.qr} size={13} />
                  </button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
