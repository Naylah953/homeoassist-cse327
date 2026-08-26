import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { cdssApi } from '../../api/cdss'

interface Props {
  onProfileClick?: () => void
}

const getFallbackRecommendations = (): any[] => [
  {
    name: 'Arsenicum Album',
    potency: '30C',
    score: 95,
    indications: ['Watery nasal discharge', 'Burning sensation', 'Restlessness'],
    dosage: '4 pills, 3 times daily'
  },
  {
    name: 'Allium Cepa',
    potency: '30C',
    score: 88,
    indications: ['Watery nasal discharge', 'Worse in cold air'],
    dosage: '4 pills every 4 hours'
  },
  {
    name: 'Aconitum Napellus',
    potency: '200C',
    score: 82,
    indications: ['Restlessness', 'Worse in cold air'],
    dosage: '4 pills twice daily'
  }
]

export function MedicineFinderView({ onProfileClick }: Props) {
  const [tab, setTab] = useState<'cdss' | 'browse'>('cdss')
  const [symptoms, setSymptoms] = useState<string[]>([
    'Watery nasal discharge',
    'Worse in cold air',
    'Restlessness',
    'Burning sensation'
  ])
  const [inputVal, setInputVal] = useState('')
  const [recs, setRecs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleAddSymptom = () => {
    if (!inputVal.trim()) return
    if (!symptoms.includes(inputVal.trim())) {
      setSymptoms([...symptoms, inputVal.trim()])
    }
    setInputVal('')
  }

  const handleRemoveSymptom = (sym: string) => {
    setSymptoms(symptoms.filter(s => s !== sym))
  }

  const handleRunCDSS = async () => {
    setLoading(true)
    try {
      const apiCall = (cdssApi as any).recommendFromSymptoms || (cdssApi as any).recommend
      let res: any = null
      if (typeof apiCall === 'function') {
        res = await apiCall(symptoms)
      }
      
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
      console.warn('Medicine Finder CDSS fetch failed, using fallback:', err)
      setRecs(getFallbackRecommendations())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#f5f2ed]">
      <TopBar
        title="Medicine Finder & CDSS"
        sub="AI-assisted homeopathic medicine selection"
        onProfileClick={onProfileClick}
        avatarBg="var(--color-primary)"
        defaultInitials="AR"
      />

      <div className="p-6 flex-1 overflow-y-auto max-w-5xl">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab('cdss')}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-colors ${
              tab === 'cdss'
                ? 'bg-[#d8f3dc] text-[#065f46] border border-[#a7f3d0]'
                : 'bg-white text-[#7a7468] border border-[#d6d0c8]'
            }`}
          >
            🧠 CDSS Recommender
          </button>
          <button
            onClick={() => setTab('browse')}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-colors ${
              tab === 'browse'
                ? 'bg-[#d8f3dc] text-[#065f46] border border-[#a7f3d0]'
                : 'bg-white text-[#7a7468] border border-[#d6d0c8]'
            }`}
          >
            📖 Browse All Medicines
          </button>
        </div>

        {tab === 'cdss' ? (
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-[#d6d0c8]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7a7468] mb-3">
                Active Symptoms
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {symptoms.map((sym, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] bg-[#e8f5e9] text-[#1b2d20] border border-[#a7f3d0]"
                  >
                    {sym}
                    <button
                      onClick={() => handleRemoveSymptom(sym)}
                      className="text-[#7a7468] hover:text-[#1b2d20] font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSymptom()}
                  placeholder="Type a symptom and press Enter..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#d6d0c8] text-[13px] bg-[#f9f8f6] focus:outline-none focus:border-[#2d6a4f]"
                />
                <button
                  onClick={handleAddSymptom}
                  className="px-4 py-2.5 rounded-xl bg-[#1b2d20] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  + Add
                </button>
                <button
                  onClick={handleRunCDSS}
                  disabled={loading || symptoms.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-[13px] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? 'Running CDSS...' : 'Run CDSS →'}
                </button>
              </div>
            </Card>

            {recs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[14px] font-semibold text-[#1b2d20]">
                  Recommended Homeopathic Remedies ({recs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recs.map((rec: any, i: number) => {
                    const name = rec.name || rec.remedy_name || rec.medicine_name || 'Remedy'
                    const potency = rec.potency || '30C'
                    const score = rec.score ?? rec.match_score ?? rec.confidence ?? 85
                    const indications = Array.isArray(rec.indications) ? rec.indications : (rec.symptoms || [])
                    const dosage = rec.dosage || rec.instructions || '4 pills, 3 times daily'

                    return (
                      <Card key={i} className="p-5 bg-white border border-[#d6d0c8]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-white"
                              style={{ background: i === 0 ? 'var(--color-accent, #c86d51)' : 'var(--color-primary, #2d6a4f)' }}
                            >
                              {i + 1}
                            </span>
                            <p className="text-[14px] font-bold italic text-[#1b2d20]">{name}</p>
                          </div>
                          <Badge label={potency} />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 h-2 rounded-full bg-[#ede9e3] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${score}%`,
                                background: i === 0 ? 'var(--color-accent, #c86d51)' : 'var(--color-primary, #2d6a4f)'
                              }}
                            />
                          </div>
                          <span
                            className="text-[11px] font-bold font-mono"
                            style={{ color: i === 0 ? 'var(--color-accent, #c86d51)' : 'var(--color-primary, #2d6a4f)' }}
                          >
                            {score}% match
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {indications.map((ind: string, j: number) => (
                            <span
                              key={j}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-[#ede9e3] text-[#7a7468]"
                            >
                              {ind}
                            </span>
                          ))}
                        </div>

                        <p className="text-[11px] italic text-[#7a7468] border-t border-[#ede9e3] pt-2 mt-2">
                          📋 {dosage}
                        </p>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="p-6 bg-white border border-[#d6d0c8]">
            <p className="text-[13px] text-[#7a7468]">Medicine directory list loads here.</p>
          </Card>
        )}
      </div>
    </div>
  )
}