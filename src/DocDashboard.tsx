import React, { useState } from 'react'
import { DView } from './types'
import { IC } from './components/ui/Ico'
import { Sidebar, NavItem } from './components/layout/Sidebar'
import { SupportBot } from './Chatbots/SupportBot'

// Views
import { DocDashboardView } from './views/doctor/DocDashboardView'
import { AIChatView } from './views/doctor/AIChatView'
import { MedicineFinderView } from './views/doctor/MedicineFinderView'
import { PatientsView } from './views/doctor/PatientsView'
import { PrescriptionsView } from './views/doctor/PrescriptionsView'
import { EmergencyView } from './views/doctor/EmergencyView'
import { DoctorProfileView } from './views/doctor/DoctorProfileView'

// ── Doctor App ───────────────────────────────────────────────────────────────────

interface DocDashboardProps {
  onLogout?: () => void
}

export default function DocDashboard({ onLogout }: DocDashboardProps) {
  const [view, setView] = useState<DView>('dashboard')

  // Editable doctor profile state
  const [doctorProfile, setDoctorProfile] = useState({
    name: 'Dr. Anika Rahman',
    specialty: 'Allergies & Respiratory',
    qualifications: 'MD Homeopathy (BHMS, Gold Medalist)',
    registrationNo: '#HOM-4821',
    experienceYears: 12,
    consultationFee: 800,
    email: 'dr.anika@homeoassist.com',
    phone: '+880 1712-345678',
    bio: 'Specialist in chronic respiratory conditions, severe allergic sinusitis, and constitutional homeopathic care with over 12 years of clinical practice.',
    availableForBooking: true,
  })

  const openProfile = () => setView('profile')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      window.location.href = '/'
    }
  }

// ── Sidebar ───────────────────────────────────────────────────────────────────

  const navItems: NavItem<DView>[] = [
    { id: 'dashboard',      label: 'Dashboard',       icon: IC.grid },
    { id: 'chat',           label: 'AI Symptom Chat', icon: IC.chat },
    { id: 'medicines',      label: 'Medicine Finder', icon: IC.pill },
    { id: 'patients',       label: 'Patients',        icon: IC.users },
    { id: 'prescriptions',  label: 'Prescriptions',   icon: IC.file },
    { id: 'emergency',      label: 'Emergency',       icon: IC.phone, badge: 1, badgeColor: '#c0392b' },
  ]

  const views: Record<DView, React.ReactNode> = {
    dashboard: <DocDashboardView onProfileClick={openProfile} />,
    chat: <AIChatView onProfileClick={openProfile} />,
    medicines: <MedicineFinderView onProfileClick={openProfile} />,
    patients: <PatientsView onProfileClick={openProfile} />,
    prescriptions: <PrescriptionsView onProfileClick={openProfile} />,
    emergency: <EmergencyView onProfileClick={openProfile} />,
    profile: ( <DoctorProfileView profile={doctorProfile} onSave={setDoctorProfile} onProfileClick={openProfile} /> ),
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#f5f2ed',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        portalLabel="Clinical Platform"
        navItems={navItems}
        active={view}
        onChange={setView}
        onLogout={handleLogout}
        onProfileClick={openProfile}
        profile={{
          name: doctorProfile.name,
          subtext: `${doctorProfile.qualifications.split('(')[0]} · ${
            doctorProfile.registrationNo
          }`,
        }}
      />

      {/* Main View Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto' }}>{views[view]}</div>
      </main>

      {/* Floating Support Bot */}
      <SupportBot role="doctor" userName={doctorProfile.name} />
    </div>
  )
}

