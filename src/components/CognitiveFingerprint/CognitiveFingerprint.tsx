'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  FiActivity, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiCpu, 
  FiTerminal, 
  FiLayers,
  FiShield,
  FiArrowRight,
  FiFileText,
  FiChevronDown
} from 'react-icons/fi';
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

interface IncidentPostmortem {
  id: string;
  title: string;
  domain: string;
  badge: string;
  symptom: string;
  root_cause: string;
  fix: string;
  outcome: string;
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
  incident_postmortems: IncidentPostmortem[];
}

const data = raw as unknown as FingerprintData;

const MODEL_ICONS = ['🔍', '📐', '🔧', '🔄'];

export default function CognitiveFingerprint() {
  const [selectedIncidentIndex, setSelectedIncidentIndex] = useState<number>(0);
  const [activeRuleId, setActiveRuleId] = useState<string>('RULE_01');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const {
    cognitive_identity,
    mental_models,
    engineering_rules,
    incident_postmortems = [],
  } = data;

  const currentIncident = incident_postmortems[selectedIncidentIndex] || incident_postmortems[0];

  const handlePrevIncident = () => {
    setSelectedIncidentIndex((prev) => (prev === 0 ? incident_postmortems.length - 1 : prev - 1));
  };

  const handleNextIncident = () => {
    setSelectedIncidentIndex((prev) => (prev === incident_postmortems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="cognitive"
      ref={sectionRef}
      className="relative w-full min-h-screen py-14 sm:py-20 md:py-24 flex flex-col justify-center border-t border-slate-200/80 dark:border-white/5 bg-transparent dark:bg-[#050511] overflow-hidden"
    >
      {/* Background Kinetic Glow & Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 35, -25, 0], y: [0, -35, 25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 30, 0], y: [0, 40, -25, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -right-20 w-[550px] h-[550px] bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-[130px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.35] dark:opacity-[0.2]" />
      </div>

      <div className="w-full lg:w-[80%] mx-auto px-3.5 sm:px-6 lg:px-0 relative z-10">
        {/* ── 1. Section Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 md:mb-12 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-cyan-100/90 dark:bg-cyan-500/10 border border-cyan-300/80 dark:border-cyan-500/20 text-cyan-900 dark:text-cyan-400 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-2.5 shadow-2xs">
            <FiActivity size={13} className="animate-pulse text-cyan-600 dark:text-cyan-400" />
            <span>Architecture &amp; Incident Case Studies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-800 to-indigo-950 dark:from-cyan-400 dark:via-indigo-300 dark:to-white tracking-tight md:tracking-normal">
            Engineering Judgment
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-semibold mt-1.5 sm:mt-2 max-w-2xl">
            Software engineering is defined by real-world tradeoffs and upstream problem-solving. Review authentic incident postmortems, diagnostic findings, and production-tested architecture rules.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-3 sm:mt-3.5 mx-auto md:mx-0 rounded-full shadow-sm" />
        </motion.div>

        {/* ======================================================================= */}
        {/* 📱 MOBILE-ONLY DEDICATED REPRESENTATION (< 640px)                       */}
        {/* ======================================================================= */}
        <div className="block sm:hidden space-y-6">
          {/* 1. Mobile Core Identity Banner */}
          <div className="p-3.5 rounded-2xl border-l-4 border-l-cyan-500 bg-white/70 dark:bg-[#0c0d1e]/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 dark:border-cyan-500/30 flex items-center justify-center text-cyan-800 dark:text-cyan-400 shrink-0 shadow-2xs">
                <FiCpu size={16} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-cyan-900 dark:text-cyan-400 block">
                  Primary Engineering Approach
                </span>
                <h3
                  className="text-sm font-black text-slate-900 dark:text-white leading-tight"
                  style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                >
                  {cognitive_identity.primary_archetype}
                </h3>
              </div>
            </div>
            <p
              className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed pl-1 border-t border-slate-200/80 dark:border-white/5 pt-2"
              style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
            >
              &ldquo;{cognitive_identity.core_thesis}&rdquo;
            </p>
          </div>

          {/* 2. Mobile Production Incident Postmortem Deck */}
          <div className="rounded-2xl bg-white/70 dark:bg-[#0c0d1e]/90 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl p-3.5 shadow-sm space-y-3">
            {/* Header with Terminal Icon & Counter */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-1.5">
                <FiTerminal size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Incident Postmortems
                </span>
              </div>
              <span className="text-[9.5px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                0{selectedIncidentIndex + 1} / 0{incident_postmortems.length}
              </span>
            </div>

            {/* Horizontal Pill Scroller */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              {incident_postmortems.map((incident, idx) => {
                const isSelected = idx === selectedIncidentIndex;
                return (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => setSelectedIncidentIndex(idx)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-xs font-black'
                        : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-mono text-[9px] opacity-75">0{idx + 1}</span>
                    <span className="truncate max-w-[120px]">{incident.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* 1-Thumb Quick Pagination Bar */}
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-100/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={handlePrevIncident}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:text-cyan-600 cursor-pointer"
              >
                <span>◄ Prev</span>
              </button>

              <div className="flex items-center gap-1.5">
                {incident_postmortems.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setSelectedIncidentIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === selectedIncidentIndex ? 'w-5 bg-cyan-500' : 'w-1.5 bg-slate-300 dark:bg-white/20'
                    }`}
                    aria-label={`Incident ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextIncident}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:text-cyan-600 cursor-pointer"
              >
                <span>Next ►</span>
              </button>
            </div>

            {/* Active Incident Diagnostic Telemetry Flow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIncident.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 pt-1"
              >
                {/* Title & Domain */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 text-cyan-900 dark:text-cyan-400">
                      {currentIncident.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {currentIncident.domain}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {currentIncident.title}
                  </h4>
                </div>

                {/* Connected 4-Stage Diagnostic Rail */}
                <div className="relative pl-5 border-l-2 border-slate-200 dark:border-white/10 space-y-3 pt-0.5">
                  {/* Phase 1: Symptom */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-[#0c0d1e] flex items-center justify-center" />
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                        01. Production Symptom
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {currentIncident.symptom}
                      </p>
                    </div>
                  </div>

                  {/* Phase 2: Root Cause */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-[#0c0d1e] flex items-center justify-center" />
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-0.5">
                        02. Root-Cause Diagnostic
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {currentIncident.root_cause}
                      </p>
                    </div>
                  </div>

                  {/* Phase 3: Fix */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#0c0d1e] flex items-center justify-center" />
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        03. Upstream Remediation
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {currentIncident.fix}
                      </p>
                    </div>
                  </div>

                  {/* Phase 4: Outcome */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 ring-4 ring-white dark:ring-[#0c0d1e] flex items-center justify-center" />
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block mb-0.5">
                        04. Verified Stability Result
                      </span>
                      <p className="text-xs text-slate-900 dark:text-white font-bold leading-relaxed">
                        {currentIncident.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. Mobile Operational Architecture Rules (Interactive Expandable Accordion) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <FiLayers className="text-cyan-600 dark:text-cyan-400" size={14} />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Architecture Rules ({engineering_rules.length})
                </h3>
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                Tap rule to expand
              </span>
            </div>

            <div className="space-y-2">
              {engineering_rules.map((rule) => {
                const isOpen = activeRuleId === rule.id;
                return (
                  <div
                    key={rule.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-white/80 dark:bg-[#0c0d1e]/90 border-cyan-500/50 shadow-xs'
                        : 'bg-white/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveRuleId(isOpen ? '' : rule.id)}
                      className="w-full p-2.5 flex items-center justify-between gap-2 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[9px] font-mono font-bold text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20 shrink-0">
                          {rule.id}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {rule.name}
                        </span>
                      </div>
                      <FiChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-cyan-500' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-2.5 pb-2.5 pt-0 border-t border-slate-200/60 dark:border-white/5"
                        >
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-2">
                            {rule.statement}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Mobile Mental Models (2x2 Matrix) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-sm">🧬</span>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Mental Models
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mental_models.map((model, idx) => {
                const borderColors = [
                  'border-l-cyan-500',
                  'border-l-purple-500',
                  'border-l-indigo-500',
                  'border-l-emerald-500'
                ];
                return (
                  <div
                    key={model.name}
                    className={`p-2.5 rounded-xl border-l-3 ${borderColors[idx % 4]} bg-white/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between shadow-2xs`}
                  >
                    <div>
                      <div className="text-base mb-1">{MODEL_ICONS[idx % MODEL_ICONS.length]}</div>
                      <h4
                        className="text-xs font-black text-slate-900 dark:text-white mb-1 tracking-tight leading-tight"
                        style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                      >
                        {model.name}
                      </h4>
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-400 font-medium leading-snug line-clamp-4">
                        {model.concept}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 🖥️ DESKTOP-ONLY REPRESENTATION (sm: and above)                           */}
        {/* ======================================================================= */}
        <div className="hidden sm:block">
          {/* ── 2. Core Identity Banner ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 sm:mb-8 p-3.5 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border-l-4 border-l-cyan-500 bg-white/60 dark:bg-[#0c0d1e]/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-2xl hover:shadow-[0_12px_35px_rgba(6,182,212,0.1)] transition-all duration-300"
          >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 dark:border-cyan-500/30 flex items-center justify-center text-cyan-800 dark:text-cyan-400 shrink-0 shadow-xs">
                <FiCpu size={18} />
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-900 dark:text-cyan-400 block">
                  Primary Engineering Approach
                </span>
                <h3
                  className="text-xs sm:text-base md:text-xl font-black text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                >
                  {cognitive_identity.primary_archetype}
                </h3>
              </div>
            </div>

            <div className="w-full md:w-auto md:max-w-xl border-t md:border-t-0 md:border-l border-slate-300/80 dark:border-white/10 pt-2 md:pt-0 md:pl-6">
              <p
                className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 italic font-semibold leading-relaxed"
                style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
              >
                &ldquo;{cognitive_identity.core_thesis}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 3. Production Incident Postmortem Console ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#0c0d1e]/80 border border-slate-200/90 dark:border-white/10 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.05)] dark:shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-2.5 sm:p-4 bg-slate-100/60 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiTerminal size={14} className="text-cyan-700 dark:text-cyan-400 shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-300">
                Production Postmortems &amp; Diagnostics ({incident_postmortems.length})
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-cyan-800 dark:text-cyan-400 font-bold hidden sm:inline-block">
              Root-Cause Case Studies
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 p-3.5 sm:p-6 md:p-8">
            {/* Left Column: Incident Selector List (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-2 sm:gap-2.5">
              <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-0.5 sm:mb-1">
                Select Case Study
              </span>
              {incident_postmortems.map((incident, idx) => {
                const isSelected = idx === selectedIncidentIndex;
                return (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => setSelectedIncidentIndex(idx)}
                    className={`group text-left p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-1 sm:gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-transparent border-cyan-500/60 shadow-xs'
                        : 'bg-white/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-md ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-cyan-900 dark:text-cyan-300' 
                          : 'bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-slate-400'
                      }`}>
                        {incident.badge}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        0{idx + 1}
                      </span>
                    </div>
                    <h4 className={`text-xs md:text-sm font-black leading-snug transition-colors ${
                      isSelected ? 'text-slate-950 dark:text-white' : 'text-slate-800 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                    }`}>
                      {incident.title}
                    </h4>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {incident.domain}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Incident Deep Dive (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIncident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Header Title & Domain */}
                  <div className="pb-2.5 sm:pb-3 border-b border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 text-cyan-900 dark:text-cyan-400">
                        {currentIncident.id}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {currentIncident.domain}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                      {currentIncident.title}
                    </h3>
                  </div>

                  {/* 1. The Symptom */}
                  <div className="p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 text-amber-800 dark:text-amber-400 text-[10.5px] sm:text-xs font-black uppercase tracking-wider">
                      <FiAlertCircle size={14} className="shrink-0" />
                      <span>Production Symptom &amp; Breakage</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {currentIncident.symptom}
                    </p>
                  </div>

                  {/* 2. Root Cause */}
                  <div className="p-3 sm:p-4 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-300/80 dark:border-white/10">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 text-purple-800 dark:text-purple-400 text-[10.5px] sm:text-xs font-black uppercase tracking-wider">
                      <FiTerminal size={14} className="shrink-0" />
                      <span>Root-Cause Diagnostic Analysis</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {currentIncident.root_cause}
                    </p>
                  </div>

                  {/* 3. The Authoritative Fix */}
                  <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 text-emerald-800 dark:text-emerald-400 text-[10.5px] sm:text-xs font-black uppercase tracking-wider">
                      <FiCheckCircle size={14} className="shrink-0" />
                      <span>Authoritative Upstream Remediation</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {currentIncident.fix}
                    </p>
                  </div>

                  {/* 4. Verified Outcome */}
                  <div className="p-3 sm:p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-2.5 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/20 text-cyan-800 dark:text-cyan-400 shrink-0 mt-0.5">
                      <FiShield size={16} />
                    </div>
                    <div>
                      <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-900 dark:text-cyan-400 block mb-0.5">
                        Production Outcome &amp; Stability Verification
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                        {currentIncident.outcome}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── 4. Engineering Rules Grid ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiLayers className="text-cyan-600 dark:text-cyan-400" size={15} />
              <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Operational Architecture Rules
              </h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold hidden sm:inline-block">
              Non-negotiable engineering constraints
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {engineering_rules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-cyan-400/50 dark:hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20 mb-1.5 sm:mb-2 inline-block">
                    {rule.id}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white mb-1 sm:mb-1.5">
                    {rule.name}
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-slate-700 dark:text-slate-400 font-medium leading-relaxed">
                    {rule.statement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 5. Mental Models Grid ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base">🧬</span>
              <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Mental Models
              </h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold hidden sm:inline-block">
              First-principles execution filters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {mental_models.map((model, idx) => {
              const borderColors = [
                'border-l-cyan-500',
                'border-l-purple-500',
                'border-l-indigo-500',
                'border-l-emerald-500'
              ];
              return (
                <div
                  key={model.name}
                  className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-l-4 ${borderColors[idx % 4]} bg-white/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)] hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{MODEL_ICONS[idx % MODEL_ICONS.length]}</div>
                    <h4
                      className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-1.5 sm:mb-2 tracking-tight"
                      style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, serif' }}
                    >
                      {model.name}
                    </h4>
                    <p className="text-[11.5px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-400 font-medium leading-relaxed">
                      {model.concept}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
