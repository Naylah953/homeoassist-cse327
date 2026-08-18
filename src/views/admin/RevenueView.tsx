import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { PLANS, RECENT_PAYMENTS } from '../../data/adminMockData'

// ── Revenue ───────────────────────────────────────────────────────────────────

export function RevenueView() {
  const totalRev = PLANS.reduce((s, p) => s + p.revenue, 0)
  const totalSubs = PLANS.reduce((s, p) => s + p.subscribers, 0)

  return (
    <div>
      <TopBar title="Revenue & Plans" sub="Subscription analytics and payment history" defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 flex flex-col gap-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Monthly Revenue" value={`₹${(totalRev/100000).toFixed(2)}L`} sub="All active subscriptions" gold />
          <StatCard label="Total Subscribers"      value={totalSubs}  sub={`Across ${PLANS.length} plans`} />
          <StatCard label="Avg. Revenue / Subscriber" value={`₹${Math.round(totalRev/totalSubs)}`} sub="ARPU this month" />
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[20px] font-bold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.name}</p>
                  <p className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-display)', color: i === 1 ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                    ₹{plan.price}<span className="text-[16px] font-normal text-[#7a7468]">/mo</span>
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-[16px] font-medium transition-colors hover:bg-[#f5f2ed]"
                  style={{ border: '1px solid #d6d0c8', color: '#7a7468' }}>Edit Plan</button>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#d8f3dc' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <p className="text-[16px]" style={{ color: '#7a7468' }}>{f}</p>
                  </div>
                ))}
              </div>
              <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #ede9e3' }}>
                <div>
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: '#7a7468' }}>Subscribers</p>
                  <p className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{plan.subscribers}</p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: '#7a7468' }}>Monthly</p>
                  <p className="text-[16px] font-bold" style={{ color: 'var(--color-primary)' }}>₹{plan.revenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Payments */}
        <Card>
          <div className="px-5 py-4" style={{ borderBottom: '2px solid #001654' }}>
            <h2 className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>Recent Payments</h2>
          </div>
          <div className="px-5 py-3 grid text-[15px] font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns: '1fr 100px 120px 90px 80px', borderBottom: '2px solid #001654', color: '#00195f' }}>
            <span>Patient</span><span>Plan</span><span>Amount</span><span>Date</span><span>Gateway</span>
          </div>
          {RECENT_PAYMENTS.map((p, i) => (
            <div key={i} className="px-5 py-3.5 grid items-center gap-3 transition-colors hover:bg-[#f5f2ed]"
              style={{ gridTemplateColumns: '1fr 100px 90px 90px 80px', borderBottom: i < RECENT_PAYMENTS.length - 1 ? '1px solid #00258c' : 'none' }}>
              <span className="text-[15px] font-medium" style={{ color: '#1b2d20' }}>{p.patient}</span>
              <Badge label={p.plan} variant={p.plan === 'Pro' ? 'accent' : p.plan === 'Clinic' ? 'gold' : 'default'} />
              <span className="text-[15px] font-semibold" style={{ color: '#1b2d20' }}>₹{p.amount}</span>
              <span className="text-[15px]" style={{ color: '#7a7468' }}>{p.date}</span>
              <Badge label={p.gateway} variant="success" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}