'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiActivity, FiCheckCircle, FiXCircle, FiSliders, FiCpu } from 'react-icons/fi';
import TradeoffRadar, { Tradeoff } from './TradeoffRadar';
import raw from '../../../utils/cognetive_fingerprint.json';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CognitiveIdentity {
  primary_archetype: string;
  core_thesis: string;
}

interface MentalModel {
  name: string;
  concept: string;
}

interface EngineeringRule {
  id: string;
  name: string;
  statement: string;
}

interface QuantifiedTradeoff extends Tradeoff {
  axis: string;
  left_anchor: string;
  right_anchor: string;
  score: number;
  rationale: string;
}

interface DecisionLog {
  id: string;
  domain: string;
  problem: string;
  rejected_alternative: string;
  chosen_solution: string;
  tradeoff_justification: string;
}

interface ProfileMetadata {
  target_platform: string;
  schema_version: string;
  generation_date: string;
  domain_focus: string;
}

interface FingerprintData {
  profile_metadata: ProfileMetadata;
  cognitive_identity: CognitiveIdentity;
  mental_models: MentalModel[];
  engineering_rules: EngineeringRule[];
  quantified_tradeoffs: QuantifiedTradeoff[];
  decision_logs: DecisionLog[];
}

const data = raw as FingerprintData;

// Strict mapping of each radar axis index to its corresponding rule and decision case
const AXIS_MAPPINGS = [
  {
    ruleId: 'RULE_01',
    decisionId: 'DEC_INFRA_01',
    icon: '⚡',
  },
  {
    ruleId: 'RULE_02',
    decisionId: 'DEC_CONTRACT_03',
    icon: '🛡️',
  },
  {
    ruleId: 'RULE_03',
    decisionId: 'DEC_AGENT_02',
    icon: '📦',
  },
  {
    ruleId: 'RULE_04',
    decisionId: 'DEC_INFRA_01',
    icon: '🎯',
  },
];

const MODEL_ICONS = ['🔍', '📐', '📦', '🔧'];

