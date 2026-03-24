'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import PersonalInfo from '@/lib/personal-info';

const HERO_SRC = '/hero.jpg';

const passage_1 = `I don't just build websites; I engineer technical dominance. My journey is defined by high-stakes development at Visiontech, where I took command of the Visiontech Academy flagship site, the LMS platform, and the complex EMS application. I don't follow trends—I architect system designs from the ground up that set the standard for performance and scalability.`;

const passage_2 = `My expertise isn't just theoretical. From optimizing Next.js to mastering the AWS cloud ecosystem, I've tackled real-world technical crises across diverse domains. Whether it's architecting clean systems or leading critical office-level technical initiatives, I operate with a precision that comes from solving high-impact engineering bottlenecks across various domains.`;

const passage_3 = `I am a Full Stack Architect who bridges the gap between visionary design and ruthless implementation. I master the MERN stack with the strategic foresight of an engineer who has built, scaled, and secured professional-grade platforms. I am here to build the future of the web, and I'm doing it with an uncompromising standard for excellence.`;

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  // Parallax effects
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section id="about" ref={containerRef} className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen py-24 flex items-center justify-center border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511]">
      <div className="w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
          className="mb-8 md:mb-12 text-center md:text-left"
        >
          <h2 className="text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 tracking-tight md:tracking-normal">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-12">
          
          {/* Left: Image with dramatic styling (col-span-1) */}
          <motion.div 
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:col-span-1 w-full max-w-sm flex-shrink-0 mx-auto lg:mx-0 h-[350px] md:h-[450px] lg:h-full min-h-[300px] z-20 -mb-8 lg:mb-0"
          >
            {/* Pulsing Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-40 animate-pulse" />
            
            {/* Image Container */}
            <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0a0a1a]">
              <Image
                src={HERO_SRC}
                alt={PersonalInfo.name}
                fill
                className="object-cover object-center saturate-100 hover:saturate-110 transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">System Architect</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white leading-none">{PersonalInfo.name}</h3>
                <p className="text-slate-400 text-[10px] md:text-xs mt-1">{PersonalInfo.role2}</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl -z-10" />
          </motion.div>

          {/* Right: Storytelling Content (col-span-3) */}
          <motion.div 
            style={{ y: textY }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
              hidden: {}
            }}
            className="lg:col-span-3 flex flex-col gap-4 md:gap-6 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed z-10"
          >
            {/* Top Box: Main Narrative */}
            <motion.div 
              variants={textVariants} 
              whileHover={{ y: -5, scale: 1.01 }}
              className="group relative cursor-pointer overflow-hidden bg-white/40 dark:bg-white/10 border-2 border-slate-200 dark:border-white/10 p-5 md:p-6 pt-12 md:pt-6 rounded-[1.5rem] md:rounded-[1.5rem] backdrop-blur-2xl shadow-xl hover:shadow-cyan-500/10 hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-0.5 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-cyan-500/20">
                  01 // Technical Command
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-sm md:text-base font-medium leading-relaxed">
                {passage_1}
              </p>
            </motion.div>

            {/* Bottom Grid: Expertise & Architecture - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                variants={textVariants} 
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative cursor-pointer overflow-hidden bg-white/40 dark:bg-white/10 border-2 border-slate-200 dark:border-white/10 p-6 rounded-[1.5rem] backdrop-blur-2xl shadow-lg hover:shadow-purple-500/10 hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-0.5 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-purple-500/20">
                    02 // Domain Expertise
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
                </div>
                <p className="text-slate-700 dark:text-slate-400 text-[13px] md:text-sm">
                  {passage_2}
                </p>
              </motion.div>

              <motion.div 
                variants={textVariants} 
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative cursor-pointer overflow-hidden bg-gradient-to-br from-cyan-500/5 to-purple-500/5 dark:from-cyan-500/10 dark:to-purple-500/10 border-2 border-cyan-500/30 dark:border-cyan-500/20 p-6 rounded-[1.5rem] backdrop-blur-2xl shadow-lg hover:shadow-cyan-500/20 hover:from-cyan-500/10 hover:to-purple-500/10 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-0.5 bg-white dark:bg-white/20 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/40 shadow-sm">
                    03 // Strategic Architecture
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white to-transparent opacity-20" />
                </div>
                <p className="text-slate-900 dark:text-white font-medium text-[13px] md:text-sm">
                  {passage_3}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Links Outside the Grid Layout */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
          className="mt-16 flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Witness the technical footprint:
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
            <a 
              href={PersonalInfo.github} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 group transition-all"
              aria-label="GitHub Profile"
            >
              <div className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500">
                <FiGithub size={28} className="group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-cyan-500 transition-colors">Github Domain</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  The Codebase Domain
                </span>
              </div>
            </a>

            <a 
              href={PersonalInfo.linkedIn} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 group transition-all"
              aria-label="LinkedIn Profile"
            >
              <div className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500">
                <FiLinkedin size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-cyan-500 transition-colors">Professional Network</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  The Strategic Network
                </span>
              </div>
            </a>
          </div>
        </motion.div>

        </div>
    </section>
  );
}
