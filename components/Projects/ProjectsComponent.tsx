'use client';

import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
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

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

function ProjectCard({ item }: { item: Project }) {
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all duration-500"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image Header */}
      <div className="relative h-40 md:h-48 w-full overflow-hidden bg-slate-100 dark:bg-black/50 border-b border-slate-200 dark:border-white/10">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a1a] via-transparent to-transparent opacity-90" />
      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-5 relative z-10">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors font-[family-name:var(--font-outfit)]">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            {item.git && (
              <a 
                href={item.git} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors tooltip"
                aria-label="GitHub Repository"
                title="View Source"
              >
                <FiGithub size={16} />
              </a>
            )}
            {item.live && (
              <a 
                href={item.live} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:text-white hover:bg-cyan-500 transition-colors tooltip"
                aria-label="Live Demo"
                title="Live Demo"
              >
                <FiExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3 flex-1">
          {item.des}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-3 border-t border-slate-200 dark:border-white/5">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsComponent() {
  return (
    <section id="projects" className="relative w-[80%] m-auto min-h-screen flex flex-col justify-center border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511] py-24">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-outfit)] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400">
              Selected Works
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-500 dark:to-cyan-500 mt-4 mx-auto md:mx-0 rounded-full" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm text-sm md:text-right">
            A showcase of my recent builds, ranging from responsive UIs to complex full-stack web applications.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
          {(ProjectList as Project[]).map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}
