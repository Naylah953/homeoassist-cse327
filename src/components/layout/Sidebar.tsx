import { Ico, IC } from "../ui/Ico"

export interface NavItem<T extends string = string> {
  id: T
  label: string
  icon: string[]
  badge?: number | string
  badgeColor?: string
  isEmergency?: boolean
}

interface SidebarProps<T extends string> {
  portalLabel: string
  navItems: NavItem<T>[]
  active: T
  onChange: (view: T) => void
  onLogout?: () => void
  onProfileClick?: () => void
  profile?: {
    name?: string
    subtext?: string // e.g. "admin@homeoassist.in" or "BHMS · #HOM-4821" or "PAT-9821"
    initials?: string
  }
}

export function Sidebar<T extends string>({
  portalLabel,
  navItems,
  active,
  onChange,
  onLogout,
  onProfileClick,
  profile,
}: SidebarProps<T>) {
  const getInitials = (name?: string) => {
    if (!name) return 'SA'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const initials = profile?.initials || getInitials(profile?.name)
  const displayName = profile?.name || 'Super Admin'
  const displaySubtext = profile?.subtext || 'admin@homeoassist.in'

  return (
    <aside style={{ width: 240, background: '#131f16', flexShrink: 0 }} className="flex flex-col h-full">
      {/* Brand / Logo Header */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {IC.logo.map((p, i) => <path key={i} d={p} />)}
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e0ebe2', letterSpacing: '0.01em', fontFamily: 'var(--font-display)' }}>
              HomeoAssist
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(224,235,226,0.4)' }}>
              {portalLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = active === item.id
          const isEmergency = item.isEmergency

          // Custom styling for active vs inactive vs emergency states
          let bgColor = 'transparent'
          let textColor = 'rgba(224,235,226,0.65)'

          if (isActive) {
            bgColor = isEmergency ? '#c0392b' : 'var(--color-primary)'
            textColor = '#f0ede8'
          } else if (isEmergency) {
            textColor = 'rgba(239,132,132,0.85)'
          }

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full text-left transition-all duration-150 relative"
              style={{
                background: bgColor,
                color: textColor,
                fontWeight: isActive ? 500 : 400,
              }}>
              <span style={{ opacity: isActive ? 1 : 0.65 }}>
                <Ico d={item.icon} size={15} />
              </span>
              {item.label}

              {/* Dynamic Badge */}
              {item.badge !== undefined && item.badge !== 0 && (
                <span
                  className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: item.badgeColor || '#c0392b',
                    color: 'white',
                    lineHeight: 1.4,
                  }}>
                  {item.badge}
                </span>
              )}

              {/* Emergency Inactive Dot Indicator */}
              {isEmergency && !isActive && !item.badge && (
                <span
                  className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.6)' }} /> )}
            </button>
          )
        })}
      </nav>

      {/* Profile & Sign Out Footer */}
      <div className="p-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Profile Card */}
        <button
          onClick={onProfileClick}
          disabled={!onProfileClick}
          className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
            onProfileClick ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'
          }`} >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary)', color: '#f0ede8' }} >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate" style={{ color: '#e0ebe2' }}>
              {displayName}
            </p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(224,235,226,0.38)' }}>
              {displaySubtext}
            </p>
          </div>
        </button>

        {/* Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 text-[12px] font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition border border-red-500/20" >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        )}
      </div>
    </aside>
  )
}