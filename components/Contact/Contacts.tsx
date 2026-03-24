'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import PersonalInfo from '@/lib/personal-info';
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, FiAlertCircle, FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring" as const, 
      stiffness: 100, 
      damping: 15 
    }
  }
};

type AccentColor = 'cyan' | 'emerald' | 'blue' | 'purple' | 'slate';

const accentMap: Record<AccentColor, { glow: string; text: string; bg: string }> = {
  cyan: { glow: 'rgba(6, 182, 212, 0.12)', text: 'text-cyan-500', bg: 'from-cyan-500/20' },
  emerald: { glow: 'rgba(16, 185, 129, 0.12)', text: 'text-emerald-500', bg: 'from-emerald-500/20' },
  blue: { glow: 'rgba(59, 130, 246, 0.12)', text: 'text-blue-500', bg: 'from-blue-500/20' },
  purple: { glow: 'rgba(168, 85, 247, 0.12)', text: 'text-purple-500', bg: 'from-purple-500/20' },
  slate: { glow: 'rgba(71, 85, 105, 0.12)', text: 'text-slate-500', bg: 'from-slate-500/20' },
};

export default function Contacts() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeAccent, setActiveAccent] = useState<AccentColor>('cyan');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('loading');
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
      )
      .then(() => setStatus('success'), () => setStatus('error'));
  }

  const socialLinks: { label: string; icon: any; href: string | null; accent: AccentColor; value: string }[] = [
    { label: 'LinkedIn', icon: FiLinkedin, href: PersonalInfo.linkedIn, accent: 'blue', value: 'sanket-kedare-dev' },
    { label: 'GitHub', icon: FiGithub, href: PersonalInfo.github, accent: 'slate', value: 'sanketkedare' },
    { label: 'WhatsApp', icon: FaWhatsapp, href: `https://wa.me/91${PersonalInfo.mobile}`, accent: 'emerald', value: 'Quick Chat' },
    { label: 'Email', icon: FiMail, href: `mailto:${PersonalInfo.email}`, accent: 'cyan', value: PersonalInfo.email },
  ];

  const currentTheme = accentMap[activeAccent];

  return (
    <section id="contact" className="relative w-full py-24 md:py-32 bg-white dark:bg-[#050511] overflow-hidden transition-colors duration-1000">
      
      {/* Subtle Aura Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            background: `radial-gradient(circle at 50% 50%, ${currentTheme.glow} 0%, transparent 60%)` 
          }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 opacity-40"
        />
      </div>

      <div className="w-full lg:w-[80%] px-6 lg:px-0 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          
          {/* Left Side: Executive Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 lg:sticky lg:top-32"
          >
            <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.3em] uppercase text-[9px] md:text-[10px] mb-4">Inquiry</p>
            <h2 className="text-[1.75rem] md:text-4xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 tracking-tight">
              Let&apos;s Connect.
            </h2>
            <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-10 md:mb-12 leading-relaxed opacity-80">
              Have a dedicated project or a simple question? I&apos;m here to help you turn your next vision into reality.
            </p>

            <div className="space-y-6 md:space-y-8">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setActiveAccent(link.accent)}
                  onMouseLeave={() => setActiveAccent('cyan')}
                  className="flex flex-col group w-fit"
                >
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 transition-colors duration-300 group-hover:text-cyan-500 shadow-sm">
                    {link.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <link.icon size={14} className={`transition-colors duration-300 ${activeAccent === link.accent ? currentTheme.text : 'text-slate-900 dark:text-white'}`} />
                    <span className="text-[11px] md:text-sm font-bold text-slate-900 dark:text-white border-b-2 border-transparent group-hover:border-slate-900 dark:group-hover:border-white transition-all">
                      {link.value}
                    </span>
                  </div>
                </motion.a>
              ))}

              <div className="pt-8 flex items-center gap-2 text-slate-400">
                <FiMapPin size={12} className="md:size-[14px]" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{PersonalInfo.location}</span>
                <span className="mx-2 opacity-20">|</span>
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Available Remotely</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: High-Density Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <form 
              ref={formRef} 
              onSubmit={sendEmail} 
              className="relative bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-slate-100 dark:border-white/10 p-6 md:p-10 rounded-3xl shadow-xl flex flex-col gap-5 md:gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-1.5">
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</span>
                  <input type="text" name="name" required placeholder="Sanket Kedare" className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-cyan-500/30 rounded-xl px-4 md:px-5 py-3 md:py-3.5 text-xs md:text-sm transition-all focus:outline-none dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</span>
                  <input type="email" name="email" required placeholder="sanket@dev.com" className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-cyan-500/30 rounded-xl px-4 md:px-5 py-3 md:py-3.5 text-xs md:text-sm transition-all focus:outline-none dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Message</span>
                <textarea name="message" required placeholder="Describe your inquiry or vision..." rows={4} className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-cyan-500/30 rounded-xl px-4 md:px-5 py-3 md:py-3.5 text-xs md:text-sm transition-all focus:outline-none dark:text-white resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700" />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className={`mt-4 w-full py-3.5 md:py-4 rounded-xl font-black text-[9px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 ${
                  status === 'loading' ? 'bg-slate-100 dark:bg-white/10 text-slate-400' : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.99]'
                }`}
              >
                {status === 'idle' && (
                  <>
                    <span>Send Inquiry</span>
                    <FiSend size={14} />
                  </>
                )}
                {status === 'loading' && <span className="animate-pulse">Processing...</span>}
                {status === 'success' && <span className="text-emerald-500 italic">Submitted.</span>}
                {status === 'error' && <span className="text-red-500 italic">Failed.</span>}
              </button>

              <div className="mt-4 pt-6 border-t border-slate-50 dark:border-white/5 text-center">
                 <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60">Sanket Kedare | Architecting Experience</p>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
