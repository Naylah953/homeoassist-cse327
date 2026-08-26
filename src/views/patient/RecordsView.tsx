import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { prescriptionsApi, Prescription } from '../../api/prescriptions'
import { API_BASE } from '../../api/client'

interface RecordsProps {
  onProfileClick?: () => void
  profile?: Record<string, unknown>
}

export function RecordsView({ onProfileClick, profile }: RecordsProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    prescriptionsApi.list()
      .then(r => setPrescriptions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const downloadPDF = (id: number) => {
    const token = localStorage.getItem('token')
    const url   = `${API_BASE}/pdf/prescription/${id}`
    const a     = document.createElement('a')
    a.href      = url
    // Add token as query param for download (since headers can't be set on anchor)
    a.href      = `${url}?token=${token}`
    a.download  = `HomeoAssist-RX-${id}.pdf`
    a.target    = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const active  = prescriptions.filter(r => r.status === 'active')
  const allMeds = prescriptions.reduce((acc, r) => acc + (r.medicines?.length ?? 0), 0)

  return (
    <div>
      <TopBar title="Prescriptions & Records" sub="Your complete medical history"
        onProfileClick={onProfileClick} profile={profile}
        avatarBg="var(--color-accent)" defaultInitials="RH" />
      <div className="p-8 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-1">
          {[
            { label: 'Total Prescriptions', value: prescriptions.length, sub: 'All time' },
            { label: 'Active Prescriptions', value: active.length, sub: 'Currently in use', gold: true },
            { label: 'Total Medicines',      value: allMeds, sub: 'Across all prescriptions' },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#7a7468' }}>{s.label}</p>
              <p className="text-[28px] font-bold" style={{ fontFamily: 'var(--font-display)', color: s.gold ? 'var(--color-accent)' : '#1b2d20' }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7a7468' }}>{s.sub}</p>
            </Card>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>Loading records…</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>No prescriptions yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {prescriptions.map(rx => (
              <Card key={rx.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ fontFamily: 'var(--font-mono)', background: '#d8f3dc', color: 'var(--color-primary)' }}>
                        RX-{rx.id}
                      </span>
                      <Badge label={rx.status === 'active' ? 'Active' : 'Completed'} variant={rx.status === 'active' ? 'success' : 'default'} />
                      {rx.is_verified && <Badge label="✓ Verified" variant="gold" />}
                    </div>
                    <p className="text-[15px] font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>
                      {rx.diagnosis}
                    </p>
                    <p className="text-[11px] mb-3" style={{ color: '#7a7468' }}>
                      Issued by {rx.doctor_name} · {new Date(rx.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                    </p>
                    {rx.medicines && rx.medicines.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {rx.medicines.map((m, j) => (
                          <span key={j} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                            style={{ background: '#f5f2ed', border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                            {m.name} {m.potency}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => downloadPDF(rx.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                      style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                      <Ico d={IC.download} size={13} /> PDF
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                      <Ico d={IC.qr} size={13} /> Verify
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
