import { useState } from 'react'
import { AView } from '../types'
import { IC } from '../components/ui/Ico'
import { Sidebar, NavItem } from '../components/layout/Sidebar'

// Views
import { AdminDashboardView } from './admin/AdminDashboardView'
import { DoctorManagementView } from './admin/DoctorManagementView'
import { PatientManagementView } from './admin/PatientManagementView'
import { ComplaintsView } from './admin/ComplaintsView'
import { RevenueView } from './admin/RevenueView'
import { SettingsView } from './admin/SettingsView'

import { COMPLAINTS, PENDING_DOCTORS } from '../data/adminMockData'

// ── Admin App ───────────────────────────────────────────────────────────────────

export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<AView>('dashboard')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Fallback redirect if no custom handler is passed
      window.location.href = '/'
    }
  }

  // Badge calculations for sidebar
  const openCount = COMPLAINTS.filter(c => c.status === 'open').length
  const pendingCount = PENDING_DOCTORS.length

// ── Sidebar ───────────────────────────────────────────────────────────────────

  const navItems: NavItem<AView>[] = [
    { id: 'dashboard',  label: 'Dashboard',             icon: IC.grid },
    { id: 'doctors',    label: 'Doctor Management',     icon: IC.shield, badge: pendingCount, badgeColor: '#c0392b' },
    { id: 'patients',   label: 'Patient Management',    icon: IC.users },
    { id: 'complaints', label: 'Complaints & Feedback', icon: IC.flag,   badge: openCount,    badgeColor: '#c9913d' },
    { id: 'revenue',    label: 'Revenue & Plans',       icon: IC.coin },
    { id: 'settings',   label: 'System Settings',       icon: IC.settings },
  ]

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#f5f2ed',
      }}
    >
      {/* Shared generic Sidebar configured for Admin */}
      <Sidebar
        portalLabel="Admin Console"
        navItems={navItems}
        active={view}
        onChange={setView}
        onLogout={handleLogout}
        profile={{
          name: 'Super Admin',
          subtext: 'admin@homeoassist.in',
          initials: 'SA',
        }}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {view === 'dashboard' && <AdminDashboardView goTo={setView} />}
          {view === 'doctors' && <DoctorManagementView />}
          {view === 'patients' && <PatientManagementView />}
          {view === 'complaints' && <ComplaintsView />}
          {view === 'revenue' && <RevenueView />}
          {view === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  )
}