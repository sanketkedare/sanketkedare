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
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSegment, setActiveSegment] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Simple scroll spy logic
      const sections = navLinks.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + 200; // offset

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
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ease-in-out ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
    >
      {/* Background overlay on scroll */}
      <div 
        className={`absolute inset-0 bg-white/80 dark:bg-[#0a0a1a]/70 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-opacity duration-500 -z-10 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* Logo */}
      <div className="flex-1 flex justify-start relative z-10">
        <a href="#home" onClick={() => setActiveSegment('Home')} className="flex items-center gap-3 group">
          <Logo />
        </a>
      </div>

      {/* Floating Pill Menu (Desktop) */}
      <div className="hidden md:flex flex-shrink-0 items-center gap-1 p-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md relative z-10">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setActiveSegment(link.name)}
            className={`relative px-5 py-2 text-sm font-medium transition-colors z-20 ${
              activeSegment === link.name ? 'text-cyan-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'
            }`}
          >
            {activeSegment === link.name && (
              <motion.div
                layoutId="navPill"
                className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm dark:shadow-none -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span>{link.name}</span>
          </a>
        ))}
      </div>

      {/* Social Icons */}
      <div className="flex-1 hidden md:flex justify-end items-center gap-6 relative z-10">
        <a 
          href={PersonalInfo.github} 
          target="_blank" 
          rel="noreferrer" 
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors hover:scale-110 transform duration-200"
          aria-label="GitHub"
        >
          <FiGithub size={26} />
        </a>
        <a 
          href={PersonalInfo.linkedIn} 
          target="_blank" 
          rel="noreferrer" 
          className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors hover:scale-110 transform duration-200"
          aria-label="LinkedIn"
        >
          <FiLinkedin size={26} />
        </a>
      </div>
    </motion.nav>
  );
}
