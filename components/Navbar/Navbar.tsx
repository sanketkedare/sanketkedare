'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import PersonalInfo from '@/lib/personal-info';
import Logo from './Logo';
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSegment, setActiveSegment] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Precise scroll spy for 100vh slides
      const sections = navLinks.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + (window.innerHeight / 3);

      sections.forEach((section) => {
        if (!section) return;
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
           const id = section.getAttribute('id');
           if (id) {
             const matchingLink = navLinks.find(link => link.href === `#${id}`);
             if (matchingLink && activeSegment !== matchingLink.name) {
                setActiveSegment(matchingLink.name);
             }
           }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSegment]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* 1. Header Row: Logo & Socials (Absolute - Scrolls away with content) */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 pointer-events-none ${
        isScrolled ? 'py-4 opacity-0' : 'py-8 opacity-100'
      }`}>
        <div className="flex-1 flex justify-start pointer-events-auto">
          <a href="#home" onClick={() => setActiveSegment('Home')} className="flex items-center gap-3">
            <Logo />
          </a>
        </div>

        <div className="hidden md:flex flex-1 justify-end items-center gap-6 pointer-events-auto">
          <a href={PersonalInfo.github} target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-white transition-all"><FiGithub size={24} /></a>
          <a href={PersonalInfo.linkedIn} target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-all"><FiLinkedin size={24} /></a>
        </div>
      </div>

      {/* 2. Floating Navigation Pill (Fixed - Shown only on Desktop) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] hidden md:flex items-center justify-center">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/70 dark:bg-[#0a0a1a]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveSegment(link.name)}
              className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                activeSegment === link.name ? 'text-black dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {activeSegment === link.name && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-lg -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* 3. Mobile Navigation: Toggler & Overlay */}
      <div className="md:hidden">
        {/* Fixed Toggler Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white shadow-xl"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Fullscreen Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-white dark:bg-[#050511] flex flex-col items-center justify-center gap-8 py-20 px-6 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="flex flex-col items-center gap-6 w-full">
                {navLinks.map((link, i) => (
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setActiveSegment(link.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-4xl font-black tracking-tighter ${
                      activeSegment === link.name ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-700'
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-12 flex items-center gap-8">
                <a href={PersonalInfo.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-500 transition-colors"><FiGithub size={28} /></a>
                <a href={PersonalInfo.linkedIn} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-500 transition-colors"><FiLinkedin size={28} /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
