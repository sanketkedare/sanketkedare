'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar — Renders a 2px fixed gradient bar at the very top of the viewport
 * that fills left-to-right as the user scrolls through the page.
 * Uses Framer spring smoothing so it doesn't jump abruptly on fast scrolls.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 z-[200] pointer-events-none"
      aria-hidden="true"
    />
  );
}
