import { useState } from 'react'

type Category = 'bug' | 'feature' | 'feedback'
type Priority = 'low' | 'medium' | 'high'

interface Props {
  role: 'doctor' | 'patient'
  userName: string
}

function Ico({ d, size = 16 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  )
}

const ICONS = {
  chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  x: ["M18 6L6 18M6 6l12 12"],
  check: ["M20 6L9 17l-5-5"],
  bug: [
    "M8 2l1.88 1.88",
    "M14.12 3.88 16 2",
    "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",
    "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z",
    "M12 20v-9",
    "M6.53 9C4.6 8.8 3 7.1 3 5",
    "M6 13H2",
    "M3 21c0-2.1 1.7-3.9 4-4",
    "M20.97 5c0 2.1-1.6 3.8-3.5 4",
    "M22 13h-4",
    "M17 17c2.3.1 4 1.9 4 4"
  ],
  spark: ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  msg: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  send: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"]
}

export function SupportBot({ role, userName }: Props) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('')

  const canSubmit = category !== null && text.trim().length >= 10

  const generateTicketId = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = Math.floor(100 + Math.random() * 900)
    return `TKT-${dateStr}-${randomNum}`
  }

  const submit = () => {
    if (canSubmit) {
      setTicketId(generateTicketId())
      setSubmitted(true)
    }
  }

  const reset = () => {
    setCategory(null)
    setText('')
    setPriority('medium')
    setSubmitted(false)
    setOpen(false)
  }

  const CATS: { id: Category; label: string; icon: string[] }[] = [
    { id: 'bug', label: 'Bug Report', icon: ICONS.bug },
    { id: 'feature', label: 'Feature Request', icon: ICONS.spark },
    { id: 'feedback', label: 'General Feedback', icon: ICONS.msg }
  ]

  const priorityColors: Record<Priority, string> = {
    low: '#7a7468',
    medium: '#c9913d',
    high: '#c0392b'
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Floating Modal Panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 68,
            right: 0,
            width: 340,
            background: 'white',
            border: '1px solid #d6d0c8',
            borderRadius: 14,
            boxShadow: '0 16px 48px rgba(27,45,32,0.18)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ background: '#0d3116', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'var(--color-primary, #2d6a4f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#e0ebe2', fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', margin: 0 }}>
                Help & Feedback
              </p>
              <p style={{ color: 'rgba(224,235,226,0.45)', fontSize: 14, margin: 0 }}>
                HomeoAssist · {role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ color: 'rgba(224,235,226,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
            >
              <Ico d={ICONS.x} size={15} />
            </button>
          </div>

          {!submitted ? (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Category Selector */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7a7468', marginBottom: 8 }}>
                  What would you like to report?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {CATS.map(cat => {
                    const isSelected = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '9px 12px',
                          borderRadius: 9,
                          border: isSelected ? '1px solid var(--color-primary, #2d6a4f)' : '1px solid #d6d0c8',
                          background: isSelected ? '#d8f3dc' : '#f5f2ed',
                          color: isSelected ? 'var(--color-primary, #2d6a4f)' : '#1b2d20',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 400
                        }}
                      >
                        <span style={{ color: isSelected ? 'var(--color-primary, #2d6a4f)' : '#7a7468' }}>
                          <Ico d={cat.icon} size={14} />
                        </span>
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7a7468', marginBottom: 6 }}>
                  Description
                </p>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={
                    category === 'bug'
                      ? 'Describe the bug — what happened and when…'
                      : category === 'feature'
                      ? "Describe the feature you'd like to see…"
                      : 'Share your experience or suggestion…'
                  }
                  rows={4}
                  maxLength={500}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 9,
                    border: '1px solid #d6d0c8',
                    background: '#f5f2ed',
                    color: '#1b2d20',
                    fontSize: 14,
                    lineHeight: 1.5,
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: 12, color: text.length < 10 ? '#7a7468' : 'var(--color-primary, #2d6a4f)', marginTop: 4, textAlign: 'right' }}>
                  {text.length} / 500 {text.length < 10 && text.length > 0 && '(min 10 chars)'}
                </p>
              </div>

              {/* Priority Selector (Only visible for bugs) */}
              {category === 'bug' && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7a7468', marginBottom: 6 }}>
                    Priority
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['low', 'medium', 'high'] as Priority[]).map(p => {
                      const isSelected = priority === p
                      return (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          style={{
                            flex: 1,
                            padding: '6px 0',
                            borderRadius: 7,
                            border: isSelected ? `1px solid ${priorityColors[p]}` : '1px solid #d6d0c8',
                            background: isSelected ? `${priorityColors[p]}18` : 'white',
                            color: isSelected ? priorityColors[p] : '#7a7468',
                            fontSize: 13,
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontFamily: 'var(--font-sans)',
                            transition: 'all 0.15s'
                          }}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #ede9e3', paddingTop: 12 }}>
                <p style={{ fontSize: 13, color: '#7a7468', margin: 0 }}>
                  Sent as <strong style={{ color: '#1b2d20' }}>{userName}</strong>
                </p>
                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 9,
                    background: canSubmit ? 'var(--color-primary, #2d6a4f)' : '#ede9e3',
                    color: canSubmit ? '#f0ede8' : '#7a7468',
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.15s'
                  }}
                >
                  <Ico d={ICONS.send} size={13} /> Submit
                </button>
              </div>
            </div>
          ) : (
            /* Success View */
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#d8f3dc',
                  color: 'var(--color-primary, #2d6a4f)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ico d={ICONS.check} size={24} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1b2d20', fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 4 }}>
                  Thank you!
                </p>
                <p style={{ fontSize: 11, color: '#7a7468', lineHeight: 1.5, margin: 0 }}>
                  Your {category === 'bug' ? 'bug report' : category === 'feature' ? 'feature request' : 'feedback'} has been submitted. Our team will review it shortly.
                </p>
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 8, background: '#f5f2ed', border: '1px solid #d6d0c8', width: '100%' }}>
                <p style={{ fontSize: 10, color: '#7a7468', margin: '0 0 2px' }}>Your ticket ID</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary, #2d6a4f)', fontFamily: 'var(--font-mono, monospace)', margin: 0 }}>
                  {ticketId}
                </p>
              </div>
              <button
                onClick={reset}
                style={{ fontSize: 12, color: '#7a7468', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Help & Feedback"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: open ? '#1b2d20' : 'var(--color-primary, #2d6a4f)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(45,106,79,0.35)',
          transition: 'all 0.2s',
          transform: open ? 'rotate(45deg)' : 'none'
        }}
      >
        <Ico d={open ? ICONS.x : ICONS.chat} size={22} />
      </button>
    </div>
  )
}