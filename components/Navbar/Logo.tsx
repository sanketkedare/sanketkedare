'use client';

import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      className="relative flex items-center justify-center cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-3xl font-black tracking-tighter flex items-center">
        <span className="text-cyan-600 dark:text-cyan-400 opacity-80 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300">
          &lt;
        </span>
        <span className="text-slate-800 dark:text-white mx-1">
          SK
        </span>
        <span className="text-purple-600 dark:text-purple-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
          /&gt;
        </span>
      </span>
    </motion.div>
  );
}
