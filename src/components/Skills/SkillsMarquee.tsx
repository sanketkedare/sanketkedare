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
    <div className="flex overflow-hidden relative z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div 
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        className="flex gap-8 whitespace-nowrap min-w-max pr-8"
      >
        {[...backend, ...backend, ...backend].map((skill, index) => (
          <div key={`${skill.skill}-${index}`} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-3 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-md">
              {skill.src ? (
                <Image src={skill.src} alt={skill.skill} loading="lazy" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : skill.icon ? (
                <skill.icon size={26} style={{ color: skill.color }} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              ) : null}
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{skill.skill}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