export default function CognitiveFingerprint() {
  // Default to 0 so the component is immediately informative with zero dead space
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const {
    cognitive_identity,
    mental_models,
    engineering_rules,
    quantified_tradeoffs,
    decision_logs,
  } = data;

  const activeTradeoff = quantified_tradeoffs[selectedIndex];
  const activeMapping = AXIS_MAPPINGS[selectedIndex];
  const activeRule =
    engineering_rules.find((r) => r.id === activeMapping.ruleId) ?? engineering_rules[0];
  const activeLog =
    decision_logs.find((d) => d.id === activeMapping.decisionId) ?? decision_logs[0];

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  return (
    <section
      id="cognitive"
      ref={sectionRef}
      className="relative w-full lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-0 min-h-screen py-16 md:py-24 flex flex-col justify-center border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511] overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full relative z-10">
        {/* ── 1. Section Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-7 md:mb-12 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <FiActivity size={13} className="animate-pulse text-cyan-400" />
            <span>Architecture & Tradeoffs Profile</span>
          </div>
          <h2 className="text-[1.65rem] sm:text-[1.75rem] md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-slate-900 dark:from-cyan-400 dark:via-indigo-300 dark:to-white tracking-tight md:tracking-normal">
            Cognitive Fingerprint
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 max-w-2xl">
            Software engineering is a discipline of deliberate tradeoffs. Explore how I reason through architectural boundaries, deterministic contracts, and production stability.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-3.5 mx-auto md:mx-0 rounded-full" />
        </motion.div>

        {/* ── 2. Core Identity Banner ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/70 dark:bg-[#0c0d1e]/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <FiCpu size={19} />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400 block">
                  Primary Engineering Archetype
                </span>
                <h3
                  className="text-sm sm:text-base md:text-xl font-black text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                >
                  {cognitive_identity.primary_archetype}
                </h3>
              </div>
            </div>

            <div className="w-full md:w-auto md:max-w-xl border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-2.5 md:pt-0 md:pl-6">
              <p
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed"
                style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
              >
                &ldquo;{cognitive_identity.core_thesis}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 3. Interactive Tradeoffs & Decision Console ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-[#0c0d1e]/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-xl overflow-hidden"
        >
          {/* Top Quick Selector Tabs — Effortless navigation on mobile and desktop */}
          <div className="p-2.5 sm:p-4 bg-slate-100/70 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <FiSliders size={13} className="text-cyan-400" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Select Architectural Vector
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 hidden xs:inline-block">
                Click any tab or radar node to inspect
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {quantified_tradeoffs.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.axis}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300 shadow-sm'
                        : 'bg-white/40 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold truncate mr-1.5">
                      {item.axis}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-500 dark:text-cyan-300'
                          : 'bg-slate-200/60 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      {item.score}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Console Main Content Grid: Radar on Left, Decision Lab on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 p-4 sm:p-6 md:p-8 items-stretch">
            {/* Left Column: Visual Radar Chart & Anchor Spectrum (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-between gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070817]/90 border border-slate-200 dark:border-white/5">
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
                  Tradeoff Vector Plane
                </span>
                <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 truncate max-w-[150px]">
                  {activeTradeoff.axis}
                </span>
              </div>

              {/* Centered Radar Chart */}
              <div className="w-full py-1">
                <TradeoffRadar
                  tradeoffs={quantified_tradeoffs}
                  selectedIndex={selectedIndex}
                  onAxisClick={handleSelect}
                  shouldAnimate={isInView}
                />
              </div>

              {/* Tradeoff Spectrum Meter */}
              <div className="w-full bg-white/50 dark:bg-white/[0.02] p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-white/5">
                <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1.5 gap-2">
                  <span className="font-bold text-cyan-500 dark:text-cyan-400 truncate">
                    {activeTradeoff.left_anchor}
                  </span>
                  <span className="font-bold text-slate-400 truncate text-right">
                    {activeTradeoff.right_anchor}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeTradeoff.score}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2 font-medium">
                  Priority Calibrated at <strong className="text-cyan-400">{activeTradeoff.score}%</strong> for upstream resilience
                </p>
              </div>
            </div>

            {/* Right Column: The Architectural Decision Lab (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTradeoff.axis}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-3.5 sm:gap-4"
                >
                  {/* Active Principle Title & Rationale */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] sm:text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                          {activeRule.id}
                        </span>
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {activeLog.domain}
                        </span>
                      </div>
                      <h4
                        className="text-base sm:text-lg md:text-2xl font-black text-slate-900 dark:text-white"
                        style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                      >
                        {activeRule.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-cyan-500 dark:text-cyan-400 leading-none">
                        {activeTradeoff.score}%
                      </div>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-400 block mt-0.5">
                        Rigidity Score
                      </span>
                    </div>
                  </div>

                  {/* Operational Rule Statement */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border-l-4 border-cyan-500 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {activeRule.statement}
                  </div>

                  {/* Rationale Brief */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeTradeoff.rationale}
                  </p>

                  {/* Real-World Case Contrast: Rejected vs. Engineered Solution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                    {/* Rejected Alternative */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 mb-2">
                          <FiXCircle size={15} />
                          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                            Rejected Anti-Pattern
                          </span>
                        </div>
                        <p
                          className="text-xs sm:text-sm text-slate-700 dark:text-rose-100/80 leading-relaxed"
                          style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                        >
                          {activeLog.rejected_alternative}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-rose-400/70 mt-2.5 block">
                        ✕ Avoided Temporary Band-Aid
                      </span>
                    </div>

                    {/* Engineered Solution */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 mb-2">
                          <FiCheckCircle size={15} />
                          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                            Engineered Production Fix
                          </span>
                        </div>
                        <p
                          className="text-xs sm:text-sm text-slate-700 dark:text-emerald-100/90 leading-relaxed font-medium"
                          style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                        >
                          {activeLog.chosen_solution}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400/80 mt-2.5 block">
                        ✓ Upstream Structural Correctness
                      </span>
                    </div>
                  </div>

                  {/* Tradeoff Justification / Impact Statement */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 text-xs text-purple-700 dark:text-purple-300">
                    <span className="font-bold shrink-0">Production Impact:</span>
                    <span className="text-left sm:text-right italic font-medium">
                      {activeLog.tradeoff_justification}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── 4. Core Mental Models Grid ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-[#0c0d1e]/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 mb-4 sm:mb-6">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-400 block">
                Foundational Reasoning
              </span>
              <h3
                className="text-base sm:text-lg md:text-2xl font-black text-slate-900 dark:text-white"
                style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
              >
                Core Mental Models
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              First-principles execution filters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {mental_models.map((model, idx) => (
              <div
                key={model.name}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{MODEL_ICONS[idx]}</div>
                  <h4
                    className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-1.5"
                    style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                  >
                    {model.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {model.concept}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
