'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Logo() {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Completely silent 10-click Easter Egg trigger -> Opens Admin Portal in new tab
    if (newCount >= 10) {
      setClickCount(0);
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.sanketkedare.com';
      if (typeof window !== 'undefined') {
        window.open(adminUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Reset sequence silently after 5 seconds of inactivity
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 5000);
  };

  return (
    <motion.div
      onClick={handleLogoClick}
      className="relative flex items-center justify-center cursor-pointer group select-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-3xl font-black tracking-tighter flex items-center relative z-10">
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
