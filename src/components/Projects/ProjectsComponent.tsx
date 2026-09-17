'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiArrowUpRight, FiLock, FiBookOpen } from 'react-icons/fi';
import ProjectList from './ProjectList.json';
import EnterpriseShowcase from './EnterpriseShowcase';

interface Project {
  id:        number;
  title:     string;
  subtitle?: string;
  category?: 'production' | 'enterprise' | 'academic';
  badge?:    string;
  domain?:   string;
  client?:   string;
  role?:     string;
  git?:      string;
  live?:     string;
  caseStudy?: string;
  skills:    string[];
  img:       string;
  des:       string;
  status?:   string;
  features?: string[];
}

const COLOR_THEMES = [
  {
    bg: 'bg-cyan-50/70 dark:bg-[#0c0d1e]/90',
    border: 'border-cyan-200/90 dark:border-white/10 hover:border-cyan-400 dark:hover:border-cyan-500/40',
    shadow: 'shadow-[0_10px_35px_-5px_rgba(6,182,212,0.12)] hover:shadow-[0_15px_45px_-5px_rgba(6,182,212,0.2)]',
    titleHover: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-400',
    accentText: 'text-cyan-800 dark:text-cyan-400',
    chip: 'bg-cyan-100/80 dark:bg-white/5 border-cyan-200 dark:border-white/10 text-cyan-900 dark:text-slate-300',
  },
  {
    bg: 'bg-purple-50/70 dark:bg-[#0c0d1e]/90',
    border: 'border-purple-200/90 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40',
    shadow: 'shadow-[0_10px_35px_-5px_rgba(168,85,247,0.12)] hover:shadow-[0_15px_45px_-5px_rgba(168,85,247,0.2)]',
    titleHover: 'group-hover:text-purple-700 dark:group-hover:text-purple-400',
    accentText: 'text-purple-800 dark:text-purple-400',
    chip: 'bg-purple-100/80 dark:bg-white/5 border-purple-200 dark:border-white/10 text-purple-900 dark:text-slate-300',
  },
  {
    bg: 'bg-indigo-50/70 dark:bg-[#0c0d1e]/90',
    border: 'border-indigo-200/90 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/40',
    shadow: 'shadow-[0_10px_35px_-5px_rgba(99,102,241,0.12)] hover:shadow-[0_15px_45px_-5px_rgba(99,102,241,0.2)]',
    titleHover: 'group-hover:text-indigo-700 dark:group-hover:text-indigo-400',
    accentText: 'text-indigo-800 dark:text-indigo-400',
    chip: 'bg-indigo-100/80 dark:bg-white/5 border-indigo-200 dark:border-white/10 text-indigo-900 dark:text-slate-300',
  },
  {
    bg: 'bg-emerald-50/70 dark:bg-[#0c0d1e]/90',
    border: 'border-emerald-200/90 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/40',
    shadow: 'shadow-[0_10px_35px_-5px_rgba(16,185,129,0.12)] hover:shadow-[0_15px_45px_-5px_rgba(16,185,129,0.2)]',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
    accentText: 'text-emerald-800 dark:text-emerald-400',
    chip: 'bg-emerald-100/80 dark:bg-white/5 border-emerald-200 dark:border-white/10 text-emerald-900 dark:text-slate-300',
  },
  {
    bg: 'bg-amber-50/70 dark:bg-[#0c0d1e]/90',
    border: 'border-amber-200/90 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-500/40',
    shadow: 'shadow-[0_10px_35px_-5px_rgba(245,158,11,0.12)] hover:shadow-[0_15px_45px_-5px_rgba(245,158,11,0.2)]',
    titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
    accentText: 'text-amber-800 dark:text-amber-400',
    chip: 'bg-amber-100/80 dark:bg-white/5 border-amber-200 dark:border-white/10 text-amber-900 dark:text-slate-300',
  },
];

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

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { 
      type: 'spring' as const, 
      stiffness: 80, 
      damping: 15,
      mass: 1
    }
  }
};

