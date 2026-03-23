'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import PersonalInfo from '@/lib/personal-info';
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function Contacts() {
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      .then(
        () => setStatus('success'),
        () => setStatus('error'),
      );
  }

  const inputClasses = "w-full bg-white dark:bg-[#050511] border border-slate-300 dark:border-white/10 rounded-xl px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300";

  return (
    <section id="contact" className="relative w-full py-32 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col justify-center"
        >
          <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-outfit)] font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
            Let's <span className="text-cyan-600 dark:text-cyan-400">Talk.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 max-w-md">
            Have a project in mind or just want to say hi? Feel free to reach out. Connecting with fellow developers and creators is what I do best.
          </p>

          <div className="flex flex-col gap-8">
            <div className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5 w-fit">
              <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                <FiMail size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Email</p>
                <p className="text-slate-800 dark:text-white font-medium text-lg">{PersonalInfo.email}</p>
              </div>
            </div>

            <div className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5 w-fit">
              <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <FiMapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Location</p>
                <p className="text-slate-800 dark:text-white font-medium text-lg">{PersonalInfo.location}</p>
              </div>
            </div>

            <div className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5 w-fit">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <FiPhone size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Phone</p>
                <p className="text-slate-800 dark:text-white font-medium text-lg">{PersonalInfo.mobile}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative"
        >
          {/* Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          <form 
            ref={formRef} 
            onSubmit={sendEmail} 
            className="flex flex-col gap-6 bg-white/90 dark:bg-[#0a0a1a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-sm dark:shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <input type="text" name="name" required placeholder="Your Name" className={inputClasses} />
              </div>
              <div className="flex-1">
                <input type="email" name="email" required placeholder="Your Email" className={inputClasses} />
              </div>
            </div>
            
            <div>
              <input type="text" name="subject" placeholder="Subject (Optional)" className={inputClasses} />
            </div>

            <div>
              <textarea name="message" required placeholder="Write your message here..." rows={6} className={`${inputClasses} resize-none`} />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 flex items-center justify-center gap-3 w-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold py-5 rounded-xl hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'idle' && (
                <>
                  <span className="text-lg">Send Message</span>
                  <FiSend size={20} className="ml-2" />
                </>
              )}
              {status === 'loading' && <span className="text-lg animate-pulse">Sending...</span>}
              {status === 'success' && (
                <>
                  <span className="text-lg text-emerald-600">Sent Successfully!</span>
                  <FiCheckCircle size={20} className="text-emerald-600 ml-2" />
                </>
              )}
              {status === 'error' && (
                <>
                  <span className="text-lg text-red-600">Failed to Send</span>
                  <FiAlertCircle size={20} className="text-red-600 ml-2" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
