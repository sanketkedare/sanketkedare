'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGithub, FiArrowUpRight, FiLock } from 'react-icons/fi';
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
  git:       string;
  live:      string;
  skills:    string[];
  img:       string;
  des:       string;
  status?:   string;
  features?: string[];
}

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

function ProjectCard({ project, isLarge = false }: { project: Project; isLarge?: boolean }) {
  const isDevelopment = project.status === 'Active Development';
  const isEnterprise = project.category === 'enterprise';

  if (isLarge) {
    return (
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
        className="group relative col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl md:rounded-3xl bg-white/70 dark:bg-[#0c0d1e]/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-500 overflow-hidden flex flex-col md:grid md:grid-cols-12"
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

          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Rich Enterprise Content */}
        <div className="p-6 md:p-8 md:col-span-6 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                Featured Production System • Architected by Sanket
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {project.git && (
                  <a
                    href={project.git}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-sm"
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
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-sm"
                    title="Live Platform Demo"
                  >
                    <FiArrowUpRight size={17} />
                  </a>
                )}
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight mb-2.5">
              {project.title}
            </h3>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
              {project.des}
            </p>

            {/* Feature Highlights */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-2 mb-5">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Tech Chips */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center gap-1.5 mb-4">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] md:text-[10px] font-bold text-slate-700 dark:text-slate-300 tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Direct CTA Action */}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500 hover:to-cyan-400 text-cyan-600 dark:text-cyan-300 hover:text-black font-black text-xs uppercase tracking-wider border border-cyan-500/30 hover:border-transparent transition-all shadow-md"
              >
                <span>Live Platform Demo</span>
                <FiArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={`group relative flex flex-col h-full rounded-2xl md:rounded-3xl bg-white/60 dark:bg-[#0c0d1e]/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-500 overflow-hidden col-span-1 ${
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

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />
      </div>

      {/* Card Content Body */}
      <div className="p-5 md:p-6 flex flex-col flex-1 justify-between relative z-10">
        <div>
          {/* Client & Role Subtitle for Enterprise Deliverables */}
          {isEnterprise && project.client && project.role && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {project.role}
              </span>
              <span className="text-[9.5px] text-slate-400 dark:text-slate-600">•</span>
              <span className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400">
                {project.client}
              </span>
            </div>
          )}

          {/* Header & External Links */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3 className="text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
              {project.title}
            </h3>

            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              {isEnterprise ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
                  title="Proprietary commercial codebase under NDA"
                >
                  <FiLock size={10} className="text-amber-500/90" />
                  <span className="hidden sm:inline">Proprietary</span>
                </span>
              ) : (
                project.git && (
                  <a
                    href={project.git}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-sm"
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
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black hover:border-transparent transition-all shadow-sm"
                  title="Live Demo"
                >
                  <FiArrowUpRight size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium mb-5">
            {project.des}
          </p>
        </div>

        <div>
          {/* Tech Stack Chips */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-1.5">
            {project.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-md bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-[9px] md:text-[10px] font-bold text-slate-700 dark:text-slate-300 tracking-wide"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="text-[9px] md:text-[10px] font-bold text-cyan-600 dark:text-cyan-400 px-1">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
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
    <section id="projects" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen py-24 flex flex-col justify-center border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511] overflow-hidden">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12 text-center md:text-left"
        >
          <h2 className="text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-white tracking-tight md:tracking-normal">
            Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4 mx-auto md:mx-0 rounded-full" />
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
            <ProjectCard key={project.id} project={project} isLarge={index === 0} />
          ))}
        </motion.div>

        {/* 2. Enterprise & Client Deliverables (VisionTech Group) */}
        {enterpriseProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200 dark:border-white/10">
            <EnterpriseShowcase projects={enterpriseProjects} />
          </div>
        )}

        {/* 3. Academic & Foundation Projects (Below with Label) */}
        {academicProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200 dark:border-white/10">
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
              <div className="w-12 h-1 bg-cyan-500 mt-3 mx-auto md:mx-0 rounded-full" />
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              style={{ perspective: 1200 }}
            >
              {academicProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isLarge={false} />
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
