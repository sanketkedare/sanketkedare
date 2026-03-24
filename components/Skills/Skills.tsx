'use client';

import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';

// Skill icons
import bootstrapImg from '@/src/images/bootstrap.png';
import cssImg       from '@/src/images/css.png';
import dsaImg       from '@/src/images/dsa.png';
import expressjsImg from '@/src/images/expressjs.png';
import githubImg    from '@/src/images/github.png';
import htmlImg      from '@/src/images/html.png';
import javaImg      from '@/src/images/java.png';
import jsImg        from '@/src/images/js.png';
import mariadbImg   from '@/src/images/mariadb.png';
import mongoDbImg   from '@/src/images/mongodb.png';
import mysqlImg     from '@/src/images/mysql.png';
import nextjsImg    from '@/src/images/nextjs.png';
import nodejsImg    from '@/src/images/nodejs.png';
import postmanImg   from '@/src/images/postman.png';
import reactImg     from '@/src/images/reactjs.png';
import springbootImg from '@/src/images/springboot.png';
import tailwindImg  from '@/src/images/tailwind.png';

interface Skill {
  skill: string;
  type: 'Programming Skills' | 'Frontend Skills' | 'Backend & Database';
  src: StaticImageData;
}

const skills: Skill[] = [
  // Programming Skills
  { skill: 'JavaScript', type: 'Programming Skills', src: jsImg },
  { skill: 'Java',       type: 'Programming Skills', src: javaImg },
  { skill: 'DSA',        type: 'Programming Skills', src: dsaImg },
  { skill: 'GitHub',     type: 'Programming Skills', src: githubImg },
  // Frontend
  { skill: 'HTML',       type: 'Frontend Skills', src: htmlImg },
  { skill: 'CSS',        type: 'Frontend Skills', src: cssImg },
  { skill: 'ReactJS',    type: 'Frontend Skills', src: reactImg },
  { skill: 'NextJS',     type: 'Frontend Skills', src: nextjsImg },
  { skill: 'Tailwind',   type: 'Frontend Skills', src: tailwindImg },
  { skill: 'Bootstrap',  type: 'Frontend Skills', src: bootstrapImg },
  // Backend & DB
  { skill: 'NodeJS',     type: 'Backend & Database', src: nodejsImg },
  { skill: 'ExpressJS',  type: 'Backend & Database', src: expressjsImg },
  { skill: 'Postman',    type: 'Backend & Database', src: postmanImg },
  { skill: 'MongoDB',    type: 'Backend & Database', src: mongoDbImg },
  { skill: 'MySQL',      type: 'Backend & Database', src: mysqlImg },
  { skill: 'MariaDB',    type: 'Backend & Database', src: mariadbImg },
  { skill: 'SpringBoot', type: 'Backend & Database', src: springbootImg },
];

const SKILL_TYPES = ['Frontend Skills', 'Backend & Database', 'Programming Skills'] as const;

export default function Skills() {
  const frontend = skills.filter((s) => s.type === 'Frontend Skills');
  const backend = skills.filter((s) => s.type === 'Backend & Database');
  const programming = skills.filter((s) => s.type === 'Programming Skills');

  return (
    <section id="skills" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen flex flex-col justify-center border-t border-slate-200 dark:border-white/5 overflow-hidden bg-slate-50 dark:bg-[#050511] py-24">
      <div className="mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12 text-center md:text-left"
        >
          <h2 className="text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-white tracking-tight md:tracking-normal">
            Tech Arsenal
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Box 1: Frontend (Span 2 cols on tablet, 1 on desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="col-span-2 md:col-span-2 lg:col-span-2 bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-2xl hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-colors duration-500 group"
          >
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-6 rounded border bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-[10px]">🎨</span>
              Frontend Mastery
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {frontend.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-1 group/item">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 group-hover/item:scale-110 group-hover/item:border-cyan-400 dark:group-hover/item:border-cyan-500/50 group-hover/item:shadow-[0_0_20px_rgba(6,182,212,0.1)] dark:group-hover/item:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                    <Image src={skill.src} alt={skill.skill} className="w-full h-full object-contain filter group-hover/item:brightness-125 transition-all" />
                  </div>
                  <span className="text-[8px] md:text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors">{skill.skill}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Box 2: Programming */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="col-span-1 bg-gradient-to-br from-white to-purple-50 dark:from-[#0a0a1a] dark:to-[#120a22] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500/50 transition-colors duration-500"
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-6 rounded flex items-center bg-purple-100 dark:bg-purple-500/20 justify-center text-purple-600 dark:text-purple-400 text-xs">⚡</span>
              Core & Tools
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {programming.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-2 group/item">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 group-hover/item:scale-110 group-hover/item:border-purple-400 dark:group-hover/item:border-purple-500/50 group-hover/item:shadow-[0_0_20px_rgba(168,85,247,0.1)] dark:group-hover/item:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                    <Image src={skill.src} alt={skill.skill} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">{skill.skill}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Box 3: Backend (Full Width) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors duration-500 overflow-hidden relative"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 relative z-10">
              <span className="w-6 h-6 rounded flex items-center bg-indigo-100 dark:bg-indigo-500/20 justify-center text-indigo-600 dark:text-indigo-400 text-xs">⚙️</span>
              Backend Architecture & Database
            </h3>
            
            {/* Infinite Marquee for Backend Skills */}
            <div className="flex overflow-hidden relative z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                className="flex gap-8 whitespace-nowrap min-w-max pr-8"
              >
                {/* Double the array for seamless infinite scroll */}
                {[...backend, ...backend, ...backend].map((skill, index) => (
                  <div key={`${skill.skill}-${index}`} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors duration-300 backdrop-blur-md">
                      <Image src={skill.src} alt={skill.skill} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{skill.skill}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
