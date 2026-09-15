'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShield, FiKey, FiAlertTriangle, FiArrowLeft, FiLogOut,
  FiHome, FiInbox, FiCloud, FiActivity, FiUserCheck,
  FiMessageSquare, FiZap
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
  const [inboxCount, setInboxCount]   = useState<number>(0);
  const [resumeCount, setResumeCount] = useState<number>(0);
  const [dbStatus, setDbStatus]       = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbLatency, setDbLatency]     = useState<number | null>(null);

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
        if (d.success) {
          if (d.counts && typeof d.counts.unread === 'number') {
            setInboxCount(d.counts.unread > 0 ? d.counts.unread : d.counts.active || d.inquiries?.length || 0);
          } else if (Array.isArray(d.inquiries)) {
            setInboxCount(d.inquiries.length);
          }
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
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <FiActivity size={28} className="text-indigo-400 animate-spin" />
      </div>
    );
  }

  /* ── Render: Login Screen ────────────────────────────────────────── */
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-600/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-180px] right-[-100px] w-[450px] h-[450px] bg-violet-600/[0.06] rounded-full blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-sm"
        >
          <div className="bg-[#0f1422] border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <FiShield className="text-indigo-400" size={26} />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white text-center mb-1 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-400 text-center font-mono uppercase tracking-widest mb-8">
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
                  className="w-full bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white focus:outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              <AnimatePresence>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-rose-400 text-xs flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5"
                  >
                    <FiAlertTriangle size={13} /> {authError}
                  </motion.p>
                )}
              </AnimatePresence>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-indigo-600 cursor-pointer rounded" />
                Remember this session
              </label>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? <FiActivity className="animate-spin" size={16} /> : <><FiShield size={15} /> Enter Portal</>}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between">
              <button onClick={() => router.replace('/')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">
                <FiArrowLeft size={12} /> Back to portfolio
              </button>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Secured</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Subpages Navigation Items (Inbox First, Resume Second, AI Chat Third) ── */
  const navItems = [
    {
      id: 'inbox',
      name: 'Inbox',
      label: `Inbox${inboxCount > 0 ? ` (${inboxCount})` : ''}`,
      count: inboxCount,
      href: '/admin/inbox',
      icon: FiInbox,
      isActive: pathname.startsWith('/admin/inbox') || pathname === '/admin',
    },
    {
      id: 'resume',
      name: 'Resumes',
      label: `Resumes${resumeCount > 0 ? ` (${resumeCount})` : ''}`,
      count: resumeCount,
      href: '/admin/resume',
      icon: FiCloud,
      isActive: pathname.startsWith('/admin/resume'),
    },
    {
      id: 'chat',
      name: 'AI Chat',
      label: 'AI Chat',
      badge: 'Copilot',
      href: '/admin/chat',
      icon: FiMessageSquare,
      isActive: pathname.startsWith('/admin/chat'),
    },
  ];

  /* ── Render: Authenticated Responsive Shell ──────────────────────── */
  return (
    <div className="min-h-screen bg-[#0b0d14] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* ── Desktop Sidebar (Hidden on Mobile < md) ── */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0f121d] border-r border-white/[0.08] flex-col z-20">
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <FiShield className="text-indigo-400" size={17} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">Admin Portal</p>
              <p className="text-xs text-slate-400 font-mono">{PersonalInfo.name.split(' ')[0]}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map(({ id, label, href, icon: Icon, isActive, badge }) => (
            <Link
              key={id}
              href={href}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                <span>{label}</span>
              </div>
              {badge && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] font-mono font-bold text-indigo-300 border border-indigo-500/30">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* DB Health Indicator */}
        <div className="p-3.5 border-t border-white/[0.08]">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border ${
            dbStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            dbStatus === 'error'     ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/[0.03] text-slate-400 border-white/5'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' :
              dbStatus === 'error'     ? 'bg-rose-400' : 'bg-slate-400'
            }`} />
            {dbStatus === 'connected' ? `MongoDB · ${dbLatency}ms` :
             dbStatus === 'error'     ? 'MongoDB · Error' : 'Checking...'}
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="p-3.5 border-t border-white/[0.08] space-y-1.5">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <FiUserCheck size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{PersonalInfo.name}</p>
              <p className="text-[11px] text-slate-400 truncate font-mono">{PersonalInfo.email}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
          >
            <FiHome size={13} /> Return to Portfolio
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <FiLogOut size={13} /> Logout &amp; Lock
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header (Visible on Mobile < md) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0f121d]/95 backdrop-blur-xl border-b border-white/[0.08] px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <FiShield className="text-indigo-400" size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-white leading-tight truncate">Admin Portal</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
              }`} />
              <span className="text-[10px] text-slate-400 font-mono truncate">
                {dbStatus === 'connected' ? 'MongoDB OK' : 'Checking'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/admin/chat"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all cursor-pointer"
            title="Open Admin AI Copilot"
          >
            <FiZap size={12} className="text-indigo-400" />
            <span className="text-[11px]">AI Copilot</span>
          </Link>
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Portfolio"
          >
            <FiHome size={14} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors cursor-pointer"
            title="Logout"
          >
            <FiLogOut size={14} />
          </button>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <main
        className={
          pathname?.startsWith('/admin/chat')
            ? 'flex-1 ml-0 md:ml-64 h-[100dvh] pt-14 md:pt-0 pb-16 md:pb-0 relative z-10 min-w-0 overflow-hidden p-0'
            : 'flex-1 ml-0 md:ml-64 pt-16 md:pt-8 p-3 sm:p-6 md:p-8 pb-24 md:pb-8 relative z-10 min-w-0 overflow-x-hidden'
        }
      >
        {children}
      </main>

      {/* ── Mobile Bottom Tabs for Sub Pages (Visible on Mobile < md) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f121d]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl">
        {navItems.map(({ id, name, href, icon: Icon, isActive, count, badge }) => (
          <Link
            key={id}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative active:scale-95 ${
              isActive
                ? 'text-indigo-300 font-bold bg-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Top Active Indicator Line */}
            {isActive && (
              <span className="absolute -top-1.5 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-sm shadow-indigo-500/50" />
            )}

            <div className="relative">
              <Icon size={19} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
              {/* Notification count bubble */}
              {typeof count === 'number' && count > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-indigo-500 text-white font-black text-[9px] rounded-full min-w-[15px] text-center shadow-sm">
                  {count}
                </span>
              )}
              {badge && (
                <span className="absolute -top-1 -right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
