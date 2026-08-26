import Homepage from './views/Homepage';
import DocDashboard from './views/DocDashboard';
import PatientDashboard from './views/PatientDashboard';
import AdminDashboard from './views/AdminDashboard';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {role === 'home' && <Homepage />}

      {role === 'doctor' && <DocDashboard onLogout={logout} />}

      {role === 'patient' && <PatientDashboard onLogout={logout} />}
      
      {role === 'admin' && <AdminDashboard onLogout={logout} />}

    </div>
  );
}
