import { useState, useEffect, useCallback } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { medicinesApi, Medicine } from '../../api/medicines'
import { cdssApi, CDSSRecommendation } from '../../api/cdss'

interface Props { onProfileClick?: () => void }

export function MedicineFinderView({ onProfileClick }: Props) {
  const [tab, setTab]               = useState<'browse'|'cdss'>('cdss')
  const [medicines, setMedicines]   = useState<Medicine[]>([])
  const [total, setTotal]           = useState(0)
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const [loadingMeds, setLoadingMeds] = useState(false)
  const [tags, setTags]             = useState(['Watery nasal discharge','Worse in cold air','Restlessness','Burning sensation'])
  const [input, setInput]           = useState('')
  const [recs, setRecs]             = useState<CDSSRecommendation[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [selected, setSelected]     = useState<string | null>(null)
  const LIMIT = 30

  const fetchMedicines = useCallback(async () => {
    setLoadingMeds(true)
    try {
      const res = await medicinesApi.list({ search: search || undefined, page, limit: LIMIT })
      setMedicines(res.data)
      setTotal(res.total)
    } catch (err) { console.error(err) }
    finally { setLoadingMeds(false) }
  }, [search, page])

  useEffect(() => {
    if (tab !== 'browse') return
    const t = setTimeout(fetchMedicines, 300)
    return () => clearTimeout(t)
  }, [tab, fetchMedicines])

  const runCDSS = async () => {
    if (tags.length === 0) return
    setLoadingRecs(true)
    setRecs([])
    try {
      const res = await cdssApi.recommend(tags)
      setRecs(res.data)
    } catch (err) { console.error(err) }
    finally { setLoadingRecs(false) }
  }

  const addTag = () => {
    const t = input.trim()
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setInput('') }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <TopBar title="Medicine Finder & CDSS"
        sub="AI-assisted homeopathic medicine selection"
        onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-5">

        {/* Tab switcher */}
        <div className="flex gap-2">
          {(['cdss','browse'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize"
              style={tab === t
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {t === 'cdss' ? '🧠 CDSS Recommender' : '📖 Browse All Medicines'}
            </button>
          ))}
        </div>

        {/* ── CDSS TAB ── */}
        {tab === 'cdss' && (
          <div className="flex flex-col gap-5">
            <Card className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Active Symptoms</p>
              <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                {tags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
                    style={{ background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                    {tag}
                    <button onClick={() => setTags(t => t.filter((_,j) => j !== i))} className="opacity-60 hover:opacity-100">
                      <Ico d={IC.x} size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Type a symptom and press Enter…"
                  className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20' }} />
                <button onClick={addTag}
                  className="px-3 py-2 rounded-lg text-[12px] font-semibold"
                  style={{ background: '#1b2d20', color: '#e0ebe2' }}>+ Add</button>
                <button onClick={runCDSS} disabled={tags.length === 0 || loadingRecs}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                  {loadingRecs ? 'Analysing…' : 'Run CDSS →'}
                </button>
              </div>
            </Card>

            {recs.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Ranked Recommendations</h2>
                  <p className="text-[11px]" style={{ color: '#7a7468' }}>{recs.length} medicines · sorted by match score</p>
                </div>
                {recs.map((med, i) => (
                  <Card key={i} className="p-5 cursor-pointer transition-all hover:border-[#2d6a4f]/40"
                    style={selected === med.name ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 2px rgba(45,106,79,0.12)' } : undefined}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                            style={{ background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{i+1}</span>
                          <h3 className="text-[14px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{med.name}</h3>
                          <Badge label={med.potency} />
                        </div>
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
            )}

            {selected && (
              <div className="px-5 py-4 rounded-xl flex items-center justify-between"
                style={{ background: '#d8f3dc', border: '1px solid var(--color-primary)' }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{selected}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>Review dosage before generating prescription</p>
                </div>
                <button className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                  Generate Prescription →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── BROWSE TAB ── */}
        {tab === 'browse' && (
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <div className="flex gap-2 items-center">
                <span style={{ color: '#7a7468' }}><Ico d={IC.search} size={16} /></span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search by English or Bengali name…"
                  className="flex-1 text-[13px] outline-none bg-transparent"
                  style={{ color: '#1b2d20' }} />
                {search && <button onClick={() => { setSearch(''); setPage(1) }} style={{ color: '#7a7468' }}><Ico d={IC.x} size={14} /></button>}
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
                style={{ gridTemplateColumns: '60px 1fr 1fr 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
                <span>ID</span><span>English Name</span><span>Bengali Name</span><span>Featured</span>
              </div>
              {loadingMeds ? (
                <p className="py-8 text-center text-[13px]" style={{ color: '#7a7468' }}>Loading…</p>
              ) : medicines.map((m, i) => (
                <div key={m.m_id} className="px-5 py-3 grid items-center transition-colors hover:bg-[#f5f2ed]"
                  style={{ gridTemplateColumns: '60px 1fr 1fr 80px', borderBottom: i < medicines.length-1 ? '1px solid #ede9e3' : 'none' }}>
                  <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{m.m_id}</span>
                  <span className="text-[13px] font-medium" style={{ color: '#1b2d20', fontStyle: 'italic' }}>{m.m_txt}</span>
                  <span className="text-[12px]" style={{ color: '#7a7468' }}>{m.m_btxt ?? '—'}</span>
                  {m.m_du ? <Badge label="Featured" variant="success" /> : <span />}
                </div>
              ))}
            </Card>
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-[12px]" style={{ color: '#7a7468' }}>Showing {(page-1)*LIMIT+1}–{Math.min(page*LIMIT, total)} of {total}</p>
                <div className="flex gap-2">
                  <button disabled={page<=1} onClick={() => setPage(p => p-1)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium disabled:opacity-40"
                    style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>← Prev</button>
                  <span className="px-3 py-1.5 text-[12px]" style={{ color: '#7a7468' }}>{page} / {totalPages}</span>
                  <button disabled={page>=totalPages} onClick={() => setPage(p => p+1)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium disabled:opacity-40"
                    style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Next →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
