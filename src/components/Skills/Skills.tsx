'use client';

import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
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
import { TbApi } from 'react-icons/tb';
import {
  SiOpenai,
  SiClaude,
  SiGooglegemini,
  SiGoogleappsscript,
  SiGithubcopilot,
  SiWindsurf,
  SiGoogle
} from 'react-icons/si';

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

export interface Skill {
  skill: string;
  type: 'Frontend Mastery' | 'Backend Architecture' | 'Cloud & Systems' | 'Core & Tools' | 'Databases';
  src?: StaticImageData;
  icon?: IconType;
  color?: string;
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
  { skill: 'REST APIs', type: 'Backend Architecture', icon: TbApi, color: '#38bdf8' },
];

// ── Authentic AI Brand Icons ──────────────────────────────────────────────────
const CursorIcon: IconType = ({ size = 24, style, className, ...props }) => (
  <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style} className={className} {...props}>
    <title>Cursor</title>
    <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
  </svg>
);

const AntigravityIcon: IconType = ({ size = 24, style, className, ...props }) => (
  <svg viewBox="0 0 112 112" width={size} height={size} fill="currentColor" style={style} className={className} {...props}>
    <title>Antigravity</title>
    <path d="M89.754 92.75c4.667 3.5 11.667 1.167 5.25-5.25-19.25-18.667-15.167-70-39.083-70-23.917 0-19.834 51.333-39.084 70-7 7 .584 8.75 5.25 5.25C40.171 80.5 39.004 58.917 55.921 58.917c16.916 0 15.75 21.583 33.833 33.833Z" />
  </svg>
);

