'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PersonalInfo from '@/lib/personal-info';
import type { IconType } from 'react-icons';
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiCopy, FiCheck, FiUser, FiMessageSquare, FiZap } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { toast } from '@/lib/toast';

type AccentColor = 'cyan' | 'emerald' | 'blue' | 'purple' | 'slate';

const accentMap: Record<AccentColor, { glow: string; text: string; bg: string }> = {
  cyan: { glow: 'rgba(6, 182, 212, 0.18)', text: 'text-cyan-500', bg: 'from-cyan-500/20' },
  emerald: { glow: 'rgba(16, 185, 129, 0.18)', text: 'text-emerald-500', bg: 'from-emerald-500/20' },
  blue: { glow: 'rgba(59, 130, 246, 0.18)', text: 'text-blue-500', bg: 'from-blue-500/20' },
  purple: { glow: 'rgba(168, 85, 247, 0.18)', text: 'text-purple-500', bg: 'from-purple-500/20' },
  slate: { glow: 'rgba(71, 85, 105, 0.18)', text: 'text-slate-500', bg: 'from-slate-500/20' },
};

export default function Contacts() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeAccent, setActiveAccent] = useState<AccentColor>('cyan');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [nameVal, setNameVal] = useState<string>('');
  const [emailVal, setEmailVal] = useState<string>('');
  const [msgVal, setMsgVal] = useState<string>('');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        toast.success('Your message was received! Sanket will get back to you promptly.', 'Message Sent');
        formRef.current.reset();
        setNameVal('');
        setEmailVal('');
        setMsgVal('');
      } else {
        console.error('Failed to send inquiry message:', data.error);
        setStatus('error');
        toast.error(data.error || 'Failed to deliver message. Please try again.', 'Delivery Failed');
      }
    } catch (err) {
      console.error('Error sending inquiry message:', err);
      setStatus('error');
      toast.error('Network error. Please try again.', 'Delivery Failed');
    }
  }

  const handleCopyLink = async (e: React.MouseEvent, label: string, textToCopy: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedLabel(label);
      toast.success(`${label} copied to clipboard!`, 'Copied');
      setTimeout(() => setCopiedLabel(null), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard.');
    }
  };

  const socialLinks: {
    label: string;
    icon: IconType;
    href: string | null;
    accent: AccentColor;
    value: string;
    copyValue: string;
  }[] = [
      {
        label: 'LinkedIn',
        icon: FiLinkedin,
        href: PersonalInfo.linkedIn,
        accent: 'blue',
        value: 'sanket-kedare-dev',
        copyValue: PersonalInfo.linkedIn,
      },
      {
        label: 'GitHub',
        icon: FiGithub,
        href: PersonalInfo.github,
        accent: 'slate',
        value: 'sanketkedare',
        copyValue: PersonalInfo.github,
      },
      {
        label: 'X (Twitter)',
        icon: FaXTwitter,
        href: PersonalInfo.twitter,
        accent: 'slate',
        value: '@sanketkedare',
        copyValue: PersonalInfo.twitter,
      },
      {
        label: 'WhatsApp',
        icon: FaWhatsapp,
        href: `https://wa.me/91${PersonalInfo.mobile}`,
        accent: 'emerald',
        value: 'Quick Chat',
        copyValue: `+91${PersonalInfo.mobile}`,
      },
      {
        label: 'Email',
        icon: FiMail,
        href: `mailto:${PersonalInfo.email}`,
        accent: 'cyan',
        value: PersonalInfo.email,
        copyValue: PersonalInfo.email,
      },
    ];

  const currentTheme = accentMap[activeAccent];

  return (
    <section id="contact" className="relative w-full min-h-screen py-20 md:py-32 bg-transparent dark:bg-[#050511] overflow-hidden transition-colors duration-1000 flex items-center">
      {/* Dynamic Ambient Glow Mesh - Seamless Flow into Footer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            background: `radial-gradient(circle at 70% 60%, ${currentTheme.glow} 0%, transparent 70%)`
          }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 opacity-70"
        />
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-36 -right-32 w-[36rem] h-[36rem] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="w-full lg:w-[82%] px-6 lg:px-0 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

          {/* Left Column: Contact Bio & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            {/* Left Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-extrabold tracking-[0.25em] uppercase text-[9px] mb-4 shadow-sm">
              <FiZap size={11} className="text-cyan-500 animate-pulse" />
              <span>Direct Inquiry</span>
            </div>

            {/* Left Heading */}
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-none">
              Let&apos;s Connect.
            </h2>

            {/* Left Subtitle */}
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-sm mb-8 leading-relaxed opacity-90">
              Have a project in mind, an engineering opening, or an architectural challenge? Let&apos;s talk technical scope and execution.
            </p>

            <div className="space-y-5">
              {socialLinks.map((link) => (
                <div key={link.label} className="flex items-center gap-3">
                  <motion.a
                    href={link.href ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setActiveAccent(link.accent)}
                    onMouseLeave={() => setActiveAccent('cyan')}
                    className="flex flex-col group w-fit"
                  >
                    <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors duration-300 group-hover:text-cyan-500">
                      {link.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <link.icon size={14} className={`transition-colors duration-300 ${activeAccent === link.accent ? currentTheme.text : 'text-slate-700 dark:text-slate-300'}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white border-b border-transparent group-hover:border-cyan-500 transition-all">
                        {link.value}
                      </span>
                    </div>
                  </motion.a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, link.label, link.copyValue)}
                    title={`Copy ${link.label} link`}
                    className="self-end mb-0.5 p-1 rounded text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
                  >
                    {copiedLabel === link.label ? (
                      <FiCheck size={13} className="text-emerald-500" />
                    ) : (
                      <FiCopy size={12} />
                    )}
                  </button>
                </div>
              ))}

              <div className="pt-6 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FiMapPin size={13} className="text-cyan-500" />
                <span className="text-[9px] font-extrabold uppercase tracking-widest">{PersonalInfo.location}</span>
                <span className="mx-1 opacity-25">|</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Available Remotely</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 10/10 Minimalist Floating Underline Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            {/* Right Badge - Symmetric with Left Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold tracking-[0.25em] uppercase text-[9px] mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Fast Response</span>
            </div>

            {/* Right Heading - Symmetric with Left Heading */}
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-none">
              Send Message.
            </h2>

            {/* Right Subtitle - Symmetric with Left Subtitle */}
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-sm mb-8 leading-relaxed opacity-90">
              Fill out the details below and I&apos;ll get back to you promptly.
            </p>

            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="relative w-full flex flex-col gap-6"
            >
              {/* Grid: Full Name & Email Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* 01. Full Name */}
                <div className="relative group space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-300">
                    <label htmlFor="contact-name" className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-1.5 cursor-pointer">
                      <FiUser size={12} className={focusedField === 'name' ? 'text-cyan-500' : 'text-slate-500 dark:text-slate-400'} />
                      01. Full Name
                    </label>
                    {nameVal && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-500">
                        <FiCheck size={12} />
                      </motion.span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-transparent border-b border-slate-300 dark:border-white/15 focus:border-cyan-500 py-2.5 text-sm md:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300"
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 shadow-[0_2px_8px_rgba(6,182,212,0.5)]"
                      initial={{ width: '0%' }}
                      animate={{ width: focusedField === 'name' ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* 02. Email Address */}
                <div className="relative group space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-300">
                    <label htmlFor="contact-email" className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-1.5 cursor-pointer">
                      <FiMail size={12} className={focusedField === 'email' ? 'text-cyan-500' : 'text-slate-500 dark:text-slate-400'} />
                      02. Email Address
                    </label>
                    {emailVal && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-500">
                        <FiCheck size={12} />
                      </motion.span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="alex@company.com"
                      className="w-full bg-transparent border-b border-slate-300 dark:border-white/15 focus:border-cyan-500 py-2.5 text-sm md:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300"
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 shadow-[0_2px_8px_rgba(6,182,212,0.5)]"
                      initial={{ width: '0%' }}
                      animate={{ width: focusedField === 'email' ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* 03. Message Field */}
              <div className="relative group space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-300">
                  <label htmlFor="contact-message" className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-1.5 cursor-pointer">
                    <FiMessageSquare size={12} className={focusedField === 'message' ? 'text-cyan-500' : 'text-slate-500 dark:text-slate-400'} />
                    03. Your Message
                  </label>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{msgVal.length} chars</span>
                </div>
                <div className="relative">
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={3}
                    value={msgVal}
                    onChange={(e) => setMsgVal(e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Describe your inquiry, project vision, or question..."
                    className="w-full bg-transparent border-b border-slate-300 dark:border-white/15 focus:border-cyan-500 py-2.5 text-sm md:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 resize-none"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 shadow-[0_2px_8px_rgba(6,182,212,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: focusedField === 'message' ? '100%' : '0%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Submit Button - Aligned Proportions */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`relative overflow-hidden group py-3 px-8 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg w-full md:w-auto md:self-start mt-1 ${status === 'loading'
                    ? 'bg-slate-200 dark:bg-white/10 text-slate-400'
                    : 'bg-slate-900 hover:bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:via-blue-600 dark:to-cyan-500 text-white shadow-cyan-500/20 hover:shadow-cyan-500/40'
                  }`}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                {status === 'idle' && (
                  <>
                    <span>Send Message</span>
                    <FiSend size={14} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300 text-cyan-400 dark:text-white" />
                  </>
                )}
                {status === 'loading' && <span className="animate-pulse">Transmitting...</span>}
                {status === 'success' && <span className="text-emerald-400 italic">Delivered!</span>}
                {status === 'error' && <span className="text-red-400 italic">Transmission Failed</span>}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
