'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import mountainImg from '@/src/images/mountains.png';
import sunImg from '@/src/images/sun.png';
import starsImg from '@/src/images/stars.png';

interface ParallaxProps {
  type: 'projects' | 'about';
}

export default function Parallax({ type }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '500%']);
  const yBg   = useTransform(scrollYProgress, [0, 10], ['0%', '100%']);

  const background =
    type === 'projects'
      ? 'linear-gradient(180deg, #111132, #0c0c1d)'
      : 'linear-gradient(180deg, #111132, #505064)';

  const heading = type === 'projects' ? 'What I did ?' : 'How am I ?';

  return (
    <motion.div
      className="parallax"
      ref={ref}
      style={{ background }}
    >
      <motion.h1 style={{ y: yText }} className="lg:text-[100px] text-[40px] z-[19] bg-transparent">
        {heading}
      </motion.h1>

      <motion.div className="flex items-end mountains absolute w-[100%] h-[100%] bg-transparent z-20 overflow-hidden">
        <Image src={mountainImg} alt="Mountain foreground" className="lg:w-[100%] lg:h-[100%] h-[40%] w-[1000px] bg-inherit" />
      </motion.div>

      <motion.div className="flex items-start mountains absolute w-[100%] h-[100%] bg-transparent z-20 overflow-hidden">
        <Image src={sunImg} alt="Planet/sun" className="lg:w-[90%] lg:h-[100%] h-[40%] w-auto bg-inherit" />
      </motion.div>

      <motion.div style={{ x: yBg }} className="flex stars overflow-hidden absolute lg:w-[100%] h-full bg-transparent z-15">
        <Image src={starsImg} alt="Stars background" className="lg:w-[90%] lg:h-[100%] h-[50%] w-auto bg-inherit" />
      </motion.div>
    </motion.div>
  );
}
