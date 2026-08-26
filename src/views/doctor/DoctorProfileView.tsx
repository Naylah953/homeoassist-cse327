import React, { useState } from 'react'
import { TopBar } from '../../components/layout/Topbar'
import { Card } from '../../components/ui/Card'

// ── Profile ─────────────────────────────────────────────────────────────────

interface Props {
  profile: any
  onSave: (updated: any) => void
  onProfileClick?: () => void
}

export function DoctorProfileView({ profile, onSave, onProfileClick }: Props) {
  const getInitials = (name?: string) => {
    if (!name) return 'AR'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }
  const [formData, setFormData] = useState(profile)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div>
      <TopBar title="Doctor Profile & Settings" sub="Manage details visible to patients in Find Doctor directory" onProfileClick={onProfileClick} avatarBg="var(--color-primary)" defaultInitials="AR" />
      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Top Header Card */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
              {getInitials(formData.name)}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{formData.name}</h2>
              <p className="text-xs" style={{ color: '#7a7468' }}>{formData.specialty} · {formData.registrationNo}</p>
            </div>
          </div>
          {savedSuccess && (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              ✓ Profile Saved & Live for Patients
            </span>
          )}
        </Card>

        {/* Profile Settings Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold border-b pb-3" style={{ borderBottomColor: '#ede9e3', fontFamily: 'var(--font-display)' }}>
              Public Directory Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Full Name & Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                >
                  <option value="Allergies & Respiratory">Allergies & Respiratory</option>
                  <option value="Digestive & IBS">Digestive & IBS</option>
                  <option value="Women's Health">Women's Health</option>
                  <option value="Skin & Dermatology">Skin & Dermatology</option>
                  <option value="Paediatrics">Paediatrics</option>
                  <option value="Joint & Arthritis">Joint & Arthritis</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Qualifications / Merits</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Registration No.</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={e => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={e => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7a7468] uppercase tracking-wider mb-1">Doctor Biography & Merits</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none bg-[#f5f2ed] border border-[#d6d0c8] focus:border-[#2d6a4f]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderTopColor: '#ede9e3' }}>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1b2d20]">
                <input
                  type="checkbox"
                  checked={formData.availableForBooking}
                  onChange={e => setFormData({ ...formData, availableForBooking: e.target.checked })}
                  className="rounded accent-[#2d6a4f]"
                />
                Show profile in "Find Doctor" panel for patient appointments
              </label>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  )
}