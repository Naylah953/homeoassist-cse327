import { useState, useEffect } from 'react'
import { Ico, IC } from '../../components/ui/Ico'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { TopBar } from '../../components/layout/Topbar'
import { doctorsApi, Doctor } from '../../api/doctors'
import { appointmentsApi } from '../../api/appointments'

interface PatientDoctorsViewProps {
  onProfileClick?: () => void
  profile?: Record<string, unknown>
}

export function FindDoctorsView({ onProfileClick, profile }: PatientDoctorsViewProps) {
  const [doctors, setDoctors]       = useState<Doctor[]>([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('All')
  const [search, setSearch]         = useState('')
  const [booking, setBooking]       = useState<Doctor | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(0)
  const [bookingType, setBookingType]   = useState<'online'|'in-person'>('online')
  const [submitting, setSubmitting] = useState(false)
  const [booked, setBooked]         = useState(false)

  const specialties = ['All','Allergies & Respiratory','Digestive & IBS',"Women's Health",'Skin & Dermatology','Paediatrics','Joint & Arthritis']

  const SLOTS = ['09:00','10:00','11:00','14:00','15:00','16:00']
  const DATES = ['Mon 17 Aug','Tue 18 Aug','Wed 19 Aug']

  useEffect(() => {
    const params: Record<string,string> = {}
    if (filter !== 'All') params.specialty = filter
    if (search) params.search = search
    setLoading(true)
    doctorsApi.list({ specialty: filter !== 'All' ? filter : undefined, search: search || undefined })
      .then(r => setDoctors(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter, search])

  const handleBook = async () => {
    if (!booking || !selectedSlot) return
    setSubmitting(true)
    try {
      const date = DATES[selectedDate]
      const [day, month, year] = [
        date.split(' ')[1],
        ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(date.split(' ')[2]) + 1,
        2026
      ]
      await appointmentsApi.book({
        doctor_id: booking.id,
        appointment_date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
        appointment_time: selectedSlot,
        type: bookingType,
      })
      setBooked(true)
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <TopBar title="Find Doctors" sub="Browse certified homeopathic practitioners"
        onProfileClick={onProfileClick} profile={profile}
        avatarBg="var(--color-accent)" defaultInitials="RH" />
      <div className="p-8 flex flex-col gap-5">
        {/* Search + filters */}
        <div className="flex flex-col gap-3">
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}>
              <Ico d={IC.search} size={14} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {specialties.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={filter === s
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>Loading doctors…</p>
        ) : doctors.length === 0 ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>No doctors found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {doctors.map(doc => (
              <Card key={doc.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                      {doc.name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{doc.name}</p>
                        <Badge label={doc.is_available ? 'Available' : 'Unavailable'} variant={doc.is_available ? 'success' : 'default'} />
                      </div>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--color-primary)' }}>{doc.qualifications} · {doc.reg_no}</p>
                      <p className="text-[11px]" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.experience_yrs} yrs exp</p>
                    </div>
                  </div>
                  {doc.bio && (
                    <p className="text-[11px] leading-relaxed mb-4 p-2.5 rounded-lg" style={{ background: '#f5f2ed', color: '#1b2d20' }}>
                      {doc.bio}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <span style={{ color: 'var(--color-accent)' }}><Ico d={IC.star} size={13} /></span>
                      <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{doc.rating}</span>
                      <span className="text-[11px]" style={{ color: '#7a7468' }}>({doc.review_count} reviews)</span>
                    </div>
                    <span className="text-[14px] font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>৳{doc.fee}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setBooking(doc); setBooked(false); setSelectedSlot(null) }}
                  disabled={!doc.is_available}
                  className="w-full py-2 rounded-lg text-[12px] font-semibold transition-opacity"
                  style={doc.is_available
                    ? { background: 'var(--color-primary)', color: '#f0ede8', cursor: 'pointer' }
                    : { background: '#ede9e3', color: '#7a7468', cursor: 'not-allowed' }}>
                  {doc.is_available ? 'Book Appointment' : 'Not Available'}
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(27,45,32,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setBooking(null)}>
          <div className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white"
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <div>
                <h3 className="text-[16px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Book Appointment</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{booking.name} · {booking.specialty}</p>
              </div>
              <button onClick={() => setBooking(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f2ed]" style={{ color: '#7a7468' }}>
                <Ico d={IC.x} size={16} />
              </button>
            </div>

            {booked ? (
              <div className="px-6 py-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#d8f3dc' }}>
                  <Ico d={IC.check} size={24} />
                </div>
                <p className="text-[16px] font-bold mb-1" style={{ color: '#1b2d20' }}>Appointment Booked!</p>
                <p className="text-[12px]" style={{ color: '#7a7468' }}>{DATES[selectedDate]} at {selectedSlot} with {booking.name}</p>
                <button onClick={() => setBooking(null)}
                  className="mt-5 px-6 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>Done</button>
              </div>
            ) : (
              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Select Date</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DATES.map((d, i) => (
                      <button key={d} onClick={() => setSelectedDate(i)}
                        className="py-2 rounded-lg text-[12px] font-medium transition-all"
                        style={selectedDate === i
                          ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                          : { border: '1px solid #d6d0c8', color: '#1b2d20', background: 'white' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Select Time</p>
                  <div className="flex gap-2 flex-wrap">
                    {SLOTS.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)}
                        className="px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
                        style={selectedSlot === slot
                          ? { background: 'var(--color-primary)', color: '#f0ede8', border: '1px solid var(--color-primary)' }
                          : { border: '1px solid #d6d0c8', color: '#1b2d20', background: 'white', fontFamily: 'var(--font-mono)' }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Type</p>
                  <div className="flex gap-2">
                    {(['online','in-person'] as const).map(t => (
                      <button key={t} onClick={() => setBookingType(t)}
                        className="px-4 py-2 rounded-lg text-[12px] font-medium capitalize transition-all"
                        style={bookingType === t
                          ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                          : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>Consultation Fee</p>
                    <p className="text-[18px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>৳{booking.fee}</p>
                  </div>
                  <button onClick={handleBook} disabled={!selectedSlot || submitting}
                    className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-50"
                    style={{ background: 'var(--color-primary)', color: '#f0ede8', cursor: selectedSlot ? 'pointer' : 'not-allowed' }}>
                    {submitting ? 'Booking…' : 'Confirm & Pay →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
