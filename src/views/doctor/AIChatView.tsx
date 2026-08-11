import { useState, useRef, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { CHAT_MESSAGES, PATIENT_EXTRACTED_SYMPTOMS } from '../../data/doctorMockData'

// ── AI Chat ───────────────────────────────────────────────────────────────────

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

interface Props {
  onProfileClick?: () => void
}

export function AIChatView({ onProfileClick }: Props) {
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>AM</div>
          <div>
            <p className="text-[18px] font-medium" style={{ color: '#1b2d20' }}>Anika Rahman, 34F</p>
            <p className="text-[14px]" style={{ color: '#7a7468' }}>Chronic Sinusitis · 8 previous visits</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[15px] font-medium px-2.5 py-1 rounded-full"
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
              <div className={cx('max-w-[68%] px-4 py-2.5 rounded-2xl text-[16px] leading-relaxed',
                msg.role === 'ai' ? 'bg-white border border-[#d6d0c8] text-[#1b2d20] rounded-tl-sm' : 'rounded-tr-sm text-white')}
                style={msg.role === 'patient' ? { background: 'var(--color-primary)' } : {}}>
                <p>{msg.text}</p>
                <p className="text-[12px] mt-1" style={{ fontFamily: 'var(--font-mono)', color: msg.role === 'ai' ? '#7a7468' : 'rgba(255,255,255,0.55)' }}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 flex gap-3" style={{ borderTop: '1px solid #d6d0c8' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Continue the conversation…"
            className="flex-1 px-4 py-2.5 rounded-xl text-[16px] outline-none transition-colors"
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
          <h2 className="text-[25px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Symptom Summary</h2>
          <p className="text-[16px] mt-0.5" style={{ color: '#7a7468' }}>AI-extracted · live update</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Chief Complaint</p>
            <p className="text-[15px] leading-relaxed" style={{ color: '#1b2d20' }}>Persistent bilateral nasal congestion with watery discharge, onset 3 weeks ago following URTI.</p>
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Duration</p>
            <p className="text-[15px]" style={{ color: '#1b2d20' }}>~3 weeks (subacute progression)</p>
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Extracted Symptoms</p>
            <div className="flex flex-col gap-2">
              {PATIENT_EXTRACTED_SYMPTOMS.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                  <p className="text-[15px] leading-relaxed" style={{ color: '#1b2d20' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Miasmatic Hint</p>
            <div className="flex gap-2 flex-wrap">
              {['Psoric', 'Acute'].map(m => <Badge key={m} label={m} variant="accent" />)}
            </div>
          </div>
        </div>
        <div className="p-4" style={{ borderTop: '1px solid #d6d0c8' }}>
          <button className="w-full py-2.5 rounded-xl text-[16px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.check} size={22} /> Begin Consultation
          </button>
          <p className="text-[14px] text-center mt-2" style={{ color: '#044800' }}>Summary shared with Dr. Sharma</p>
        </div>
      </div>
    </div>
  )
}
