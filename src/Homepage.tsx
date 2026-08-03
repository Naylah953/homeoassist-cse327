import { useState } from 'react';
import { HeartPulse, Stethoscope, ShieldCheck } from 'lucide-react';
import { HomeBot } from './Chatbots/HomeBot';

interface HomeProps {
  onLogin?: (role: 'doctor' | 'patient' | 'admin') => void;
}

export default function Home({ onLogin }: HomeProps) {
  // Modal state management: 'login' | 'register' | null
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);

  // Role toggles for modals
  const [loginRole, setLoginRole] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [registerRole, setRegisterRole] = useState<'doctor' | 'patient'>('doctor');

  const openLogin = (role: 'doctor' | 'patient' | 'admin' = 'doctor') => {
    setLoginRole(role);
    setActiveModal('login');
  };

  const openRegister = (role: 'doctor' | 'patient' = 'doctor') => {
    setRegisterRole(role);
    setActiveModal('register');
  };

  const closeModal = () => setActiveModal(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    if (onLogin) onLogin(loginRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    if (onLogin) onLogin(registerRole);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-900/10 py-3.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-[#112219] flex items-center gap-2 font-serif">
            <span className="bg-[#235B43] text-white px-2.5 py-1.5 rounded-lg text-sm inline-flex items-center">
              <i className="bi bi-layers-half"></i>
            </span>
            HomeoAssist
          </a>
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden md:block text-slate-800 hover:text-[#235B43] font-medium text-sm mr-2">
              Features
            </a>
            <a href="#how-it-works" className="hidden md:block text-slate-800 hover:text-[#235B43] font-medium text-sm mr-4">
              How it works
            </a>
            <button
              onClick={() => openLogin('doctor')}
              className="px-5 py-1.5 border border-[#112219] text-[#112219] rounded-md font-medium text-sm hover:bg-[#112219]/5 transition"
            >
              Log in
            </button>
            <button
              onClick={() => openRegister('doctor')}
              className="px-5 py-1.5 bg-[#235B43] text-white rounded-md font-medium text-sm hover:bg-[#112219] transition"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header
        className="relative py-36 px-4 text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(19, 36, 28, 0.88), rgba(19, 36, 28, 0.88)), url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80')`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/12 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium mb-6 tracking-wide">
            📍 NORTH SOUTH UNIVERSITY • DHAKA, BANGLADESH
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 font-serif leading-tight">
            Smart Connection,<br />
            <span className="text-[#52C48E]"> Faster Healing</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-200 text-base mb-9 leading-relaxed opacity-90">
            HomeoAssist connects clinical homeopaths with advanced diagnostic AI architecture, providing automated client triage pipelines and multi-doctor emergency calling systems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => openRegister('patient')}
              className="px-8 py-3 bg-[#235B43] text-white rounded-lg font-medium text-sm hover:bg-[#112219] transition"
            >
              Get started — it's free
            </button>
            <button
              onClick={() => openLogin('doctor')}
              className="px-8 py-3 bg-transparent text-white rounded-lg font-medium text-sm border border-white/60 hover:border-white hover:bg-white/10 transition"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="border-b border-slate-900/10 py-8 bg-[#F9FBF9] text-center">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <div className="text-3xl font-bold text-[#235B43]">3</div>
            <div className="text-xs font-medium text-slate-500 mt-1">User Roles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#235B43]">AI</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Chatbot Assistant</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#235B43]">SOS</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Emergency Alerts</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#235B43]">QR</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Verified Records</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-[#235B43]">100%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Doctor Control</div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-4">
        <div className=" max-w-6xl mx-auto">
          <span className="text-[#235B43] font-bold text-xs uppercase tracking-wider block mb-1">Platform Features</span>
          <h2 className="text-4xl font-bold text-[#112219] font-serif mb-3">Everything you need for safe practice</h2>
          <p className="text-slate-500 text-sm max-w-lg mb-12">
            From intelligent intake to instant emergency routing, every process supports absolute medical safety.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#F9FBF9] p-8 rounded-2xl border border-slate-900/5">
              <div className="w-12 h-12 bg-[#EAF7F0] rounded-xl flex items-center justify-center text-[#235B43] text-xl mb-5">
                <i className="bi bi-chat-dots-fill"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Symptom Chat</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Collects case records via patient conversational language summaries prior to formal clinic entry.
              </p>
            </div>

            <div className="bg-[#F9FBF9] p-8 rounded-2xl border border-slate-900/5">
              <div className="w-12 h-12 bg-[#EAF7F0] rounded-xl flex items-center justify-center text-[#235B43] text-xl mb-5">
                <i className="bi bi-search"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Intelligent CDSS</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Calculates remedy probability matching scores built upon historical repertory diagnostics safely.
              </p>
            </div>

            <div className="bg-[#F9FBF9] p-8 rounded-2xl border border-slate-900/5">
              <div className="w-12 h-12 bg-[#EAF7F0] rounded-xl flex items-center justify-center text-[#235B43] text-xl mb-5">
                <i className="bi bi-telephone-plus-fill"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency Routing</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Automated triage protocols dispatch critical patient calls to fallback doctors instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-4 bg-[#F8F7F3]">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#235B43] font-bold text-xs uppercase tracking-wider block mb-1">How It Works</span>
          <h2 className="text-4xl font-bold text-[#112219] font-serif mb-12">Care mapping in 4 simple steps</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="w-9 h-9 bg-[#235B43] text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">1</div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">Create an account</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Register as a practitioner or patient. Providers securely submit credential parameters.</p>
            </div>
            <div>
              <div className="w-9 h-9 bg-[#235B43] text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">2</div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">Log Symptoms</h3>
              <p className="text-slate-500 text-xs leading-relaxed">The automated patient assistant converts structural logs into clinic-ready charts.</p>
            </div>
            <div>
              <div className="w-9 h-9 bg-[#235B43] text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">3</div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">Run CDSS Alignment</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Evaluate ranked probability metrics safely backed inside the doctor screen layout.</p>
            </div>
            <div>
              <div className="w-9 h-9 bg-[#235B43] text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">4</div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">Secure Dispensation</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Generate legal prescriptions embedded with trackable quick-response codes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE ROLES SECTION */}

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#235B43] font-bold text-[11px] uppercase tracking-[1.2px] block mb-2">WHO IS IT FOR?</span>
          <h2 className="text-4xl font-bold text-[#112219] font-serif mb-12">Three roles, one platform</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Patient Card */}
            <div className="bg-[#112219] text-white p-9 rounded-2xl flex flex-col justify-between min-h-[320px]">
              <div>
                {/* Updated Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-5">
                  <HeartPulse className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Patient Portal</h3>
                <p className="text-white/75 text-xs leading-relaxed">
                  Log symptoms easily, process platform payments seamlessly, and store treatment reports directly.
                </p>
              </div>
              <div className="flex gap-2 mt-8">
                <button 
                  onClick={() => openLogin('patient')} 
                  className="flex-1 py-3 border border-white/30 text-white rounded-lg font-medium text-xs hover:bg-white/10 transition"
                >
                  Patient Login
                </button>
                <button 
                  onClick={() => openRegister('patient')} 
                  className="flex-1 py-3 bg-[#148352] text-white rounded-lg font-medium text-xs hover:bg-[#148352]/90 transition"
                >
                  Register →
                </button>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="bg-[#235B43] text-white p-9 rounded-2xl flex flex-col justify-between min-h-[320px]">
              <div>
                {/* Updated Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center mb-5">
                  <Stethoscope className="w-6 h-6 text-emerald-200" />
                </div>
                <h3 className="text-xl font-bold mb-3">Certified Doctor</h3>
                <p className="text-white/75 text-xs leading-relaxed">
                  Evaluate automated remedy match recommendations while holding master prescription controls.
                </p>
              </div>
              <div className="flex gap-2 mt-8">
                <button 
                  onClick={() => openLogin('doctor')} 
                  className="flex-1 py-3 border border-white/30 text-white rounded-lg font-medium text-xs hover:bg-white/10 transition"
                >
                  Doctor Login
                </button>
                <button 
                  onClick={() => openRegister('doctor')} 
                  className="flex-1 py-3 bg-white text-[#112219] rounded-lg font-medium text-xs hover:bg-white/90 transition"
                >
                  Register →
                </button>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-[#F8F7F3] text-[#112219] p-9 rounded-2xl border border-slate-900/5 flex flex-col justify-between min-h-[320px]">
              <div>
                {/* Updated Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-[#235B43]/10 border border-[#235B43]/15 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 text-[#235B43]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">System Admin</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Monitor live platform analytical charts, approve practitioners, and manage medical indices.
                </p>
              </div>
              <button 
                onClick={() => openLogin('admin')} 
                className="w-full mt-8 py-3 bg-[#148352] text-white rounded-lg font-medium text-xs hover:bg-[#148352]/90 transition"
              >
                Admin Login →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <div className="bg-[#235B43] text-white py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-3">Ready to practice safely?</h2>
          <p className="text-sm opacity-90 mb-6">Join HomeoAssist today and optimize your clinical workflows.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => openRegister('doctor')} className="px-6 py-2.5 bg-[#112219] text-white rounded-md text-sm font-medium hover:opacity-90 transition">
              Create free account
            </button>
            <button onClick={() => openLogin('doctor')} className="px-6 py-2.5 border border-white text-white rounded-md text-sm font-medium hover:bg-white/10 transition">
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#112219] text-slate-400 text-xs py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-xl font-serif font-bold text-white mb-2">HomeoAssist</div>
              <p className="text-slate-300 mb-1">Smart Connection, Faster Healing</p>
              <p className="text-slate-500">North South University • Dhaka, Bangladesh</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-bold tracking-wider uppercase mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => openRegister('doctor')} className="hover:text-white">Register</button></li>
                  <li><button onClick={() => openLogin('doctor')} className="hover:text-white">Log In</button></li>
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold tracking-wider uppercase mb-3">Roles</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>Patient Portal</li>
                  <li>Certified Doctor</li>
                  <li>System Admin</li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="border-slate-800 my-6" />
          <div className="text-center text-slate-500">
            © 2026 HomeoAssist. All Rights Reserved. Dhaka, Bangladesh.
          </div>
        </div>
      </footer>

      {/* --- MODALS OVERLAY LAYER --- */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* LOGIN MODAL */}
          {activeModal === 'login' && (
            <div 
              className="bg-[#FCFBF7] rounded-3xl max-w-md w-full p-8 relative shadow-2xl border border-stone-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>

              <h2 className="text-3xl font-serif font-bold text-[#112219] mb-1">Welcome Back</h2>
              <p className="text-slate-500 text-xs mb-5">Select your role to access your portal.</p>

              {/* 3-WAY ROLE SWITCHER TABS */}
              <div className="flex bg-stone-200/60 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setLoginRole('doctor')}
                  className={`flex-1 py-2 text-[11px] font-semibold rounded-lg transition ${
                    loginRole === 'doctor'
                      ? 'bg-white text-[#235B43] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🩺 Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('patient')}
                  className={`flex-1 py-2 text-[11px] font-semibold rounded-lg transition ${
                    loginRole === 'patient'
                      ? 'bg-white text-[#235B43] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👤 Patient
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('admin')}
                  className={`flex-1 py-2 text-[11px] font-semibold rounded-lg transition ${
                    loginRole === 'admin'
                      ? 'bg-white text-[#235B43] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginRole === 'doctor' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Doctor Reg. ID / Email
                    </label>
                    <input 
                      type="text" 
                      defaultValue="dr.anika@homeoassist.com" 
                      required 
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                    />
                  </div>
                )}

                {loginRole === 'patient' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Phone Number / Patient ID / Email
                    </label>
                    <input 
                      type="text" 
                      placeholder="+8801700000000 or patient@email.com"
                      required 
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                    />
                  </div>
                )}

                {loginRole === 'admin' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Admin Username / Security ID
                    </label>
                    <input 
                      type="text" 
                      defaultValue="admin_sys"
                      required 
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <input 
                    type="password" 
                    defaultValue="••••••••" 
                    required 
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#235B43] text-white text-xs font-medium rounded-xl hover:bg-[#112219] transition mt-2"
                >
                  Log In as {loginRole === 'doctor' ? 'Doctor' : loginRole === 'patient' ? 'Patient' : 'Admin'}
                </button>
              </form>
            </div>
          )}

          {/* REGISTER MODAL */}
          {activeModal === 'register' && (
            <div 
              className="bg-[#FCFBF7] rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl border border-stone-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>

              <h2 className="text-3xl font-serif font-bold text-[#112219] mb-1">Create Account</h2>
              <p className="text-slate-500 text-xs mb-5">Select your role to get started with HomeoAssist.</p>

              {/* ROLE SWITCHER TABS */}
              <div className="flex bg-stone-200/60 p-1 rounded-xl mb-6 max-w-md">
                <button
                  type="button"
                  onClick={() => setRegisterRole('doctor')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    registerRole === 'doctor'
                      ? 'bg-white text-[#235B43] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🩺 Doctor Registration
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('patient')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    registerRole === 'patient'
                      ? 'bg-white text-[#235B43] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👤 Patient Registration
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {registerRole === 'doctor' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          defaultValue="Dr. Anika Rahman" 
                          required 
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Medical Council Reg. ID
                        </label>
                        <input 
                          type="text" 
                          defaultValue="#HOM-4821" 
                          required 
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          defaultValue="priya.sharma@clinic.org" 
                          required 
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Contact Number
                        </label>
                        <input 
                          type="text" 
                          defaultValue="+880 17XXXXXXXX" 
                          required 
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Clinic/Chamber Address
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Dhaka, Bangladesh" 
                        required 
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Contact Number
                      </label>
                      <input 
                        type="text" 
                        placeholder="+880 17XXXXXXXX" 
                        required 
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Age
                      </label>
                      <input 
                        type="number" 
                        placeholder="28" 
                        required 
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Gender
                      </label>
                      <select 
                        required 
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#235B43] bg-white text-slate-800"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#235B43] text-white text-xs font-medium rounded-xl hover:bg-[#112219] transition mt-2"
                >
                  {registerRole === 'doctor' ? 'Submit Registration For Admin Review' : 'Create Patient Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* FLOATING BOT COMPONENT */}
      <HomeBot />
    </div>
  );
}