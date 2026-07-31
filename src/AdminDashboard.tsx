import { useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type AView = 'dashboard' | 'doctors' | 'patients' | 'complaints' | 'medicines' | 'revenue' | 'settings'

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
  grid:     ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
  users:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  flag:     ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  pill:     ["M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7", "m13 12 7 7", "m15 10 4 4"],
  coin:     ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  check:    ["M20 6L9 17l-5-5"],
  x:        ["M18 6L6 18M6 6l12 12"],
  bell:     ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  search:   ["M21 21l-6-6", "M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"],
  plus:     ["M12 5v14M5 12h14"],
  edit:     ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash:    ["M3 6h18", "M19 6l-1 14H6L5 6", "M8 6V4h8v2", "M10 11v6", "M14 11v6"],
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logo:     ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  trending: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  alert:    ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  star:     ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  toggle:   ["M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4", "M9 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0", "M12 12v9"],
  doc:      ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"],
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
  return <div style={style} className={cx('bg-white rounded-[10px] border border-[#d6d0c8]', className)}>{children}</div>
}

function StatCard({ label, value, sub, gold, warn }: { label: string; value: string | number; sub: string; gold?: boolean; warn?: boolean }) {
  return (
    <Card className="p-5 flex flex-col gap-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7a7468' }}>{label}</p>
      <p className="text-[32px] font-bold leading-none" style={{ fontFamily: 'var(--font-display)', color: warn ? '#c0392b' : gold ? 'var(--color-accent)' : '#1b2d20' }}>{value}</p>
      <p className="text-[11px]" style={{ color: '#7a7468' }}>{sub}</p>
    </Card>
  )
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PENDING_DOCTORS = [
  {
    name: 'Dr. Sameer Kapoor', initials: 'SK', qual: 'BHMS, MD (Homeopathy)',
    reg: 'UP-HOM-2847', specialty: 'Paediatric Homeopathy', exp: 6,
    city: 'Delhi, India', submitted: '9 Jul 2025', docs: true,
    note: 'Registered with Delhi Homeopathic Council. 6 years at Kapoor Wellness Clinic.',
  },
  {
    name: 'Dr. Nisha Pillai', initials: 'NP', qual: 'BHMS',
    reg: 'KA-HOM-1934', specialty: 'Dermatology & Skin', exp: 4,
    city: 'Bangalore, India', submitted: '10 Jul 2025', docs: true,
    note: 'Karnataka Medical Council registered. Specialises in chronic skin conditions.',
  },
  {
    name: 'Dr. Tanvir Ahmed', initials: 'TA', qual: 'MD (Homeopathy)',
    reg: 'MH-HOM-3621', specialty: 'General & Acute Homeopathy', exp: 8,
    city: 'Mumbai, India', submitted: '11 Jul 2025', docs: false,
    note: 'Documents partially uploaded. Certificate of practice pending.',
  },
]

const VERIFIED_DOCTORS = [
  { name: 'Dr. Priya Sharma',  initials: 'PS', reg: 'HOM-4821', specialty: 'Allergies & Respiratory', exp: 12, patients: 247, joined: '15 Jan 2025', status: 'active'    },
  { name: 'Dr. Amit Joshi',    initials: 'AJ', reg: 'HOM-3614', specialty: 'Digestive & IBS',         exp: 9,  patients: 189, joined: '20 Feb 2025', status: 'active'    },
  { name: 'Dr. Leela Nair',    initials: 'LN', reg: 'HOM-5027', specialty: 'Women\'s Health',          exp: 15, patients: 312, joined: '8 Mar 2025',  status: 'active'    },
  { name: 'Dr. Rohan Mehta',   initials: 'RM', reg: 'HOM-2891', specialty: 'Skin & Dermatology',       exp: 7,  patients: 124, joined: '1 Apr 2025',  status: 'active'    },
  { name: 'Dr. Shalini Verma', initials: 'SV', reg: 'HOM-6102', specialty: 'Paediatrics',              exp: 11, patients: 201, joined: '12 May 2025', status: 'active'    },
  { name: 'Dr. Karan Bose',    initials: 'KB', reg: 'HOM-1743', specialty: 'Arthritis & Joints',       exp: 18, patients: 298, joined: '3 Jun 2025',  status: 'suspended' },
]

const ALL_PATIENTS = [
  { name: 'Anjali Mehta',    initials: 'AM', id: 'P-00124', age: 34, gender: 'F', city: 'Mumbai',    plan: 'Pro',    joined: '3 Mar 2025',  visits: 8,  status: 'active'  },
  { name: 'Rajesh Kumar',    initials: 'RK', id: 'P-00118', age: 52, gender: 'M', city: 'Delhi',     plan: 'Basic',  joined: '18 Jan 2025', visits: 14, status: 'active'  },
  { name: 'Preethi Sharma',  initials: 'PS', id: 'P-00131', age: 28, gender: 'F', city: 'Chennai',   plan: 'Pro',    joined: '7 Apr 2025',  visits: 5,  status: 'active'  },
  { name: 'Suresh Nair',     initials: 'SN', id: 'P-00109', age: 45, gender: 'M', city: 'Kochi',     plan: 'Basic',  joined: '5 Dec 2024',  visits: 11, status: 'active'  },
  { name: 'Kavitha Reddy',   initials: 'KR', id: 'P-00142', age: 39, gender: 'F', city: 'Hyderabad', plan: 'Pro',    joined: '22 May 2025', visits: 7,  status: 'active'  },
  { name: 'Arjun Patel',     initials: 'AP', id: 'P-00088', age: 61, gender: 'M', city: 'Ahmedabad', plan: 'Clinic', joined: '2 Oct 2024',  visits: 22, status: 'active'  },
  { name: 'Meera Singh',     initials: 'MS', id: 'P-00149', age: 22, gender: 'F', city: 'Jaipur',    plan: 'Basic',  joined: '10 Jul 2025', visits: 2,  status: 'pending' },
  { name: 'Vikram Desai',    initials: 'VD', id: 'P-00096', age: 48, gender: 'M', city: 'Pune',      plan: 'Pro',    joined: '14 Nov 2024', visits: 9,  status: 'active'  },
]

const COMPLAINTS = [
  {
    id: 'TKT-20250711-041', from: 'Dr. Priya Sharma',  role: 'doctor',  type: 'bug',
    priority: 'high',   status: 'in-review',
    subject: 'Medicine search extremely slow',
    message: 'The medicine search results take over 10 seconds to load when the connection is moderate. This delays consultations. Happens on Chrome desktop.',
    submitted: '11 Jul · 09:15 AM', adminNote: 'Escalated to engineering team. DB query optimisation in progress.',
  },
  {
    id: 'TKT-20250711-042', from: 'Anjali Mehta',     role: 'patient', type: 'bug',
    priority: 'medium', status: 'open',
    subject: 'AI chat history lost on refresh',
    message: 'When I refreshed the browser during an AI symptom chat, all my previous messages disappeared. I had to start over from scratch.',
    submitted: '11 Jul · 10:42 AM', adminNote: '',
  },
  {
    id: 'TKT-20250710-038', from: 'Dr. Amit Joshi',    role: 'doctor',  type: 'feature',
    priority: 'low',    status: 'open',
    subject: 'Voice notes in patient records',
    message: 'Would love to be able to record short voice notes during consultation instead of typing lengthy observations. Could save significant time.',
    submitted: '10 Jul · 04:30 PM', adminNote: '',
  },
  {
    id: 'TKT-20250709-034', from: 'Kavitha Reddy',    role: 'patient', type: 'bug',
    priority: 'high',   status: 'resolved',
    subject: 'Payment gateway timeout during booking',
    message: 'Payment timed out twice in a row while trying to book with Dr. Rohan Mehta. Amount was debited but booking was not confirmed. Very stressful.',
    submitted: '9 Jul · 02:18 PM', adminNote: 'Payment gateway issue fixed. Refund processed. Patient notified.',
  },
  {
    id: 'TKT-20250708-031', from: 'Arjun Patel',      role: 'patient', type: 'bug',
    priority: 'medium', status: 'in-review',
    subject: 'Prescription QR code fails to scan',
    message: 'The QR code on my prescription PDF does not scan on my older Android phone (Samsung A32). Tried three different scanning apps.',
    submitted: '8 Jul · 11:05 AM', adminNote: 'QR rendering issue on low DPI screens identified. Fix in next release.',
  },
  {
    id: 'TKT-20250707-028', from: 'Dr. Leela Nair',    role: 'doctor',  type: 'feedback',
    priority: 'low',    status: 'open',
    subject: 'AI summary — excellent feature!',
    message: 'The AI symptom summary is incredibly helpful before consultations. Would love to see a PDF export option for the summary to attach to physical records.',
    submitted: '7 Jul · 03:55 PM', adminNote: '',
  },
  {
    id: 'TKT-20250706-025', from: 'Meera Singh',       role: 'patient', type: 'feature',
    priority: 'low',    status: 'open',
    subject: 'Dark mode request',
    message: 'I often use the app late at night before sleep. A dark mode option would reduce eye strain significantly. Even a simple toggle would help.',
    submitted: '6 Jul · 09:40 PM', adminNote: '',
  },
  {
    id: 'TKT-20250705-022', from: 'Dr. Karan Bose',    role: 'doctor',  type: 'bug',
    priority: 'high',   status: 'resolved',
    subject: 'Double-booking conflict in scheduler',
    message: 'Two patients were booked at the same time slot (11:00 AM, 5 Jul) when my assistant and I were booking simultaneously from different devices.',
    submitted: '5 Jul · 12:30 PM', adminNote: 'Concurrency locking fix deployed. Scheduler now uses row-level locking.',
  },
]

const MEDICINES_DB = [
  { name: 'Arsenicum Album',       category: 'Anti-miasmatic',  potencies: '6C, 12C, 30C, 200C, 1M', count: 89,  status: 'active'   },
  { name: 'Nux Vomica',            category: 'Polychrest',       potencies: '30C, 200C, 1M',           count: 72,  status: 'active'   },
  { name: 'Lycopodium Clavatum',   category: 'Polychrest',       potencies: '30C, 200C',               count: 61,  status: 'active'   },
  { name: 'Pulsatilla Nigricans',  category: 'Polychrest',       potencies: '6C, 30C, 200C',           count: 58,  status: 'active'   },
  { name: 'Sulphur',               category: 'Polychrest',       potencies: '30C, 200C, 1M',           count: 54,  status: 'active'   },
  { name: 'Belladonna',            category: 'Acute Remedy',     potencies: '6C, 30C, 200C',           count: 47,  status: 'active'   },
  { name: 'Rhus Toxicodendron',    category: 'Anti-rheumatic',   potencies: '30C, 200C',               count: 41,  status: 'active'   },
  { name: 'Bryonia Alba',          category: 'Acute Remedy',     potencies: '30C, 200C',               count: 38,  status: 'active'   },
  { name: 'Apis Mellifica',        category: 'Anti-allergic',    potencies: '6C, 30C, 200C',           count: 29,  status: 'active'   },
  { name: 'Natrum Muriaticum',     category: 'Constitutional',   potencies: '30C, 200C, 1M',           count: 67,  status: 'active'   },
  { name: 'Gelsemium Sempervirens',category: 'Neurological',     potencies: '30C, 200C',               count: 22,  status: 'active'   },
  { name: 'Calcarea Carbonica',    category: 'Constitutional',   potencies: '30C, 200C, 1M',           count: 34,  status: 'archived' },
]

const PLANS = [
  { name: 'Basic',  price: 499,  subscribers: 312, revenue: 155688,  features: ['2 AI chats/month', 'Standard booking', 'Prescription access'] },
  { name: 'Pro',    price: 999,  subscribers: 487, revenue: 486513,  features: ['Unlimited AI chats', 'Priority booking', 'Emergency SOS', '20% off fees'] },
  { name: 'Clinic', price: 2499, subscribers: 28,  revenue: 69972,   features: ['Team access', 'Unlimited everything', 'Dedicated support', 'Analytics'] },
]

const RECENT_PAYMENTS = [
  { patient: 'Preethi Sharma', plan: 'Pro',    amount: 999,  date: '11 Jul 2025', gateway: 'UPI' },
  { patient: 'Meera Singh',    plan: 'Basic',  amount: 499,  date: '10 Jul 2025', gateway: 'Card' },
  { patient: 'Vikram Desai',   plan: 'Pro',    amount: 999,  date: '10 Jul 2025', gateway: 'UPI' },
  { patient: 'Anjali Mehta',   plan: 'Pro',    amount: 999,  date: '1 Jul 2025',  gateway: 'Card' },
  { patient: 'Arjun Patel',    plan: 'Clinic', amount: 2499, date: '2 Jun 2025',  gateway: 'NEFT' },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV: { id: AView; label: string; icon: string[] }[] = [
  { id: 'dashboard',  label: 'Dashboard',           icon: IC.grid     },
  { id: 'doctors',    label: 'Doctor Management',   icon: IC.shield   },
  { id: 'patients',   label: 'Patient Management',  icon: IC.users    },
  { id: 'complaints', label: 'Complaints & Feedback', icon: IC.flag   },
  { id: 'medicines',  label: 'Medicine Database',   icon: IC.pill     },
  { id: 'revenue',    label: 'Revenue & Plans',     icon: IC.coin     },
  { id: 'settings',   label: 'System Settings',     icon: IC.settings },
]

function Sidebar({ active, onChange, onLogout }: { active: AView; onChange: (v: AView) => void; onLogout: () => void }) {
  const openCount = COMPLAINTS.filter(c => c.status === 'open').length
  const pendingCount = PENDING_DOCTORS.length

  return (
    <aside style={{ width: 240, background: '#131f16', flexShrink: 0 }} className="flex flex-col h-full">
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {IC.logo.map((p, i) => <path key={i} d={p} />)}
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e0ebe2', fontFamily: 'var(--font-display)' }}>HomeoAssist</p>
            <p className="text-[10px]" style={{ color: 'rgba(224,235,226,0.4)' }}>Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(item => {
          const isActive = active === item.id
          const badge = item.id === 'doctors' ? pendingCount : item.id === 'complaints' ? openCount : 0
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full text-left transition-all duration-150"
              style={{
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? '#f0ede8' : 'rgba(224,235,226,0.65)',
                fontWeight: isActive ? 500 : 400,
              }}>
              <span style={{ opacity: isActive ? 1 : 0.65 }}><Ico d={item.icon} size={15} /></span>
              {item.label}
              {badge > 0 && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: item.id === 'complaints' ? '#c9913d' : '#c0392b', color: 'white', lineHeight: 1.4 }}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Profile */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: '#c9913d', color: 'white' }}>SA</div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: '#e0ebe2' }}>Super Admin</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(224,235,226,0.38)' }}>admin@homeoassist.in</p>
          </div>
        </div>

      {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 text-[12px] font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition border border-red-500/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Top Bar ───────────────────────────────────────────────────────────────────

function TopBar({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
      style={{ background: 'rgba(245,242,237,0.88)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d6d0c8' }}>
      <div>
        <h1 className="text-[19px] font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{title}</h1>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}>
          <Ico d={IC.bell} size={16} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{ background: '#c9913d', color: 'white' }}>SA</div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ goTo }: { goTo: (v: AView) => void }) {
  const openComplaints = COMPLAINTS.filter(c => c.status === 'open').length
  const totalRev = PLANS.reduce((s, p) => s + p.revenue, 0)

  return (
    <div>
      <TopBar title="Admin Dashboard" sub="Thursday, 11 July 2025 · Platform Overview" />
      <div className="p-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard label="Registered Doctors" value={47}     sub="6 specialties"         />
          <StatCard label="Registered Patients" value="1,284" sub="+31 this week" gold     />
          <StatCard label="Pending Verifications" value={PENDING_DOCTORS.length} sub="Doctors awaiting review" warn />
          <StatCard label="Open Complaints"      value={openComplaints} sub="Requires attention" warn />
          <StatCard label="Monthly Revenue"      value={`₹${(totalRev/100000).toFixed(1)}L`} sub="All active plans" gold />
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Pending Doctor Verifications */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Pending Doctor Verifications</h2>
              <button onClick={() => goTo('doctors')} className="text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-primary)' }}>View all →</button>
            </div>
            <div>
              {PENDING_DOCTORS.map((doc, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < PENDING_DOCTORS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.city}</p>
                  </div>
                  {!doc.docs && <Badge label="Docs missing" variant="danger" />}
                  <Badge label="Pending" variant="warning" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Complaints */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Complaints</h2>
              <button onClick={() => goTo('complaints')} className="text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-primary)' }}>View all →</button>
            </div>
            <div>
              {COMPLAINTS.slice(0, 4).map((c, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < 3 ? '1px solid #ede9e3' : 'none' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: c.priority === 'high' ? '#c0392b' : c.priority === 'medium' ? '#c9913d' : '#7a7468' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{c.subject}</p>
                    <p className="text-[10px]" style={{ color: '#7a7468' }}>{c.from} · {c.role}</p>
                  </div>
                  <Badge
                    label={c.status === 'open' ? 'Open' : c.status === 'in-review' ? 'In Review' : 'Resolved'}
                    variant={c.status === 'open' ? 'danger' : c.status === 'in-review' ? 'accent' : 'success'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.name} Plan</p>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>₹{plan.price}<span className="text-[10px] font-normal text-[#7a7468]">/mo</span></span>
              </div>
              <p className="text-[28px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : '#1b2d20' }}>{plan.subscribers}</p>
              <p className="text-[11px] mb-3" style={{ color: '#7a7468' }}>subscribers</p>
              <div className="pt-3" style={{ borderTop: '1px solid #ede9e3' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Monthly Revenue</p>
                <p className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>₹{plan.revenue.toLocaleString('en-IN')}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Doctors ───────────────────────────────────────────────────────────────────

function DoctorManagement() {
  const [tab, setTab] = useState<'pending' | 'verified' | 'declined'>('pending')
  const [declineModal, setDeclineModal] = useState<typeof PENDING_DOCTORS[0] | null>(null)
  const [approved, setApproved] = useState<string[]>([])
  const [declined, setDeclined] = useState<string[]>([])
  const [declineReason, setDeclineReason] = useState('')

  const pending  = PENDING_DOCTORS.filter(d => !approved.includes(d.reg) && !declined.includes(d.reg))
  const verified = [...VERIFIED_DOCTORS, ...PENDING_DOCTORS.filter(d => approved.includes(d.reg)).map(d => ({
    name: d.name, initials: d.initials, reg: d.reg, specialty: d.specialty, exp: d.exp,
    patients: 0, joined: 'Just now', status: 'active' as const,
  }))]

  return (
    <div>
      <TopBar title="Doctor Management" sub={`${PENDING_DOCTORS.length} pending · ${VERIFIED_DOCTORS.length} verified`} />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex gap-2">
          {(['pending', 'verified', 'declined'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize relative"
              style={tab === t
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {t === 'pending' ? 'Pending Review' : t === 'verified' ? 'Verified Doctors' : 'Declined'}
              {t === 'pending' && pending.length > 0 && (
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#c0392b', color: 'white' }}>{pending.length}</span>
              )}
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.download} size={13} /> Export List
          </button>
        </div>

        {tab === 'pending' && (
          <div className="flex flex-col gap-4">
            {pending.length === 0
              ? <p className="text-[13px] text-center py-12" style={{ color: '#7a7468' }}>No pending verifications.</p>
              : pending.map((doc, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{doc.name}</h3>
                        <Badge label="Pending Review" variant="warning" />
                        {!doc.docs && <Badge label="Documents Incomplete" variant="danger" />}
                      </div>
                      <p className="text-[12px] mb-1" style={{ color: '#7a7468' }}>{doc.qual} · {doc.specialty} · {doc.exp} yrs experience</p>
                      <div className="flex items-center gap-4 text-[11px]" style={{ color: '#7a7468' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontWeight: 600 }}>{doc.reg}</span>
                        <span>📍 {doc.city}</span>
                        <span>Submitted {doc.submitted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-lg mb-4" style={{ background: '#f5f2ed', border: '1px solid #ede9e3' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Registration Note</p>
                    <p className="text-[12px]" style={{ color: '#1b2d20' }}>{doc.note}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                      <Ico d={IC.eye} size={13} /> View Full Application
                    </button>
                    <button onClick={() => setDeclineModal(doc)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                      style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>
                      <Ico d={IC.x} size={13} /> Decline
                    </button>
                    <button onClick={() => setApproved(a => [...a, doc.reg])}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
                      style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                      <Ico d={IC.check} size={13} /> Approve & Verify
                    </button>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab === 'verified' && (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '180px 80px 1fr 100px 90px 80px 90px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Doctor</span><span>Reg. No.</span><span>Specialty</span><span>Joined</span><span>Patients</span><span>Status</span><span>Actions</span>
            </div>
            {verified.map((doc, i) => (
              <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '180px 80px 1fr 100px 90px 80px 90px', borderBottom: i < verified.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                  <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{doc.name}</span>
                </div>
                <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{doc.reg}</span>
                <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.exp} yrs</span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{doc.joined}</span>
                <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{doc.patients}</span>
                <Badge label={doc.status === 'active' ? 'Active' : 'Suspended'} variant={doc.status === 'active' ? 'success' : 'danger'} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.eye} size={13} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.edit} size={13} /></button>
                </div>
              </div>
            ))}
          </Card>
        )}

        {tab === 'declined' && (
          <div className="text-center py-16" style={{ color: '#7a7468' }}>
            <Ico d={IC.doc} size={32} />
            <p className="text-[13px] mt-3">No declined applications on record.</p>
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(27,45,32,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeclineModal(null)}>
          <div className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <div>
                <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Decline Application</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{declineModal.name}</p>
              </div>
              <button onClick={() => setDeclineModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f2ed]" style={{ color: '#7a7468' }}>
                <Ico d={IC.x} size={16} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Reason for Decline</p>
                <textarea value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                  placeholder="Provide a reason (this will be shared with the applicant)…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none"
                  style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20', fontFamily: 'var(--font-sans)' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeclineModal(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Cancel</button>
                <button onClick={() => { setDeclined(d => [...d, declineModal.reg]); setDeclineModal(null); setDeclineReason('') }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: '#c0392b', color: 'white' }}>Confirm Decline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Patients ──────────────────────────────────────────────────────────────────

function PatientManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const shown = ALL_PATIENTS.filter(p => {
    const q = query.toLowerCase()
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchF = filter === 'All' || (filter === 'Active' && p.status === 'active') || (filter === 'Pending' && p.status === 'pending')
    return matchQ && matchF
  })

  return (
    <div>
      <TopBar title="Patient Management" sub={`${ALL_PATIENTS.length} total patients registered`} />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}><Ico d={IC.search} size={14} /></span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or ID…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={filter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.download} size={13} /> Export
          </button>
        </div>

        <Card>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '110px 160px 60px 80px 80px 80px 70px 80px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>Patient ID</span><span>Name</span><span>Age</span><span>City</span><span>Plan</span><span>Joined</span><span>Visits</span><span>Status</span><span>Actions</span>
          </div>
          {shown.map((p, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '110px 160px 60px 80px 80px 80px 70px 80px 80px', borderBottom: i < shown.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{p.id}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{p.initials}</div>
                <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{p.name}</span>
              </div>
              <span className="text-[12px]" style={{ color: '#7a7468' }}>{p.age}{p.gender}</span>
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{p.city}</span>
              <Badge label={p.plan} variant={p.plan === 'Pro' ? 'accent' : p.plan === 'Clinic' ? 'gold' : 'default'} />
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{p.joined}</span>
              <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{p.visits}</span>
              <Badge label={p.status === 'active' ? 'Active' : 'Pending'} variant={p.status === 'active' ? 'success' : 'warning'} />
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.eye} size={12} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.trash} size={12} /></button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ── Complaints ────────────────────────────────────────────────────────────────

function Complaints() {
  const [typeFilter, setTypeFilter]     = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter]     = useState('All')
  const [expanded, setExpanded]         = useState<string | null>(null)

  const shown = COMPLAINTS.filter(c => {
    const matchT = typeFilter  === 'All' || c.type === typeFilter.toLowerCase()
    const matchS = statusFilter === 'All' || c.status === statusFilter.toLowerCase().replace(' ', '-')
    const matchR = roleFilter  === 'All' || c.role === roleFilter.toLowerCase()
    return matchT && matchS && matchR
  })

  const priorityColor: Record<string, string> = { high: '#c0392b', medium: '#c9913d', low: '#7a7468' }
  const typeLabel: Record<string, string> = { bug: 'Bug', feature: 'Feature Request', feedback: 'Feedback' }

  return (
    <div>
      <TopBar title="Complaints & Feedback" sub="Submitted via in-app feedback widget" />
      <div className="p-8 flex flex-col gap-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1.5">
            {['All', 'Bug', 'Feature', 'Feedback'].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={typeFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {['All', 'Open', 'In Review', 'Resolved'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={statusFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {['All', 'Doctor', 'Patient'].map(f => (
              <button key={f} onClick={() => setRoleFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={roleFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <p className="ml-auto text-[11px] self-center" style={{ color: '#7a7468' }}>{shown.length} results</p>
        </div>

        <div className="flex flex-col gap-3">
          {shown.map((c, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="px-5 py-4 cursor-pointer transition-colors hover:bg-[#f5f2ed]"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: priorityColor[c.priority] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>{c.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: '#7a7468' }}>
                      <span className="font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: 10 }}>{c.id}</span>
                      <span>·</span>
                      <span>{c.from}</span>
                      <Badge label={c.role === 'doctor' ? 'Doctor' : 'Patient'} variant={c.role === 'doctor' ? 'new' : 'default'} />
                      <span>·</span>
                      <span>{c.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge label={typeLabel[c.type]} variant={c.type === 'bug' ? 'danger' : c.type === 'feature' ? 'new' : 'default'} />
                    <Badge
                      label={c.status === 'open' ? 'Open' : c.status === 'in-review' ? 'In Review' : 'Resolved'}
                      variant={c.status === 'open' ? 'danger' : c.status === 'in-review' ? 'accent' : 'success'}
                    />
                    <Badge label={`${c.priority.charAt(0).toUpperCase() + c.priority.slice(1)} Priority`}
                      variant={c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warning' : 'default'} />
                  </div>
                </div>
              </div>

              {expanded === c.id && (
                <div className="px-5 py-4 flex flex-col gap-4" style={{ borderTop: '1px solid #ede9e3', background: '#fafaf9' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7a7468' }}>User Message</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: '#1b2d20' }}>{c.message}</p>
                  </div>
                  {c.adminNote && (
                    <div className="px-4 py-3 rounded-lg" style={{ background: '#d8f3dc', border: '1px solid #a7d9b4' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>Admin Note</p>
                      <p className="text-[12px]" style={{ color: '#1b2d20' }}>{c.adminNote}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {c.status !== 'resolved' && (
                      <button className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                        Mark Resolved
                      </button>
                    )}
                    {c.status === 'open' && (
                      <button className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-amber-50"
                        style={{ border: '1px solid #f59e0b', color: '#92400e' }}>
                        Move to In Review
                      </button>
                    )}
                    <button className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>
                      Add Note
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Medicines ─────────────────────────────────────────────────────────────────

function MedicineDatabase() {
  const [query, setQuery] = useState('')
  const shown = MEDICINES_DB.filter(m => m.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <TopBar title="Medicine Database" sub={`${MEDICINES_DB.filter(m => m.status === 'active').length} active medicines`} />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}><Ico d={IC.search} size={14} /></span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search medicines…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.plus} size={13} /> Add Medicine
          </button>
        </div>

        <Card>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '220px 160px 1fr 80px 80px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>Medicine Name</span><span>Category</span><span>Available Potencies</span><span>Rx Count</span><span>Status</span><span>Actions</span>
          </div>
          {shown.map((med, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '220px 160px 1fr 80px 80px 80px', borderBottom: i < shown.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <p className="text-[12px] font-semibold" style={{ color: '#1b2d20', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{med.name}</p>
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{med.category}</span>
              <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{med.potencies}</span>
              <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{med.count}</span>
              <Badge label={med.status === 'active' ? 'Active' : 'Archived'} variant={med.status === 'active' ? 'success' : 'default'} />
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.edit} size={13} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.trash} size={13} /></button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ── Revenue ───────────────────────────────────────────────────────────────────

function Revenue() {
  const totalRev = PLANS.reduce((s, p) => s + p.revenue, 0)
  const totalSubs = PLANS.reduce((s, p) => s + p.subscribers, 0)

  return (
    <div>
      <TopBar title="Revenue & Plans" sub="Subscription analytics and payment history" />
      <div className="p-8 flex flex-col gap-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Monthly Revenue" value={`₹${(totalRev/100000).toFixed(2)}L`} sub="All active subscriptions" gold />
          <StatCard label="Total Subscribers"      value={totalSubs}  sub={`Across ${PLANS.length} plans`} />
          <StatCard label="Avg. Revenue / Subscriber" value={`₹${Math.round(totalRev/totalSubs)}`} sub="ARPU this month" />
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[15px] font-bold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.name}</p>
                  <p className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                    ₹{plan.price}<span className="text-[12px] font-normal text-[#7a7468]">/mo</span>
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>Edit Plan</button>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{f}</p>
                  </div>
                ))}
              </div>
              <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #ede9e3' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7a7468' }}>Subscribers</p>
                  <p className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.subscribers}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7a7468' }}>Monthly</p>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>₹{plan.revenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Payments */}
        <Card>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Payments</h2>
          </div>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>Patient</span><span>Plan</span><span>Amount</span><span>Date</span><span>Gateway</span>
          </div>
          {RECENT_PAYMENTS.map((p, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: i < RECENT_PAYMENTS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{p.patient}</span>
              <Badge label={p.plan} variant={p.plan === 'Pro' ? 'accent' : p.plan === 'Clinic' ? 'gold' : 'default'} />
              <span className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>₹{p.amount}</span>
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{p.date}</span>
              <Badge label={p.gateway} variant="success" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ── Settings ──────────────────────────────────────────────────────────────────

function Settings() {
  const [toggles, setToggles] = useState({
    aiChat: true, aiEmergency: true, aiCDSS: true,
    emailNotifs: true, smsNotifs: false, inAppNotifs: true,
    maintenanceMode: false, newRegistrations: true, onlinePayments: true,
  })

  const toggle = (key: keyof typeof toggles) => setToggles(t => ({ ...t, [key]: !t[key] }))

  const Toggle = ({ k, label, desc }: { k: keyof typeof toggles; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #ede9e3' }}>
      <div>
        <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{label}</p>
        <p className="text-[11px]" style={{ color: '#7a7468' }}>{desc}</p>
      </div>
      <button onClick={() => toggle(k)}
        className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative"
        style={{ background: toggles[k] ? 'var(--color-primary)' : '#d6d0c8' }}>
        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
          style={{ left: toggles[k] ? 'calc(100% - 22px)' : '2px' }} />
      </button>
    </div>
  )

  return (
    <div>
      <TopBar title="System Settings" sub="Platform-wide configuration — admin only" />
      <div className="p-8 grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* AI Features */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>AI Features</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Control AI-powered modules platform-wide</p>
          <Toggle k="aiChat"      label="AI Symptom Chat"          desc="Patient-facing AI chat assistant before consultations" />
          <Toggle k="aiEmergency" label="AI Emergency Routing"     desc="Automatic triage and doctor routing for SOS calls" />
          <Toggle k="aiCDSS"      label="Clinical Decision Support" desc="Medicine recommendations for doctors (CDSS)" />
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Delivery channels for alerts and reminders</p>
          <Toggle k="emailNotifs"  label="Email Notifications"  desc="Appointment confirmations, receipts, reminders" />
          <Toggle k="smsNotifs"    label="SMS Notifications"    desc="OTP, emergency alerts, appointment reminders" />
          <Toggle k="inAppNotifs"  label="In-App Notifications" desc="Dashboard alerts and real-time updates" />
        </Card>

        {/* Platform Controls */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Platform Controls</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Core platform availability settings</p>
          <Toggle k="newRegistrations" label="New Registrations"   desc="Allow new doctors and patients to register" />
          <Toggle k="onlinePayments"   label="Online Payments"     desc="Enable UPI, card and net banking payments" />
          <Toggle k="maintenanceMode"  label="Maintenance Mode"    desc="Take platform offline for scheduled updates" />
        </Card>

        {/* Data Export */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Data & Exports</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Download platform reports and backups</p>
          <div className="flex flex-col gap-2">
            {[
              'All Doctor Registrations (CSV)',
              'All Patient Records (CSV)',
              'Complaint & Feedback Log (CSV)',
              'Revenue Report — July 2025 (PDF)',
              'Emergency Call Logs — July 2025 (CSV)',
              'Prescription Audit Log (CSV)',
            ].map((item, i) => (
              <button key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-medium w-full text-left transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                <span style={{ color: 'var(--color-primary)' }}><Ico d={IC.download} size={13} /></span>
                {item}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── Admin App ─────────────────────────────────────────────────────────────────

export default function Admin_Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<AView>('dashboard')

  // Handler to handle sign out with fallback routing
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Fallback redirect if no custom handler is passed
      window.location.href = '/'
    }
  }

  const views: Record<AView, React.ReactNode> = {
    dashboard:  <Dashboard goTo={setView} />,
    doctors:    <DoctorManagement />,
    patients:   <PatientManagement />,
    complaints: <Complaints />,
    medicines:  <MedicineDatabase />,
    revenue:    <Revenue />,
    settings:   <Settings />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f2ed' }}>
      {/* 1. Sidebar */}
      <Sidebar 
      active={view} 
      onChange={setView}
      onLogout={handleLogout}  
      />
      {/* 2. Main View Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {views[view]}
        </div>
      </main>
    </div>
  )
}
