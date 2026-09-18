'use client';

import Image from 'next/image';
import PersonalInfo from '@/lib/personal-info';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import Logo from '../Navbar/Logo';
import ScrollToTopButton from './ScrollToTopButton';
import FooterShareSection from './FooterShareSection';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-transparent dark:bg-[#050511] pt-20 pb-12 overflow-hidden transition-colors duration-1000">
      {/* Unified Ambient Glow Mesh & Volcanic Emblem Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_70%_0%,rgba(99,102,241,0.14)_0%,transparent_70%)]" />
        <div className="absolute -top-36 -right-32 w-[36rem] h-[36rem] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Volcanic Emblem Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/icons/volcanic_logo_no_bg.png"
            alt="Volcanic Emblem Watermark"
            width={500}
            height={500}
            className="w-[20rem] sm:w-[28rem] md:w-[34rem] h-auto object-contain opacity-[0.05] dark:opacity-[0.06] select-none pointer-events-none"
          />
        </div>
      </div>

      <div className="w-full lg:w-[80%] px-6 lg:px-0 mx-auto relative z-10">
        {/* Top Grid: Logo & Tagline | Explore Navigation | Connect Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="flex items-center gap-3 w-fit">
              <Logo />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium max-w-xs leading-relaxed opacity-80">
              Architecting high-performance digital experiences with a focus on precision, scalability, and premium design.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Explore</p>
            <ul className="flex flex-wrap md:flex-col justify-center gap-x-6 gap-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-[11px] md:text-sm font-semibold text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all opacity-80 hover:opacity-100"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Connect</p>
            <div className="flex flex-wrap md:flex-col justify-center gap-4">
              <a 
                href={PersonalInfo.linkedIn} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-[11px] md:text-sm font-semibold text-slate-800 dark:text-slate-300 group"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50">
                  <FiLinkedin size={14} className="group-hover:text-cyan-500" />
                </div>
                <span className="hidden md:inline group-hover:text-cyan-500">LinkedIn</span>
              </a>
              <a 
                href={PersonalInfo.github} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-[11px] md:text-sm font-semibold text-slate-800 dark:text-slate-300 group"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all group-hover:bg-slate-900/10 dark:group-hover:bg-white/10 group-hover:border-slate-900/50 dark:group-hover:border-white/50">
                  <FiGithub size={14} className="group-hover:text-slate-900 dark:group-hover:text-white" />
                </div>
                <span className="hidden md:inline group-hover:text-slate-900 dark:group-hover:text-white">GitHub</span>
              </a>
              <a 
                href={`mailto:${PersonalInfo.email}`}
                className="flex items-center gap-3 text-[11px] md:text-sm font-semibold text-slate-800 dark:text-slate-300 group"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all group-hover:bg-purple-500/10 group-hover:border-purple-500/50">
                  <FiMail size={14} className="group-hover:text-purple-500" />
                </div>
                <span className="hidden md:inline group-hover:text-purple-500">Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Share Profile & Portfolio URL Section */}
        <FooterShareSection />

        {/* Dedicated V O L C A N I C Display Section below cards */}
        <div className="w-full my-4 md:my-6 flex items-center justify-center overflow-hidden select-none pointer-events-none px-4 sm:px-6 md:px-8">
          <span className="text-[6.5vw] sm:text-[7.5vw] md:text-[8.2vw] lg:text-[8.8vw] font-black uppercase tracking-[0.2em] text-slate-900/[0.04] dark:text-white/[0.035] whitespace-nowrap leading-none transition-colors duration-1000 pl-[0.2em]">
            VOLCANIC
          </span>
        </div>

        {/* Bottom Copyright Block */}
        <div className="pt-2 flex flex-col items-center justify-center gap-4 text-center relative">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none">
              © {currentYear} SK. Architecting Experience.
            </p>
            <p className="text-[7px] md:text-[9px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-[0.3em] leading-none">
              Sanket Kedare • Portfolio 2026
            </p>
          </div>

          <div className="md:absolute md:right-0 md:bottom-0">
            <ScrollToTopButton />
          </div>
        </div>

      </div>
    </footer>
  );
}
