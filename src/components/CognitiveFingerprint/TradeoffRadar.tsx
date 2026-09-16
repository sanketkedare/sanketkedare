'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface Tradeoff {
  axis: string;
  left_anchor: string;
  right_anchor: string;
  score: number;
  rationale: string;
}

interface Props {
  tradeoffs: Tradeoff[];
  selectedIndex: number;
  onAxisClick: (index: number) => void;
  shouldAnimate: boolean;
}

// ── Symmetrical Centered Geometry ─────────────────────────────────────────────
// Center is (0, 0). ViewBox [-170, -125, 340, 255] allows zero clipping
// on both phone viewports (320px) and wide desktop screens.
const R = 74;

const AXES = [
  { dx: 0, dy: -1 }, // 0: Top (Resolution Depth)
  { dx: 1, dy: 0 },  // 1: Right (Data Contracts)
  { dx: 0, dy: 1 },  // 2: Bottom (Modularity)
  { dx: -1, dy: 0 }, // 3: Left (Optimization Strategy)
] as const;

const GRIDS = [0.25, 0.5, 0.75, 1.0];

function diamond(r: number) {
  return `0,${-r} ${r},0 0,${r} ${-r},0`;
}

export default function TradeoffRadar({
  tradeoffs,
  selectedIndex,
  onAxisClick,
  shouldAnimate,
}: Props) {
  // Compute polygon points from scores
  const pts = tradeoffs.map((t, i) => {
    const fraction = (t.score / 100) * R;
    return {
      x: fraction * AXES[i].dx,
      y: fraction * AXES[i].dy,
    };
  });

  const polygonStr = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="relative w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[320px] aspect-square mx-auto flex items-center justify-center select-none">
      <svg
        viewBox="-170 -125 340 255"
        className="w-full h-full overflow-visible"
        aria-label="Interactive Tradeoff Radar Chart"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#06b6d4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient concentric grid diamond levels */}
        {GRIDS.map((lvl) => (
          <polygon
            key={lvl}
            points={diamond(lvl * R)}
            fill="none"
            stroke={lvl === 1.0 ? 'rgba(6, 182, 212, 0.28)' : 'rgba(255, 255, 255, 0.08)'}
            strokeWidth={lvl === 1.0 ? 1.2 : 0.6}
            strokeDasharray={lvl < 1.0 ? '2,2' : undefined}
          />
        ))}

        {/* Cross Axes lines */}
        {AXES.map((axis, i) => (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={R * axis.dx}
            y2={R * axis.dy}
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={1}
          />
        ))}

        {/* Filled Radar Polygon with spring animation */}
        <motion.polygon
          points={polygonStr}
          fill="url(#radarGlow)"
          stroke="url(#radarStroke)"
          strokeWidth={2.4}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0 }}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '0px 0px' }}
        />

        {/* ── 0. TOP AXIS: Resolution Depth ───────────────────────────────── */}
        {(() => {
          const i = 0;
          const pt = pts[i];
          const t = tradeoffs[i];
          const isSelected = selectedIndex === i;

          return (
            <g
              key="axis-0"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAxisClick(i);
              }}
            >
              <text
                x={0}
                y={-96}
                textAnchor="middle"
                fontFamily="Cambria, Cochin, Georgia, Times, serif"
                fontSize={isSelected ? 12.5 : 11}
                fontWeight={isSelected ? 700 : 500}
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                className="transition-all duration-200"
              >
                {t.axis}
              </text>
              <text
                x={0}
                y={-83}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={isSelected ? '#22d3ee' : '#64748b'}
                className="transition-all duration-200"
              >
                {t.score}%
              </text>

              {isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={15}
                  fill="rgba(34, 211, 238, 0.15)"
                  stroke="rgba(34, 211, 238, 0.6)"
                  strokeWidth={1.5}
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6.5 : 4.5}
                fill={isSelected ? '#22d3ee' : '#a855f7'}
                stroke={isSelected ? '#ffffff' : '#c084fc'}
                strokeWidth={2}
                filter={isSelected ? 'url(#nodeGlow)' : undefined}
                className="transition-all duration-200"
              />
              <circle cx={pt.x} cy={pt.y} r={34} fill="transparent" />
            </g>
          );
        })()}

        {/* ── 1. RIGHT AXIS: Data Contracts (Split Multi-Line for Safe Margins) ─ */}
        {(() => {
          const i = 1;
          const pt = pts[i];
          const t = tradeoffs[i];
          const isSelected = selectedIndex === i;

          return (
            <g
              key="axis-1"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAxisClick(i);
              }}
            >
              <text
                x={88}
                y={-4}
                textAnchor="start"
                fontFamily="Cambria, Cochin, Georgia, Times, serif"
                fontSize={isSelected ? 12 : 11}
                fontWeight={isSelected ? 700 : 500}
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                className="transition-all duration-200"
              >
                Data
              </text>
              <text
                x={88}
                y={9}
                textAnchor="start"
                fontFamily="Cambria, Cochin, Georgia, Times, serif"
                fontSize={isSelected ? 12 : 11}
                fontWeight={isSelected ? 700 : 500}
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                className="transition-all duration-200"
              >
                Contracts
              </text>
              <text
                x={88}
                y={22}
                textAnchor="start"
                fontSize={10.5}
                fontWeight={700}
                fill={isSelected ? '#22d3ee' : '#64748b'}
                className="transition-all duration-200"
              >
                {t.score}%
              </text>

              {isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={15}
                  fill="rgba(34, 211, 238, 0.15)"
                  stroke="rgba(34, 211, 238, 0.6)"
                  strokeWidth={1.5}
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6.5 : 4.5}
                fill={isSelected ? '#22d3ee' : '#a855f7'}
                stroke={isSelected ? '#ffffff' : '#c084fc'}
                strokeWidth={2}
                filter={isSelected ? 'url(#nodeGlow)' : undefined}
                className="transition-all duration-200"
              />
              <circle cx={pt.x} cy={pt.y} r={34} fill="transparent" />
            </g>
          );
        })()}

        {/* ── 2. BOTTOM AXIS: Modularity ──────────────────────────────────── */}
        {(() => {
          const i = 2;
          const pt = pts[i];
          const t = tradeoffs[i];
          const isSelected = selectedIndex === i;

          return (
            <g
              key="axis-2"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAxisClick(i);
              }}
            >
              <text
                x={0}
                y={98}
                textAnchor="middle"
                fontFamily="Cambria, Cochin, Georgia, Times, serif"
                fontSize={isSelected ? 12.5 : 11}
                fontWeight={isSelected ? 700 : 500}
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                className="transition-all duration-200"
              >
                {t.axis}
              </text>
              <text
                x={0}
                y={111}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={isSelected ? '#22d3ee' : '#64748b'}
                className="transition-all duration-200"
              >
                {t.score}%
              </text>

              {isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={15}
                  fill="rgba(34, 211, 238, 0.15)"
                  stroke="rgba(34, 211, 238, 0.6)"
                  strokeWidth={1.5}
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6.5 : 4.5}
                fill={isSelected ? '#22d3ee' : '#a855f7'}
                stroke={isSelected ? '#ffffff' : '#c084fc'}
                strokeWidth={2}
                filter={isSelected ? 'url(#nodeGlow)' : undefined}
                className="transition-all duration-200"
              />
              <circle cx={pt.x} cy={pt.y} r={34} fill="transparent" />
            </g>
          );
        })()}

        {/* ── 3. LEFT AXIS: Optimization Strategy (Split Multi-Line for Safe Margins) ─ */}
        {(() => {
          const i = 3;
          const pt = pts[i];
          const t = tradeoffs[i];
          const isSelected = selectedIndex === i;

          return (
            <g
              key="axis-3"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAxisClick(i);
              }}
            >
              <text
                x={-88}
                y={-4}
                textAnchor="end"
                fontFamily="Cambria, Cochin, Georgia, Times, serif"
                fontSize={isSelected ? 12 : 11}
                fontWeight={isSelected ? 700 : 500}
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                className="transition-all duration-200"
              >
                Optimization
              </text>
              <text
                x={-88}
                y={9}
                textAnchor="end"
                fontFamily="Cambria, Cochin, Georgia, Times, serif"
                fontSize={isSelected ? 12 : 11}
                fontWeight={isSelected ? 700 : 500}
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                className="transition-all duration-200"
              >
                Strategy
              </text>
              <text
                x={-88}
                y={22}
                textAnchor="end"
                fontSize={10.5}
                fontWeight={700}
                fill={isSelected ? '#22d3ee' : '#64748b'}
                className="transition-all duration-200"
              >
                {t.score}%
              </text>

              {isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={15}
                  fill="rgba(34, 211, 238, 0.15)"
                  stroke="rgba(34, 211, 238, 0.6)"
                  strokeWidth={1.5}
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6.5 : 4.5}
                fill={isSelected ? '#22d3ee' : '#a855f7'}
                stroke={isSelected ? '#ffffff' : '#c084fc'}
                strokeWidth={2}
                filter={isSelected ? 'url(#nodeGlow)' : undefined}
                className="transition-all duration-200"
              />
              <circle cx={pt.x} cy={pt.y} r={34} fill="transparent" />
            </g>
          );
        })()}

        {/* Center pivot dot */}
        <circle cx={0} cy={0} r={3} fill="#818cf8" opacity={0.7} />
      </svg>
    </div>
  );
}
