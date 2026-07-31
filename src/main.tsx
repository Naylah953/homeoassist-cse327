// main.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Homepage';
import DocDashboard from './DocDashboard';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';
import './index.css';

type UserRole = 'home' | 'doctor' | 'patient' | 'admin';

function Main() {
  const [currentRole, setCurrentRole] = useState<UserRole>('home');

  const handleLogin = (role: 'doctor' | 'patient' | 'admin') => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole('home');
  };

  return (
    <React.StrictMode>
      {currentRole === 'home' && <Home onLogin={handleLogin} />}

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
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);