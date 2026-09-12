'use client';

import Image, { StaticImageData } from 'next/image';
import { IconType } from 'react-icons';
import { 
  SiTypescript, 
  SiRedux, 
  SiThreedotjs, 
  SiFramer, 
  SiGreensock, 
  SiFirebase, 
  SiDocker, 
  SiVitest, 
  SiChartdotjs, 
  SiJsonwebtokens, 
  SiSocketdotio, 
  SiSpringsecurity 
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { SkillsMarquee, SkillItem } from './SkillsMarquee';

import bootstrapImg from '@/images/bootstrap.png';
import cssImg from '@/images/css.png';
import dsaImg from '@/images/dsa.png';
import expressjsImg from '@/images/expressjs.png';
import githubImg from '@/images/github.png';
import htmlImg from '@/images/html.png';
import javaImg from '@/images/java.png';
import jsImg from '@/images/js.png';
import mariadbImg from '@/images/mariadb.png';
import mongoDbImg from '@/images/mongodb.png';
import mysqlImg from '@/images/mysql.png';
import nextjsImg from '@/images/nextjs.png';
import nodejsImg from '@/images/nodejs.png';
import postmanImg from '@/images/postman.png';
import reactImg from '@/images/reactjs.png';
import springbootImg from '@/images/springboot.png';
import tailwindImg from '@/images/tailwind.png';

export interface Skill extends SkillItem {
  skill: string;
  type: 'Frontend Mastery' | 'Backend Architecture' | 'Cloud & Systems' | 'Core & Tools' | 'Databases';
}

const skills: Skill[] = [
  // --- Frontend Mastery ---
  { skill: 'React 19', type: 'Frontend Mastery', src: reactImg },
  { skill: 'Next.js 16', type: 'Frontend Mastery', src: nextjsImg },
  { skill: 'TypeScript', type: 'Frontend Mastery', icon: SiTypescript, color: '#3178C6' },
  { skill: 'JavaScript', type: 'Frontend Mastery', src: jsImg },
  { skill: 'Redux Toolkit', type: 'Frontend Mastery', icon: SiRedux, color: '#764ABC' },
  { skill: 'Tailwind CSS', type: 'Frontend Mastery', src: tailwindImg },
  { skill: 'Three.js / 3D', type: 'Frontend Mastery', icon: SiThreedotjs, color: '#06b6d4' },
  { skill: 'Framer Motion', type: 'Frontend Mastery', icon: SiFramer, color: '#0055FF' },
  { skill: 'GSAP Physics', type: 'Frontend Mastery', icon: SiGreensock, color: '#88CE02' },
  { skill: 'HTML5', type: 'Frontend Mastery', src: htmlImg },
  { skill: 'CSS3', type: 'Frontend Mastery', src: cssImg },
  { skill: 'Bootstrap', type: 'Frontend Mastery', src: bootstrapImg },

  // --- DSA, Core Engineering & Cloud Systems ---
  { skill: 'DSA', type: 'Cloud & Systems', src: dsaImg },
  { skill: 'AWS Cloud', type: 'Cloud & Systems', icon: FaAws, color: '#FF9900' },
  { skill: 'Docker', type: 'Cloud & Systems', icon: SiDocker, color: '#2496ED' },
  { skill: 'GitHub CI/CD', type: 'Cloud & Systems', src: githubImg },
  { skill: 'JWT & RBAC', type: 'Cloud & Systems', icon: SiJsonwebtokens, color: '#D63AFF' },
  { skill: 'Vitest Unit', type: 'Cloud & Systems', icon: SiVitest, color: '#729B1B' },
  { skill: 'Chart.js Viz', type: 'Cloud & Systems', icon: SiChartdotjs, color: '#FF6384' },
  { skill: 'Postman', type: 'Cloud & Systems', src: postmanImg },

  // --- Backend Architecture & Databases (used in Marquee & Cards) ---
  { skill: 'NodeJS', type: 'Backend Architecture', src: nodejsImg },
  { skill: 'ExpressJS', type: 'Backend Architecture', src: expressjsImg },
  { skill: 'Java', type: 'Backend Architecture', src: javaImg },
  { skill: 'SpringBoot', type: 'Backend Architecture', src: springbootImg },
  { skill: 'Spring Security', type: 'Backend Architecture', icon: SiSpringsecurity, color: '#6DB33F' },
  { skill: 'WebSockets', type: 'Backend Architecture', icon: SiSocketdotio, color: '#00bcd4' },
  { skill: 'MongoDB', type: 'Databases', src: mongoDbImg },
  { skill: 'MySQL', type: 'Databases', src: mysqlImg },
  { skill: 'MariaDB', type: 'Databases', src: mariadbImg },
  { skill: 'Firebase', type: 'Databases', icon: SiFirebase, color: '#FFCA28' },
  { skill: 'REST APIs', type: 'Backend Architecture', src: postmanImg },
];

interface EngineeringCategory {
  title: string;
  badge: string;
  iconText: string;
  borderColor: string;
  badgeColor: string;
  dotColor: string;
  terms: string[];
}

const engineeringPractices: EngineeringCategory[] = [
  {
    title: 'Architecture & System Design',
    badge: 'Distributed Systems',
    iconText: '🏛️',
    borderColor: 'hover:border-cyan-400 dark:hover:border-cyan-500/50',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    dotColor: 'bg-cyan-400',
    terms: [
      'Data Structures & Algorithms (DSA)',
      'Microservices Architecture',
      'High-Concurrency System Design',
      'RESTful API Engineering',
      'Event-Driven & WebSockets',
      'Server-Side Rendering (SSR/SSG)',
      'Multi-Tenant Architecture',
      'Distributed Caching & Indexing'
    ]
  },
  {
    title: 'Design Principles & Code Craft',
    badge: 'Code Quality',
    iconText: '📐',
    borderColor: 'hover:border-purple-400 dark:hover:border-purple-500/50',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    dotColor: 'bg-purple-400',
    terms: [
      'SOLID Design Principles',
      'DRY & KISS Methodologies',
      'Object-Oriented Programming (OOP)',
      'Functional Programming (FP)',
      'Flux State Management Patterns',
      'Design Systems & Atomic Design',
      'Clean Code & Refactoring'
    ]
  },
  {
    title: 'Reliability, DevOps & Security',
    badge: 'Production Excellence',
    iconText: '🛡️',
    borderColor: 'hover:border-indigo-400 dark:hover:border-indigo-500/50',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    dotColor: 'bg-indigo-400',
    terms: [
      'CI/CD Automated Pipelines',
      'Core Web Vitals Optimization',
      'Role-Based Access Control (RBAC)',
      'WCAG 2.1 AA Accessibility',
      'Test-Driven Development (TDD)',
      'Agile & Scrum Methodologies',
      'Zero-Downtime Deployment'
    ]
  }
];

export default function Skills() {
  const frontend = skills.filter((s) => s.type === 'Frontend Mastery');
  const cloudAndCore = skills.filter((s) => s.type === 'Cloud & Systems');
  const backendAndDb = skills.filter((s) => s.type === 'Backend Architecture' || s.type === 'Databases');

  return (
    <section id="skills" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen flex flex-col justify-center border-t border-slate-200 dark:border-white/5 overflow-hidden bg-slate-50 dark:bg-[#050511] py-24">
      <div className="mx-auto w-full">
        {/* Section Title */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h2 className="text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-white tracking-tight md:tracking-normal">
            Tech Arsenal
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 max-w-2xl">
            Production-proven technologies, frameworks, cloud services, and architectural primitives engineered across commercial enterprise systems and high-throughput applications.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          
          {/* Card 1: Frontend Mastery & 3D WebGL (2 Cols) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-2xl hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all duration-500 group">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl border bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs shadow-sm">🎨</span>
                <span>Frontend Architecture &amp; 3D WebGL</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                {frontend.length} Technologies
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {frontend.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-1.5 group/item">
                  <div className="w-11 md:w-12 h-11 md:h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2.5 group-hover/item:scale-110 group-hover/item:border-cyan-400 dark:group-hover/item:border-cyan-500/50 group-hover/item:shadow-[0_0_20px_rgba(6,182,212,0.15)] dark:group-hover/item:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                    {skill.src ? (
                      <Image src={skill.src} alt={skill.skill} loading="lazy" className="w-full h-full object-contain filter group-hover/item:brightness-125 transition-all" />
                    ) : skill.icon ? (
                      <skill.icon size={26} style={{ color: skill.color }} className="group-hover/item:scale-110 transition-transform" />
                    ) : null}
                  </div>
                  <span className="text-[8.5px] md:text-[9.5px] text-slate-600 dark:text-slate-400 font-black uppercase tracking-wider text-center group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors">
                    {skill.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: DSA, Core Engineering & Cloud (1 Col) */}
          <div className="col-span-1 bg-gradient-to-br from-white to-purple-50/50 dark:from-[#0a0a1a] dark:to-[#120a22] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-500">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl flex items-center bg-purple-100 dark:bg-purple-500/20 justify-center text-purple-600 dark:text-purple-400 text-xs shadow-sm">⚡</span>
                <span>DSA, Core &amp; Cloud</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                {cloudAndCore.length} Stacks
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2.5 md:gap-3">
              {cloudAndCore.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-1.5 group/item">
                  <div className="w-11 md:w-12 h-11 md:h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2.5 group-hover/item:scale-110 group-hover/item:border-purple-400 dark:group-hover/item:border-purple-500/50 group-hover/item:shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:group-hover/item:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                    {skill.src ? (
                      <Image src={skill.src} alt={skill.skill} loading="lazy" className="w-full h-full object-contain" />
                    ) : skill.icon ? (
                      <skill.icon size={24} style={{ color: skill.color }} className="group-hover/item:scale-110 transition-transform" />
                    ) : null}
                  </div>
                  <span className="text-[8.5px] md:text-[9.5px] text-slate-600 dark:text-slate-400 font-bold tracking-tight text-center group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">
                    {skill.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Backend Architecture & Distributed Databases (3 Cols with Live Marquee) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
              <h3 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl flex items-center bg-indigo-100 dark:bg-indigo-500/20 justify-center text-indigo-600 dark:text-indigo-400 text-xs shadow-sm">⚙️</span>
                <span>Backend Microservices, APIs &amp; Distributed Databases</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 self-start sm:self-auto">
                Databases &amp; APIs
              </span>
            </div>
            
            <div className="relative z-10 pt-2 pb-2">
              <SkillsMarquee backend={backendAndDb} />
            </div>
          </div>

        </div>

        {/* Software Engineering Core Disciplines & Methodologies */}
        <div className="mt-10 pt-10 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
                <span>⚡ Professional Paradigms &amp; Methodologies</span>
              </div>
              <h3 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Software Engineering Disciplines
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-2xl">
                Architectural patterns, engineering principles, and quality standards applied across production systems.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {engineeringPractices.map((practice) => (
              <div
                key={practice.title}
                className={`rounded-3xl bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 p-6 shadow-sm dark:shadow-2xl transition-all duration-500 ${practice.borderColor}`}
              >
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{practice.iconText}</span>
                    <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight">
                      {practice.title}
                    </h4>
                  </div>
                  <span className={`text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${practice.badgeColor}`}>
                    {practice.badge}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {practice.terms.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-cyan-400 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${practice.dotColor} shrink-0 shadow-sm`} />
                      <span>{term}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
