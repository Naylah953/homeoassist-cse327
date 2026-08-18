import { useState } from 'react';
import { AuthService } from '../../services/AuthService';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: (role: 'doctor' | 'patient' | 'admin') => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [role, setRole] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const authService = AuthService.getInstance(); // Access Singleton Instance

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (role === 'doctor') {
        await authService.loginDoctor(identifier, password);
      } else if (role === 'patient') {
        await authService.loginPatient(identifier, password);
      } else {
        await authService.loginAdmin(identifier, password);
      }

      alert(`Successfully logged in as ${role}!`);
      if (onLoginSuccess) onLoginSuccess(role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF8F5] rounded-3xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 font-bold">✕</button>
        <h2 className="text-3xl font-serif text-[#1c352d] font-bold">Welcome Back</h2>
        <p className="text-gray-500 mb-4 text-sm">Select your role to access your portal.</p>

        {/* Display Error Message if Login Fails */}
        {error && (
          <div className="mb-4 p-2.5 bg-red-100 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* 3-Way Role Switcher */}
        <div className="flex bg-[#EFECE6] p-1 rounded-2xl mb-6">
          {(['doctor', 'patient', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition ${
                role === r ? 'bg-[#235d48] text-white shadow' : 'text-gray-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {role === 'doctor' ? 'Email or Phone' : role === 'patient' ? 'Phone Number' : 'Admin Email'}
            </label>
            <input
              required
              className="w-full p-3 border rounded-xl text-sm"
              placeholder={role === 'admin' ? 'admin@homeo.com' : 'Enter login ID'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-xl text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full py-3 bg-[#235d48] text-white rounded-xl font-semibold text-sm hover:bg-[#1a4737] transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}