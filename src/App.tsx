import { useState } from 'react';
import Homepage from './views/Homepage';
import DocDashboard from './views/DocDashboard';
import PatientDashboard from './views/PatientDashboard';
import AdminDashboard from './views/AdminDashboard';

export type UserRole = 'home' | 'doctor' | 'patient' | 'admin';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('home');

  const handleLogin = (role: 'doctor' | 'patient' | 'admin') => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {currentRole === 'home' && ( <Homepage onLogin={handleLogin} /> )}

      {currentRole === 'doctor' && (
        <div>
          {/* Top Banner with Logout */}
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>Dr. Anika Rahman (NSU Chamber)</strong></span>
            <button onClick={handleLogout} className="underline hover:text-red-300 transition-colors">
              Logout to Homepage
            </button>
          </div>
          <DocDashboard />
        </div>
      )}

      {currentRole === 'patient' && (
        <div>
          {/* Top Banner with Logout */}
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>Raisa Hossain</strong></span>
            <button onClick={handleLogout} className="underline hover:text-red-300 transition-colors">
              Logout to Homepage
            </button>
          </div>
          <PatientDashboard />
        </div>
      )}

      {currentRole === 'admin' && (
        <div>
          {/* Top Banner with Logout */}
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>Admin</strong></span>
            <button onClick={handleLogout} className="underline hover:text-red-300 transition-colors">
              Logout to Homepage
            </button>
          </div>
          <AdminDashboard />
        </div>
      )}
    </div>
  );
}


