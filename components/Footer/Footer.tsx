import PersonalInfo from '@/lib/personal-info';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511] pt-20 pb-10 overflow-hidden">
      
      {/* Massive Background Text Parallax Illusion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5 dark:opacity-5 text-slate-900 dark:text-white select-none -z-10 mt-10">
        <span className="text-[15vw] font-[family-name:var(--font-outfit)] font-black whitespace-nowrap">
          SANKET KEDARE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-[family-name:var(--font-outfit)] font-bold text-slate-800 dark:text-white tracking-tighter">
              Sanket<span className="text-cyan-600 dark:text-cyan-500">.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-500 mt-2 max-w-sm">
              Building scalable, high-performance web applications with MERN stack and Next.js.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={PersonalInfo.github} 
              target="_blank" 
              rel="noreferrer" 
              className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white hover:-translate-y-1 transition-all duration-300"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a 
              href={PersonalInfo.linkedIn} 
              target="_blank" 
              rel="noreferrer" 
              className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border-cyan-300/0 dark:border-cyan-500/0 hover:border-cyan-300 dark:hover:border-cyan-500 hover:-translate-y-1 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a 
              href={`mailto:${PersonalInfo.email}`} 
              className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 border-purple-300/0 dark:border-purple-500/0 hover:border-purple-300 dark:hover:border-purple-500 hover:-translate-y-1 transition-all duration-300"
              aria-label="Email"
            >
              <FiMail size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200 dark:border-white/10 text-sm font-medium text-slate-500 dark:text-slate-600">
          <p>
            &copy; {currentYear} Sanket Kedare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#home" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Back to Top</a>
            <span className="opacity-50 text-slate-300 dark:text-slate-700">|</span>
            <span>Designed & Built with Next.js 16</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
