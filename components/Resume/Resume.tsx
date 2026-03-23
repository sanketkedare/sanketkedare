'use client';

import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const RESUME_PDF = '/Sanket_Kedare_WD_AlmaBetter.pdf';

const resumeInfo = `Results-driven professional with a proven track record in project management and strategic planning. 
Skilled in team leadership, communication, and problem-solving. 
Recognized for achieving operational efficiency and exceeding targets. 
Adaptable and detail-oriented, with a commitment to delivering high-quality results. 
Seeking to contribute expertise in a dynamic and growth-oriented environment.`;

function downloadResume() {
  const a = document.createElement('a');
  a.href = RESUME_PDF;
  a.setAttribute('download', 'Sanket_Kedare_WD_AlmaBetter');
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function Resume() {
  return (
    <section id="resume" className="relative w-full py-32 px-6 flex items-center justify-center overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[128px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-5xl w-full bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-16 shadow-lg dark:shadow-2xl flex flex-col md:flex-row items-center gap-12 text-center md:text-left overflow-hidden"
      >
        {/* Decorative inner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-outfit)] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6 leading-tight">
            Ready to build <br/> something <span className="text-cyan-600 dark:text-cyan-400">great?</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            {resumeInfo}
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          {/* Pulsing rings around the button */}
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-30 animate-ping duration-1000" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadResume}
            className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <FiDownload size={24} className="group-hover:-translate-y-1 transition-transform" />
            <span className="text-lg tracking-wide uppercase">Download Resume</span>
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
}