const TraeIcon: IconType = ({ size = 24, style, className, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" style={style} className={className} {...props}>
    <title>Trae AI</title>
    <path
      fill="#32F08C"
      d="M24 20.541H3.428v-3.426H0V3.4h24V20.54zM3.428 17.115h17.144V6.827H3.428v10.288zm8.573-5.196l-2.425 2.424-2.424-2.424 2.424-2.424 2.425 2.424zm6.857-.001l-2.424 2.423-2.425-2.423 2.425-2.425 2.424 2.425z"
    />
  </svg>
);

const BlackboxAiIcon: IconType = ({ size = 24, style, className, ...props }) => (
  <svg viewBox="0 0 274 312" width={size} height={size} fill="none" style={style} className={className} {...props}>
    <title>Blackbox AI</title>
    <path
      d="M272.205 185.262C274.309 187.586 273.457 225.275 273.439 231.532C259.764 238.431 240.572 250.373 226.585 258.464L134.56 311.71C110.707 297.246 84.9748 282.861 60.7132 268.858C59.535 264.734 60.1441 227.775 60.2148 221.383L134.926 264.627C149.348 255.575 167.098 245.87 182.016 237.244L272.205 185.262Z"
      fill="#10b981"
    />
    <path
      d="M75.5572 34.3324C88.7347 42.2162 102.993 50.3876 115.919 58.5073C94.6995 70.7628 61.0157 88.8504 41.4509 101.802C41.4503 150.926 42.9122 209.169 41.3355 257.576C32.3066 252.354 8.25927 237.57 0 233.852V77.9571C20.5984 65.811 55.1389 44.4756 75.5572 34.3324Z"
      fill="#38bdf8"
    />
    <path
      d="M134.304 0H135.204C145.166 7.08673 167.646 19.5747 178.714 26.1553C210.351 44.8007 241.884 63.6219 273.312 82.6181C274.071 107.793 273.415 136.913 273.431 162.379C260.716 170.359 244.62 179.1 231.408 186.761L231.369 104.969L94.2639 23.2964C107.679 15.6494 121.027 7.88363 134.304 0Z"
      fill="#8b5cf6"
    />
  </svg>
);

// ── AI Tools & Ecosystem ──────────────────────────────────────────────────────
interface AiTool {
  skill: string;
  group: 'AI IDEs' | 'Coding Agents' | 'AI Models' | 'Automation';
  icon: IconType;
  color?: string;
  className?: string;
}

const aiTools: AiTool[] = [
  // AI IDEs & Smart Editors
  { skill: 'Antigravity',    group: 'AI IDEs',       icon: AntigravityIcon, color: '#38bdf8' },
  { skill: 'Cursor IDE',     group: 'AI IDEs',       icon: CursorIcon,      className: 'text-slate-900 dark:text-violet-300' },
  { skill: 'Windsurf',       group: 'AI IDEs',       icon: SiWindsurf,      color: '#06b6d4' },
  { skill: 'Trae IDE',       group: 'AI IDEs',       icon: TraeIcon,        color: '#32F08C' },
  // Coding Agents
  { skill: 'GitHub Copilot', group: 'Coding Agents', icon: SiGithubcopilot, className: 'text-slate-900 dark:text-white' },
  { skill: 'Blackbox AI',    group: 'Coding Agents', icon: BlackboxAiIcon,  color: '#10b981' },
  { skill: 'OpenAI Codex',   group: 'Coding Agents', icon: SiOpenai,        color: '#10a37f' },
  // AI Models & Assistants
  { skill: 'ChatGPT',        group: 'AI Models',     icon: SiOpenai,        color: '#10a37f' },
  { skill: 'Claude',         group: 'AI Models',     icon: SiClaude,        color: '#D97757' },
  { skill: 'Gemini',         group: 'AI Models',     icon: SiGooglegemini,  color: '#4285F4' },
  // Automation & Google Tools
  { skill: 'Apps Script',    group: 'Automation',    icon: SiGoogleappsscript, color: '#4285F4' },
  { skill: 'AI Studio',      group: 'Automation',    icon: SiGoogle,        color: '#EA4335' },
];

interface EngineeringCategory {
  title: string;
  badge: string;
  iconText: string;
  accentBorder: string;
  badgeColor: string;
  dotColor: string;
  terms: string[];
}

const engineeringPractices: EngineeringCategory[] = [
  {
    title: 'Architecture & System Design',
    badge: 'Distributed Systems',
    iconText: '🏛️',
    accentBorder: 'border-l-4 border-l-cyan-500',
    badgeColor: 'bg-cyan-100/90 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-400 border border-cyan-300/80 dark:border-cyan-500/30',
    dotColor: 'bg-cyan-500',
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
    accentBorder: 'border-l-4 border-l-purple-500',
    badgeColor: 'bg-purple-100/90 dark:bg-purple-500/20 text-purple-900 dark:text-purple-400 border border-purple-300/80 dark:border-purple-500/30',
    dotColor: 'bg-purple-500',
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
    accentBorder: 'border-l-4 border-l-indigo-500',
    badgeColor: 'bg-indigo-100/90 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-400 border border-indigo-300/80 dark:border-indigo-500/30',
    dotColor: 'bg-indigo-500',
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
    <section id="skills" className="relative w-full min-h-screen flex flex-col justify-center border-t border-slate-200/80 dark:border-white/5 overflow-hidden bg-transparent dark:bg-[#050511] py-24">
      {/* Background Motion Kinetic Atmosphere & Dot Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 35, -25, 0], y: [0, -35, 25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-1/4 w-[550px] h-[550px] bg-cyan-400/20 dark:bg-cyan-500/[0.08] rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 30, 0], y: [0, 40, -25, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/[0.08] rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{ x: [0, 30, -35, 0], y: [0, -30, 35, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/[0.08] rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.35] dark:opacity-[0.2]" />
      </div>

      <div className="w-full lg:w-[80%] mx-auto px-6 lg:px-0 relative z-10">
        {/* Section Title */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h2 className="text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-800 to-indigo-950 dark:from-cyan-400 dark:via-white dark:to-slate-300 tracking-tight md:tracking-normal">
            Tech Arsenal
          </h2>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-400 font-semibold mt-2 max-w-2xl">
            Technologies I&apos;ve shipped with in production — from client UIs to cloud infrastructure.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 mx-auto md:mx-0 rounded-full shadow-sm" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

          {/* Card 1: Frontend Mastery & 3D WebGL (2 Cols - Soft Sky Cyan Studio Tint) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-cyan-50/70 dark:bg-[#0a0a1a] backdrop-blur-xl border border-cyan-200/90 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_-5px_rgba(6,182,212,0.12)] dark:shadow-2xl hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-[0_15px_45px_-5px_rgba(6,182,212,0.2)] transition-all duration-500 group">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl border border-cyan-300 dark:border-cyan-500/30 bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-800 dark:text-cyan-400 text-xs shadow-xs">🎨</span>
                <span>Frontend Architecture &amp; 3D WebGL</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-900 dark:text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-100/90 dark:bg-cyan-500/20 border border-cyan-300/80 dark:border-cyan-500/30 shadow-xs">
                Production Ready
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {frontend.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-1.5 group/item">
                  <div className="w-11 md:w-12 h-11 md:h-12 flex items-center justify-center p-1 bg-transparent group-hover/item:scale-115 transition-transform duration-300">
                    {skill.src ? (
                      <Image src={skill.src} alt={skill.skill} loading="lazy" className="w-full h-full object-contain filter group-hover/item:brightness-110 transition-all" />
                    ) : skill.icon ? (
                      <skill.icon size={26} style={{ color: skill.color }} className="group-hover/item:scale-110 transition-transform" />
                    ) : null}
                  </div>
                  <span className="text-[8.5px] md:text-[9.5px] text-slate-800 dark:text-slate-400 font-black uppercase tracking-wider text-center group-hover/item:text-cyan-700 dark:group-hover/item:text-cyan-400 transition-colors">
                    {skill.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: DSA, Core Engineering & Cloud (1 Col - Soft Lavender Purple Studio Tint) */}
          <div className="col-span-1 bg-purple-50/70 dark:bg-gradient-to-br dark:from-[#0a0a1a] dark:via-[#0c081e] dark:to-[#120a22] backdrop-blur-xl border border-purple-200/90 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_-5px_rgba(168,85,247,0.12)] dark:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-[0_15px_45px_-5px_rgba(168,85,247,0.2)] transition-all duration-500">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl border border-purple-300 dark:border-purple-500/30 flex items-center bg-purple-100 dark:bg-purple-500/20 justify-center text-purple-800 dark:text-purple-400 text-xs shadow-xs">⚡</span>
                <span>DSA, Core &amp; Cloud</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 dark:text-purple-400 px-2.5 py-1 rounded-full bg-purple-100/90 dark:bg-purple-500/20 border border-purple-300/80 dark:border-purple-500/30 shadow-xs">
                Battle Tested
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2.5 md:gap-3">
              {cloudAndCore.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-1.5 group/item">
                  <div className="w-11 md:w-12 h-11 md:h-12 flex items-center justify-center p-1 bg-transparent group-hover/item:scale-115 transition-transform duration-300">
                    {skill.src ? (
                      <Image src={skill.src} alt={skill.skill} loading="lazy" className="w-full h-full object-contain" />
                    ) : skill.icon ? (
                      <skill.icon size={24} style={{ color: skill.color }} className="group-hover/item:scale-110 transition-transform" />
                    ) : null}
                  </div>
                  <span className="text-[8.5px] md:text-[9.5px] text-slate-800 dark:text-slate-400 font-bold tracking-tight text-center group-hover/item:text-purple-700 dark:group-hover/item:text-purple-400 transition-colors">
                    {skill.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Backend Architecture & Distributed Databases (3 Cols - Soft Royal Indigo Studio Tint with Live Marquee) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-indigo-50/70 dark:bg-[#0a0a1a] backdrop-blur-xl border border-indigo-200/90 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_-5px_rgba(99,102,241,0.12)] dark:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-[0_15px_45px_-5px_rgba(99,102,241,0.2)] transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
              <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl border border-indigo-300 dark:border-indigo-500/30 flex items-center bg-indigo-100 dark:bg-indigo-500/20 justify-center text-indigo-800 dark:text-indigo-400 text-xs shadow-xs">⚙️</span>
                <span>Backend Microservices, APIs &amp; Distributed Databases</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-100/90 dark:bg-indigo-500/20 border border-indigo-300/80 dark:border-indigo-500/30 shadow-xs self-start sm:self-auto">
                Databases &amp; APIs
              </span>
            </div>

            {/* Static grid — no carousel, no repeated badges */}
            <div className="relative z-10 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-3 md:gap-4 pt-2">
              {backendAndDb.map((skill) => (
                <div key={skill.skill} className="flex flex-col items-center gap-1.5 group/item">
                  <div className="w-11 md:w-12 h-11 md:h-12 flex items-center justify-center p-1 bg-transparent group-hover/item:scale-110 transition-transform duration-300">
                    {skill.src ? (
                      <Image
                        src={skill.src}
                        alt={skill.skill}
                        loading="lazy"
                        className={`w-full h-full object-contain filter group-hover/item:brightness-110 transition-all ${
                          skill.skill === 'ExpressJS' ? 'filter invert dark:invert-0' : ''
                        }`}
                      />
                    ) : skill.icon ? (
                      <skill.icon size={26} style={{ color: skill.color }} className="group-hover/item:scale-110 transition-transform" />
                    ) : null}
                  </div>
                  <span className="text-[8.5px] md:text-[9.5px] text-slate-800 dark:text-slate-400 font-black uppercase tracking-wider text-center group-hover/item:text-indigo-700 dark:group-hover/item:text-cyan-400 transition-colors">
                    {skill.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: AI Tools & Ecosystem (3 Cols - Soft Violet Studio Tint) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-violet-50/70 dark:bg-[#0a0a1a] backdrop-blur-xl border border-violet-200/90 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_-5px_rgba(139,92,246,0.12)] dark:shadow-2xl hover:border-violet-400 dark:hover:border-violet-500/50 hover:shadow-[0_15px_45px_-5px_rgba(139,92,246,0.2)] transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
              <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl border border-violet-300 dark:border-violet-500/30 flex items-center bg-violet-100 dark:bg-violet-500/20 justify-center text-violet-800 dark:text-violet-400 text-xs shadow-xs">🤖</span>
                <span>AI Tools &amp; Ecosystem</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-900 dark:text-violet-400 px-3 py-1 rounded-full bg-violet-100/90 dark:bg-violet-500/20 border border-violet-300/80 dark:border-violet-500/30 shadow-xs self-start sm:self-auto">
                Actively Using
              </span>
            </div>

            <div className="relative z-10 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-6 gap-3 md:gap-4 pt-2">
              {aiTools.map((tool) => (
                <div key={tool.skill} className="flex flex-col items-center gap-1.5 group/item">
                  <div className="w-11 md:w-12 h-11 md:h-12 flex items-center justify-center p-1 bg-transparent group-hover/item:scale-110 transition-transform duration-300">
                    <tool.icon size={26} style={tool.color ? { color: tool.color } : undefined} className={`group-hover/item:scale-110 transition-transform ${tool.className || ''}`} />
                  </div>
                  <span className="text-[8.5px] md:text-[9.5px] text-slate-800 dark:text-slate-400 font-black uppercase tracking-wider text-center group-hover/item:text-violet-700 dark:group-hover/item:text-violet-400 transition-colors">
                    {tool.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Software Engineering Core Disciplines & Methodologies (Open Architectural Layout) */}
        <div className="mt-8 sm:mt-14 pt-6 sm:pt-10 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider sm:tracking-widest bg-cyan-100/90 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-400 border border-cyan-300/80 dark:border-cyan-500/30 mb-2 shadow-2xs">
                <span>⚡ Professional Paradigms &amp; Methodologies</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Software Engineering Disciplines
              </h3>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-400 font-semibold mt-1 max-w-2xl leading-relaxed">
                Architectural patterns, engineering principles, and quality standards applied across production systems.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {engineeringPractices.map((practice) => (
              <div
                key={practice.title}
                className={`pl-3.5 sm:pl-5 ${practice.accentBorder} py-1 sm:py-2 transition-all duration-300`}
              >
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{practice.iconText}</span>
                    <h4 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight truncate sm:whitespace-normal">
                      {practice.title}
                    </h4>
                  </div>
                  <span className={`text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider sm:tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full shrink-0 ${practice.badgeColor}`}>
                    {practice.badge}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {practice.terms.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/70 dark:border-white/10 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-400 transition-all"
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
