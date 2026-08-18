import { useState, useRef, useEffect } from 'react'
import { PView } from '../../types'
import { Ico, IC } from '../../components/ui/Ico'
import { TopBar } from '../../components/layout/Topbar'
import { CHAT_HISTORY, EXTRACTED_SYMPTOMS } from '../../data/patientMockData'

// ── AI Chat ───────────────────────────────────────────────────────────────────

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

interface PatientAIChatViewProps {
  goTo: (v: PView) => void
  onProfileClick?: () => void
  profile?: any
}

export function AIChatView({ goTo, onProfileClick, profile }: PatientAIChatViewProps) {
  const [messages, setMessages] = useState(CHAT_HISTORY)
  const [input, setInput] = useState('')
  const [symptoms] = useState(EXTRACTED_SYMPTOMS)
  const [summaryReady] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'patient', text: input.trim(), time: t }])
    setInput('')
  }

  return (
    <div className="flex h-full">
      {/* Chat panel */}
      <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: '1px solid #d6d0c8' }}>
        <TopBar 
          title="AI Symptom Chat" 
          sub="Describe your symptoms in your own words" 
          onProfileClick={onProfileClick} 
          profile={profile}
          avatarBg="var(--color-accent)"
          defaultInitials="RH"
        />
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={cx('flex gap-3', msg.role === 'patient' ? 'flex-row-reverse' : '')}>
              {msg.role === 'ai' && (
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {IC.logo.map((p, j) => <path key={j} d={p} />)}
                  </svg>
                </div>
              )}
              <div 
                className={cx(
                  'max-w-[68%] px-4 py-2.5 rounded-2xl text-[16px] leading-relaxed',
                  msg.role === 'ai' ? 'bg-white border border-[#d6d0c8] text-[#1b2d20] rounded-tl-sm' : 'rounded-tr-sm text-white'
                )}
                style={msg.role === 'patient' ? { background: 'var(--color-primary)' } : {}} >
                <p>{msg.text}</p>
                <p 
                  className="text-[12px] mt-1"
                  style={{ fontFamily: 'var(--font-mono)', color: msg.role === 'ai' ? '#7a7468' : 'rgba(255,255,255,0.55)' }}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-5 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid #d6d0c8' }}>
          <div className="flex gap-3">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Describe your symptoms in natural language…"
              className="flex-1 px-4 py-2.5 rounded-xl text-[16px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} 
            />
            <button 
              onClick={send}
              className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-opacity hover:opacity-85"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              <Ico d={IC.send} size={15} />
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors hover:bg-[#ede9e3]"
              style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}
            >
              <Ico d={IC.mic} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary panel */}
      <div className="flex flex-col w-[300px] flex-shrink-0" style={{ background: '#f5f2ed' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
          <h2 className="text-[22.5px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Live Symptom Summary</h2>
          <p className="text-[16px] mt-0.5" style={{ color: '#7a7468' }}>Extracted Symptoms as you chat</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Chief Concern</p>
            <p className="text-[15px] leading-relaxed" style={{ color: '#1b2d20' }}>
              Persistent bilateral nasal congestion, 3 weeks post-URTI, with watery discharge and olfactory loss.
            </p>
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Identified Symptoms</p>
            <div className="flex flex-col gap-2">
              {symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                  <p className="text-[15px] leading-relaxed" style={{ color: '#1b2d20' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Privacy Note</p>
            <p className="text-[15px] leading-relaxed" style={{ color: '#7a7468' }}>
              This summary will only be shared with your selected doctor when you confirm booking.
            </p>
          </div>
        </div>

        {summaryReady && (
          <div className="p-4 flex flex-col gap-2" style={{ borderTop: '1px solid #d6d0c8' }}>
            <button 
              onClick={() => goTo('doctors')}
              className="w-full py-2.5 rounded-xl text-[16px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}
            >
              Book Doctor with Summary →
            </button>
            <p className="text-[12.3px] text-center" style={{ color: '#724d01' }}>Summary auto-attached to your next booking</p>
          </div>
        )}
      </div>
    </div>
  )
}