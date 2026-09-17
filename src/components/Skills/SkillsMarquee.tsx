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
            <div className="w-12 h-12 flex items-center justify-center p-1 bg-transparent group-hover:scale-115 transition-transform duration-300">
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
