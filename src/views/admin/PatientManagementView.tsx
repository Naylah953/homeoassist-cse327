import { useState, useEffect, useCallback } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { api } from '../../api/client'

interface Patient {
  id: number; name: string; email: string; phone: string
  age: number; gender: string; address: string; created_at: string
}

export function PatientManagementView() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [total, setTotal]       = useState(0)
  const [query, setQuery]       = useState('')
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const LIMIT = 20

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ limit: String(LIMIT), page: String(page) })
      if (query) q.set('search', query)
      const res = await api.get<{ success: boolean; total: number; data: Patient[] }>(`/patients?${q}`)
      setPatients(res.data)
      setTotal(res.total)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [query, page])

  useEffect(() => {
    const t = setTimeout(fetchPatients, 300)
    return () => clearTimeout(t)
  }, [fetchPatients])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this patient? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/patients/${id}`)
      setPatients(p => p.filter(pt => pt.id !== id))
      setTotal(t => t - 1)
    } catch (err) { console.error(err) }
    finally { setDeleting(null) }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <TopBar title="Patient Management" sub={`${total} total patients`}
        defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}><Ico d={IC.search} size={14} /></span>
            <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
        </div>

        <Card>
          <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '60px 1fr 1fr 60px 80px 100px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
            <span>ID</span><span>Name</span><span>Email</span><span>Age</span><span>Gender</span><span>Joined</span><span>Actions</span>
          </div>

          {loading ? (
            <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>Loading…</p>
          ) : patients.length === 0 ? (
            <p className="px-5 py-4 text-[12px] text-center" style={{ color: '#7a7468' }}>No patients found.</p>
          ) : patients.map((p, i) => (
            <div key={p.id} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '60px 1fr 1fr 60px 80px 100px 80px', borderBottom: i < patients.length-1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>#{p.id}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {p.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{p.name}</span>
              </div>
              <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>{p.email || '—'}</span>
              <span className="text-[12px]" style={{ color: '#7a7468' }}>{p.age || '—'}</span>
              <Badge label={p.gender || '—'} variant="default" />
              <span className="text-[11px]" style={{ color: '#7a7468' }}>
                {new Date(p.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}>
                  <Ico d={IC.eye} size={12} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40" style={{ color: '#dc2626' }}>
                  <Ico d={IC.trash} size={12} />
                </button>
              </div>
            </div>
          ))}
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[12px]" style={{ color: '#7a7468' }}>
              Showing {(page-1)*LIMIT+1}–{Math.min(page*LIMIT, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button disabled={page<=1} onClick={() => setPage(p => p-1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium disabled:opacity-40 transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>← Prev</button>
              <span className="px-3 py-1.5 text-[12px]" style={{ color: '#7a7468' }}>{page} / {totalPages}</span>
              <button disabled={page>=totalPages} onClick={() => setPage(p => p+1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium disabled:opacity-40 transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
