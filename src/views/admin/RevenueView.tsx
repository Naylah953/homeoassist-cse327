import { useState, useEffect } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { adminApi, RevenueMonth } from '../../api/admin'
import { subscriptionsApi, Plan, Subscription } from '../../api/subscriptions'

export function RevenueView() {
  const [revenue, setRevenue]   = useState<RevenueMonth[]>([])
  const [plans, setPlans]       = useState<Plan[]>([])
  const [subs, setSubs]         = useState<Subscription[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.revenue(),
      subscriptionsApi.plans(),
      subscriptionsApi.cancel ? // list all subs via admin
        fetch(`http://localhost:5000/api/subscriptions?limit=10`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()).catch(() => ({ data: [] })) :
        Promise.resolve({ data: [] }),
    ]).then(([revRes, planRes, subRes]) => {
      setRevenue(revRes.data)
      setPlans(planRes.data)
      setSubs((subRes as { data: Subscription[] }).data ?? [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalRev    = revenue.reduce((s, r) => s + parseFloat(r.total_revenue), 0)
  const totalColl   = revenue.reduce((s, r) => s + parseFloat(r.collected), 0)
  const totalAppts  = revenue.reduce((s, r) => s + parseInt(r.appointments), 0)

  return (
    <div>
      <TopBar title="Revenue & Plans" sub="Subscription analytics and payment history"
        defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Revenue"   value={`৳${totalRev.toLocaleString()}`}  sub="Completed appointments" gold />
          <StatCard label="Collected"       value={`৳${totalColl.toLocaleString()}`} sub="Paid invoices" />
          <StatCard label="Total Appointments" value={totalAppts} sub="Completed sessions" />
        </div>

        {/* Subscription plans */}
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[15px] font-bold mb-0.5 capitalize" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.name}</p>
                  <p className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                    ৳{plan.price}<span className="text-[12px] font-normal text-[#7a7468]">/mo</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <p className="text-[11px]" style={{ color: '#7a7468' }}>{f}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Monthly revenue table */}
        <Card>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Monthly Revenue Breakdown</h2>
          </div>
          {loading ? (
            <p className="px-5 py-4 text-[12px]" style={{ color: '#7a7468' }}>Loading…</p>
          ) : revenue.length === 0 ? (
            <p className="px-5 py-4 text-[12px] text-center" style={{ color: '#7a7468' }}>No revenue data yet. Run migrations to see data here.</p>
          ) : (
            <>
              <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
                style={{ gridTemplateColumns: '120px 1fr 1fr 1fr', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
                <span>Month</span><span>Appointments</span><span>Total Revenue</span><span>Collected</span>
              </div>
              {revenue.map((r, i) => (
                <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                  style={{ gridTemplateColumns: '120px 1fr 1fr 1fr', borderBottom: i < revenue.length-1 ? '1px solid #ede9e3' : 'none' }}>
                  <span className="text-[12px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: '#1b2d20' }}>{r.month}</span>
                  <span className="text-[13px]" style={{ color: '#1b2d20' }}>{r.appointments}</span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>৳{parseFloat(r.total_revenue).toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>৳{parseFloat(r.collected).toLocaleString()}</span>
                    <Badge label="Paid" variant="success" />
                  </div>
                </div>
              ))}
            </>
          )}
        </Card>

        {/* Recent subscriptions */}
        {subs.length > 0 && (
          <Card>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #d6d0c8' }}>
              <h2 className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Recent Subscriptions</h2>
            </div>
            <div className="px-5 py-3 grid text-[10px] font-bold uppercase tracking-widest"
              style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: '1px solid #d6d0c8', color: '#7a7468' }}>
              <span>Patient</span><span>Plan</span><span>Amount</span><span>Date</span><span>Status</span>
            </div>
            {subs.map((s, i) => (
              <div key={s.id} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
                style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: i < subs.length-1 ? '1px solid #ede9e3' : 'none' }}>
                <span className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>Patient #{s.patient_id}</span>
                <Badge label={s.plan} variant={s.plan === 'pro' ? 'accent' : s.plan === 'clinic' ? 'gold' : 'default'} />
                <span className="text-[13px] font-semibold" style={{ color: '#1b2d20' }}>৳{s.price}</span>
                <span className="text-[11px]" style={{ color: '#7a7468' }}>{new Date(s.started_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</span>
                <Badge label={s.status} variant={s.status === 'active' ? 'success' : 'default'} />
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
