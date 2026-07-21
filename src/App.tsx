import { useState } from 'react';
import Home from './Homepage';
import Dashboard from './Doc_Dashboard';

export default function App() {
  // 1. Set default state to false (so users see the Homepage first)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Simple handler functions to switch screens
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        <div>
          {/* Top banner to easily test logging back out */}
          <div className="bg-[#13241C] text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>Logged in as: <strong>Dr. Priya (NSU Chamber)</strong></span>
            <button 
              onClick={handleLogout}
              className="underline hover:text-red-300 transition-colors cursor-pointer"
            >
              Logout to Homepage
            </button>
          </div>

          {/* Render the Doctor Dashboard */}
          <Dashboard />
        </div>
      ) : (
        /* Render the Homepage and pass the login trigger to your CTA/Login button */
        <Home onLogin={handleLogin} />
      )}
    </div>
  );
}

