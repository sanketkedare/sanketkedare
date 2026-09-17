'use client';

import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { IconType } from 'react-icons';

export interface SkillItem {
  skill: string;
  type: string;
  src?: StaticImageData;
  icon?: IconType;
  color?: string;
}

export function SkillsMarquee({ backend }: { backend: SkillItem[] }) {
  return (
    <div className="flex overflow-hidden relative z-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        className="flex gap-8 whitespace-nowrap min-w-max pr-8"
      >
        {[...backend, ...backend, ...backend].map((skill, index) => (
          <div key={`${skill.skill}-${index}`} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-indigo-100 dark:border-white/10 ring-1 ring-indigo-900/[0.04] dark:ring-transparent shadow-[0_3px_12px_rgba(99,102,241,0.08)] dark:shadow-none flex items-center justify-center p-3 hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-110 transition-all duration-300 backdrop-blur-md">
              {skill.src ? (
                <Image
                  src={skill.src}
                  alt={skill.skill}
                  loading="lazy"
                  className={`w-full h-full object-contain filter group-hover:brightness-110 transition-all ${skill.skill === 'ExpressJS' ? 'filter invert dark:invert-0' : ''}`}
                />
              ) : skill.icon ? (
                <skill.icon size={26} style={{ color: skill.color }} className="group-hover:scale-110 transition-all" />
              ) : null}
            </div>
            <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-cyan-400 transition-colors tracking-tight">{skill.skill}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
