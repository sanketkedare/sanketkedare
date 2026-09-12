'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLock, 
  FiShield, 
  FiCheckCircle, 
  FiChevronLeft, 
  FiChevronRight, 
  FiLayers, 
  FiGrid, 
  FiCpu,
  FiBriefcase
} from 'react-icons/fi';

export interface EnterpriseProject {
  id:        number;
  title:     string;
  subtitle?: string;
  category?: string;
  badge?:    string;
  domain?:   string;
  client?:   string;
  role?:     string;
  git?:      string;
  live?:     string;
  skills:    string[];
  img:       string;
  des:       string;
  features?: string[];
}

interface EnterpriseShowcaseProps {
  projects: EnterpriseProject[];
}

export default function EnterpriseShowcase({ projects }: EnterpriseShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');

  const current = projects[activeIndex] || projects[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full">
      {/* Telemetry Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 mb-2.5">
            <FiBriefcase className="text-purple-500" size={13} />
            <span>Commercial Engineering • VisionTech Group &amp; Studios</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise &amp; Client Deliverables
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 max-w-2xl">
            Commercial web platforms, enterprise systems, and client solutions engineered during my tenure as Senior Full Stack Developer at VisionTech Group.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto bg-slate-200/60 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('spotlight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'spotlight'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FiLayers size={13} />
            <span>Spotlight View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FiGrid size={13} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Interactive Dossier Spotlight */}
      {viewMode === 'spotlight' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive System Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 order-2 lg:order-1">
            <div className="flex items-center justify-between px-1 mb-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Select System ({projects.length})</span>
              <span className="text-purple-600 dark:text-purple-400 font-mono">
                {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </div>

            {projects.map((project, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative text-left p-3.5 md:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-500/15 via-cyan-500/10 to-transparent border-purple-500/50 dark:border-purple-400/40 shadow-lg shadow-purple-500/5'
                      : 'bg-white/60 dark:bg-[#0c0d1e]/60 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#0c0d1e]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`text-xs font-mono font-black pt-0.5 transition-colors ${
                      isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-600'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          {project.client}
                        </span>
                        {project.badge && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700 text-[9px]">•</span>
                            <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">
                              {project.badge}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className={`text-sm md:text-base font-black truncate transition-colors ${
                        isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}>
                        {project.title}
                      </h4>
                      {project.domain && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          {project.domain}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      isSelected 
                        ? 'bg-purple-500 ring-4 ring-purple-500/20 scale-125' 
                        : 'bg-slate-300 dark:bg-white/10 group-hover:bg-slate-400 dark:group-hover:bg-white/30'
                    }`} />
                  </div>
                </button>
              );
            })}

            {/* Quick Next/Prev Controls */}
            <div className="flex items-center justify-between pt-3 px-1">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white hover:border-transparent transition-all"
              >
                <FiChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1.5">
                {projects.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      dotIdx === activeIndex ? 'w-6 bg-purple-500' : 'w-1.5 bg-slate-300 dark:bg-white/20'
                    }`}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white hover:border-transparent transition-all"
              >
                <span>Next</span>
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Column: Active System Architecture Spotlight (7 Cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="rounded-3xl bg-white/80 dark:bg-[#0c0d1e]/90 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-2xl p-6 md:p-8 overflow-hidden relative"
              >
                {/* 16:9 Image Preview Container */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-6 border border-slate-200/60 dark:border-white/10 shadow-lg">
                  <Image
                    src={current.img}
                    alt={current.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    loading="lazy"
                    className="object-cover"
                  />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-950/85 text-purple-300 border border-purple-500/40 backdrop-blur-md shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      {current.badge || 'Enterprise System'}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-950/85 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
                      <FiLock size={11} className="text-amber-400" />
                      <span>Proprietary IP</span>
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Header Information */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {current.role || 'Senior Full Stack Developer'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {current.client}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {current.title}
                  </h3>
                  {current.subtitle && (
                    <p className="text-xs md:text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {current.subtitle}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                  {current.des}
                </p>

                {/* Core Engineering Deliverables / Architecture Highlights */}
                {current.features && current.features.length > 0 && (
                  <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                      <FiCpu className="text-purple-500" size={14} />
                      <span>Architectural Deliverables &amp; Scope</span>
                    </h5>
                    <div className="space-y-2.5">
                      {current.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <FiCheckCircle size={14} className="text-purple-500 dark:text-purple-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Tech Stack */}
                <div className="mb-6">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Production Technology Stack
                  </h5>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {current.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] md:text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wide"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enterprise Confidentiality Notice (No live links!) */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 text-slate-600 dark:text-slate-400 text-xs">
                  <FiShield size={18} className="text-purple-500 shrink-0" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    <strong className="text-slate-800 dark:text-slate-200">Corporate Deliverable:</strong> Source codebase and internal infrastructure are protected under enterprise client NDA. Developed for live commercial operations.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Comprehensive Architecture Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col h-full rounded-3xl bg-white/80 dark:bg-[#0c0d1e]/85 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-purple-500/40 dark:hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
            >
              {/* 16:9 Image Preview */}
              <div className="relative w-full aspect-video overflow-hidden bg-slate-950">
                <Image
                  src={project.img}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  loading="lazy"
                  className="object-cover"
                />

                <div className="absolute top-3 left-3 z-20">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-950/85 text-purple-300 border border-purple-500/35 backdrop-blur-md shadow-md">
                    {project.badge || 'Commercial Deliverable'}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-20">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-semibold bg-slate-950/85 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
                    <FiLock size={10} className="text-amber-400" />
                    <span>Proprietary</span>
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {project.role}
                    </span>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400">
                      {project.client}
                    </span>
                  </div>

                  <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                    {project.title}
                  </h4>
                  {project.subtitle && (
                    <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
                      {project.subtitle}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                    {project.des}
                  </p>

                  {/* Architecture Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="space-y-2 mb-5 pt-3 border-t border-slate-100 dark:border-white/5">
                      {project.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                          <FiCheckCircle size={12} className="text-purple-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  {/* Tech Stack Chips */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-1.5 mb-4">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-bold text-slate-700 dark:text-slate-300 tracking-wide"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Governance Notice (No live links!) */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 text-slate-500 dark:text-slate-400 text-[10px] font-medium">
                    <FiShield size={13} className="text-purple-500 shrink-0" />
                    <span>Proprietary IP • Live Commercial Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
