import Link from 'next/link';
import { FiWifiOff, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

export const metadata = {
  title: 'Offline | Sanket Kedare Portfolio',
  description: 'You are currently offline. Please check your internet connection.',
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050511] text-slate-800 dark:text-slate-200 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Ambient Highlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 text-center shadow-2xl relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 mb-6 ring-1 ring-cyan-500/30 animate-pulse">
          <FiWifiOff className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          You are Offline
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
          It looks like your device disconnected from the internet. Don't worry — you can still browse cached parts of Sanket's portfolio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retry Connection
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
