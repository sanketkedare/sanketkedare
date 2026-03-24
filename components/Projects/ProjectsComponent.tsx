'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowUpRight } from 'react-icons/fi';
import ProjectList from './ProjectList.json';

interface Project {
  id:     number;
  title:  string;
  git:    string;
  live:   string;
  skills: string[];
  img:    string;
  des:    string;
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
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { 
      type: "spring" as const, 
      stiffness: 80, 
      damping: 15,
      mass: 1
    }
  }
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Determine if this is a "featured" card based on its index
  const isLarge = index === 0;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
      className={`group relative flex flex-col h-full rounded-[1.5rem] bg-white/40 dark:bg-white/10 border-2 border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl hover:shadow-cyan-500/10 hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-500 overflow-hidden ${
        isLarge ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'col-span-1'
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Background Glass Shine Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-0" />

      {/* Image Layer */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-64 md:h-80' : 'h-52'}`}>
        <motion.img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover saturate-100 opacity-95 group-hover:saturate-[1.3] group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Layer */}
      <div className="p-5 md:p-8 flex flex-col flex-1 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-3">
            {project.git && (
              <a href={project.git} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-500 transition-colors">
                <FiGithub size={20} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-500 transition-colors">
                <FiArrowUpRight size={22} />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {project.des}
        </p>

        {/* Skills Tag Styling */}
        <div className="mt-auto flex flex-wrap gap-2">
          {project.skills.slice(0, isLarge ? 6 : 4).map((skill) => (
            <span key={skill} className="px-3 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[8px] md:text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest group-hover:border-cyan-500/30 group-hover:text-cyan-500 transition-all">
              {skill}
            </span>
          ))}
          {project.skills.length > (isLarge ? 6 : 4) && (
            <span className="text-[9px] font-black text-cyan-500 ml-1 self-center">
              +{project.skills.length - (isLarge ? 6 : 4)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsComponent() {
  const projects = useMemo(() => ProjectList as Project[], []);

  return (
    <section id="projects" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen py-24 flex flex-col justify-center border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511] overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full">
        {/* Header Section - Same Style as About & Skills */}
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

        {/* Cinematic Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          style={{ perspective: 1200 }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Decorative Text (Massive Subtle Background) */}
      <div className="absolute bottom-0 right-0 text-[8rem] md:text-[15rem] font-black text-slate-900/[0.02] dark:text-white/[0.01] pointer-events-none select-none uppercase tracking-tighter leading-none">
        Works
      </div>

    </section>
  );
}

