'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE === 'true';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isDev) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-transparent" aria-hidden="true" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className="w-8 h-8 rounded-full text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 border border-slate-200/80 dark:border-white/15 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0"
    >
      {isDark ? (
        <FiSun size={15} className="text-amber-400" />
      ) : (
        <FiMoon size={15} className="text-indigo-600" />
      )}
    </motion.button>
  );
}
