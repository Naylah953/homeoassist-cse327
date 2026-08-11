import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EMERGENCY_CALLS } from '../../data/doctorMockData'

// ── Emergency ─────────────────────────────────────────────────────────────────

interface Props {
  onProfileClick?: () => void
}

export function EmergencyView({ onProfileClick }: Props) {
  return (
    <div>
      <TopBar title="Emergency Call Routing" sub="AI-powered triage and automatic doctor routing" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
          style={{ background: '#fff1f2', border: '1px solid #fca5a5' }}>
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.25)', animation: 'pulse 2s infinite' }} />
          <p className="text-[16px] font-medium" style={{ color: '#b91c1c' }}>1 active emergency in routing — EC-004 (Iram Ahmed, severe chest tightness)</p>
          <button className="ml-auto text-[15px] font-semibold transition-colors hover:opacity-80" style={{ color: '#b91c1c' }}>Take Call →</button>
        </div>

        {/* Doctor availability */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Dr. Anika Rahman', reg: '#HOM-4821', status: 'busy',      calls: 2 },
            { name: 'Dr. Rahim Uddin',   reg: '#HOM-3614', status: 'connected', calls: 1 },
            { name: 'Dr. Reema Chowdhury',   reg: '#HOM-5027', status: 'available', calls: 0 },
          ].map((doc, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold flex-shrink-0"
                  style={{ background: '#d8f3dc', color: 'var(--color-primary)' }}>
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[18px] font-medium" style={{ color: '#1b2d20' }}>{doc.name}</p>
                  <p className="text-[14px]" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{doc.reg}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge label={doc.status === 'available' ? 'Available' : doc.status === 'connected' ? 'On Call' : 'Busy'}
                  variant={doc.status === 'available' ? 'success' : doc.status === 'connected' ? 'accent' : 'danger'} />
                <span className="text-[14px]" style={{ color: '#7a7468' }}>{doc.calls} call{doc.calls !== 1 ? 's' : ''}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Call log */}
        <Card>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #d6d0c8' }}>
            <h2 className="text-[25px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>Call Queue — Today</h2>
            <Badge label={`${EMERGENCY_CALLS.length} calls`} />
          </div>
          {EMERGENCY_CALLS.map((call, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 transition-colors hover:bg-[#f5f2ed]"
              style={{ borderBottom: i < EMERGENCY_CALLS.length - 1 ? '1px solid #ede9e3' : 'none' }}>
              <span className="text-[15px] font-bold px-2 py-1 rounded flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', background: '#ede9e3', color: 'rgb(208, 147, 25)' }}>{call.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-medium" style={{ color: '#1b2d20' }}>{call.patient}</p>
                <p className="text-[16px]" style={{ color: '#7a7468' }}>{call.symptom}</p>
              </div>
              <p className="text-[14px] flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#7a7468' }}>{call.time}</p>
              <Badge label={call.priority === 'high' ? 'High' : call.priority === 'medium' ? 'Medium' : 'Low'}
                variant={call.priority === 'high' ? 'danger' : call.priority === 'medium' ? 'warning' : 'success'} />
              <Badge label={call.status === 'routing' ? 'Routing…' : call.status === 'connected' ? 'Connected' : 'Resolved'}
                variant={call.status === 'routing' ? 'accent' : call.status === 'connected' ? 'new' : 'success'} />
              <span className="text-[16px] hidden lg:block flex-shrink-0" style={{ color: '#3c382f' }}>→ {call.doctor}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}