import { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'
import { Ico, IC } from '../../components/ui/Ico'

// ── Settings ──────────────────────────────────────────────────────────────────

export function SettingsView() {
  const [toggles, setToggles] = useState({
    aiChat: true,
    aiEmergency: true, 
    aiCDSS: true,
    emailNotifs: true, 
    smsNotifs: false, 
    inAppNotifs: true,
    maintenanceMode: false, 
    newRegistrations: true, 
    onlinePayments: true,
  })

  const toggle = (key: keyof typeof toggles) => setToggles(t => ({ ...t, [key]: !t[key] }))

  const Toggle = ({ k, label, desc }: { k: keyof typeof toggles; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #ede9e3' }}>
      <div>
        <p className="text-[13px] font-medium" style={{ color: '#1b2d20' }}>{label}</p>
        <p className="text-[11px]" style={{ color: '#7a7468' }}>{desc}</p>
      </div>
      <button onClick={() => toggle(k)}
        className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative"
        style={{ background: toggles[k] ? 'var(--color-primary)' : '#d6d0c8' }}>
        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
          style={{ left: toggles[k] ? 'calc(100% - 22px)' : '2px' }} />
      </button>
    </div>
  )

  return (
    <div>
      <TopBar title="System Settings" sub="Platform-wide configuration — admin only" defaultInitials="SA" avatarBg="#b4654a" />
      <div className="p-8 grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* AI Features */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>AI Features</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Control AI-powered modules platform-wide</p>
          <Toggle k="aiChat"      label="AI Symptom Chat"          desc="Patient-facing AI chat assistant before consultations" />
          <Toggle k="aiEmergency" label="AI Emergency Routing"     desc="Automatic triage and doctor routing for SOS calls" />
          <Toggle k="aiCDSS"      label="Clinical Decision Support" desc="Medicine recommendations for doctors (CDSS)" />
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Delivery channels for alerts and reminders</p>
          <Toggle k="emailNotifs"  label="Email Notifications"  desc="Appointment confirmations, receipts, reminders" />
          <Toggle k="smsNotifs"    label="SMS Notifications"    desc="OTP, emergency alerts, appointment reminders" />
          <Toggle k="inAppNotifs"  label="In-App Notifications" desc="Dashboard alerts and real-time updates" />
        </Card>

        {/* Platform Controls */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Platform Controls</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Core platform availability settings</p>
          <Toggle k="newRegistrations" label="New Registrations"   desc="Allow new doctors and patients to register" />
          <Toggle k="onlinePayments"   label="Online Payments"     desc="Enable UPI, card and net banking payments" />
          <Toggle k="maintenanceMode"  label="Maintenance Mode"    desc="Take platform offline for scheduled updates" />
        </Card>

        {/* Data Export */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Data & Exports</h2>
          <p className="text-[11px] mb-4" style={{ color: '#7a7468' }}>Download platform reports and backups</p>
          <div className="flex flex-col gap-2">
            {[
              'All Doctor Registrations (CSV)',
              'All Patient Records (CSV)',
              'Complaint & Feedback Log (CSV)',
              'Revenue Report — July 2025 (PDF)',
              'Emergency Call Logs — July 2025 (CSV)',
              'Prescription Audit Log (CSV)',
            ].map((item, i) => (
              <button key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-medium w-full text-left transition-colors hover:bg-[#f5f2ed]"
                style={{ border: '1px solid #d6d0c8', color: '#1b2d20' }}>
                <span style={{ color: 'var(--color-primary)' }}><Ico d={IC.download} size={13} /></span>
                {item}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}