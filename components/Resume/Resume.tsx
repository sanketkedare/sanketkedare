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
    <section id="resume" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen flex items-center justify-center overflow-hidden py-24 bg-slate-50 dark:bg-[#050511]">
      
      {/* Background Orbs (Contained) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full mx-auto bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-2xl flex flex-col items-center gap-6 text-center overflow-hidden"
      >
        {/* Decorative inner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-[1.75rem] md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-4 leading-tight tracking-tight md:tracking-normal">
            Ready to build <br/> something <span className="text-cyan-600 dark:text-cyan-400">great?</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto opacity-80">
            {resumeInfo}
          </p>
        </div>

        <div className="relative z-10 shrink-0 mt-4">
          {/* Pulsing rings around the button */}
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-30 animate-ping duration-1000" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadResume}
            className="group relative flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <FiDownload size={16} className="md:size-[20px] group-hover:-translate-y-1 transition-transform" />
            <span className="text-[9px] md:text-sm tracking-widest uppercase">Download Resume</span>
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
}
