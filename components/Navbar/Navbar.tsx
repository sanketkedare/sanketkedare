'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PersonalInfo from '@/lib/personal-info';
import Logo from './Logo';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

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

      {/* 2. Floating Navigation Pill (Fixed - Stays on top) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-center">
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
    </>
  );
}
