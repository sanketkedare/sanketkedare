'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PersonalInfo from '@/lib/personal-info';
import Logo from './Logo';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Cognitive', href: '#cognitive' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSegment, setActiveSegment] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => document.querySelector(link.href));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section) => {
        if (!section) return;
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          const id = section.getAttribute('id');
          if (id) {
            const matchingLink = navLinks.find((link) => link.href === `#${id}`);
            if (matchingLink && activeSegment !== matchingLink.name) {
              setActiveSegment(matchingLink.name);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSegment]);

  return (
    <>
      {/* ── 1. Static Top Header: Logo & Social Links (Scrolls away with hero, not fixed) ─ */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-auto">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Mobile Theme Toggle (visible on mobile, spaced cleanly from fixed menu button) */}
        <div className="flex md:hidden items-center pr-14">
          <ThemeToggle />
        </div>

        {/* Desktop Social Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={PersonalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 ring-1 ring-slate-900/[0.04] dark:ring-transparent shadow-[0_6px_16px_-2px_rgba(15,23,42,0.08),_0_0_0_1px_rgba(255,255,255,0.9)_inset] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-md hover:border-slate-300 dark:hover:border-white/25 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all backdrop-blur-md hover:scale-105 active:scale-95"
            title="GitHub Profile"
          >
            <FiGithub size={19} />
          </a>
          <a
            href={PersonalInfo.linkedIn}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 ring-1 ring-slate-900/[0.04] dark:ring-transparent shadow-[0_6px_16px_-2px_rgba(15,23,42,0.08),_0_0_0_1px_rgba(255,255,255,0.9)_inset] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-md hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-all backdrop-blur-md hover:scale-105 active:scale-95"
            title="LinkedIn Profile"
          >
            <FiLinkedin size={19} />
          </a>
        </div>
      </header>

      {/* ── 2. Desktop Floating Navlinks Pill (Always fixed at top-center, hidden on mobile) ────── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] hidden md:flex items-center justify-center">
        <div className="flex items-center gap-1 p-1.5 rounded-full font-sans bg-white/75 dark:bg-[#070a16]/85 backdrop-blur-3xl border border-white/80 dark:border-white/10 ring-1 ring-slate-900/[0.07] dark:ring-white/[0.08] shadow-[0_20px_45px_-10px_rgba(15,23,42,0.14),_0_8px_18px_-4px_rgba(15,23,42,0.07),_0_0_0_1.5px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.85),_0_0_30px_rgba(99,102,241,0.2),_0_0_0_1px_rgba(255,255,255,0.08)_inset]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveSegment(link.name)}
              className={`relative px-3.5 lg:px-4 py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-300 rounded-full select-none ${
                activeSegment === link.name
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/[0.04] dark:hover:bg-white/5'
              }`}
            >
              {activeSegment === link.name && (
                <motion.div
                  layoutId="navPillDesktop"
                  className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-cyan-500/25 dark:via-purple-500/30 dark:to-cyan-500/25 dark:border dark:border-cyan-400/50 rounded-full shadow-[0_6px_20px_-2px_rgba(15,23,42,0.35),_0_2px_4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(255,255,255,0.15)_inset] dark:shadow-[0_0_20px_rgba(6,182,212,0.4),_0_0_8px_rgba(168,85,247,0.3)] -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              {link.name}
            </a>
          ))}
          {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE === 'true') && (
            <>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-1.5" />
              <ThemeToggle />
            </>
          )}
        </div>
      </nav>
    </>
  );
}
