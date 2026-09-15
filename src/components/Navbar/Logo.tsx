'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Logo() {
  const router = useRouter();
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

    // Completely silent 10-click Easter Egg trigger
    if (newCount >= 10) {
      setClickCount(0);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sk_admin_unlocked_by_easter_egg', 'true');
      }

      router.push('/admin');
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
