import { useState } from 'react';
import { AuthService } from '../../services/AuthService';

export default function RegisterModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
  const [formData, setFormData] = useState<any>({});

  const authService = AuthService.getInstance(); // Access Singleton Instance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'doctor') {
      await authService.registerDoctor(formData);
      alert('Doctor registration submitted for admin review!');
    } else {
      await authService.registerPatient(formData);
      alert('Patient account created successfully!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm p-8 max-w-lg w-full relative max-h-[95vh] shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400">✕</button>
        <h2 className="text-3xl font-serif text-[#1c352d] font-bold">Create Account</h2>
        <p className="text-gray-500 mb-6">Select your role to get started with HomeoAssist.</p>

        {/* Role Toggle Tabs */}
        <div className="flex bg-[#EFECE6] p-1 rounded-2xl mb-6">
          <button
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${role === 'doctor' ? 'bg-white text-[#1c352d] shadow-sm' : 'text-gray-600'}`}
          >
            🩺 Doctor Registration
          </button>
          <button
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${role === 'patient' ? 'bg-white text-[#1c352d] shadow-sm' : 'text-gray-600'}`}
          >
            👤 Patient Registration
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'doctor' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="Dr. Anika Rahman" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Medical Council Reg. ID</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="#HOM-4821" onChange={(e) => setFormData({ ...formData, regId: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="priya.sharma@clinic.org" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="+880 17XXXXXXXX" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Clinic/Chamber Address</label>
                <input className="w-full p-3 border rounded-xl" placeholder="Dhaka, Bangladesh" onChange={(e) => setFormData({ ...formData, chamberAddress: e.target.value })} />
              </div>             
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="John Doe" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="+880 17XXXXXXXX" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                  <input className="w-full p-3 border rounded-xl" placeholder="28" onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                  <select className="w-full p-3 border rounded-xl bg-white" onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </>
          )}
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Create Password</label>
            <input type="password" className="w-full p-3 border rounded-xl" placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div> 

          <button type="submit" className="w-full py-3 bg-[#235d48] text-white rounded-xl font-semibold">
            {role === 'doctor' ? 'Submit Registration For Admin Review' : 'Create Patient Account'}
          </button>
        </form>
      </div>
    </div>
  );
}