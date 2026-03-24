'use client';

import PersonalInfo from '@/lib/personal-info';
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi';
import Logo from '../Navbar/Logo';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#050511] pt-24 pb-12 overflow-hidden transition-colors duration-1000">
      
      <div className="w-full lg:w-[80%] px-6 lg:px-0 mx-auto relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
          
          {/* Column 1: Identity */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="flex items-center gap-3 w-fit">
              <Logo />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium max-w-xs leading-relaxed opacity-80">
              Architecting high-performance digital experiences with a focus on precision, scalability, and premium design.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
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

          {/* Column 3: Connect */}
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

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none">
              © {currentYear} SK. Architecting Experience.
            </p>
            <p className="text-[7px] md:text-[9px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-[0.3em] leading-none">
              Sanket Kedare • Portfolio 2026
            </p>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 dark:border-white/5 flex items-center justify-center transition-all group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5">
              <FiArrowUp size={16} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
            </div>
            <span className="text-[7px] md:text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-cyan-500">Back to Top</span>
          </motion.button>
        </div>

      </div>
    </footer>
  );
}
