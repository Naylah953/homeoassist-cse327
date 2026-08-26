import { useState, useRef, useEffect, useCallback } from 'react'
import { PView } from '../../types'
import { Ico, IC } from '../../components/ui/Ico'
import { TopBar } from '../../components/layout/Topbar'
import { chatApi, ChatMessage, ChatSession } from '../../api/chat'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

interface PatientAIChatViewProps {
  goTo: (v: PView) => void
  onProfileClick?: () => void
  profile?: Record<string, unknown>
}

export function AIChatView({ goTo, onProfileClick, profile }: PatientAIChatViewProps) {
  const [session, setSession]     = useState<ChatSession | null>(null)
  const [messages, setMessages]   = useState<ChatMessage[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [starting, setStarting]   = useState(true)
  const [summary, setSummary]     = useState<string | null>(null)
  const [summarizing, setSumm]    = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Start or resume session
  useEffect(() => {
    chatApi.listSessions()
      .then(res => {
        const active = res.data.find(s => s.status === 'active')
        if (active) {
          return chatApi.getSession(active.id).then(full => {
            setSession(full.data)
            setMessages(full.data.messages ?? [])
            if (full.data.summary) setSummary(full.data.summary)
          })
        } else {
          return chatApi.startSession().then(res => {
            setSession(res.data)
            setMessages([{ role: 'assistant', content: res.data.greeting }])
          })
        }
      })
      .catch(console.error)
      .finally(() => setStarting(false))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = useCallback(async () => {
    if (!input.trim() || !session || loading) return
    const text = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await chatApi.sendMessage(session.id, text)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [input, session, loading])

  const handleSummarize = async () => {
    if (!session) return
    setSumm(true)
    try {
      const res = await chatApi.summarize(session.id)
      setSummary(res.data.summary)
    } catch (err) { console.error(err) }
    finally { setSumm(false) }
  }

  if (starting) return (
    <div className="flex h-full items-center justify-center">
      <p className="text-[13px]" style={{ color: '#7a7468' }}>Starting AI assistant…</p>
    </div>
  )

  return (
    <div className="flex h-full">
      {/* Chat panel */}
      <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: '1px solid #d6d0c8' }}>
        <TopBar title="AI Symptom Chat" sub="Describe your symptoms in your own words"
          onProfileClick={onProfileClick} profile={profile}
          avatarBg="var(--color-accent)" defaultInitials="RH" />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={cx('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {IC.logo.map((p, j) => <path key={j} d={p} />)}
                  </svg>
                </div>
              )}
              <div className={cx('max-w-[68%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-white border border-[#d6d0c8] text-[#1b2d20] rounded-tl-sm'
                  : 'rounded-tr-sm text-white')}
                style={msg.role === 'user' ? { background: 'var(--color-primary)' } : {}}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-primary)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {IC.logo.map((p, j) => <path key={j} d={p} />)}
                </svg>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#d6d0c8] rounded-tl-sm">
                <div className="flex gap-1 items-center h-5">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#7a7468]"
                      style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-5 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid #d6d0c8' }}>
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Describe your symptoms in natural language…"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: 'var(--color-primary)', color: 'white' }}>
              <Ico d={IC.send} size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary panel */}
      <div className="flex flex-col w-[300px] flex-shrink-0" style={{ background: '#f5f2ed' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
          <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Symptom Summary</h2>
          <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>AI-generated clinical summary</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {summary ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Summary Ready</p>
              <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: '#1b2d20' }}>{summary}</p>
            </div>
          ) : (
            <>
              <p className="text-[12px] leading-relaxed" style={{ color: '#7a7468' }}>
                Chat with the AI assistant to describe your symptoms. After a few exchanges, generate a structured summary for your doctor.
              </p>
              <button onClick={handleSummarize} disabled={summarizing || messages.length < 4}
                className="w-full py-2.5 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: '#1b2d20', color: '#e0ebe2' }}>
                {summarizing ? 'Generating…' : 'Generate Summary'}
              </button>
            </>
          )}
          <div style={{ borderTop: '1px solid #d6d0c8', paddingTop: 12 }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Privacy Note</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#7a7468' }}>
              Your summary is only shared with your selected doctor when you confirm booking.
            </p>
          </div>
        </div>
        {summary && (
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
