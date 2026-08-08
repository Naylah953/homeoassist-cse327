import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { PRESCRIPTIONS } from '../../data/patientMockData'

// ── Records ───────────────────────────────────────────────────────────────────

interface RecordsProps {
  onProfileClick?: () => void
  profile?: any
}

export function RecordsView({ onProfileClick, profile }: RecordsProps) {
  return (
    <div>
      <TopBar 
        title="Prescriptions & Records" 
        sub="Your complete medical history" 
        onProfileClick={onProfileClick} 
        profile={profile}
        avatarBg="var(--color-accent)"
        defaultInitials="RH"
        />
      <div className="p-8 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-4 mb-1">
          {[
            { label: 'Total Prescriptions', value: '3', sub: 'All time' },
            { label: 'Active Medicines',    value: '2', sub: 'Currently in use' },
            { label: 'Verified QR',         value: '3', sub: 'All authentic' },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#7a7468' }}>{s.label}</p>
              <p className="text-[28px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : '#1b2d20' }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#7a7468' }}>{s.sub}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {PRESCRIPTIONS.map((rx, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                      style={{ fontFamily: 'var(--font-mono)', background: '#d8f3dc', color: 'var(--color-primary)' }}>{rx.id}</span>
                    <Badge label={rx.status === 'active' ? 'Active' : 'Completed'} variant={rx.status === 'active' ? 'success' : 'default'} />
                    {rx.verified && <Badge label="✓ QR Verified" variant="gold" />}
                  </div>
                  <p className="text-[15px] font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{rx.diagnosis}</p>
                  <p className="text-[11px] mb-3" style={{ color: '#7a7468' }}>Issued by {rx.doctor} · {rx.date}</p>
                  <div className="flex flex-wrap gap-2">
                    {rx.medicines.split(', ').map((m, j) => (
                      <span key={j} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                        style={{ background: '#f5f2ed', border: '1px solid #d6d0c8', color: '#1b2d20' }}>{m}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
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
      </div>
    </div>
  )
}