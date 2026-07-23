// main.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Homepage';
import DocDashboard from './Doc_Dashboard';
import PatientDashboard from './Patient_Dashboard';
//import AdminApp from './AdminApp';
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
            <span>Logged in as: <strong>Dr. Priya (NSU Chamber)</strong></span>
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
            <span>Logged in as: <strong>Anjali Mehta</strong></span>
            <button onClick={handleLogout} className="underline hover:text-red-300 transition-colors">
              Logout to Homepage
            </button>
          </div>
          <PatientDashboard />
        </div>
      )}
{/* 
      {currentRole === 'admin' && (
        <div>
          <button onClick={handleLogout} className="p-2 bg-red-600 text-white text-xs">Logout</button>
          <AdminApp />
        </div>
      )} */}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);