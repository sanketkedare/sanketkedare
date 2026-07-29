'use client';

import { motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="group flex flex-col items-center gap-2 cursor-pointer"
      aria-label="Back to Top"
    >
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 dark:border-white/5 flex items-center justify-center transition-all group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5">
        <FiArrowUp size={16} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
      </div>
      <span className="text-[7px] md:text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-cyan-500">
        Back to Top
      </span>
    </motion.button>
  );
}
