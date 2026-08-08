import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { APPOINTMENTS } from '../../data/patientMockData'

// ── Appointments ──────────────────────────────────────────────────────────────

interface AppointmentsProps {
  onProfileClick?: () => void
  profile?: any
}

export function AppointmentsView({ onProfileClick, profile }: AppointmentsProps) {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'invoices'>('upcoming')

  const upcoming = APPOINTMENTS.filter(a => a.status === 'upcoming')
  const past      = APPOINTMENTS.filter(a => a.status === 'completed')

  return (
    <div>
      <TopBar 
        title="Appointments & Billing" 
        sub="Manage your schedule and payment history" 
        onProfileClick={onProfileClick} 
        profile={profile}
        avatarBg="var(--color-accent)"
        defaultInitials="RH"
      />   
      <div className="p-8 flex flex-col gap-5">
        <div className="flex gap-2">
          {(['upcoming', 'past', 'invoices'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize cursor-pointer"
              style={tab === t
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {t === 'invoices' ? 'Invoices & Receipts' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'upcoming' && (
          <div className="flex flex-col gap-4">
            {upcoming.length === 0
              ? <p className="text-[13px] text-center py-12" style={{ color: '#7a7468' }}>No upcoming appointments.</p>
              : upcoming.map((apt, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                      {apt.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[14px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{apt.doctor}</p>
                        <Badge label={apt.type === 'online' ? 'Online' : 'In-Person'} variant={apt.type === 'online' ? 'new' : 'default'} />
                      </div>
                      <p className="text-[11px] mb-2" style={{ color: '#7a7468' }}>{apt.specialty}</p>
                      <div className="flex items-center gap-3 text-[12px]" style={{ color: '#1b2d20' }}>
                        <span className="flex items-center gap-1.5"><Ico d={IC.calendar} size={13} /> {apt.date}</span>
                        <span className="flex items-center gap-1.5"><Ico d={IC.clock} size={13} /> {apt.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>₹{apt.fee}</p>
                      <Badge label="Paid" variant="success" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4" style={{ borderTop: '1px solid #ede9e3', paddingTop: 12 }}>
                    {apt.type === 'online' && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                        <Ico d={IC.video} size={13} /> Join Call
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Reschedule</button>
                    <button className="px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                      style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>Cancel</button>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab === 'past' && (
          <div className="flex flex-col gap-3">
            {past.map((apt, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: '#ede9e3', color: '#7a7468' }}>
                    {apt.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: '#1b2d20', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{apt.doctor}</p>
                    <div className="flex items-center gap-3 text-[11px] mt-0.5" style={{ color: '#7a7468' }}>
                      <span>{apt.date} · {apt.time}</span>
                      <Badge label={apt.type === 'online' ? 'Online' : 'In-Person'} variant="default" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>₹{apt.fee}</p>
                    <Badge label="Completed" variant="success" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'invoices' && (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '120px 1fr 100px 90px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Invoice</span><span>Doctor</span><span>Date</span><span>Amount</span><span>Action</span>
            </div>
            {APPOINTMENTS.map((apt, i) => (
              <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '120px 1fr 100px 90px 80px', borderBottom: i < APPOINTMENTS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                <span className="text-[11px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{apt.id}</span>
                <span className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{apt.doctor}</span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{apt.date}</span>
                <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>₹{apt.fee}</span>
                <button className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-primary)' }}>
                  <Ico d={IC.download} size={12} /> PDF
                </button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}