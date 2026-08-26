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

interface Props { onProfileClick?: () => void }

export function PatientsView({ onProfileClick }: Props) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [total, setTotal]       = useState(0)
  const [query, setQuery]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
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

  const totalPages = Math.ceil(total / LIMIT)

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div>
      <TopBar title="Patients" sub={`${total} registered patients`}
        onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7468' }}>
              <Ico d={IC.search} size={14} />
            </span>
            <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search patients…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ border: '1px solid #d6d0c8', background: 'white', color: '#1b2d20' }} />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>Loading patients…</p>
        ) : patients.length === 0 ? (
          <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>No patients found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {patients.map(p => (
              <Card key={p.id} className="p-5 hover:border-[#2d6a4f]/40 transition-all cursor-pointer">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                    {initials(p.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>{p.name}</h3>
                      <Badge label="Active" variant="success" />
                    </div>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>
                      {p.age ? `Age ${p.age}` : '—'}{p.gender ? ` · ${p.gender}` : ''}
                    </p>
                    {p.phone && <p className="text-[11px]" style={{ color: '#7a7468' }}>{p.phone}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-3" style={{ borderTop: '1px solid #ede9e3' }}>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Registered</p>
                    <p style={{ color: '#1b2d20' }}>{new Date(p.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7a7468' }}>Email</p>
                    <p className="truncate max-w-[140px]" style={{ color: '#1b2d20' }}>{p.email || '—'}</p>
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
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[12px]" style={{ color: '#7a7468' }}>
              Showing {(page-1)*LIMIT+1}–{Math.min(page*LIMIT, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p-1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium disabled:opacity-40 transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>← Prev</button>
              <span className="px-3 py-1.5 text-[12px]" style={{ color: '#7a7468' }}>{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium disabled:opacity-40 transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
