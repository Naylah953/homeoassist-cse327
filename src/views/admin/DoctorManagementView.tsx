import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { PENDING_DOCTORS, VERIFIED_DOCTORS } from '../../data/adminMockData'

// ── Doctors ───────────────────────────────────────────────────────────────────

export function DoctorManagementView() {
  const [tab, setTab] = useState<'pending' | 'verified' | 'declined'>('pending')
  const [declineModal, setDeclineModal] = useState<typeof PENDING_DOCTORS[0] | null>(null)
  const [approved, setApproved] = useState<string[]>([])
  const [declined, setDeclined] = useState<string[]>([])
  const [declineReason, setDeclineReason] = useState('')

  const pending  = PENDING_DOCTORS.filter(d => !approved.includes(d.reg) && !declined.includes(d.reg))
  const verified = [...VERIFIED_DOCTORS, ...PENDING_DOCTORS.filter(d => approved.includes(d.reg)).map(d => ({
    name: d.name,
    initials: d.initials,
    reg: d.reg, 
    specialty: d.specialty, 
    exp: d.exp,
    patients: 0, 
    joined: 'Just now', 
    status: 'active' as const,
  }))]

  return (
    <div>
      <TopBar title="Doctor Management" sub={`${PENDING_DOCTORS.length} pending · ${VERIFIED_DOCTORS.length} verified`} defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex gap-2">
          {(['pending', 'verified', 'declined'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize relative"
              style={tab === t
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {t === 'pending' ? 'Pending Review' : t === 'verified' ? 'Verified Doctors' : 'Declined'}
              {t === 'pending' && pending.length > 0 && (
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#c0392b', color: 'white' }}>{pending.length}</span>
              )}
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
            <Ico d={IC.download} size={13} /> Export List
          </button>
        </div>

        {tab === 'pending' && (
          <div className="flex flex-col gap-4">
            {pending.length === 0
              ? <p className="text-[13px] text-center py-12" style={{ color: '#7a7468' }}>No pending verifications.</p>
              : pending.map((doc, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                      style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{doc.name}</h3>
                        <Badge label="Pending Review" variant="warning" />
                        {!doc.docs && <Badge label="Documents Incomplete" variant="danger" />}
                      </div>
                      <p className="text-[12px] mb-1" style={{ color: '#7a7468' }}>{doc.qual} · {doc.specialty} · {doc.exp} yrs experience</p>
                      <div className="flex items-center gap-4 text-[11px]" style={{ color: '#7a7468' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontWeight: 600 }}>{doc.reg}</span>
                        <span>📍 {doc.city}</span>
                        <span>Submitted {doc.submitted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-lg mb-4" style={{ background: '#f5f2ed', border: '1px solid #ede9e3' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Registration Note</p>
                    <p className="text-[12px]" style={{ color: '#1b2d20' }}>{doc.note}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-[#f5f2ed]"
                      style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                      <Ico d={IC.eye} size={13} /> View Full Application
                    </button>
                    <button onClick={() => setDeclineModal(doc)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                      style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>
                      <Ico d={IC.x} size={13} /> Decline
                    </button>
                    <button onClick={() => setApproved(a => [...a, doc.reg])}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90"
                      style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                      <Ico d={IC.check} size={13} /> Approve & Verify
                    </button>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab === 'verified' && (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '180px 80px 1fr 100px 90px 80px 90px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Doctor</span>
              <span>Reg. No.</span>
              <span>Specialty</span>
              <span>Joined</span>
              <span>Patients</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {verified.map((doc, i) => (
              <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '180px 80px 1fr 100px 90px 80px 90px', borderBottom: i < verified.length - 1 ? '1px solid #ede9e3' : 'none' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>{doc.initials}</div>
                  <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{doc.name}</span>
                </div>
                <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{doc.reg}</span>
                <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.exp} yrs</span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{doc.joined}</span>
                <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>{doc.patients}</span>
                <Badge label={doc.status === 'active' ? 'Active' : 'Suspended'} variant={doc.status === 'active' ? 'success' : 'danger'} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.eye} size={13} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}><Ico d={IC.edit} size={13} /></button>
                </div>
              </div>
            ))}
          </Card>
        )}

        {tab === 'declined' && (
          <div className="text-center py-16" style={{ color: '#7a7468' }}>
            <Ico d={IC.doc} size={32} />
            <p className="text-[13px] mt-3">No declined applications on record.</p>
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(27,45,32,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeclineModal(null)}>
          <div className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <div>
                <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Decline Application</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{declineModal.name}</p>
              </div>
              <button onClick={() => setDeclineModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f2ed]" style={{ color: '#7a7468' }}>
                <Ico d={IC.x} size={16} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7a7468' }}>Reason for Decline</p>
                <textarea value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                  placeholder="Provide a reason (this will be shared with the applicant)…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none"
                  style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20', fontFamily: 'var(--font-sans)' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeclineModal(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Cancel</button>
                <button onClick={() => { setDeclined(d => [...d, declineModal.reg]); setDeclineModal(null); setDeclineReason('') }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: '#c0392b', color: 'white' }}>Confirm Decline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}