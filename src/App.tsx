import Homepage from './views/Homepage';
import DocDashboard from './views/DocDashboard';
import PatientDashboard from './views/PatientDashboard';
import AdminDashboard from './views/AdminDashboard';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { role, user, logout } = useAuth();

  const displayName =
    role === 'doctor'  ? `Dr. ${(user?.name as string) ?? 'Doctor'}`     :
    role === 'patient' ? ((user?.name as string) ?? 'Patient')            :
    role === 'admin'   ? ((user?.username as string) ?? 'Admin')          :
    '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {role === 'home' && <Homepage />}

      {role === 'doctor' && (
        <div>
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>{displayName}</strong></span>
            <button onClick={logout} className="underline hover:text-red-300 transition-colors">
              Logout
            </button>
          </div>
          <DocDashboard />
        </div>
      )}

      {role === 'patient' && (
        <div>
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>{displayName}</strong></span>
            <button onClick={logout} className="underline hover:text-red-300 transition-colors">
              Logout
            </button>
          </div>
          <PatientDashboard />
        </div>
      )}

      {role === 'admin' && (
        <div>
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>{displayName}</strong></span>
            <button onClick={logout} className="underline hover:text-red-300 transition-colors">
              Logout
            </button>
          </div>
          <AdminDashboard />
        </div>
      )}
    </div>
  );
}
