import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { COMPLAINTS } from '../../data/adminMockData'

// ── Complaints ────────────────────────────────────────────────────────────────

export function ComplaintsView() {
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
      <TopBar title="Complaints & Feedback" sub="Submitted via in-app feedback widget" defaultInitials="SA" avatarBg="#b4654a" />
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