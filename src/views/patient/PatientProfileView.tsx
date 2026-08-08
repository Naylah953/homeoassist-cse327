import React, { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'

// ── Profile ─────────────────────────────────────────────────────────────────

interface Props {
  profile: any
  onSave: (updated: any) => void
  onProfileClick?: () => void
}

export function PatientProfileView({ profile, onSave, onProfileClick }: Props) {
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <TopBar 
        title="My Profile & Settings" 
        sub="Manage your personal details and account settings" 
        onProfileClick={onProfileClick} 
        profile={profile}
        avatarBg="var(--color-accent)"
        defaultInitials="RH"
      />
      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
        <Card className="p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#ede9e3]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: 'var(--color-accent)', color: 'white' }}>
                {form.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: '#1b2d20', fontFamily: 'var(--font-display)' }}>{form.name}</h2>
                <p className="text-xs" style={{ color: '#7a7468' }}>{form.patientId} · Pro Plan Member</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Date of Birth</label>
                <input
                  type="text"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Blood Group</label>
                <input
                  type="text"
                  value={form.bloodGroup}
                  onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a7468' }}>Known Allergies & Conditions</label>
              <textarea
                rows={3}
                value={form.allergies}
                onChange={e => setForm({ ...form, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm border border-[#d6d0c8] outline-none bg-[#f5f2ed] border resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)' }}>
                Save Profile
              </button>
              {saved && <span className="text-xs text-green-700 font-medium">✓ Profile updated successfully!</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}