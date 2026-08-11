import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { MEDICINES } from '../../data/doctorMockData'

// ── Medicine Finder ───────────────────────────────────────────────────────────

interface Props {
  onProfileClick?: () => void
}

export function MedicineFinderView({ onProfileClick }: Props ) {
  const [tags, setTags] = useState(['Watery nasal discharge', 'Worse in cold air', 'Restlessness', 'Burning sensation', 'Anxiety & chilliness'])
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const addTag = () => {
    const t = input.trim()
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setInput('') }
  }

  return (
    <div>
      <TopBar title="Medicine Finder" sub="AI-assisted homeopathic medicine selection" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">
        {/* Symptom input */}
        <Card className="p-5">
          <p className="text-[15px] font-bold uppercase tracking-widest mb-3" style={{ color: '#7a7468' }}>Active Symptoms</p>
          <div className="flex flex-wrap gap-2 mb-3 min-h-8">
            {tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[15px] font-medium"
                style={{ background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                {tag}
                <button onClick={() => setTags(t => t.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100 transition-opacity">
                  <Ico d={IC.x} size={15} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="Type a symptom and press Enter…"
              className="flex-1 px-3 py-2 rounded-lg text-[15px] outline-none transition-colors"
              style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20' }} />
            <button onClick={addTag}
              className="px-4 py-2 rounded-lg text-[15px] font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
              <Ico d={IC.plus} size={18} /> Add
            </button>
          </div>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Ranked Recommendations</h2>
            <p className="text-[16px]" style={{ color: '#7a7468' }}>{MEDICINES.length} medicines · sorted by match score</p>
          </div>
          <div className="flex flex-col gap-3">
            {MEDICINES.map((med, i) => (
              <Card key={i} className="p-5 transition-all cursor-pointer hover:border-[#2d6a4f]/40"
                style={selected === med.name ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 2px rgba(45,106,79,0.12)' } : undefined}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-6 h-6 rounded flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
                        style={{ background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{i + 1}</span>
                      <h3 className="text-[18px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'normal'  }}>{med.name}</h3>
                      <Badge label={med.potency} />
                    </div>
                    {/* Score */}
                    <div className="ml-9 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#ede9e3' }}>
                          <div className="h-full rounded-full" style={{ width: `${med.score}%`, background: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)', transition: 'width 0.6s ease' }} />
                        </div>
                        <span className="text-[16px] font-bold tabular-nums flex-shrink-0"
                          style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{med.score}%</span>
                      </div>
                    </div>
                    <div className="ml-9 flex flex-wrap gap-1.5 mb-2">
                      {med.indications.map((ind, j) => (
                        <span key={j} className="text-[15px] px-2 py-0.5 rounded-full" style={{ background: '#ede9e3', color: '#7a7468' }}>{ind}</span>
                      ))}
                    </div>
                    <p className="ml-9 text-[14px]" style={{ color: '#7a7468', fontStyle: 'italic' }}>{med.note}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-[15px] text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: '#880000' }}>{med.dosage}</p>
                    <button onClick={() => setSelected(med.name)}
                      className="px-3 py-1.5 rounded-lg text-[15px] font-semibold transition-all"
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
          {selected && (
            <div className="mt-4 px-5 py-4 rounded-xl flex items-center justify-between"
              style={{ background: '#d8f3dc', border: '1px solid var(--color-primary)' }}>
              <div>
                <p className="text-[22px] font-semibold" style={{ color: 'var(--color-primary)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{selected}</p>
                <p className="text-[15px] mt-0.5" style={{ color: '#7a7468' }}>Review dosage before generating prescription</p>
              </div>
              <button className="px-4 py-2 rounded-lg text-[15px] font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>Generate Prescription →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}