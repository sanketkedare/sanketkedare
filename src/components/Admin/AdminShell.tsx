'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShield, FiKey, FiAlertTriangle, FiArrowLeft, FiLogOut,
  FiHome, FiInbox, FiCloud, FiActivity, FiUserCheck
} from 'react-icons/fi';
import {
  isAuthenticatedClient,
  setAdminAuthSession,
  clearAdminAuthSession,
} from '@/lib/admin-auth';
import PersonalInfo from '@/lib/personal-info';

export interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Auth State
  const [isAuth, setIsAuth]                   = useState<boolean | null>(null);
  const [password, setPassword]               = useState('');
  const [rememberMe, setRememberMe]           = useState(true);
  const [authError, setAuthError]             = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Counts & DB Health
  const [inboxCount, setInboxCount] = useState<number>(0);
  const [resumeCount, setResumeCount] = useState<number>(0);
  const [dbStatus, setDbStatus]   = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbLatency, setDbLatency] = useState<number | null>(null);

  /* ── Auth check ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn    = isAuthenticatedClient();
    const eggUnlocked = sessionStorage.getItem('sk_admin_unlocked_by_easter_egg') === 'true';

    if (loggedIn)         setIsAuth(true);
    else if (eggUnlocked) setIsAuth(false);
    else                  router.replace('/');
  }, [router]);

  /* ── Fetch DB Health and Counts ─────────────────────────────────── */
  const fetchCountsAndHealth = () => {
    if (!isAuth) return;

    // Health
    fetch('/api/admin/health')
      .then(r => r.json())
      .then(d => {
        setDbStatus(d.success ? 'connected' : 'error');
        setDbLatency(d.latencyMs ?? null);
      })
      .catch(() => setDbStatus('error'));

    // Inquiries count
    fetch('/api/admin/inquiries')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.inquiries)) {
          setInboxCount(d.inquiries.length);
        }
      })
      .catch(() => {});

    // Resumes count
    fetch('/api/admin/resumes')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.resumes)) {
          setResumeCount(d.resumes.length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!isAuth) return;
    fetchCountsAndHealth();

    // Live poll inquiries count every 15 seconds
    const interval = setInterval(fetchCountsAndHealth, 15000);

    // Listen to custom events from pages
    const handleInquiryUpdated = () => fetchCountsAndHealth();
    const handleResumeUpdated = () => fetchCountsAndHealth();

    window.addEventListener('sk-inquiry-updated', handleInquiryUpdated);
    window.addEventListener('sk-resume-updated', handleResumeUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sk-inquiry-updated', handleInquiryUpdated);
      window.removeEventListener('sk-resume-updated', handleResumeUpdated);
    };
  }, [isAuth]);

  /* ── Auth actions ───────────────────────────────────────────────── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setAdminAuthSession(rememberMe);
        setIsAuth(true);
      } else {
        setAuthError(data.error || 'Incorrect password.');
      }
    } catch {
      setAuthError('Connection error. Try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    clearAdminAuthSession();
    sessionStorage.removeItem('sk_admin_unlocked_by_easter_egg');
    setIsAuth(false);
    router.replace('/');
  };

  /* ── Render: Checking auth ───────────────────────────────────────── */
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-[#050511] flex items-center justify-center">
        <FiActivity size={28} className="text-cyan-400 animate-spin" />
      </div>
    );
  }

  /* ── Render: Login Screen ────────────────────────────────────────── */
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#050511] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative w-full max-w-sm"
        >
          <div className="bg-[#0a0a1e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <FiShield className="text-cyan-400" size={26} />
              </div>
            </div>
            <h1 className="text-xl font-black text-white text-center mb-1 tracking-tight">Hidden Portal</h1>
            <p className="text-xs text-slate-300 text-center font-mono uppercase tracking-widest mb-8">
              Backend-Validated Access
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Portal password"
                  className="w-full bg-black/50 border border-white/15 focus:border-cyan-500/60 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <AnimatePresence>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-xs flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5"
                  >
                    <FiAlertTriangle size={13} /> {authError}
                  </motion.p>
                )}
              </AnimatePresence>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-cyan-500 cursor-pointer" />
                Remember this session
              </label>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? <FiActivity className="animate-spin" size={16} /> : <><FiShield size={15} /> Enter Portal</>}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-white/8 flex items-center justify-between">
              <button onClick={() => router.replace('/')} className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer">
                <FiArrowLeft size={12} /> Back to portfolio
              </button>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Secured</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Navigation Items (Inbox is FIRST, Resume is SECOND) ────────── */
  const navItems = [
    {
      id: 'inbox',
      label: `Inbox${inboxCount > 0 ? ` (${inboxCount})` : ''}`,
      href: '/admin/inbox',
      icon: FiInbox,
      isActive: pathname.startsWith('/admin/inbox') || pathname === '/admin',
    },
    {
      id: 'resume',
      label: `Resumes${resumeCount > 0 ? ` (${resumeCount})` : ''}`,
      href: '/admin/resume',
      icon: FiCloud,
      isActive: pathname.startsWith('/admin/resume'),
    },
  ];

  /* ── Render: Authenticated Shell ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#050511] flex">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-cyan-600/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Fixed Sidebar ── */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#07071a]/80 backdrop-blur-xl border-r border-white/6 flex flex-col z-20">
        {/* Brand */}
        <div className="p-6 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <FiShield className="text-cyan-400" size={16} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">Admin Portal</p>
              <p className="text-xs text-slate-300 font-mono font-medium">{PersonalInfo.name.split(' ')[0]}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Inbox First!) */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map(({ id, label, href, icon: Icon, isActive }) => (
            <Link
              key={id}
              href={href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* DB Health Indicator */}
        <div className="p-4 border-t border-white/6">
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono ${
            dbStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400' :
            dbStatus === 'error'     ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-300'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' :
              dbStatus === 'error'     ? 'bg-red-400' : 'bg-slate-400'
            }`} />
            {dbStatus === 'connected' ? `MongoDB · ${dbLatency}ms` :
             dbStatus === 'error'     ? 'MongoDB · Error' : 'Checking...'}
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-white/6 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FiUserCheck size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{PersonalInfo.name}</p>
              <p className="text-xs text-slate-300 truncate font-mono">{PersonalInfo.email}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <FiHome size={13} /> Return to Portfolio
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all cursor-pointer"
          >
            <FiLogOut size={13} /> Logout &amp; Lock
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <main className="flex-1 ml-64 p-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
