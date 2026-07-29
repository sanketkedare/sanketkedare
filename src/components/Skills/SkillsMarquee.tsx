'use client';

import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';

interface Skill {
  skill: string;
  type: string;
  src: StaticImageData;
}

export function SkillsMarquee({ backend }: { backend: Skill[] }) {
  return (
    <div className="flex overflow-hidden relative z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        className="flex gap-8 whitespace-nowrap min-w-max pr-8"
      >
        {[...backend, ...backend, ...backend].map((skill, index) => (
          <div key={`${skill.skill}-${index}`} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors duration-300 backdrop-blur-md">
              <Image src={skill.src} alt={skill.skill} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{skill.skill}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
