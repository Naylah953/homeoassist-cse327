import { useState, useRef, useEffect } from 'react'
import { SupportBot } from './Chatbots/SupportBot'

// In your main file
import { DView } from './types';
import { Ico, IC } from './components/ui/Ico';
import { Badge } from './components/ui/Badge';  
import { Card } from './components/ui/Card';
import { StatCard } from './components/ui/StatCard';
import { TopBar } from './components/layout/Topbar';

import { PATIENTS, SCHEDULE, MEDICINES, PRESCRIBED_PRESCRIPTIONS, CHAT_MESSAGES, PATIENT_EXTRACTED_SYMPTOMS, EMERGENCY_CALLS } from './data/doctorMockData';

// ── Types ─────────────────────────────────────────────────────────────────────

// ── Icons ─────────────────────────────────────────────────────────────────────

// ── Mock Data ─────────────────────────────────────────────────────────────────


// ── Utilities ─────────────────────────────────────────────────────────────────

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV: { id: DView; label: string; icon: string[] }[] = [
  { id: 'dashboard',     label: 'Dashboard',        icon: IC.grid    },
  { id: 'chat',          label: 'AI Symptom Chat',  icon: IC.chat    },
  { id: 'medicines',     label: 'Medicine Finder',  icon: IC.pill    },
  { id: 'patients',      label: 'Patients',         icon: IC.users   },
  { id: 'prescriptions', label: 'Prescriptions',    icon: IC.file    },
  { id: 'emergency',     label: 'Emergency',        icon: IC.phone   },
]

