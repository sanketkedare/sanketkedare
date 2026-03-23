'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

// Import actual skill icons from user's assets
import reactImg from '@/src/images/reactjs.png';
import nextjsImg from '@/src/images/nextjs.png';
import nodejsImg from '@/src/images/nodejs.png';
import mongoDbImg from '@/src/images/mongodb.png';
import tailwindImg from '@/src/images/tailwind.png';
import jsImg from '@/src/images/js.png';
import tsImg from '@/src/images/js.png'; // Fallback
import githubImg from '@/src/images/github.png';
import htmlImg from '@/src/images/html.png';
import cssImg from '@/src/images/css.png';
import expressjsImg from '@/src/images/expressjs.png';
import postmanImg from '@/src/images/postman.png';

const roles = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Database Engineer",
  "Cloud Engineer",
  "AI Engineer",
  "Software Architect",
  "System Designer"
];

const innerOrbitItems = [reactImg, nextjsImg, nodejsImg];
const middleOrbitItems = [mongoDbImg, tailwindImg, jsImg, githubImg];
const outerOrbitItems = [htmlImg, cssImg, expressjsImg, postmanImg];

const OrbitRing = ({ radius, duration, reverse, items }: { radius: number, duration: number, reverse?: boolean, items: StaticImageData[] }) => {
  const rotation = reverse ? -360 : 360;
  return (
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      className="absolute top-1/2 left-1/2 rounded-full border border-slate-300/40 dark:border-white/10"
      style={{
        width: radius * 2,
        height: radius * 2,
        x: '-50%',
        y: '-50%',
      }}
    >
      {items.map((src, i) => {
        const angle = (i / items.length) * 360;
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
            }}
          >
            <motion.div
              animate={{ rotate: -rotation }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-[#0a0a1a] shadow-xl dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 backdrop-blur-md"
            >
              <Image src={src} alt="skill" className="w-full h-full object-contain" />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default function Home() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative h-[100dvh] w-[80%] m-auto flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#050511]">
      
      {/* Background Glows (Contained) */}
      <div className="absolute top-1/2 left-1/4 w-[250px] h-[250px] bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-[95%] lg:w-[90%] mx-auto gap-6 mt-24 md:mt-16">
        
        {/* Left Side: Typography & CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[45%]">
          
          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-4 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Available for new opportunities
          </motion.div>

          {/* Core Identity */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] font-[family-name:var(--font-inter)] font-black tracking-[-0.04em] text-slate-900 dark:text-white drop-shadow-sm mb-2"
          >
            Sanket Kedare.
          </motion.h1>

          {/* Dynamic Role Switcher */}
          <div className="h-10 md:h-12 lg:h-14 w-full relative flex items-center justify-center lg:justify-start overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentRoleIndex}
                initial={{ y: 50, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -50, opacity: 0, rotateX: 90 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                className="absolute text-2xl md:text-3xl lg:text-4xl font-[family-name:var(--font-outfit)] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600 pb-1"
              >
                {roles[currentRoleIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium mt-3 mb-6"
          >
            I build high-performance web applications that demand attention. Armed with full-stack mastery over MERN and Next.js, I write ruthless, optimized code to turn complex architectures into flawless, globally-scalable digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
          >
            <a
              href="#projects"
              className="group px-6 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold hover:bg-cyan-600 dark:hover:bg-cyan-400 focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 text-sm"
            >
              <span>Explore Works</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-full border-2 border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-md text-sm"
            >
              Contact Me
            </a>
          </motion.div>

        </div>

        {/* Right Side: Orbital Skills Ferris Wheel */}
        <div className="flex-1 w-full lg:w-auto h-[350px] md:h-[400px] lg:h-[450px] relative hidden md:flex items-center justify-center scale-90 lg:scale-100">

          {/* Core Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] z-20">
            <span className="text-white font-bold text-lg md:text-xl tracking-tighter">&lt;SK /&gt;</span>
          </div>

          <OrbitRing radius={90} duration={15} items={innerOrbitItems} />
          <OrbitRing radius={150} duration={25} reverse items={middleOrbitItems} />
          <OrbitRing radius={210} duration={35} items={outerOrbitItems} />

        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none hidden lg:flex"
      >
        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[2px] h-8 bg-gradient-to-b from-cyan-500 to-transparent rounded-full"
/>
      </motion.div>
    </section>
  );
}
