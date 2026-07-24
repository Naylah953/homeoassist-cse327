import { useState, useRef, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type PView = 'dashboard' | 'chat' | 'doctors' | 'appointments' | 'records' | 'emergency' | 'profile'

// ── Icons ─────────────────────────────────────────────────────────────────────

function Ico({ d, size = 18 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

const IC = {
  grid:    ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
  chat:    ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  search:  ["M21 21l-6-6", "M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"],
  calendar:["M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z", "M16 2v4", "M8 2v4", "M3 10h18"],
  file:    ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
  phone:   ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.97-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.4z"],
  bell:    ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  send:    ["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"],
  check:   ["M20 6L9 17l-5-5"],
  x:       ["M18 6L6 18M6 6l12 12"],
  download:["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  qr:      ["M3 3h6v6H3z", "M15 3h6v6h-6z", "M3 15h6v6H3z", "M15 15h2v2h-2z", "M19 15v2", "M15 19h2", "M17 19v2", "M19 19h2"],
  star:    ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  video:   ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
  mic:     ["M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M8 23h8"],
  alert:   ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"],
  chevR:   ["M9 18l6-6-6-6"],
  clock:   ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  receipt: ["M4 2h16a1 1 0 0 1 1 1v18l-3-2-2 2-2-2-2 2-2-2-2 2-2-2-3 2V3a1 1 0 0 1 1-1z", "M8 10h8", "M8 14h4"],
  map:     ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logo:    ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  user:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  plus:    ["M12 5v14M5 12h14"],
  zap:     ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  logout:  ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
}

// ── Utilities ─────────────────────────────────────────────────────────────────

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'new' | 'gold' }) {
  const s: Record<string, string> = {
    default: 'bg-[#ede9e3] text-[#7a7468]',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger:  'bg-red-50 text-red-600 border border-red-200',
    accent:  'bg-amber-50 text-amber-700 border border-amber-200',
    new:     'bg-blue-50 text-blue-600 border border-blue-200',
    gold:    'bg-amber-50 text-amber-700 border border-amber-300',
  }
  return <span className={cx('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap', s[variant])}>{label}</span>
}

function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div style={style} className={cx('bg-white rounded-[10px] border border-[#d6d0c8]', className)}>
      {children}
    </div>
  )
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const DOCTORS = [
  {
    name: 'Dr. Anika Rahman',
    specialty: 'Allergies & Respiratory',
    qualifications: 'MD Homeopathy (BHMS, Gold Medalist)',
    regNo: '#HOM-4821',
    bio: 'Specialist in chronic respiratory conditions, severe allergic sinusitis, and constitutional homeopathic care with over 12 years of clinical practice.',
    exp: 12,
    rating: 4.9,
    reviews: 214,
    fee: 800,
    available: true,
    slots: ['09:00', '11:30', '14:00'],
    img: 'AR'
  },
  {
    name: 'Dr. Rahim Uddin',
    specialty: 'Digestive & IBS',
    qualifications: 'BHMS, MD (Homeo Gastro)',
    regNo: '#HOM-3910',
    bio: 'Focused on holistic gastrointestinal recovery, chronic acid reflux, IBS, and metabolic digestive disorders.',
    exp: 9,
    rating: 4.7,
    reviews: 156,
    fee: 700,
    available: true,
    slots: ['10:00', '13:30', '16:00'],
    img: 'RU'
  },
  {
    name: 'Dr. Reema Chowdhury',
    specialty: "Women's Health",
    qualifications: 'BHMS, FCMH (Gynecology)',
    regNo: '#HOM-5102',
    bio: 'Dedicated to women’s hormonal health, PCOS/PCOD management, and natural constitutional wellness care.',
    exp: 15,
    rating: 4.8,
    reviews: 302,
    fee: 900,
    available: false,
    slots: [],
    img: 'RC'
  },
  {
    name: 'Dr. Imran Shah',
    specialty: 'Skin & Dermatology',
    qualifications: 'BHMS, Dip. Homeopathic Dermatology',
    regNo: '#HOM-2891',
    bio: 'Expert in non-suppressive treatments for eczema, psoriasis, chronic acne, and allergic skin diseases.',
    exp: 7,
    rating: 4.6,
    reviews: 98,
    fee: 650,
    available: true,
    slots: ['09:30', '12:00'],
    img: 'IS'
  },
  {
    name: 'Dr. Shahida Shereen',
    specialty: 'Paediatrics',
    qualifications: 'BHMS, MD (Paediatric Homeopathy)',
    regNo: '#HOM-6019',
    bio: 'Gentle, safe, and holistic care for children, recurring childhood infections, and pediatric immunity boost.',
    exp: 11,
    rating: 4.8,
    reviews: 187,
    fee: 750,
    available: true,
    slots: ['10:30', '15:00', '17:00'],
    img: 'SS'
  },
  {
    name: 'Dr. Karim Khan',
    specialty: 'Joint & Arthritis',
    qualifications: 'BHMS, MD (Homeopathic Rheumatology)',
    regNo: '#HOM-1108',
    bio: 'Senior practitioner specializing in osteoarthritis, rheumatoid stiffness, and chronic musculoskeletal conditions.',
    exp: 18,
    rating: 4.9,
    reviews: 341,
    fee: 1000,
    available: false,
    slots: [],
    img: 'KK'
  },
]

const APPOINTMENTS = [
  { id: 'APT-0031', doctor: 'Dr. Anika Rahman', specialty: 'Allergies & Respiratory', date: '16 Jul 2025', time: '09:00 AM', type: 'online',  status: 'upcoming', fee: 800,  paid: true  },
  { id: 'APT-0030', doctor: 'Dr. Rahim Uddin',   specialty: 'Digestive & IBS',         date: '7 Jul 2025',  time: '10:00 AM', type: 'in-person',status: 'completed',fee: 700,  paid: true  },
  { id: 'APT-0029', doctor: 'Dr. Anika Rahman', specialty: 'Allergies & Respiratory', date: '2 Jul 2025',  time: '09:00 AM', type: 'online',  status: 'completed',fee: 800,  paid: true  },
  { id: 'APT-0028', doctor: 'Dr. Reema Chowdhury',   specialty: 'Women\'s Health',          date: '19 Jun 2025', time: '11:00 AM', type: 'in-person',status: 'completed',fee: 900,  paid: true  },
]

const PRESCRIPTIONS = [
  { id: 'RX-2025-0089', doctor: 'Dr. Anika Rahman', date: '2 Jul 2025',  diagnosis: 'Chronic Sinusitis',   medicines: 'Arsenicum Album 30C, Allium Cepa 6C',  status: 'active',    verified: true  },
  { id: 'RX-2025-0087', doctor: 'Dr. Anika Rahman', date: '15 Jun 2025', diagnosis: 'Allergic Rhinitis',   medicines: 'Natrum Muriaticum 30C, Sabadilla 6C',   status: 'completed', verified: true  },
  { id: 'RX-2025-0081', doctor: 'Dr. Rahim Uddin',   date: '3 Jun 2025',  diagnosis: 'IBS — Acute Episode', medicines: 'Lycopodium 30C, Nux Vomica 200C',        status: 'completed', verified: true  },
]

const CHAT_HISTORY = [
  { role: 'ai',      text: "Hello, Raisa! I'm your HomeoAssist AI. I'm here to help you describe your symptoms before your appointment with Dr. Rahman. What's been troubling you?", time: '08:42' },
  { role: 'patient', text: "I've had a blocked nose for about 3 weeks. Started after a cold but it's not going away.", time: '08:43' },
  { role: 'ai',      text: "I understand — persistent post-viral congestion can be quite uncomfortable. Is the discharge watery or thick? Does one side feel more blocked than the other?", time: '08:43' },
  { role: 'patient', text: "Mostly watery and clear. Sometimes yellowish in the morning. Left side is worse.", time: '08:45' },
  { role: 'ai',      text: "Thank you. Does the congestion improve in warm environments or worsen in the cold? And do you notice it being worse at any particular time of day?", time: '08:46' },
  { role: 'patient', text: "Much worse in the morning and in cold air. Warm rooms definitely help.", time: '08:47' },
  { role: 'ai',      text: "Are you also experiencing sneezing, facial pressure around the nose or forehead, or any change in your sense of smell?", time: '08:48' },
  { role: 'patient', text: "Yes — lots of sneezing when I wake up, some pressure around my nose, and my sense of smell has dropped a lot.", time: '08:50' },
]

const EXTRACTED = [
  'Bilateral nasal congestion (left > right)',
  'Watery discharge, yellowish in morning',
  'Worse: cold air, morning on waking',
  'Better: warm environments',
  'Sneezing — predominantly on waking',
  'Frontal facial pressure',
  'Reduced olfaction',
]

const ON_CALL_DOCTORS = [
  { name: 'Dr. Reema Chowdhury',  specialty: 'General', status: 'available', wait: '< 2 min' },
  { name: 'Dr. Imran Shah', specialty: 'General', status: 'available', wait: '< 5 min' },
  { name: 'Dr. Karim Khan',  specialty: 'General', status: 'busy',      wait: '~12 min' },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV: { id: PView; label: string; icon: string[] }[] = [
  { id: 'dashboard',    label: 'Dashboard',            icon: IC.grid     },
  { id: 'chat',         label: 'AI Symptom Chat',      icon: IC.chat     },
  { id: 'doctors',      label: 'Find Doctors',         icon: IC.search   },
  { id: 'appointments', label: 'Appointments',         icon: IC.calendar },
  { id: 'records',      label: 'Prescriptions',        icon: IC.file     },
  { id: 'emergency',    label: 'Emergency SOS',        icon: IC.zap      },
]

function Sidebar({ active, onChange, profile, onLogout }: { active: PView; onChange: (v: PView) => void; profile: any; onLogout: () => void }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <aside style={{ width: 240, background: '#131f16', flexShrink: 0 }} className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {IC.logo.map((p, i) => <path key={i} d={p} />)}
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e0ebe2', fontFamily: 'var(--font-display)' }}>HomeoAssist</p>
            <p className="text-[10px]" style={{ color: 'rgba(224,235,226,0.4)' }}>Patient Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(item => {
          const isActive = active === item.id
          const isEmergency = item.id === 'emergency'
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full text-left transition-all duration-150"
              style={{
                background: isActive ? (isEmergency ? '#c0392b' : 'var(--color-primary)') : 'transparent',
                color: isActive ? '#f0ede8' : isEmergency ? 'rgba(239,132,132,0.85)' : 'rgba(224,235,226,0.65)',
                fontWeight: isActive ? 500 : 400,
              }}>
              <span style={{ opacity: isActive ? 1 : 0.65 }}>
                <Ico d={item.icon} size={15} />
              </span>
              {item.label}
              {isEmergency && !isActive && (
                <span className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.6)' }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Patient profile & Logout Section */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button 
          onClick={() => onChange('profile')}
          className="flex items-center gap-3 w-full text-left p-2 rounded-xl transition-colors hover:bg-white/5 cursor-pointer mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'var(--color-accent)', color: 'white' }}>{getInitials(profile.name)}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate" style={{ color: '#e0ebe2' }}>{profile.name}</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(224,235,226,0.38)' }}>{profile.patientId}</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] w-full text-left transition-colors hover:bg-red-500/10 hover:text-red-400"
          style={{ color: 'rgba(224,235,226,0.6)' }}>
          <Ico d={IC.logout} size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Top Bar ───────────────────────────────────────────────────────────────────

function TopBar({ title, sub, onProfileClick, profile }: { title: string; sub?: string; onProfileClick?: () => void; profile?: any }) {
  const getInitials = (name?: string) => {
    if (!name) return 'RH'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
      style={{ background: 'rgba(245,242,237,0.88)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d6d0c8' }}>
      <div>
        <h1 className="text-[19px] font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{title}</h1>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[#ede9e3]" style={{ color: '#7a7468' }}>
          <Ico d={IC.bell} size={16} />
        </button>
        <button 
          onClick={onProfileClick}
          title="View & Edit Profile"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform active:scale-95 cursor-pointer"
          style={{ background: 'var(--color-accent)', color: 'white' }}>
          {getInitials(profile?.name)}
        </button>
      </div>
    </div>
  )
}

// ── Patient Profile View ──────────────────────────────────────────────────────

function PatientProfileView({ profile, onSave, onProfileClick }: { profile: any; onSave: (p: any) => void; onProfileClick?: () => void }) {
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <TopBar title="My Profile & Settings" sub="Manage your personal details and account settings" onProfileClick={onProfileClick} profile={profile} />
      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
        <Card className="p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#ede9e3]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: 'var(--color-accent)', color: 'white' }}>
                {form.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)' }}>{form.name}</h2>
                <p className="text-xs" style={{ color: '#7a7468' }}>{form.patientId} · Pro Plan Member</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Date of Birth</label>
                <input
                  type="text"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Blood Group</label>
                <input
                  type="text"
                  value={form.bloodGroup}
                  onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Known Allergies & Conditions</label>
              <textarea
                rows={3}
                value={form.allergies}
                onChange={e => setForm({ ...form, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm border border-[#d6d0c8] outline-none bg-[#f5f2ed] border resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)' }}>
                Save Profile
              </button>
              {saved && <span className="text-xs text-green-700 font-medium">✓ Profile updated successfully!</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ goTo, onProfileClick, profile }: { goTo: (v: PView) => void; onProfileClick?: () => void; profile?: any }) {
  return (
    <div>
      <TopBar title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Raisa'}`} sub="Thursday, 11 July 2025" onProfileClick={onProfileClick} profile={profile} />
      <div className="p-8 flex flex-col gap-6">

        {/* Greeting Banner */}
        <div className="rounded-xl p-6 flex items-center justify-between overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1b2d20 0%, #2d6a4f 100%)' }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1.2px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(224,235,226,0.55)' }}>Your health, your pace</p>
            <h2 className="text-[22px] font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: '#e0ebe2', fontStyle: 'italic' }}>
              How are you feeling today?
            </h2>
            <div className="flex gap-3">
              <button onClick={() => goTo('chat')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: 'white' }}>
                <Ico d={IC.chat} size={15} /> Start AI Chat
              </button>
              <button onClick={() => goTo('emergency')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-white/15"
                style={{ border: '1px solid rgba(255,255,255,0.25)', color: '#e0ebe2' }}>
                <Ico d={IC.zap} size={15} /> Emergency SOS
              </button>
            </div>
          </div>
          <div className="relative text-right hidden lg:block">
            <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(224,235,226,0.45)' }}>Current Plan</p>
            <p className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#c9913d' }}>Pro Plan</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(224,235,226,0.55)' }}>Unlimited AI Chats · Priority Booking</p>
          </div>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr 300px' }}>
          {/* Next Appointment */}
          <Card className="p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Next Appointment</p>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>AR</div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Dr. Anika Rahman</p>
                <p className="text-[11px]" style={{ color: '#7a7468' }}>Allergies & Respiratory · Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[12px]" style={{ color: '#1b2d20' }}>
              <span className="flex items-center gap-1.5"><Ico d={IC.calendar} size={13} /> 16 Jul 2025</span>
              <span className="flex items-center gap-1.5"><Ico d={IC.clock} size={13} /> 09:00 AM</span>
            </div>
            <button className="w-full py-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
              <Ico d={IC.video} size={14} /> Join Video Call
            </button>
          </Card>

          {/* Active Prescription */}
          <Card className="p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Active Prescription</p>
            <div className="mb-3">
              <p className="text-[13px] font-semibold mb-1" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>RX-2025-0089</p>
              <p className="text-[11px] mb-1" style={{ color: '#7a7468' }}>Issued by Dr. Anika Rahman · 2 Jul 2025</p>
              <p className="text-[11px]" style={{ color: '#1b2d20' }}>Arsenicum Album 30C · Allium Cepa 6C</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge label="Active" variant="success" />
              <Badge label="QR Verified" variant="gold" />
            </div>
            <button className="w-full py-2 rounded-lg text-[12px] font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#f5f2ed]"
              style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
              <Ico d={IC.download} size={14} /> Download PDF
            </button>
          </Card>

          {/* Subscription & Stats */}
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Subscription</p>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>Pro Plan</p>
                <Badge label="Active" variant="success" />
              </div>
              <div className="text-[11px] flex flex-col gap-1" style={{ color: '#7a7468' }}>
                {['Unlimited AI symptom chats', 'Priority appointment booking', 'Emergency doctor routing', '20% off consultation fees'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #ede9e3', paddingTop: 12 }}>
              <div className="flex justify-between text-[11px]">
                {[['Appointments', '14'], ['AI Chats', '31'], ['Prescriptions', '3']].map(([l, v]) => (
                  <div key={l} className="text-center">
                    <p className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{v}</p>
                    <p style={{ color: '#7a7468' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
          </div>
          <div>
            {[
              { icon: IC.chat,     label: 'AI symptom chat completed',          sub: 'Summary sent to Dr. Anika Rahman',   time: 'Today, 08:51 AM',    color: '#2d6a4f' },
              { icon: IC.calendar, label: 'Appointment confirmed',               sub: 'Dr. Anika Rahman · 16 Jul · Online', time: 'Today, 09:00 AM',    color: '#c9913d' },
              { icon: IC.file,     label: 'Prescription RX-2025-0089 issued',   sub: 'Dr. Anika Rahman · 2 Jul 2025',      time: '2 Jul, 09:45 AM',    color: '#2d6a4f' },
              { icon: IC.receipt,  label: 'Payment ₹800 confirmed',             sub: 'APT-0031 · UPI · PhonePe',           time: '10 Jul, 11:20 AM',   color: '#7a7468' },
            ].map((item, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
                style={{ borderBottom: i < 3 ? '1px solid #ede9e3' : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.color + '18', color: item.color }}>
                  <Ico d={item.icon} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{item.label}</p>
                  <p className="text-[11px]" style={{ color: '#7a7468' }}>{item.sub}</p>
                </div>
                <p className="text-[10px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{item.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── AI Chat ───────────────────────────────────────────────────────────────────

function AIChat({ goTo, onProfileClick, profile }: { goTo: (v: PView) => void; onProfileClick?: () => void; profile?: any }) {
  const [messages, setMessages] = useState(CHAT_HISTORY)
  const [input, setInput] = useState('')
  const [symptoms] = useState(EXTRACTED)
  const [summaryReady] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'patient', text: input.trim(), time: t }])
    setInput('')
  }

  return (
    <div className="flex" style={{ height: '100%' }}>
      {/* Chat panel */}
      <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: '1px solid #d6d0c8' }}>
        <TopBar title="AI Symptom Chat" sub="Describe your symptoms in your own words" onProfileClick={onProfileClick} profile={profile} />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={cx('flex gap-3', msg.role === 'patient' ? 'flex-row-reverse' : '')}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {IC.logo.map((p, j) => <path key={j} d={p} />)}
                  </svg>
                </div>
              )}
              <div className={cx('max-w-[68%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed',
                msg.role === 'ai' ? 'bg-white border border-[#d6d0c8] text-[#1b2d20] rounded-tl-sm' : 'rounded-tr-sm text-white')}
                style={msg.role === 'patient' ? { background: 'var(--color-primary)' } : {}}>
                <p>{msg.text}</p>
                <p className="text-[10px] mt-1"
                  style={{ fontFamily: 'var(--font-mono)', color: msg.role === 'ai' ? '#7a7468' : 'rgba(255,255,255,0.55)' }}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-5 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid #d6d0c8' }}>
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Describe your symptoms in natural language…"
              className="flex-1 px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
            <button onClick={send}
              className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-opacity hover:opacity-85"
              style={{ background: 'var(--color-primary)', color: 'white' }}>
              <Ico d={IC.send} size={15} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors hover:bg-[#ede9e3]"
              style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>
              <Ico d={IC.mic} size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary panel */}
      <div className="flex flex-col" style={{ width: 300, flexShrink: 0, background: '#f5f2ed' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
          <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Live Symptom Summary</h2>
          <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>Extracted as you chat</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Chief Concern</p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#1b2d20' }}>Persistent bilateral nasal congestion, 3 weeks post-URTI, with watery discharge and olfactory loss.</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Identified Symptoms</p>
            <div className="flex flex-col gap-2">
              {symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: '#1b2d20' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Privacy Note</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#7a7468' }}>This summary will only be shared with your selected doctor when you confirm booking below.</p>
          </div>
        </div>

        {summaryReady && (
          <div className="p-4 flex flex-col gap-2" style={{ borderTop: '1px solid #d6d0c8' }}>
            <button onClick={() => goTo('doctors')}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
              Book Doctor with Summary →
            </button>
            <p className="text-[10px] text-center" style={{ color: '#7a7468' }}>Summary auto-attached to your next booking</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Find Doctors ──────────────────────────────────────────────────────────────

function FindDoctors({ onProfileClick, profile }: { onProfileClick?: () => void; profile?: any }) {
  const [filter, setFilter] = useState('All')
  const [booking, setBooking] = useState<typeof DOCTORS[0] | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [attachSummary, setAttachSummary] = useState(true)
  const specialties = ['All', 'Allergies & Respiratory', 'Digestive & IBS', "Women's Health", 'Skin & Dermatology', 'Paediatrics']

  const shown = filter === 'All' ? DOCTORS : DOCTORS.filter(d => d.specialty === filter)

  return (
    <div>
      <TopBar title="Find Doctors" sub="Browse certified homeopathic practitioners" onProfileClick={onProfileClick} profile={profile} />
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

// ── Appointments ──────────────────────────────────────────────────────────────

function Appointments({ onProfileClick, profile }: { onProfileClick?: () => void; profile?: any }) {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'invoices'>('upcoming')

  const upcoming = APPOINTMENTS.filter(a => a.status === 'upcoming')
  const past      = APPOINTMENTS.filter(a => a.status === 'completed')

  return (
    <div>
      <TopBar title="Appointments & Billing" sub="Manage your schedule and payment history" onProfileClick={onProfileClick} profile={profile} />
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

// ── Records ───────────────────────────────────────────────────────────────────

function Records({ onProfileClick, profile }: { onProfileClick?: () => void; profile?: any }) {
  return (
    <div>
      <TopBar title="Prescriptions & Records" sub="Your complete medical history" onProfileClick={onProfileClick} profile={profile} />
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

// ── Emergency SOS ─────────────────────────────────────────────────────────────

function Emergency({ onProfileClick, profile }: { onProfileClick?: () => void; profile?: any }) {
  const [called, setCalled] = useState(false)

  return (
    <div>
      <TopBar title="Emergency SOS" sub="Immediate access to on-call certified doctors" onProfileClick={onProfileClick} profile={profile} />
      <div className="p-8 flex flex-col gap-6">

        {/* SOS Button */}
        <div className="flex flex-col items-center py-10 px-6 rounded-2xl text-center"
          style={{ background: called ? '#fff1f2' : '#1b2d20', border: called ? '2px solid #fca5a5' : '2px solid transparent', transition: 'all 0.3s ease' }}>
          {!called ? (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative"
                style={{ background: '#c0392b' }}>
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(192,57,43,0.35)' }} />
                <Ico d={IC.zap} size={32} />
              </div>
              <h2 className="text-[22px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#e0ebe2' }}>Emergency SOS</h2>
              <p className="text-[13px] mb-6 max-w-sm" style={{ color: 'rgba(224,235,226,0.6)', lineHeight: 1.6 }}>
                Tap below to connect instantly with the AI triage assistant. You'll be routed to the first available on-call doctor.
              </p>
              <button onClick={() => setCalled(true)}
                className="px-10 py-3.5 rounded-2xl text-[14px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: '#c0392b', color: 'white', boxShadow: '0 0 24px rgba(192,57,43,0.5)' }}>
                Initiate Emergency Call
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#d1fae5' }}>
                <Ico d={IC.check} size={28} />
              </div>
              <h2 className="text-[20px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#b91c1c' }}>Connecting you now…</h2>
              <p className="text-[13px] mb-4" style={{ color: '#7a7468' }}>AI triage assistant is collecting your details. Estimated wait: &lt; 2 minutes.</p>
              <button onClick={() => setCalled(false)}
                className="text-[12px] font-medium transition-colors hover:opacity-70 cursor-pointer"
                style={{ color: '#7a7468' }}>Cancel Call</button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* On-call doctors */}
          <Card>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>On-Call Doctors</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>Real-time availability</p>
            </div>
            <div className="divide-y" style={{ borderColor: '#ede9e3' }}>
              {ON_CALL_DOCTORS.map((doc, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                    {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                    <p className="text-[10px]" style={{ color: '#7a7468' }}>{doc.specialty} Homeopathy</p>
                  </div>
                  <div className="text-right">
                    <Badge label={doc.status === 'available' ? 'Available' : 'Busy'} variant={doc.status === 'available' ? 'success' : 'warning'} />
                    <p className="text-[10px] mt-1" style={{ color: '#7a7468', fontFamily: 'var(--font-mono)' }}>{doc.wait}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Helpline & info */}
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Emergency Helpline</p>
              <a href="tel:18001234567"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[18px] transition-colors hover:opacity-90"
                style={{ background: '#d8f3dc', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
                <Ico d={IC.phone} size={18} />
                1800-123-4567
              </a>
              <p className="text-[10px] mt-2" style={{ color: '#7a7468' }}>Toll-free · Available 24×7 · All Bangladesh</p>
            </div>

            <div style={{ borderTop: '1px solid #ede9e3', paddingTop: 16 }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>How It Works</p>
              {['Call or tap the SOS button above', 'AI voice assistant collects your symptoms', 'Priority matched to next available doctor', 'Doctor connects within minutes'].map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: '#131f16', color: '#e0ebe2' }}>{i + 1}</span>
                  <p className="text-[12px]" style={{ color: '#1b2d20' }}>{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ── Patient App ───────────────────────────────────────────────────────────────

export default function Patient_Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<PView>('dashboard')

  const [patientProfile, setPatientProfile] = useState({
    name: 'Raisa Hossain',
    patientId: 'Patient #P-00124',
    email: 'raisa.hossain@example.com',
    phone: '+880 1812-987654',
    dob: '14 Nov 1996',
    bloodGroup: 'B+',
    address: 'Dhaka, Bangladesh',
    allergies: 'Dust allergy, seasonal rhinitis'
  })

  const openProfile = () => setView('profile')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      window.location.href = '/'
    }
  }

  const views: Record<PView, React.ReactNode> = {
    dashboard:    <Dashboard goTo={setView} onProfileClick={openProfile} profile={patientProfile} />,
    chat:         <AIChat goTo={setView} onProfileClick={openProfile} profile={patientProfile} />,
    doctors:      <FindDoctors onProfileClick={openProfile} profile={patientProfile} />,
    appointments: <Appointments onProfileClick={openProfile} profile={patientProfile} />,
    records:      <Records onProfileClick={openProfile} profile={patientProfile} />,
    emergency:    <Emergency onProfileClick={openProfile} profile={patientProfile} />,
    profile:      <PatientProfileView profile={patientProfile} onSave={setPatientProfile} onProfileClick={openProfile} />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f2ed' }}>
      <Sidebar active={view} onChange={setView} profile={patientProfile} onLogout={handleLogout} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {views[view]}
        </div>
      </main>
    </div>
  )
}