function Sidebar({ active, onChange, profile, onLogout }: { active: DView; onChange: (v: DView) => void; profile: any; onLogout?: () => void }) {
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
            <p className="text-sm font-semibold" style={{ color: '#e0ebe2', letterSpacing: '0.01em', fontFamily: 'var(--font-display)' }}>HomeoAssist</p>
            <p className="text-[10px]" style={{ color: 'rgba(224,235,226,0.4)' }}>Clinical Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active_ = active === item.id
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full text-left transition-all duration-150 relative"
              style={{
                background: active_ ? 'var(--color-primary)' : 'transparent',
                color: active_ ? '#f0ede8' : 'rgba(224,235,226,0.65)',
                fontWeight: active_ ? 500 : 400,
              }}>
              <span style={{ opacity: active_ ? 1 : 0.65 }}>
                <Ico d={item.icon} size={15} />
              </span>
              {item.label}
              {item.id === 'emergency' && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#c0392b', color: 'white', lineHeight: 1.4 }}>1</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Profile */}
      <div className="p-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Clickable Profile Card */}
        <button
          onClick={() => onChange('profile')}
          className="flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors hover:bg-white/5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ 
              background: 'var(--color-primary)', 
              color: '#f0ede8' }}>{getInitials(profile.name)}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate" style={{ color: '#e0ebe2' }}>{profile.name}</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(224,235,226,0.38)' }}>{profile.qualifications.split('(')[0]} · {profile.registrationNo}</p>
          </div>
        </button>

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

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onProfileClick }: { onProfileClick?: () => void }) {
  return (
    <div>
      <TopBar title="Good morning, Dr. Rahman" sub="Thursday, 11 July 2025 · 10:30 AM" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Today's Appointments" value={8}   sub="3 completed · 5 remaining" />
          <StatCard label="Total Patients"        value={247} sub="+12 this month" gold />
          <StatCard label="Prescriptions Today"   value={12}  sub="All digitally signed" />
          <StatCard label="Active Emergency"       value={1}   sub="EC-004 — routing now" />
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px' }}>
          {/* Schedule */}
          <Card>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Today's Schedule</h2>
              <Badge label="8 appointments" />
            </div>
            <div>
              {SCHEDULE.map((a, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
                  style={{ borderBottom: i < SCHEDULE.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                  <span className="text-[11px] w-11 flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{a.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{a.patient}</p>
                    <p className="text-[11px] truncate" style={{ color: '#7a7468' }}>{a.condition}</p>
                  </div>
                  {a.type === 'new' && <Badge label="New" variant="new" />}
                  <Badge
                    label={a.status === 'in-progress' ? 'In Progress' : a.status === 'completed' ? 'Done' : 'Upcoming'}
                    variant={a.status === 'in-progress' ? 'accent' : a.status === 'completed' ? 'success' : 'default'}
                  />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {/* AI Activity */}
            <Card>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
                <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>AI Activity</h2>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {[
                  { event: 'Symptom summary ready', patient: 'Fahmida Akter', time: '10:28', color: '#2d6a4f' },
                  { event: 'Chat in progress',      patient: 'Raisa Hossain',   time: '10:15', color: '#c9913d' },
                  { event: 'Prescription validated', patient: 'Shourob Ahmed',   time: '09:52', color: '#2d6a4f' },
                  { event: 'Emergency triaged',      patient: 'Ramesh Tiwari',  time: '09:43', color: '#c0392b' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium" style={{ color: '#1b2d20' }}>{item.event}</p>
                      <p className="text-[11px]" style={{ color: '#7a7468' }}>{item.patient}</p>
                    </div>
                    <p className="text-[10px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{item.time}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h2 className="text-[13px] font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'New Prescription',  icon: IC.plus     },
                  { label: 'Add Patient',        icon: IC.users    },
                  { label: 'Medicine Lookup',    icon: IC.pill     },
                  { label: 'View Analytics',     icon: IC.activity },
                ].map((a, i) => (
                  <button key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium w-full text-left transition-colors hover:bg-[#f5f2ed]"
                    style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                    <span style={{ color: 'var(--color-primary)' }}><Ico d={a.icon} size={14} /></span>
                    {a.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── AI Chat ───────────────────────────────────────────────────────────────────

function AIChat({ onProfileClick }: { onProfileClick?: () => void }) {
  const [messages, setMessages] = useState(CHAT_MESSAGES)
  const [input, setInput] = useState('')
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
      {/* Chat */}
      <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: '1px solid #d6d0c8' }}>
        <TopBar title="AI Symptom Chat" sub="Anika Rahman · Consultation at 11:15 AM" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
        {/* Patient bar */}
        <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #d6d0c8', background: '#d8f3dc55' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>AM</div>
          <div>
            <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>Anika Rahman, 34F</p>
            <p className="text-[11px]" style={{ color: '#7a7468' }}>Chronic Sinusitis · 8 previous visits</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: 'pulse 2s infinite' }} />
            Chat Active
          </div>
        </div>

        {/* Messages */}
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
                <p className="text-[10px] mt-1" style={{ fontFamily: 'var(--font-mono)', color: msg.role === 'ai' ? '#7a7468' : 'rgba(255,255,255,0.55)' }}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 flex gap-3" style={{ borderTop: '1px solid #d6d0c8' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Continue the conversation…"
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] outline-none transition-colors"
            style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          <button onClick={send}
            className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-opacity hover:opacity-85"
            style={{ background: 'var(--color-primary)', color: 'white' }}>
            <Ico d={IC.send} size={15} />
          </button>
        </div>
      </div>

      {/* Summary panel */}
      <div className="flex flex-col" style={{ width: 300, flexShrink: 0, background: '#f5f2ed' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8', background: 'rgba(245,242,237,0.85)' }}>
          <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Symptom Summary</h2>
          <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>AI-extracted · live update</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Chief Complaint</p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#1b2d20' }}>Persistent bilateral nasal congestion with watery discharge, onset 3 weeks ago following URTI.</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Duration</p>
            <p className="text-[12px]" style={{ color: '#1b2d20' }}>~3 weeks (subacute progression)</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Extracted Symptoms</p>
            <div className="flex flex-col gap-2">
              {PATIENT_EXTRACTED_SYMPTOMS.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: '#1b2d20' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Miasmatic Hint</p>
            <div className="flex gap-2 flex-wrap">
              {['Psoric', 'Acute'].map(m => <Badge key={m} label={m} variant="accent" />)}
            </div>
          </div>
        </div>
        <div className="p-4" style={{ borderTop: '1px solid #d6d0c8' }}>
          <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.check} size={14} /> Begin Consultation
          </button>
          <p className="text-[10px] text-center mt-2" style={{ color: '#7a7468' }}>Summary shared with Dr. Sharma</p>
        </div>
      </div>
    </div>
  )
}

// ── Medicine Finder ───────────────────────────────────────────────────────────

function MedicineFinder({ onProfileClick }: { onProfileClick?: () => void }) {
  const [tags, setTags] = useState(['Watery nasal discharge', 'Worse in cold air', 'Restlessness', 'Burning sensation', 'Anxiety & chilliness'])
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const addTag = () => {
    const t = input.trim()
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setInput('') }
  }

  return (
    <div>
      <TopBar title="Medicine Finder" sub="AI-assisted homeopathic medicine selection" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">
        {/* Symptom input */}
        <Card className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Active Symptoms</p>
          <div className="flex flex-wrap gap-2 mb-3 min-h-8">
            {tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                {tag}
                <button onClick={() => setTags(t => t.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100 transition-opacity">
                  <Ico d={IC.x} size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="Type a symptom and press Enter…"
              className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none transition-colors"
              style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20' }} />
            <button onClick={addTag}
              className="px-4 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
              <Ico d={IC.plus} size={13} /> Add
            </button>
          </div>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Ranked Recommendations</h2>
            <p className="text-[11px]" style={{ color: '#7a7468' }}>{MEDICINES.length} medicines · sorted by match score</p>
          </div>
          <div className="flex flex-col gap-3">
            {MEDICINES.map((med, i) => (
              <Card key={i} className="p-5 transition-all cursor-pointer hover:border-[#2d6a4f]/40"
                style={selected === med.name ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 2px rgba(45,106,79,0.12)' } : undefined}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                        style={{ background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{i + 1}</span>
                      <h3 className="text-[14px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{med.name}</h3>
                      <Badge label={med.potency} />
                    </div>
                    {/* Score */}
                    <div className="ml-9 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#ede9e3' }}>
                          <div className="h-full rounded-full" style={{ width: `${med.score}%`, background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)', transition: 'width 0.6s ease' }} />
                        </div>
                        <span className="text-[11px] font-bold tabular-nums flex-shrink-0"
                          style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{med.score}%</span>
                      </div>
                    </div>
                    <div className="ml-9 flex flex-wrap gap-1.5 mb-2">
                      {med.indications.map((ind, j) => (
                        <span key={j} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#ede9e3', color: '#7a7468' }}>{ind}</span>
                      ))}
                    </div>
                    <p className="ml-9 text-[11px]" style={{ color: '#7a7468', fontStyle: 'italic' }}>{med.note}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-[10px] text-right" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{med.dosage}</p>
                    <button onClick={() => setSelected(med.name)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                      style={selected === med.name
                        ? { background: 'var(--color-primary)', color: '#f0ede8' }
                        : { border: '1px solid #d6d0c8', color: '#1b2d20', background: 'white' }}>
                      {selected === med.name ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {selected && (
            <div className="mt-4 px-5 py-4 rounded-xl flex items-center justify-between"
              style={{ background: '#d8f3dc', border: '1px solid var(--color-primary)' }}>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{selected}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>Review dosage before generating prescription</p>
              </div>
              <button className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>Generate Prescription →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Patients ──────────────────────────────────────────────────────────────────

function Patients({ onProfileClick }: { onProfileClick?: () => void }) {
  const [query, setQuery] = useState('')
  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.condition.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <TopBar title="Patients" sub={`${PATIENTS.length} registered patients`} onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}><Ico d={IC.search} size={14} /></span>
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search patients or conditions…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.plus} size={14} /> New Patient
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-5 hover:border-[#2d6a4f]/40 transition-all cursor-pointer">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>{p.name}</h3>
                    <Badge
                      label={p.status === 'new' ? 'New' : p.status === 'follow-up' ? 'Follow-up' : 'Active'}
                      variant={p.status === 'new' ? 'new' : p.status === 'follow-up' ? 'warning' : 'success'}
                    />
                  </div>
                  <p className="text-[11px]" style={{ color: '#7a7468' }}>{p.age}{p.gender} · {p.condition}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-3" style={{ borderTop: '1px solid #ede9e3' }}>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Last Visit</p>
                  <p style={{ color: '#1b2d20' }}>{p.lastVisit}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Next Visit</p>
                  <p style={{ color: '#1b2d20' }}>{p.nextVisit}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Visits</p>
                  <p className="font-semibold" style={{ color: '#1b2d20' }}>{p.visits}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>View History</button>
                <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>Prescribe</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Prescriptions ─────────────────────────────────────────────────────────────

function Prescriptions({ onProfileClick }: { onProfileClick?: () => void }) {
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
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={filter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.plus} size={14} /> New Prescription
          </button>
        </div>

        <Card>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '130px 1fr 1fr 110px 100px 90px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>Rx ID</span><span>Patient</span><span>Medicines</span><span>Date</span><span>Status</span><span>Actions</span>
          </div>
          {shown.map((rx, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '130px 1fr 1fr 110px 100px 90px', borderBottom: i < shown.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[11px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{rx.id}</span>
              <span className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{rx.patient}</span>
              <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>{rx.medicines}</span>
              <span className="text-[11px]" style={{ color: '#7a7468' }}>{rx.date}</span>
              <Badge label={rx.status === 'dispensed' ? 'Dispensed' : 'Active'} variant={rx.status === 'dispensed' ? 'success' : 'accent'} />
              <div className="flex items-center gap-1">
                {[IC.eye, IC.download, IC.qr].map((ic, j) => (
                  <button key={j}
                    className="p-1.5 rounded-lg transition-colors hover:bg-[#ede9e3]"
                    style={{ color: j === 2 && rx.verified ? '#2d6a4f' : '#7a7468' }}>
                    <Ico d={ic} size={13} />
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

// ── Emergency ─────────────────────────────────────────────────────────────────

function Emergency({ onProfileClick }: { onProfileClick?: () => void }) {
  return (
    <div>
      <TopBar title="Emergency Call Routing" sub="AI-powered triage and automatic doctor routing" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
          style={{ background: '#fff1f2', border: '1px solid #fca5a5' }}>
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.25)', animation: 'pulse 2s infinite' }} />
          <p className="text-[13px] font-medium" style={{ color: '#b91c1c' }}>1 active emergency in routing — EC-004 (Iram Ahmed, severe chest tightness)</p>
          <button className="ml-auto text-[12px] font-semibold transition-colors hover:opacity-80" style={{ color: '#b91c1c' }}>Take Call →</button>
        </div>

        {/* Doctor availability */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Dr. Anika Rahman', reg: '#HOM-4821', status: 'busy',      calls: 2 },
            { name: 'Dr. Rahim Uddin',   reg: '#HOM-3614', status: 'connected', calls: 1 },
            { name: 'Dr. Reema Chowdhury',   reg: '#HOM-5027', status: 'available', calls: 0 },
          ].map((doc, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{doc.reg}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge label={doc.status === 'available' ? 'Available' : doc.status === 'connected' ? 'On Call' : 'Busy'}
                  variant={doc.status === 'available' ? 'success' : doc.status === 'connected' ? 'accent' : 'danger'} />
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{doc.calls} call{doc.calls !== 1 ? 's' : ''}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Call log */}
        <Card>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Call Queue — Today</h2>
            <Badge label="3 calls" />
          </div>
          {EMERGENCY_CALLS.map((call, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
              style={{ borderBottom: i < EMERGENCY_CALLS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[10px] font-bold px-2 py-1 rounded flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', background: '#ede9e3', color: '#7a7468' }}>{call.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{call.patient}</p>
                <p className="text-[11px]" style={{ color: '#7a7468' }}>{call.symptom}</p>
              </div>
              <p className="text-[11px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{call.time}</p>
              <Badge label={call.priority === 'high' ? 'High' : call.priority === 'medium' ? 'Medium' : 'Low'}
                variant={call.priority === 'high' ? 'danger' : call.priority === 'medium' ? 'warning' : 'success'} />
              <Badge label={call.status === 'routing' ? 'Routing…' : call.status === 'connected' ? 'Connected' : 'Resolved'}
                variant={call.status === 'routing' ? 'accent' : call.status === 'connected' ? 'new' : 'success'} />
              <span className="text-[11px] hidden lg:block flex-shrink-0" style={{ color: '#7a7468' }}>→ {call.doctor}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ── Profile ─────────────────────────────────────────────────────────────────

function ProfileView({ profile, onSave, onProfileClick }: { profile: any; onSave: (updated: any) => void; onProfileClick?: () => void }) {
  const getInitials = (name?: string) => {
    if (!name) return 'AR'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }
  const [formData, setFormData] = useState(profile)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div>
      <TopBar title="Doctor Profile & Settings" sub="Manage details visible to patients in Find Doctor directory" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Top Header Card */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
              {getInitials(formData.name)}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{formData.name}</h2>
              <p className="text-xs" style={{ color: '#7a7468' }}>{formData.specialty} · {formData.registrationNo}</p>
            </div>
          </div>
          {savedSuccess && (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              ✓ Profile Saved & Live for Patients
            </span>
          )}
        </Card>

        {/* Profile Settings Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold border-b pb-3" style={{ borderBottomColor: '#ede9e3', fontFamily: 'var(--font-display)' }}>
              Public Directory Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Full Name & Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                >
                  <option value="Allergies & Respiratory">Allergies & Respiratory</option>
                  <option value="Digestive & IBS">Digestive & IBS</option>
                  <option value="Women's Health">Women's Health</option>
                  <option value="Skin & Dermatology">Skin & Dermatology</option>
                  <option value="Paediatrics">Paediatrics</option>
                  <option value="Joint & Arthritis">Joint & Arthritis</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Qualifications / Merits</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Registration No.</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={e => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={e => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Doctor Biography & Merits</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderTopColor: '#ede9e3' }}>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1b2d20]">
                <input
                  type="checkbox"
                  checked={formData.availableForBooking}
                  onChange={e => setFormData({ ...formData, availableForBooking: e.target.checked })}
                  className="rounded accent-[#2d6a4f]"
                />
                Show profile in "Find Doctor" panel for patient appointments
              </label>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  )
}

// ── Doctor App ──────────────────────────────────────────────

export default function Doc_Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<DView>('dashboard')

  // Editable doctor profile state
  const [doctorProfile, setDoctorProfile] = useState({
    name: 'Dr. Anika Rahman',
    specialty: 'Allergies & Respiratory',
    qualifications: 'MD Homeopathy (BHMS, Gold Medalist)',
    registrationNo: '#HOM-4821',
    experienceYears: 12,
    consultationFee: 800,
    email: 'dr.anika@homeoassist.com',
    phone: '+880 1712-345678',
    bio: 'Specialist in chronic respiratory conditions, severe allergic sinusitis, and constitutional homeopathic care with over 12 years of clinical practice.',
    availableForBooking: true,
  })

  // Handler to safely navigate to profile from top bar
  const openProfile = () => setView('profile')

  // Handler to handle sign out with fallback routing
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Fallback redirect if no custom handler is passed
      window.location.href = '/'
    }
  }

  const views: Record<DView, React.ReactNode> = {
    dashboard:     <Dashboard onProfileClick={openProfile} />,
    chat:          <AIChat onProfileClick={openProfile}/>,
    medicines:     <MedicineFinder onProfileClick={openProfile}/>,
    patients:      <Patients onProfileClick={openProfile}/>,
    prescriptions: <Prescriptions onProfileClick={openProfile}/>,
    emergency:     <Emergency onProfileClick={openProfile}/>,
    profile:       <ProfileView profile={doctorProfile} onSave={setDoctorProfile} />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f2ed' }}>
      {/* 1. Sidebar */}
      <Sidebar 
        active={view} 
        onChange={setView} 
        profile={doctorProfile} 
        onLogout={handleLogout} 
      />
      {/* 2. Main View Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {views[view]}
        </div>
      </main>
      {/* 3. Floating Support Bot */}
      <SupportBot role="doctor" userName={doctorProfile.name} />
    </div>
  )
}


