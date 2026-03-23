'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import PersonalInfo from '@/lib/personal-info';

const HERO_SRC = '/hero.jpg';

const passage_1 = `I am a Full Stack Web Developer with a Bachelor of Engineering in Electronics and Telecommunication. With over 1.5 years of hands-on experience, I specialize in the MERN stack and have additional expertise in Next.js for optimized server and client-side rendering. Completing an intensive Full Stack Web Development program at AlmaBetter has refined my ability to build scalable, secure, and high-performance web applications. My strong foundation in Data Structures and Algorithms (DSA) allows me to tackle problem-solving with precision and efficiency.`;

const passage_2 = `During my role as a Full Stack Developer Intern at Unified Mentor, I developed GrowSphere, an industry-level investment platform emphasizing system design, Agile methodologies, Firebase authentication, and REST APIs. As a Teaching Assistant at AlmaBetter, I mentored aspiring developers, strengthening my expertise in JavaScript, React, Node.js, MongoDB, and business communication. My technical skills also include MySQL, MariaDB, database normalization, transaction management, and cloud services like AWS and Firebase.`;

const passage_3 = `On the frontend, I utilize Tailwind CSS to craft responsive and maintainable UI designs, while my backend expertise spans REST API development, middleware integration, and JWT authentication for secure applications. With hands-on experience in real-time dashboards, investment platforms, and modular React projects, I am passionate about creating innovative solutions that enhance user engagement and drive business growth.`;

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
    <section id="about" ref={containerRef} className="relative w-full min-h-screen py-32 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
          className="mb-20 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-outfit)] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-500">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-6 mx-auto md:mx-0 rounded-full" />
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Image with dramatic styling */}
          <motion.div 
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:w-1/3 w-full max-w-sm flex-shrink-0"
          >
            {/* Pulsing Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-40 animate-pulse" />
            
            {/* Image Container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0a0a1a]">
              <Image
                src={HERO_SRC}
                alt={PersonalInfo.name}
                fill
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-bold text-white">{PersonalInfo.name}</h3>
                <p className="text-cyan-400 text-sm">{PersonalInfo.role2}</p>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl -z-10" />
          </motion.div>

          {/* Right: Storytelling Content */}
          <motion.div 
            style={{ y: textY }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
              hidden: {}
            }}
            className="lg:w-2/3 flex flex-col gap-8 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)]"
          >
            <motion.p variants={textVariants} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors duration-300">
              {passage_1}
            </motion.p>
            <motion.p variants={textVariants} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors duration-300">
              {passage_2}
            </motion.p>
            <motion.p variants={textVariants} className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-cyan-500/10 dark:to-purple-500/10 border border-cyan-200 dark:border-cyan-500/20 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-xl hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-colors duration-300 text-slate-800 dark:text-white">
              {passage_3}
            </motion.p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
