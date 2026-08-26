import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { appointmentsApi, Appointment } from '../../api/appointments'

interface AppointmentsProps {
  onProfileClick?: () => void
  profile?: Record<string, unknown>
}

export function AppointmentsView({ onProfileClick, profile }: AppointmentsProps) {
  const [tab, setTab]               = useState<'upcoming' | 'past' | 'invoices'>('upcoming')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    appointmentsApi.list()
      .then(res => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const upcoming = appointments.filter(a => a.status === 'upcoming')
  const past      = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')

  const handleCancel = async (id: number) => {
    try {
      await appointmentsApi.updateStatus(id, 'cancelled')
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatTime = (t: string) => t?.slice(0, 5) ?? ''

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

        {loading && (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>Loading appointments…</p>
        )}

        {!loading && tab === 'upcoming' && (
          <div className="flex flex-col gap-4">
            {upcoming.length === 0
              ? <p className="text-[13px] text-center py-12" style={{ color: '#7a7468' }}>No upcoming appointments.</p>
              : upcoming.map((apt) => (
                <Card key={apt.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                      {apt.doctor_name?.split(' ').slice(1).map(n => n[0]).join('') ?? 'DR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[14px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{apt.doctor_name}</p>
                        <Badge label={apt.type === 'online' ? 'Online' : 'In-Person'} variant={apt.type === 'online' ? 'new' : 'default'} />
                      </div>
                      <p className="text-[11px] mb-2" style={{ color: '#7a7468' }}>{apt.specialty}</p>
                      <div className="flex items-center gap-3 text-[12px]" style={{ color: '#1b2d20' }}>
                        <span className="flex items-center gap-1.5"><Ico d={IC.calendar} size={13} /> {formatDate(apt.appointment_date)}</span>
                        <span className="flex items-center gap-1.5"><Ico d={IC.clock} size={13} /> {formatTime(apt.appointment_time)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>৳{apt.fee}</p>
                      <Badge label={apt.is_paid ? 'Paid' : 'Unpaid'} variant={apt.is_paid ? 'success' : 'warning'} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4" style={{ borderTop: '1px solid #ede9e3', paddingTop: 12 }}>
                    {apt.type === 'online' && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                        <Ico d={IC.video} size={13} /> Join Call
                      </button>
                    )}
                    <button onClick={() => handleCancel(apt.id)}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                      style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>Cancel</button>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {!loading && tab === 'past' && (
          <div className="flex flex-col gap-3">
            {past.length === 0
              ? <p className="text-[13px] text-center py-12" style={{ color: '#7a7468' }}>No past appointments.</p>
              : past.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: '#ede9e3', color: '#7a7468' }}>
                      {apt.doctor_name?.split(' ').slice(1).map(n => n[0]).join('') ?? 'DR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: '#1b2d20', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{apt.doctor_name}</p>
                      <div className="flex items-center gap-3 text-[11px] mt-0.5" style={{ color: '#7a7468' }}>
                        <span>{formatDate(apt.appointment_date)} · {formatTime(apt.appointment_time)}</span>
                        <Badge label={apt.type === 'online' ? 'Online' : 'In-Person'} variant="default" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>৳{apt.fee}</p>
                      <Badge label={apt.status === 'completed' ? 'Completed' : 'Cancelled'} variant={apt.status === 'completed' ? 'success' : 'danger'} />
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {!loading && tab === 'invoices' && (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '80px 1fr 120px 90px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>ID</span><span>Doctor</span><span>Date</span><span>Amount</span><span>Status</span>
            </div>
            {appointments.length === 0 ? (
              <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>No invoices yet.</p>
            ) : appointments.map((apt, i) => (
              <div key={apt.id} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '80px 1fr 120px 90px 80px', borderBottom: i < appointments.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                <span className="text-[11px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>#{apt.id}</span>
                <span className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{apt.doctor_name}</span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{formatDate(apt.appointment_date)}</span>
                <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>৳{apt.fee}</span>
                <Badge label={apt.is_paid ? 'Paid' : 'Unpaid'} variant={apt.is_paid ? 'success' : 'warning'} />
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
