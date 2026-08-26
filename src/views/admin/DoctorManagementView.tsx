import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Ico, IC } from '../../components/ui/Ico'
import { doctorsApi, Doctor } from '../../api/doctors'
import { adminApi } from '../../api/admin'

export function DoctorManagementView() {
  const [tab, setTab]                   = useState<'pending'|'verified'>('pending')
  const [pending, setPending]           = useState<Doctor[]>([])
  const [verified, setVerified]         = useState<Doctor[]>([])
  const [loading, setLoading]           = useState(true)
  const [declineModal, setDeclineModal] = useState<Doctor | null>(null)
  const [declineReason, setDeclineReason] = useState('')
  const [updating, setUpdating]         = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      adminApi.doctors({ verified: false }),
      adminApi.doctors({ verified: true }),
    ]).then(([pRes, vRes]) => {
      setPending(pRes.data as Doctor[])
      setVerified(vRes.data as Doctor[])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const approve = async (id: number) => {
    setUpdating(id)
    try {
      await doctorsApi.verify(id, true)
      const doc = pending.find(d => d.id === id)
      if (doc) {
        setPending(p => p.filter(d => d.id !== id))
        setVerified(v => [...v, { ...doc, is_verified: true }])
      }
    } catch (err) { console.error(err) }
    finally { setUpdating(null) }
  }

  const decline = async (id: number) => {
    setUpdating(id)
    try {
      await doctorsApi.delete(id)
      setPending(p => p.filter(d => d.id !== id))
    } catch (err) { console.error(err) }
    finally { setUpdating(null); setDeclineModal(null); setDeclineReason('') }
  }

  if (loading) return (
    <div className="p-8 text-center text-[13px]" style={{ color: '#7a7468' }}>Loading doctors…</div>
  )

  return (
    <div>
      <TopBar title="Doctor Management"
        sub={`${pending.length} pending · ${verified.length} verified`}
        defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-5">
        <div className="flex gap-2">
          {(['pending','verified'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize relative"
              style={tab === t
                ? { background: '#d8f3dc', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }
                : { border: '1px solid #d6d0c8', color: '#7a7468', background: 'white' }}>
              {t === 'pending' ? 'Pending Review' : 'Verified Doctors'}
              {t === 'pending' && pending.length > 0 && (
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#c0392b', color: 'white' }}>{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'pending' && (
          <div className="flex flex-col gap-4">
            {pending.length === 0 ? (
              <p className="text-center py-12 text-[13px]" style={{ color: '#7a7468' }}>No pending verifications.</p>
            ) : pending.map(doc => (
              <Card key={doc.id} className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                    {doc.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#1b2d20' }}>{doc.name}</h3>
                      <Badge label="Pending Review" variant="warning" />
                    </div>
                    <p className="text-[12px] mb-1" style={{ color: '#7a7468' }}>
                      {doc.qualifications} · {doc.specialty} · {doc.experience_yrs} yrs
                    </p>
                    <div className="flex items-center gap-4 text-[11px]" style={{ color: '#7a7468' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontWeight: 600 }}>{doc.reg_no}</span>
                      {doc.address && <span>📍 {doc.address}</span>}
                      {doc.email && <span>{doc.email}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setDeclineModal(doc)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50"
                    style={{ border: '1px solid #fca5a5', color: '#dc2626' }}>
                    <Ico d={IC.x} size={13} /> Decline
                  </button>
                  <button onClick={() => approve(doc.id)} disabled={updating === doc.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold ml-auto transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
                    <Ico d={IC.check} size={13} /> {updating === doc.id ? 'Approving…' : 'Approve & Verify'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'verified' && (
          <Card>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '1fr 120px 1fr 100px 80px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Doctor</span><span>Reg. No.</span><span>Specialty</span><span>Fee</span><span>Rating</span><span>Status</span>
            </div>
            {verified.length === 0 ? (
              <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>No verified doctors yet.</p>
            ) : verified.map((doc, i) => (
              <div key={doc.id} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '1fr 120px 1fr 100px 80px 80px', borderBottom: i < verified.length-1 ? '1px solid #ede9e3' : 'none' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                    {doc.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <span className="text-[12px] font-medium truncate" style={{ color: '#1b2d20' }}>{doc.name}</span>
                </div>
                <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{doc.reg_no}</span>
                <span className="text-[11px] truncate" style={{ color: '#7a7468' }}>{doc.specialty} · {doc.experience_yrs} yrs</span>
                <span className="text-[12px] font-semibold" style={{ color: '#1b2d20' }}>৳{doc.fee}</span>
                <span className="text-[12px]" style={{ color: '#1b2d20' }}>⭐ {doc.rating}</span>
                <Badge label="Active" variant="success" />
              </div>
            ))}
          </Card>
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
              <textarea value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                placeholder="Reason for decline (will be recorded)…" rows={4}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none"
                style={{ border: '1px solid #d6d0c8', background: '#f5f2ed', color: '#1b2d20' }} />
              <div className="flex gap-3">
                <button onClick={() => setDeclineModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>Cancel</button>
                <button onClick={() => decline(declineModal.id)} disabled={updating === declineModal.id}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#c0392b', color: 'white' }}>
                  {updating === declineModal.id ? 'Removing…' : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
