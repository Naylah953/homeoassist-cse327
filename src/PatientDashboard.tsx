import { useState } from 'react'
import { SupportBot } from './Chatbots/SupportBot'

// Types & Icons
import { PView } from './types'
import { IC } from './components/ui/Ico'
import { Sidebar, NavItem } from './components/layout/Sidebar'

// Sub-views from patient directory
import { PatientDashboardView } from './views/patient/PatientDashboardView'
import { AIChatView } from './views/patient/AIChatView'
import { FindDoctorsView } from './views/patient/FindDoctorsView'
import { AppointmentsView } from './views/patient/AppointmentsView'
import { RecordsView } from './views/patient/RecordsView'
import { EmergencyView } from './views/patient/EmergencyView'
import { PatientProfileView } from './views/patient/PatientProfileView'

// ── Sidebar ───────────────────────────────────────────────────────────────────

function PatientSidebar({ active, onChange, profile, onLogout, }: { active: PView, onChange: (v: PView) => void, profile: any, onLogout: () => void }) {
  const navItems: NavItem<PView>[] = [
    { id: 'dashboard',    label: 'Dashboard',       icon: IC.grid },
    { id: 'chat',         label: 'AI Symptom Chat', icon: IC.chat },
    { id: 'doctors',      label: 'Find Doctors',    icon: IC.search },
    { id: 'appointments', label: 'Appointments',    icon: IC.calendar },
    { id: 'records',      label: 'Prescriptions',   icon: IC.file },
    { id: 'emergency',    label: 'Emergency SOS',   icon: IC.zap, isEmergency: true },
  ]

  return (
    <Sidebar
      portalLabel="Patient Portal"
      navItems={navItems}
      active={active}
      onChange={onChange}
      onLogout={onLogout}
      onProfileClick={() => onChange('profile')}
      profile={{
        name: profile.name,
        subtext: profile.patientId,
      }}
    />
  )
}

// ── Patient App ───────────────────────────────────────────────────────────────

export default function Patient_Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<PView>('dashboard')

  const [patientProfile, setPatientProfile] = useState({
    name: 'Raisa Hossain',
    patientId: 'Patient #P-00124',
    email: 'raisa.hossain@example.com',
    phone: '+880 1812-987654',
    dob: '14 Nov 1996',
    bloodGroup: 'B+',
    address: 'Dhaka, Bangladesh',
    allergies: 'Dust allergy, seasonal rhinitis',
  })

  const openProfile = () => setView('profile')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      window.location.href = '/'
    }
  }

  const views: Record<PView, React.ReactNode> = {
    dashboard: ( <PatientDashboardView goTo={setView} onProfileClick={openProfile} profile={patientProfile} /> ),
    chat: ( <AIChatView goTo={setView} onProfileClick={openProfile} profile={patientProfile} /> ),
    doctors: ( <FindDoctorsView onProfileClick={openProfile} profile={patientProfile} /> ),
    appointments: ( <AppointmentsView onProfileClick={openProfile} profile={patientProfile} /> ),
    records: ( <RecordsView onProfileClick={openProfile} profile={patientProfile} /> ),
    emergency: ( <EmergencyView onProfileClick={openProfile} profile={patientProfile} /> ),
    profile: ( <PatientProfileView profile={patientProfile} onSave={setPatientProfile} onProfileClick={openProfile} /> ),
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f2ed' }}>
      <PatientSidebar
        active={view}
        onChange={setView}
        profile={patientProfile}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {views[view]}
        </div>
      </main>
      {/* Floating Support Bot */}
      <SupportBot role="patient" userName={patientProfile.name} />
    </div>
  )
}