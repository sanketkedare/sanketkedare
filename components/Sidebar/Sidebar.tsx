'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose } from 'react-icons/io5';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import PersonalInfo from '@/lib/personal-info';

const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Floating Toggle Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed top-5 right-6 z-50 w-12 h-12 rounded-full bg-slate-900/10 dark:bg-white/10 border border-slate-300/50 dark:border-white/20 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white shadow-lg active:scale-90 transition-transform"
          onClick={() => setOpen(true)}
          aria-label="Open mobile menu"
        >
          <IoMenu size={24} />
        </motion.button>
      )}

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-white/80 dark:bg-[#050511]/80 flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              className="absolute top-5 right-6 w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white active:scale-90 transition-transform"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <IoClose size={24} />
            </button>

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-6 mb-16">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 100 }}
                  className="text-3xl font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Social Icons inside Menu */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8"
            >
              <a href={PersonalInfo.github} target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="GitHub">
                <FiGithub size={28} />
              </a>
              <a href={PersonalInfo.linkedIn} target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" aria-label="LinkedIn">
                <FiLinkedin size={28} />
              </a>
              <a href={`mailto:${PersonalInfo.email}`} className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" aria-label="Email">
                <FiMail size={28} />
              </a>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
