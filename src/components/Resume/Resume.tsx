'use client';

import { motion } from 'framer-motion';
import ResumeViewer from './ResumeViewer';
import JDMatcherModal from './JDMatcherModal';

const resumeInfo = `Results-driven Full Stack Developer with expertise in React, Next.js, TypeScript, and modern web application architecture. Dedicated to crafting clean code, high-performance interfaces, and scalable backend solutions.`;

export default function Resume() {
  return (
    <section id="resume" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-24 bg-transparent dark:bg-[#050511] border-none">
      {/* Rich Centered Soft Atmosphere (Expanded Size, Low Intensity, Seamless Fade Mask) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
        {/* Main Expanded Soft Multi-Color Aura Mesh centered behind component */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] sm:w-[1150px] lg:w-[1350px] h-[600px] sm:h-[750px] bg-gradient-to-tr from-cyan-400/20 via-purple-400/18 to-indigo-500/20 dark:from-cyan-500/12 dark:via-purple-500/12 dark:to-indigo-500/12 rounded-full blur-[140px]" />

        {/* Animated Centered Expanded Soft Color Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.12, 1], x: [-30, 30, -30], y: [-20, 20, -20] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-1/2 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] bg-cyan-400/22 dark:bg-cyan-500/10 rounded-full blur-[120px]" 
        />

        <motion.div 
          animate={{ scale: [1.1, 0.95, 1.1], x: [30, -30, 30], y: [20, -20, 20] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-1/2 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] bg-purple-400/22 dark:bg-purple-500/10 rounded-full blur-[120px]" 
        />

        <motion.div 
          animate={{ scale: [0.92, 1.08, 0.92], y: [-30, 25, -30] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[450px] sm:w-[580px] h-[450px] sm:h-[580px] bg-amber-300/18 dark:bg-amber-400/08 rounded-full blur-[110px]" 
        />

        {/* Dot Matrix Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.35] dark:opacity-[0.2]" />
      </div>

      <div className="w-full lg:w-[80%] mx-auto px-6 lg:px-0 relative z-10">
        <div className="w-full flex flex-col items-center gap-6 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-[1.75rem] md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight md:tracking-normal">
              Resume &amp; <span className="text-cyan-600 dark:text-cyan-400">Qualifications</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-800 dark:text-slate-400 font-semibold leading-relaxed max-w-xl mx-auto">
              {resumeInfo}
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 mt-4 mx-auto rounded-full shadow-sm" />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full pt-2">
            <ResumeViewer />
            <JDMatcherModal />
          </div>
        </div>
      </div>
    </section>
  );
}
