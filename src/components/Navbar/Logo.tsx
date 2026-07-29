'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Logo() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 10) {
      setClickCount(0);
      // Set secret Easter Egg authorization flag in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sk_admin_unlocked_by_easter_egg', 'true');
      }
      // Trigger secret 10-click Easter Egg admin page navigation
      router.push('/admin');
      return;
    }

    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  return (
    <motion.div
      onClick={handleLogoClick}
      className="relative flex items-center justify-center cursor-pointer group select-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Secret subtle glow pulse as clicks accumulate */}
      {clickCount >= 3 && (
        <span className="absolute -inset-1 rounded-lg bg-cyan-500/20 blur-md animate-pulse pointer-events-none" />
      )}

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
