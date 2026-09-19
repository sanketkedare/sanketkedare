'use client';

import { motion, useAnimationControls } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { IconType } from 'react-icons';
import { useRef, useEffect, useState } from 'react';

export interface SkillItem {
  skill: string;
  type: string;
  src?: StaticImageData;
  icon?: IconType;
  color?: string;
}

/**
 * SkillsMarquee — infinite horizontal scroll of backend/database skill badges.
 *
 * Fix (Issue #1): Replaced the hardcoded `x: [0, -1200]` with a dynamic
 * measurement of the rendered single-copy width via `useRef + getBoundingClientRect`.
 * This ensures the marquee seamlessly loops regardless of how many items are rendered,
 * eliminating the "triple badge appearing 3 times" visual artefact.
 * Uses 2 copies (not 3) — one visible, one buffer — which is sufficient for a seamless loop.
 */
export function SkillsMarquee({ backend }: { backend: SkillItem[] }) {
  const singleRef = useRef<HTMLDivElement>(null);
  const [singleWidth, setSingleWidth] = useState(0);

  useEffect(() => {
    if (singleRef.current) {
      // Measure after a short delay to ensure images have settled their layout
      const measure = () => {
        if (singleRef.current) {
          setSingleWidth(singleRef.current.scrollWidth);
        }
      };
      measure();
      // Re-measure on resize (responsive layouts can change item sizes)
      const observer = new ResizeObserver(measure);
      observer.observe(singleRef.current);
      return () => observer.disconnect();
    }
  }, [backend]);

  // Duration scales with item count so speed stays consistent regardless of list size
  const duration = Math.max(backend.length * 2.2, 18);

  return (
    <div className="flex overflow-hidden relative z-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        animate={singleWidth > 0 ? { x: [0, -singleWidth] } : {}}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
        }}
        className="flex whitespace-nowrap min-w-max"
        style={{ willChange: 'transform' }}
      >
        {/* Copy 1 — measured for loop distance */}
        <div ref={singleRef} className="flex gap-8 pr-8">
          {backend.map((skill, index) => (
            <div key={`a-${skill.skill}-${index}`} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 flex items-center justify-center p-1 bg-transparent group-hover:scale-110 transition-transform duration-300">
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
              <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-cyan-400 transition-colors tracking-tight">
                {skill.skill}
              </span>
            </div>
          ))}
        </div>

        {/* Copy 2 — buffer copy for seamless infinite wrap */}
        <div className="flex gap-8 pr-8" aria-hidden="true">
          {backend.map((skill, index) => (
            <div key={`b-${skill.skill}-${index}`} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 flex items-center justify-center p-1 bg-transparent group-hover:scale-110 transition-transform duration-300">
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
              <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-cyan-400 transition-colors tracking-tight">
                {skill.skill}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
