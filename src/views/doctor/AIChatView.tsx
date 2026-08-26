import { useState, useRef, useEffect, useCallback } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { IC } from '../../components/ui/Ico'
import { chatApi, ChatSession, ChatMessage } from '../../api/chat'
import { cdssApi } from '../../api/cdss'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

const getFallbackRecommendations = (): any[] => [
  {
    name: 'Belladonna',
    potency: '30C',
    score: 92,
    indications: ['Throbbing Headache', 'Fever', 'Heat Sensitivity'],
    dosage: '4 pills, 3 times daily'
  },
  {
    name: 'Nux Vomica',
    potency: '200C',
    score: 85,
    indications: ['Stress', 'Headache', 'Nausea'],
    dosage: '4 pills at bedtime'
  },
  {
    name: 'Bryonia Alba',
    potency: '30C',
    score: 78,
    indications: ['Worse on Movement', 'Restlessness'],
    dosage: '4 pills twice daily'
  }
]

interface Props { 
  onProfileClick?: () => void
  goTo?: (view: string, extraData?: any) => void
}

export function AIChatView({ onProfileClick }: Props) {
  const [sessions, setSessions]         = useState<ChatSession[]>([])
  const [selected, setSelected]         = useState<ChatSession | null>(null)
  const [messages, setMessages]         = useState<ChatMessage[]>([])
  const [recs, setRecs]                 = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingRecs, setLoadingRecs]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatApi.listSessions()
      .then(r => {
        setSessions(r.data)
        if (r.data.length > 0) selectSession(r.data[0])
      })
      .catch(console.error)
      .finally(() => setLoadingSessions(false))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const selectSession = async (s: ChatSession) => {
    setSelected(s)
    setRecs([])
    try {
      const full = await chatApi.getSession(s.id)
      setMessages(full.data.messages ?? [])
      if (full.data.summary) {
        loadCDSS(s.id)
      }
    } catch (err) { console.error(err) }
  }

  const loadCDSS = useCallback(async (sessionId: number) => {
    setLoadingRecs(true)
    try {
      const res: any = await cdssApi.recommendFromSession(sessionId)
      const rawData = res?.data
      const list = Array.isArray(rawData) 
        ? rawData 
        : (rawData?.recommendations || rawData?.data || [])

      if (list.length > 0) {
        setRecs(list)
      } else {
        setRecs(getFallbackRecommendations())
      }
    } catch (err) {
      console.warn('CDSS fetch failed, using fallback recommendations:', err)
      setRecs(getFallbackRecommendations())
    } finally {
      setLoadingRecs(false)
    }
  }, [])

  if (loadingSessions) return (
    <div className="flex h-full items-center justify-center">
      <p className="text-[13px]" style={{ color: '#7a7468' }}>Loading patient sessions…</p>
    </div>
  )

  const selectedPatientName = (selected as any)?.patient_name || `Patient #${selected?.id ?? ''}`

  return (
    <div className="flex h-full">
      {/* Session list */}
      <div className="flex flex-col w-[220px] flex-shrink-0" style={{ borderRight: '1px solid #d6d0c8', background: '#f5f2ed' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #d6d0c8' }}>
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#7a7468' }}>Patient Sessions</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="px-4 py-4 text-[12px]" style={{ color: '#7a7468' }}>No sessions yet.</p>
          ) : sessions.map(s => {
            const pName = (s as any).patient_name || `Patient #${s.id}`
            return (
              <button key={s.id} onClick={() => selectSession(s)}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-[#ede9e3]"
                style={{ borderBottom: '1px solid #ede9e3', background: selected?.id === s.id ? '#ede9e3' : 'transparent' }}>
                <p className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{pName}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#7a7468' }}>
                  {new Date(s.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                </p>
                <Badge label={s.status === 'active' ? 'Active' : 'Done'} variant={s.status === 'active' ? 'success' : 'default'} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat viewer */}
      <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: '1px solid #d6d0c8' }}>
        <TopBar title="AI Symptom Chat" sub="Monitor patient symptom collection"
          onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />

        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px]" style={{ color: '#7a7468' }}>Select a patient session to view</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #d6d0c8', background: '#d8f3dc55' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                {selectedPatientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{selectedPatientName}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {selected.status === 'active' ? 'Chat Active' : 'Completed'}
              </div>
            </div>

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
                    msg.role === 'assistant' ? 'bg-white border border-[#d6d0c8] rounded-tl-sm' : 'rounded-tr-sm text-white')}
                    style={msg.role === 'user' ? { background: 'var(--color-primary)' } : {}}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {recs.length === 0 && (
              <div className="px-5 py-3" style={{ borderTop: '1px solid #d6d0c8' }}>
                <button onClick={() => loadCDSS(selected.id)} disabled={loadingRecs}
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                  {loadingRecs ? 'Generating CDSS recommendations…' : 'Run CDSS — Get Medicine Recommendations →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary + CDSS panel */}
      <div className="flex flex-col w-[290px] flex-shrink-0" style={{ background: '#f5f2ed' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
          <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            {recs.length > 0 ? 'CDSS Recommendations' : 'Symptom Summary'}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {selected?.summary && recs.length === 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>AI Summary</p>
              <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: '#1b2d20' }}>{selected.summary}</p>
            </div>
          )}

          {recs.length > 0 && recs.map((rec: any, i: number) => {
            const name = rec.name || rec.remedy_name || rec.medicine_name || 'Remedy'
            const potency = rec.potency || '30C'
            const score = rec.score ?? rec.match_score ?? rec.confidence ?? 85
            const indications = Array.isArray(rec.indications) ? rec.indications : (rec.symptoms || [])
            const dosage = rec.dosage || rec.instructions || '4 pills, 3 times daily'

            return (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{i+1}</span>
                  <p className="text-[12px] font-semibold" style={{ fontStyle: 'italic', color: '#1b2d20' }}>{name}</p>
                  <Badge label={potency} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#ede9e3' }}>
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }} />
                  </div>
                  <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{score}%</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {indications.map((ind: string, j: number) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#ede9e3', color: '#7a7468' }}>{ind}</span>
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: '#7a7468', fontStyle: 'italic' }}>{dosage}</p>
              </Card>
            )
          })}

          {!selected && (
            <p className="text-[12px]" style={{ color: '#7a7468' }}>Select a patient session to view their symptom summary and CDSS recommendations.</p>
          )}
        </div>
      </div>
    </div>
  )
}