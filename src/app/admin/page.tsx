'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiLock, FiKey, FiShield, FiLogOut, FiArrowLeft, 
  FiCheckCircle, FiActivity, FiServer, FiDatabase, FiMail, 
  FiUserCheck, FiGlobe, FiCpu, FiAlertTriangle 
} from 'react-icons/fi';
import { 
  isAuthenticatedClient, 
  setAdminAuthSession, 
  clearAdminAuthSession, 
  ADMIN_PASSWORD_HASH 
} from '@/lib/admin-auth';
import PersonalInfo from '@/lib/personal-info';

export default function AdminPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Validate authentication status & mandatory 10-click Easter Egg flag on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loggedIn = isAuthenticatedClient();
    const easterEggUnlocked = sessionStorage.getItem('sk_admin_unlocked_by_easter_egg') === 'true';

    if (loggedIn) {
      setIsAuth(true);
    } else if (easterEggUnlocked) {
      // User triggered 10-click Easter Egg -> allow entering password
      setIsAuth(false);
    } else {
      // Direct URL attempt without 10-click Easter Egg -> IMMEDIATELY REDIRECT TO HOME
      router.replace('/');
    }
  }, [router]);

  // Handle Admin Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAdminAuthSession(rememberMe);
        setIsAuth(true);
        setPassword('');
      } else {
        setAuthError(data.error || 'Incorrect admin password');
      }
    } catch (err) {
      setAuthError('Authentication server error. Try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout & Lock handler
  const handleLogout = () => {
    clearAdminAuthSession();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sk_admin_unlocked_by_easter_egg');
    }
    setIsAuth(false);
    router.replace('/');
  };

  // Redirect to Home if unauthorized visitor cancels login
  const handleRedirectHome = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sk_admin_unlocked_by_easter_egg');
    }
    router.replace('/');
  };

  // Loading / Redirecting state (Blank dark background to prevent flashing login modal)
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-[#050511] flex items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <FiActivity size={32} className="animate-spin" />
          <p className="text-xs font-mono tracking-widest uppercase">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050511] text-white selection:bg-cyan-500/30 font-sans relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* UNAUTHENTICATED STATE: SLEEK LOGIN MODAL (Only rendered if 10-click Easter Egg triggered) */}
      {!isAuth ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Security Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <FiLock size={20} />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-wide text-white">
                    Restricted Area
                  </h1>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    SHA-256 Encrypted Portal
                  </p>
                </div>
              </div>

              <button
                onClick={handleRedirectHome}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5"
                title="Return to Home"
              >
                <FiArrowLeft size={14} />
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Admin Master Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-black/40 border border-white/10 focus:border-cyan-500 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                </div>
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2"
                >
                  <FiAlertTriangle size={15} />
                  <span>{authError}</span>
                </motion.div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember Session</span>
                </label>
                <span className="text-[10px] text-cyan-500 font-mono">Protected</span>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <FiShield size={16} />
                    <span>Unlock Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Disclaimer */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-[10px] text-slate-500 font-mono">
                Direct URL access is blocked. Mandatory 10-click logo sequence required.
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        /* AUTHENTICATED STATE: ADMIN DASHBOARD */
        <div className="w-full max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col gap-8">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                <FiUserCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                    {PersonalInfo.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold uppercase">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  System Architecture &amp; Environment Control Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRedirectHome}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <FiGlobe size={15} />
                <span>Return to Portfolio</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiLogOut size={15} />
                <span>Logout &amp; Lock</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">System Status</span>
                <FiServer size={18} className="text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">Operational</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <FiCheckCircle size={12} />
                <span>Next.js 16 App Router Active</span>
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Security Engine</span>
                <FiShield size={18} className="text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white">SHA-256</p>
              <p className="text-[10px] text-cyan-400 font-mono">
                Session Token Verified
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Inquiry API</span>
                <FiMail size={18} className="text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">Online</p>
              <p className="text-[10px] text-slate-400 font-mono">
                Endpoint: /api/contact
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Turbopack Bundler</span>
                <FiCpu size={18} className="text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">v16.2</p>
              <p className="text-[10px] text-amber-400 font-mono">
                Dev &amp; Build Mode Ready
              </p>
            </div>

          </div>

          {/* Detailed Control Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* System Info Panel */}
            <div className="lg:col-span-2 p-6 md:p-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FiDatabase className="text-cyan-400" />
                  <span>Admin Environment Credentials &amp; Info</span>
                </h2>
                <span className="text-[10px] font-mono text-slate-400">Strict Mode On</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-1">
                  <span className="text-slate-500 font-mono uppercase text-[10px]">Encrypted SHA-256 Hash</span>
                  <span className="font-mono text-cyan-400 break-all">{ADMIN_PASSWORD_HASH}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono uppercase text-[10px]">Admin Name</span>
                    <span className="font-bold text-white">{PersonalInfo.name}</span>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono uppercase text-[10px]">Primary Email</span>
                    <span className="font-bold text-white">{PersonalInfo.email}</span>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono uppercase text-[10px]">Role</span>
                    <span className="font-bold text-white">{PersonalInfo.role}</span>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono uppercase text-[10px]">Production Domain</span>
                    <span className="font-bold text-cyan-400">{PersonalInfo.website}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 md:p-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FiShield className="text-purple-400" />
                  <span>Admin Actions</span>
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/#resume')}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-between transition-all"
                >
                  <span>Inspect Resume Viewer</span>
                  <span className="text-cyan-400">→</span>
                </button>

                <button
                  onClick={() => router.push('/#contact')}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-between transition-all"
                >
                  <span>Test Inquiry Form</span>
                  <span className="text-cyan-400">→</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-between transition-all cursor-pointer mt-4"
                >
                  <span>Logout &amp; Lock Section</span>
                  <FiLogOut />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </main>
  );
}