export function DescriptionWithReadMore({ text, title, maxLen = 135 }: { text: string; title: string; maxLen?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLong = text.length > maxLen;
  const truncatedText = isLong ? `${text.slice(0, maxLen).trim()}...` : text;

  // Auto-collapse when clicking anywhere outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div ref={containerRef} className="relative mb-4">
      <motion.p
        layout
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-xs md:text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-semibold"
      >
        {isExpanded ? text : truncatedText}
        {isLong && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="ml-1.5 text-cyan-800 dark:text-cyan-400 font-black hover:underline inline-flex items-center gap-0.5 cursor-pointer select-none"
          >
            {isExpanded ? ' Show Less' : ' Read More...'}
          </button>
        )}
      </motion.p>
    </div>
  );
}

function ProjectCard({ project, isLarge = false, themeIndex = 0 }: { project: Project; isLarge?: boolean; themeIndex?: number }) {
  const isDevelopment = project.status === 'Active Development';
  const isEnterprise = project.category === 'enterprise';

  const theme = COLOR_THEMES[themeIndex % COLOR_THEMES.length];

  if (isLarge) {
    return (
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
        className={`group relative col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl md:rounded-3xl ${theme.bg} ${theme.border} backdrop-blur-2xl ${theme.shadow} transition-all duration-500 overflow-hidden flex flex-col md:grid md:grid-cols-12`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Left Side: 16:9 Image Display */}
        <div className="relative w-full aspect-video md:aspect-auto md:col-span-6 md:h-full min-h-[240px] md:min-h-[360px] overflow-hidden bg-slate-950">
          <Image
            src={project.img}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 650px"
            loading="lazy"
            className="object-cover transition-all duration-700 saturate-100 group-hover:saturate-110 group-hover:scale-105"
          />

          {/* Floating Top Badge */}
          <div className="absolute top-3.5 left-3.5 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-slate-950/85 text-cyan-400 border border-cyan-500/40 backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              {project.badge || 'Featured Project'}
            </span>
          </div>

          {/* Floating Case Study Available Label */}
          {project.caseStudy && (
            <div className="absolute top-3.5 right-3.5 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md shadow-lg shadow-emerald-950/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <FiBookOpen size={11} className="text-emerald-400" />
                <span>Case Study</span>
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Rich Enterprise Content */}
        <div className="p-6 md:p-8 md:col-span-6 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accentText}`}>
                Featured Production System • Architected by Sanket
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {project.caseStudy && (
                  <a
                    href={project.caseStudy}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-800 dark:text-emerald-400 hover:text-white dark:hover:text-black border border-emerald-400/40 dark:border-emerald-500/30 hover:border-transparent text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-2xs"
                    title="Read Architecture Case Study"
                  >
                    <FiBookOpen size={12} />
                    <span>Case Study</span>
                    <FiArrowUpRight size={11} />
                  </a>
                )}
                {project.git && (
                  <a
                    href={project.git}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-2xs"
                    title="GitHub Repository"
                  >
                    <FiGithub size={15} />
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-2xs"
                    title="Live Platform Demo"
                  >
                    <FiArrowUpRight size={17} />
                  </a>
                )}
              </div>
            </div>

            <h3 className={`text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight ${theme.titleHover} transition-colors leading-tight mb-2.5`}>
              {project.title}
            </h3>

            <DescriptionWithReadMore text={project.des} title={project.title} maxLen={135} />

            {/* Feature Highlights */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-2 mb-5">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-1.5 shrink-0 shadow-xs" />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Tech Chips */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-1.5 mb-4">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className={`px-2.5 py-0.5 rounded-md ${theme.chip} text-[9px] md:text-[10px] font-bold tracking-wide`}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Direct CTA Action */}
            <div className="flex items-center gap-2.5">
              {project.caseStudy && (
                <a
                  href={project.caseStudy}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-900 dark:text-cyan-300 hover:text-black font-black text-xs uppercase tracking-wider border border-cyan-400/40 dark:border-cyan-500/30 hover:border-transparent transition-all shadow-md"
                >
                  <FiBookOpen size={14} />
                  <span>Case Study</span>
                  <FiArrowUpRight size={14} />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500 hover:to-cyan-400 text-cyan-950 dark:text-cyan-300 hover:text-black font-black text-xs uppercase tracking-wider border border-cyan-400/40 dark:border-cyan-500/30 hover:border-transparent transition-all shadow-md ${
                    project.caseStudy ? 'flex-1' : 'w-full'
                  }`}
                >
                  <span>Live Platform Demo</span>
                  <FiArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={`group relative flex flex-col h-full rounded-2xl md:rounded-3xl ${theme.bg} ${theme.border} backdrop-blur-2xl ${theme.shadow} transition-all duration-500 overflow-hidden col-span-1 ${
        isDevelopment ? 'opacity-85 hover:opacity-100' : ''
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Dynamic 16:9 Widescreen Image Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-950">
        <Image
          src={project.img}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 450px"
          loading="lazy"
          className={`object-cover transition-all duration-700 ${
            isDevelopment
              ? 'saturate-90 group-hover:saturate-100 group-hover:scale-105'
              : 'saturate-100 group-hover:saturate-110 group-hover:scale-105'
          }`}
        />

        {/* Floating Top Badge */}
        {project.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-md ${
              isEnterprise 
                ? 'bg-slate-950/85 text-purple-300 border border-purple-500/35' 
                : 'bg-slate-950/80 text-cyan-400 border border-cyan-500/30'
            }`}>
              {project.badge}
            </span>
          </div>
        )}

        {/* Active Development Indicator */}
        {isDevelopment && (
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-slate-950/85 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Active Dev
            </span>
          </div>
        )}

        {/* Floating Case Study Available Label */}
        {project.caseStudy && !isDevelopment && (
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md shadow-lg shadow-emerald-950/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <FiBookOpen size={11} className="text-emerald-400" />
              <span>Case Study</span>
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />
      </div>

      {/* Card Content Body */}
      <div className="p-5 md:p-6 flex flex-col flex-1 justify-between relative z-10">
        <div>
          {/* Client & Role Subtitle for Enterprise Deliverables */}
          {isEnterprise && project.client && project.role && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                {project.role}
              </span>
              <span className="text-[9.5px] text-slate-400 dark:text-slate-600">•</span>
              <span className="text-[9.5px] font-semibold text-slate-600 dark:text-slate-400">
                {project.client}
              </span>
            </div>
          )}

          {/* Header & External Links */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3 className={`text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tight ${theme.titleHover} transition-colors leading-snug`}>
              {project.title}
            </h3>

            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              {project.caseStudy && (
                <a
                  href={project.caseStudy}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-800 dark:text-emerald-400 hover:text-white dark:hover:text-black border border-emerald-400/40 dark:border-emerald-500/30 hover:border-transparent text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-2xs"
                  title="Architecture Case Study"
                >
                  <FiBookOpen size={12} />
                  <span>Case Study</span>
                  <FiArrowUpRight size={11} />
                </a>
              )}
              {isEnterprise ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold text-slate-700 dark:text-slate-400 bg-slate-200/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 shadow-2xs"
                  title="Proprietary commercial codebase under NDA"
                >
                  <FiLock size={10} className="text-amber-600 dark:text-amber-500/90" />
                  <span className="hidden sm:inline">Proprietary</span>
                </span>
              ) : (
                project.git && (
                  <a
                    href={project.git}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-2xs"
                    title="GitHub Repository"
                  >
                    <FiGithub size={15} />
                  </a>
                )
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-2xs"
                  title="Live Demo"
                >
                  <FiArrowUpRight size={17} />
                </a>
              )}
            </div>
          </div>

          <DescriptionWithReadMore text={project.des} title={project.title} maxLen={115} />
        </div>

        <div>
          {/* Tech Stack Chips */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 flex flex-wrap items-center gap-1.5">
            {project.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className={`px-2.5 py-0.5 rounded-md ${theme.chip} text-[9px] md:text-[10px] font-bold tracking-wide`}
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className={`text-[9px] md:text-[10px] font-black ${theme.accentText} px-1`}>
                +{project.skills.length - 4}
              </span>
            )}
          </div>

          {/* Dedicated Case Study CTA Link with Label */}
          {project.caseStudy && (
            <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-white/5">
              <a
                href={project.caseStudy}
                target="_blank"
                rel="noreferrer"
                className="group/cs flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-400/40 dark:border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/20 transition-all duration-300 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 border border-emerald-400/40 dark:border-emerald-500/30 group-hover/cs:scale-110 transition-transform">
                    <FiBookOpen size={13} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        Case Study Available
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-400/40 dark:border-emerald-500/30">
                        Read
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-700 dark:text-slate-400 font-semibold">
                      Architecture &amp; technical deep dive
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-emerald-800 dark:text-emerald-400 group-hover/cs:translate-x-1 transition-transform pr-1">
                  <FiArrowUpRight size={15} />
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsComponent() {
  const projects = useMemo(() => ProjectList as Project[], []);

  const productionProjects = useMemo(
    () => projects.filter((p) => p.category === 'production'),
    [projects]
  );
  const enterpriseProjects = useMemo(
    () => projects.filter((p) => p.category === 'enterprise'),
    [projects]
  );
  const academicProjects = useMemo(
    () => projects.filter((p) => p.category === 'academic'),
    [projects]
  );

  return (
    <section id="projects" className="relative w-full min-h-screen py-24 flex flex-col justify-center border-none bg-transparent dark:bg-[#050511] overflow-hidden">
      {/* Background Motion Kinetic Atmosphere & Dot Grid Overlay (Full Width Edge-to-Edge) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
        <motion.div 
          animate={{ x: [0, 35, -25, 0], y: [0, -35, 25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-cyan-400/20 dark:bg-cyan-500/[0.08] rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 30, 0], y: [0, 40, -25, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -left-20 w-[550px] h-[550px] bg-purple-400/20 dark:bg-purple-500/[0.08] rounded-full blur-[130px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.35] dark:opacity-[0.2]" />
      </div>

      <div className="w-full lg:w-[80%] mx-auto px-6 lg:px-0 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12 text-center md:text-left"
        >
          <h2 className="text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-800 to-indigo-950 dark:from-cyan-400 dark:to-white tracking-tight md:tracking-normal">
            Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 mx-auto md:mx-0 rounded-full shadow-sm" />
        </motion.div>

        {/* 1. Production / Flagship Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          style={{ perspective: 1200 }}
        >
          {productionProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} isLarge={index === 0} themeIndex={index} />
          ))}
        </motion.div>

        {/* 2. Enterprise & Client Deliverables (VisionTech Group) */}
        {enterpriseProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200/80 dark:border-white/10">
            <EnterpriseShowcase projects={enterpriseProjects} />
          </div>
        )}

        {/* 3. Academic & Foundation Projects (Below with Label) */}
        {academicProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200/80 dark:border-white/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center md:text-left"
            >
              <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Academic &amp; Foundation Projects
              </h3>
              <div className="w-12 h-1 bg-cyan-500 mt-3 mx-auto md:mx-0 rounded-full shadow-sm" />
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              style={{ perspective: 1200 }}
            >
              {academicProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} isLarge={false} themeIndex={index + 1} />
              ))}
            </motion.div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 right-0 text-[8rem] md:text-[15rem] font-black text-slate-900/[0.02] dark:text-white/[0.01] pointer-events-none select-none uppercase tracking-tighter leading-none">
        Works
      </div>
    </section>
  );
}
