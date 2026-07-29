'use client';

import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const RESUME_PDF = '/Sanket_Kedare_WD_AlmaBetter.pdf';

export default function DownloadResumeButton() {
  function downloadResume() {
    const a = document.createElement('a');
    a.href = RESUME_PDF;
    a.setAttribute('download', 'Sanket_Kedare_WD_AlmaBetter.pdf');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="relative z-10 shrink-0 mt-4">
      <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-30 animate-ping duration-1000" />
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadResume}
        className="group relative flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <FiDownload size={16} className="md:size-[20px] group-hover:-translate-y-1 transition-transform" />
        <span className="text-[9px] md:text-sm tracking-widest uppercase">Download Resume</span>
      </motion.button>
    </div>
  );
}
