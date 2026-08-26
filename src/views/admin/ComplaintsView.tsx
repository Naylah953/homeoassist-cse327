import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { complaintsApi, Complaint } from '../../api/complaints'

export function ComplaintsView() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading]       = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter]     = useState('All')
  const [expanded, setExpanded]         = useState<number | null>(null)
  const [updating, setUpdating]         = useState<number | null>(null)

  useEffect(() => {
    complaintsApi.list()
      .then(r => setComplaints(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: number, status: 'open' | 'resolved' | 'dismissed') => {
    setUpdating(id)
    try {
      await complaintsApi.updateStatus(id, status)
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    } catch (err) { console.error(err) }
    finally { setUpdating(null) }
  }

  const shown = complaints.filter(c => {
    const matchS = statusFilter === 'All' || c.status === statusFilter.toLowerCase()
    const matchR = roleFilter === 'All' || c.filed_by === roleFilter.toLowerCase()
    return matchS && matchR
  })

  return (
    <div>
      <TopBar title="Complaints & Feedback" sub="User-submitted complaints and issues"
        defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1.5">
            {['All','open','resolved','dismissed'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize"
                style={statusFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {['All','doctor','patient'].map(f => (
              <button key={f} onClick={() => setRoleFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize"
                style={roleFilter === f
                  ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                  : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
                {f}
              </button>
            ))}
          </div>
          <p className="ml-auto text-[11px] self-center" style={{ color: '#7a7468' }}>{shown.length} results</p>
        </div>

        {loading ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>Loading complaints…</p>
        ) : shown.length === 0 ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>No complaints found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {shown.map(c => (
              <Card key={c.id} className="overflow-hidden">
                <div className="px-5 py-4 cursor-pointer transition-colors hover:bg-[#f5f2ed]"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: c.status === 'open' ? '#c0392b' : c.status === 'resolved' ? '#2d6a4f' : '#7a7468' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: '#1b2d20' }}>{c.subject}</p>
                      <div className="flex items-center gap-2 text-[11px]" style={{ color: '#7a7468' }}>
                        <span className="font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: 10 }}>#{c.id}</span>
                        <span>·</span>
                        <span className="capitalize">{c.filed_by}</span>
                        <Badge label={c.filed_by === 'doctor' ? 'Doctor' : 'Patient'} variant={c.filed_by === 'doctor' ? 'new' : 'default'} />
                        <span>·</span>
                        <span>{new Date(c.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                      </div>
                    </div>
                    <Badge
                      label={c.status === 'open' ? 'Open' : c.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                      variant={c.status === 'open' ? 'danger' : c.status === 'resolved' ? 'success' : 'default'}
                    />
                  </div>
                </div>

                {expanded === c.id && (
                  <div className="px-5 py-4 flex flex-col gap-4" style={{ borderTop: '1px solid #ede9e3', background: '#fafaf9' }}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7a7468' }}>Description</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: '#1b2d20' }}>{c.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {c.status !== 'resolved' && (
                        <button
                          disabled={updating === c.id}
                          onClick={() => updateStatus(c.id, 'resolved')}
                          className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                          style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                          {updating === c.id ? 'Updating…' : 'Mark Resolved'}
                        </button>
                      )}
                      {c.status === 'open' && (
                        <button
                          disabled={updating === c.id}
                          onClick={() => updateStatus(c.id, 'dismissed')}
                          className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                          style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>
                          Dismiss
                        </button>
                      )}
                      {c.status !== 'open' && (
                        <button
                          disabled={updating === c.id}
                          onClick={() => updateStatus(c.id, 'open')}
                          className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                          style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
