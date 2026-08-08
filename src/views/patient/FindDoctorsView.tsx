import { useState } from 'react'
import { Ico, IC } from '../../components/ui/Ico'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { TopBar } from '../../components/layout/Topbar'
import { DOCTORS } from '../../data/patientMockData'

// ── Find Doctors ──────────────────────────────────────────────────────────────

interface PatientDoctorsViewProps {
  onProfileClick?: () => void
  profile?: any
}

export function FindDoctorsView({ onProfileClick, profile }: PatientDoctorsViewProps) {
  const [filter, setFilter] = useState('All')
  const [booking, setBooking] = useState<typeof DOCTORS[0] | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [attachSummary, setAttachSummary] = useState(true)
  const specialties = ['All', 'Allergies & Respiratory', 'Digestive & IBS', "Women's Health", 'Skin & Dermatology', 'Paediatrics']

  const shown = filter === 'All' ? DOCTORS : DOCTORS.filter(d => d.specialty === filter)

  return (
    <div>
      <TopBar 
        title="Find Doctors" 
        sub="Browse certified homeopathic practitioners" 
        onProfileClick={onProfileClick} 
        profile={profile}
        avatarBg="var(--color-accent)"
        defaultInitials="RH"
      />
      <div className="p-8 flex flex-col gap-5">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {specialties.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
              style={filter === s
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Doctor cards with full Doctor Dashboard details */}
        <div className="grid grid-cols-2 gap-4">
          {shown.map((doc, i) => (
            <Card key={i} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.img}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{doc.name}</p>
                      {doc.available
                        ? <Badge label="Available" variant="success" />
                        : <Badge label="Unavailable" variant="default" />}
                    </div>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--color-primary)' }}>{doc.qualifications} · {doc.regNo}</p>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.exp} yrs exp</p>
                  </div>
                </div>

                {/* Doctor Bio / Description */}
                <p className="text-[11px] leading-relaxed mb-4 p-2.5 rounded-lg" style={{ background: '#f5f2ed', color: '#1b2d20' }}>
                  {doc.bio}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span style={{ color: 'var(--color-accent)' }}><Ico d={IC.star} size={13} /></span>
                    <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{doc.rating}</span>
                    <span className="text-[11px]" style={{ color: '#7a7468' }}>({doc.reviews} reviews)</span>
                  </div>
                  <span className="text-[14px] font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>₹{doc.fee}</span>
                </div>

                {doc.available && doc.slots.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {doc.slots.map(slot => (
                      <span key={slot} className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                        style={{ background: '#f5f2ed', border: '1px solid #d6d0c8', color: '#1b2d20', fontFamily: 'var(--font-mono)' }}>{slot}</span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => doc.available ? setBooking(doc) : undefined}
                disabled={!doc.available}
                className="w-full py-2 rounded-lg text-[12px] font-semibold transition-opacity"
                style={doc.available
                  ? { background: 'var(--color-primary)', color: '#f0ede8', opacity: 1, cursor: 'pointer' }
                  : { background: '#ede9e3', color: '#7a7468', cursor: 'not-allowed' }}>
                {doc.available ? 'Book Appointment' : 'Not Available'}
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(27,45,32,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setBooking(null); setSelectedSlot(null) }}>
          <div className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'white' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <div>
                <h3 className="text-[16px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Book Appointment</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{booking.name} · {booking.specialty}</p>
              </div>
              <button onClick={() => { setBooking(null); setSelectedSlot(null) }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f2ed] transition-colors cursor-pointer" style={{ color: '#7a7468' }}>
                <Ico d={IC.x} size={16} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#7a7468' }}>Select Date</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Tue 15 Jul', 'Wed 16 Jul', 'Thu 17 Jul'].map((d, i) => (
                    <button key={d}
                      className="py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                      style={i === 1
                        ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                        : { border: '1px solid #d6d0c8', color: '#1b2d20', background: 'white' }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#7a7468' }}>Select Time</p>
                <div className="flex gap-2 flex-wrap">
                  {booking.slots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      className="px-3 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                      style={selectedSlot === slot
                        ? { background: 'var(--color-primary)', color: '#f0ede8', border: '1px solid var(--color-primary)' }
                        : { border: '1px solid #d6d0c8', color: '#1b2d20', background: 'white', fontFamily: 'var(--font-mono)' }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: '#f5f2ed' }}>
                <div>
                  <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>Attach AI Symptom Summary</p>
                  <p className="text-[10px]" style={{ color: '#7a7468' }}>Prepares your doctor before the consult</p>
                </div>
                <button onClick={() => setAttachSummary(!attachSummary)}
                  className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative cursor-pointer"
                  style={{ background: attachSummary ? 'var(--color-primary)' : '#d6d0c8' }}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                    style={{ left: attachSummary ? 'calc(100% - 22px)' : '2px' }} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[11px]" style={{ color: '#7a7468' }}>Consultation Fee</p>
                  <p className="text-[18px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>₹{booking.fee} <span className="text-[13px] line-through text-[#7a7468]">₹{Math.round(booking.fee / 0.8)}</span></p>
                  <p className="text-[10px]" style={{ color: 'var(--color-primary)' }}>Pro Plan — 20% off applied</p>
                </div>
                <button
                  disabled={!selectedSlot}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity"
                  style={selectedSlot
                    ? { background: 'var(--color-primary)', color: '#f0ede8', cursor: 'pointer' }
                    : { background: '#ede9e3', color: '#7a7468', cursor: 'not-allowed' }}>
                  Confirm & Pay →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
