'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiAlertOctagon, FiHome, FiArrowLeft, FiCompass } from 'react-icons/fi';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050511] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-xl mx-auto relative z-10 text-center flex flex-col items-center">
        
        {/* Animated 404 Header Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-2xl backdrop-blur-xl">
            <FiAlertOctagon size={44} />
          </div>
          <span className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-slate-200">
            404
          </span>
        </motion.div>

        {/* Message Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl w-full flex flex-col items-center gap-4"
        >
          <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
            The URL or page route you are looking for does not exist, has been moved, or is restricted.
          </p>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 w-full">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
            >
              <FiHome size={16} />
              <span>Return Home</span>
            </Link>

            <Link
              href="/#projects"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wider uppercase transition-all border border-white/10 cursor-pointer"
            >
              <FiCompass size={16} />
              <span>Explore Projects</span>
            </Link>
          </div>

          <div className="mt-4 pt-6 border-t border-white/10 w-full text-center">
            <p className="text-[10px] text-slate-500 font-mono">
              Sanket Kedare Portfolio • Invalid Route Handler
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
