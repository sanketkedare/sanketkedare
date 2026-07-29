'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp, 
  FiBriefcase, 
  FiZap, 
  FiGitCommit,
  FiGitBranch,
  FiCode,
  FiAward,
  FiStar,
  FiCpu,
  FiBookOpen,
  FiUserCheck,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

import visiontechLogo from '@/images/experience/visiontech-logo-no-background (1).webp';
import almabetterLogo from '@/images/experience/almabetter.png';
import jsLogo from '@/images/js.png';
import unifiedMentorLogo from '@/images/experience/Unified_Mentor.png';

interface ExperienceNode {
  id: string;
  role: string;
  company: string;
  logo?: StaticImageData;
  logoType?: 'horizontal' | 'square';
  period: string;
  location: string;
  type: string;
  stageLabel: 'FULL TIME & SENIOR LEADERSHIP' | 'FREELANCING' | 'INTERNSHIP & MENTORSHIP' | 'LEARNING & FOUNDATION';
  stageColor: string;
  badgeText: 'FULL TIME' | 'FREELANCING' | 'INTERNSHIP' | 'LEARNING';
  isCurrent?: boolean;
  impactTagline: string;
  highlights: string[];
  skills: string[];
  keyProjects?: string[];
  promotions?: { role: string; period: string; isCurrent?: boolean }[];
}

const nodes: ExperienceNode[] = [
  {
    id: 'visiontech',
    role: 'Senior Full Stack Developer',
    company: 'VisionTech Group',
    logo: visiontechLogo,
    logoType: 'horizontal',
    period: 'Jun 2025 - Present',
    location: 'Hyderabad, India (On-site)',
    type: 'Full-time',
    stageLabel: 'FULL TIME & SENIOR LEADERSHIP',
    stageColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    badgeText: 'FULL TIME',
    isCurrent: true,
    promotions: [
      { role: 'Senior Full Stack Developer', period: 'Jul 2026 - Present', isCurrent: true },
      { role: 'Full Stack Developer', period: 'Jun 2025 - Jul 2026' }
    ],
    impactTagline: 'Engineering Lead & Architect for VisionTech Academy Flagship Platforms, LMS, & EMS Applications',
    highlights: [
      'Promoted to Senior Full Stack Developer in July 2026, taking full technical ownership of core platform architecture and engineering standards across VisionTech Group.',
      'Architecting and leading end-to-end full-stack development for VisionTech Academy flagship web portal, Learning Management System (LMS), and Education Management System (EMS).',
      'Engineered server-side rendered (SSR) Next.js 16 App Router systems using Turbopack, driving SEO performance scores to 95+ and delivering sub-second First Contentful Paint (FCP).',
      'Designed multi-tenant RESTful microservice architectures and optimized MongoDB schemas for real-time student tracking, automated grading pipelines, and live video class scheduling.',
      'Configured enterprise AWS cloud infrastructure (Amazon S3, EC2 instances, CloudFront CDN) ensuring 99.9% uptime, robust security compliance, and zero-downtime automated CI/CD deployments.',
      'Mentoring junior developers, conducting rigorous peer code reviews, establishing strict TypeScript guidelines, and driving Agile development sprints.'
    ],
    skills: ['Next.js 16', 'React 19', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript', 'Tailwind CSS', 'AWS S3/EC2', 'System Architecture', 'CI/CD Pipelines'],
    keyProjects: ['VisionTech Academy Platform', 'Learning Management System (LMS)', 'Education Management System (EMS)', 'Automated Grading Pipeline']
  },
  {
    id: 'viacerta',
    role: 'Frontend Developer',
    company: 'ViaCerta Abroad',
    period: 'Feb 2025 - Jun 2025 (5 mos)',
    location: 'Delhi, India (Remote)',
    type: 'Full-time',
    stageLabel: 'FULL TIME & SENIOR LEADERSHIP',
    stageColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    badgeText: 'FULL TIME',
    impactTagline: 'Interactive Design Systems & Web Performance Tuning for Educational Consultancy',
    highlights: [
      'Engineered high-converting interactive web portals and multi-step student onboarding workflows for a global educational consultancy.',
      'Designed and deployed scalable UI component design systems using React, TypeScript 5, Tailwind CSS, and Framer Motion micro-animations.',
      'Achieved a 40% reduction in web page bundle sizes through strategic code-splitting, route lazy loading, dynamic image compression, and web vitals optimization.',
      'Integrated Redux Toolkit centralized state management for complex multi-stage visa application forms and document upload tracking pipelines.'
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs', 'Framer Motion', 'Web Vitals', 'UI/UX Design Systems'],
    keyProjects: ['Global Consultancy Workflows', 'Responsive Component Library', 'Visa Document Tracking System']
  },
  {
    id: 'freelance',
    role: 'JavaScript Developer Freelancer',
    company: 'Freelance Practice',
    logo: jsLogo,
    logoType: 'square',
    period: 'Jan 2024 - Feb 2025 (1 yr 2 mos)',
    location: 'Remote',
    type: 'Freelance',
    stageLabel: 'FREELANCING',
    stageColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    badgeText: 'FREELANCING',
    impactTagline: 'End-to-End Client Web Applications, Dashboard Portals, & Custom API Integrations (Launched During AlmaBetter)',
    highlights: [
      'Launched active commercial freelancing in Jan 2024 while completing fellowship training at AlmaBetter, delivering production web solutions for global clients.',
      'Engineered full-stack SaaS MVPs, admin dashboard analytics portals, and dynamic single-page web applications using clean JavaScript ES6+ and Node.js.',
      'Integrated secure third-party payment processing gateways (Stripe, Razorpay), OAuth 2.0 authentication, and automated email/SMS webhook notifications.',
      'Provided end-to-end technical consulting, performance audits, database indexing, and query optimizations for small-to-medium business clients.'
    ],
    skills: ['JavaScript ES6+', 'React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Stripe API', 'Razorpay', 'OAuth 2.0'],
    keyProjects: ['Client Dashboard Analytics Portals', 'Payment & Auth API Integrations', 'Custom Full-Stack SaaS MVPs']
  },
  {
    id: 'unified',
    role: 'Full Stack Web Developer',
    company: 'Unified Mentor',
    logo: unifiedMentorLogo,
    logoType: 'horizontal',
    period: 'Dec 2024 - Jan 2025 (2 mos)',
    location: 'Remote',
    type: 'Internship',
    stageLabel: 'INTERNSHIP & MENTORSHIP',
    stageColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: 'INTERNSHIP',
    impactTagline: 'MERN Microservices & Component Development during Active Freelancing',
    highlights: [
      'Developed modular MERN stack project features and RESTful backend microservices while actively running commercial freelance projects.',
      'Created reusable, accessible React UI component libraries with strict state isolation and responsive layout support.',
      'Collaborated with senior engineering mentors to implement robust JWT authentication, password hashing with bcrypt, and role-based access control (RBAC).'
    ],
    skills: ['MERN Stack', 'React.js', 'Node.js', 'MongoDB', 'Git', 'JWT Auth', 'Bcrypt Security'],
    keyProjects: ['RESTful Microservices', 'State Management Modules', 'RBAC Authentication System']
  },
  {
    id: 'almabetter-ta',
    role: 'Teaching Assistant Web Development',
    company: 'AlmaBetter',
    logo: almabetterLogo,
    logoType: 'horizontal',
    period: 'Jun 2024 - Jul 2024 (2 mos)',
    location: 'Remote',
    type: 'Internship',
    stageLabel: 'INTERNSHIP & MENTORSHIP',
    stageColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: 'INTERNSHIP',
    impactTagline: 'Mentoring 100+ Aspiring Developers & Conducting Server-Side Code Reviews',
    highlights: [
      'Mentored 100+ aspiring full-stack web developers in Node.js, Express, React, and server-side software engineering principles.',
      'Conducted technical code reviews, debugged complex full-stack codebase issues, and provided 1-on-1 architecture guidance.',
      'Facilitated daily engineering standups, live code walkthroughs, and technical mock interview preparation sessions.'
    ],
    skills: ['Server Side Programming', 'Node.js', 'Express.js', 'Code Review', 'Mentorship', 'Technical Troubleshooting'],
    keyProjects: ['Web Dev Mentorship Track', 'Server-Side Code Audits', 'Technical Interview Prep']
  },
  {
    id: 'almabetter-trainee',
    role: 'Full Stack Web Developer Trainee',
    company: 'AlmaBetter',
    logo: almabetterLogo,
    logoType: 'horizontal',
    period: 'Apr 2023 - Mar 2024 (1 yr)',
    location: 'Remote',
    type: 'Apprenticeship',
    stageLabel: 'LEARNING & FOUNDATION',
    stageColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'LEARNING',
    impactTagline: '1-Year MERN Fellowship, DSA, & Full-Stack Capstone Systems (GrowSphere, Snapdeal Clone)',
    highlights: [
      'Completed an intensive 1-year fellowship covering MERN Stack Web Development, Data Structures & Algorithms, and System Design fundamentals.',
      'Successfully launched commercial freelancing in Jan 2024 during training before completing the fellowship, applying real-world code skills.',
      'Engineered 3 major enterprise-grade capstone projects: GrowSphere (MERN investment platform with Firebase & JWT), Snapdeal Clone (React/Redux e-commerce web app), and React Tasks suite.'
    ],
    skills: ['MERN Stack', 'JavaScript ES6+', 'Data Structures & Algorithms', 'React', 'Node.js', 'MongoDB', 'System Design', 'Firebase'],
    keyProjects: ['GrowSphere MERN Platform', 'Snapdeal E-Commerce Clone', 'React Task Management Suite']
  }
];

export default function Experience() {
  const [selectedId, setSelectedId] = useState<string>('visiontech');
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSelectNode = (id: string, autoScroll = true) => {
    setSelectedId(id);
    if (autoScroll) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const currentIndex = nodes.findIndex(n => n.id === selectedId);
  const activeNode = nodes[currentIndex >= 0 ? currentIndex : 0];
  const prevNode = nodes[currentIndex > 0 ? currentIndex - 1 : nodes.length - 1];
  const nextNode = nodes[currentIndex < nodes.length - 1 ? currentIndex + 1 : 0];

  return (
    <section id="experience" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen py-24 flex flex-col justify-center border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050511] overflow-hidden">
      
      {/* Seamless Page Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-3">
            <FiGitBranch size={13} /> Interactive Career Flow Graph
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-600 to-purple-600 dark:from-white dark:via-cyan-400 dark:to-purple-400 tracking-tight">
            Evolution Flow Diagram
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto font-medium">
            Visualizing parallel growth tracks: Started freelancing while learning at AlmaBetter, leading into senior engineering leadership. Click any node to auto-scroll to full details.
          </p>
        </motion.div>

        {/* SEAMLESS TREE DIAGRAM MATRIX */}
        <div className="relative mb-14 py-6 px-2 md:px-6 overflow-hidden">
          
          <div className="relative z-10 flex flex-col items-center gap-12">
            
            {/* STAGE LABEL 4: FULL TIME & SENIOR LEADERSHIP */}
            <div className="w-full max-w-2xl text-center">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] inline-flex items-center gap-2">
                <FiBriefcase size={13} /> STAGE 4 • FULL TIME & SENIOR LEADERSHIP
              </span>
            </div>

            {/* LEVEL 4: APEX TARGET (VisionTech Senior Full Stack - PERFECTLY BALANCED TREE CARD) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              onClick={() => handleSelectNode('visiontech')}
              className={`cursor-pointer w-full max-w-2xl p-5 md:p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl backdrop-blur-2xl ${
                selectedId === 'visiontech'
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 border-cyan-400 shadow-cyan-500/30 scale-[1.02]'
                  : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center gap-4 md:gap-5 min-w-0 w-full md:w-auto">
                <div className="w-36 md:w-40 h-10 md:h-12 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-md">
                  <Image 
                    src={visiontechLogo} 
                    alt="VisionTech Group" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">VisionTech Group</span>
                    <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">FULL TIME</span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">PROMOTED (JUL 2026)</span>
                  </div>
                  <h4 className="text-base md:text-lg font-black text-cyan-600 dark:text-cyan-400 leading-tight">Senior Full Stack Developer</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 truncate">VisionTech Academy Flagship Platforms, LMS, & EMS</p>
                  
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-black uppercase">Next.js 16</span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-black uppercase">MERN</span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-black uppercase">AWS</span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-black uppercase">System Architecture</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20 self-end md:self-center">
                <span className="text-[10px] text-cyan-400 font-bold whitespace-nowrap">Jun 2025 - Present</span>
                <FiGitCommit size={16} className="text-cyan-400 animate-pulse" />
              </div>
            </motion.div>

            {/* CONNECTING FLOW LINE 1 */}
            <div className="flex flex-col items-center -my-8 z-0">
              <div className="w-[2px] h-12 bg-gradient-to-b from-cyan-500 to-purple-500" />
              <div className="w-3.5 h-3.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
            </div>

            {/* LEVEL 3: CONVERGENCE NODE (ViaCerta Abroad) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              onClick={() => handleSelectNode('viacerta')}
              className={`cursor-pointer w-full max-w-xl p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 backdrop-blur-xl ${
                selectedId === 'viacerta'
                  ? 'bg-white dark:bg-white/10 border-cyan-400 shadow-lg'
                  : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 font-black text-sm text-slate-800 dark:text-white shadow-sm">
                  VA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ViaCerta Abroad</span>
                    <span className="text-[9px] font-black text-cyan-400 uppercase px-2 py-0.5 rounded border border-cyan-500/20">FULL TIME</span>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">Frontend Developer</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Interactive Educational Consultancy Workflows & Design Systems</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold shrink-0">Feb 2025 - Jun 2025</span>
            </motion.div>

            {/* STAGE LABEL 2 & 3: FREELANCING & INTERNSHIPS (PARALLEL FORK) */}
            <div className="w-full max-w-3xl flex flex-col items-center -my-6">
              <div className="w-full text-center mb-1">
                <span className="px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.3)] inline-flex items-center gap-2">
                  <FiGlobe size={13} /> STAGE 2 & 3 • PARALLEL FREELANCING & INTERNSHIPS (JAN 2024 - FEB 2025)
                </span>
              </div>

              <svg className="w-full h-16 pointer-events-none" viewBox="0 0 600 60" fill="none">
                <path d="M 300 0 L 300 15 C 300 35, 120 20, 120 60" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 300 0 L 300 15 C 300 35, 480 20, 480 60" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="300" cy="0" r="4" fill="#a855f7" />
                <circle cx="120" cy="60" r="4" fill="#a855f7" />
                <circle cx="480" cy="60" r="4" fill="#06b6d4" />
              </svg>
            </div>

            {/* LEVEL 2: PARALLEL BRANCHES (LEFT: FREELANCE, RIGHT: INTERNSHIPS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              
              {/* BRANCH A: FREELANCING STAGE */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                onClick={() => handleSelectNode('freelance')}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-3 backdrop-blur-xl ${
                  selectedId === 'freelance'
                    ? 'bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent border-purple-400 shadow-xl shadow-purple-500/20 scale-105'
                    : 'bg-white/60 dark:bg-white/5 border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-300 bg-purple-500/30 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                      FREELANCING
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">Jan 2024 - Feb 2025</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-400/20 p-1 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/30 shadow-sm">
                      <Image src={jsLogo} alt="JavaScript Freelance" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">JavaScript Developer Freelancer</h4>
                      <p className="text-[10px] text-purple-300 font-bold mt-0.5">Started Freelancing while learning!</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {['React', 'Node.js', 'Stripe API', 'Dashboards'].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[8px] font-black uppercase">{s}</span>
                  ))}
                </div>
              </motion.div>

              {/* BRANCH B: INTERNSHIPS & MENTORSHIP STAGE */}
              <div className="flex flex-col gap-3">
                
                {/* UNIFIED MENTOR INTERNSHIP NODE */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  onClick={() => handleSelectNode('unified')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                    selectedId === 'unified'
                      ? 'bg-white dark:bg-white/10 border-emerald-400 shadow-md'
                      : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-28 md:w-32 h-8 md:h-9 bg-white p-0.5 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/80 shadow-sm overflow-hidden">
                        <Image src={unifiedMentorLogo} alt="Unified Mentor" className="w-full h-full object-contain scale-[1.45]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider block">INTERNSHIP</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Unified Mentor • Full Stack Intern</h4>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0">Dec 2024 - Jan 2025</span>
                  </div>
                </motion.div>

                {/* ALMABETTER TA INTERNSHIP NODE */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  onClick={() => handleSelectNode('almabetter-ta')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                    selectedId === 'almabetter-ta'
                      ? 'bg-white dark:bg-white/10 border-emerald-400 shadow-md'
                      : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-28 md:w-32 h-8 md:h-9 bg-transparent p-0 flex items-center justify-center shrink-0">
                        <Image src={almabetterLogo} alt="AlmaBetter" className="w-full h-full object-contain filter drop-shadow" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider block">INTERNSHIP</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">AlmaBetter • Teaching Assistant</h4>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0">Jun 2024 - Jul 2024</span>
                  </div>
                </motion.div>

              </div>

            </div>

            {/* STAGE LABEL 1: LEARNING & FOUNDATION */}
            <div className="flex flex-col items-center -my-6">
              <svg className="w-full max-w-3xl h-14 pointer-events-none" viewBox="0 0 600 50" fill="none">
                <path d="M 120 0 C 120 30, 300 20, 300 50" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 480 0 C 480 30, 300 20, 300 50" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              
              <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest z-10 shadow-lg inline-flex items-center gap-2">
                <FiBookOpen size={13} /> STAGE 1 • LEARNING & FOUNDATION (APR 2023 - MAR 2024)
              </span>
            </div>

            {/* LEVEL 1: FOUNDATIONAL ROOT (AlmaBetter Trainee) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              onClick={() => handleSelectNode('almabetter-trainee')}
              className={`cursor-pointer w-full max-w-2xl p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 backdrop-blur-xl ${
                selectedId === 'almabetter-trainee'
                  ? 'bg-amber-500/10 border-amber-400 shadow-xl scale-[1.02]'
                  : 'bg-white/60 dark:bg-white/5 border-amber-500/30 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-32 md:w-36 h-10 md:h-12 bg-transparent p-0 flex items-center justify-center shrink-0">
                  <Image src={almabetterLogo} alt="AlmaBetter" className="w-full h-full object-contain filter drop-shadow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-500 uppercase tracking-wider">AlmaBetter Fellowship</span>
                    <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">LEARNING</span>
                  </div>
                  <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white">Full Stack Web Developer Trainee</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Capstone Systems: GrowSphere • Snapdeal Clone • React Tasks</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold shrink-0">Apr 2023 - Mar 2024</span>
            </motion.div>

          </div>

        </div>

        {/* EXPANDED SELECTED NODE SPOTLIGHT DETAIL PANEL (BALANCED 2-COLUMN GRID) */}
        <div ref={detailRef} className="scroll-mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 rounded-3xl bg-white/70 dark:bg-[#0a0a1a]/90 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            >
              {/* Header Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
                <div className="flex items-center gap-4">
                  {activeNode.logo ? (
                    <div className={`w-32 md:w-40 h-10 md:h-12 p-1 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-md overflow-hidden ${
                      activeNode.id === 'visiontech' || activeNode.id === 'unified' ? 'bg-white' : 'bg-transparent border-none shadow-none'
                    }`}>
                      <Image src={activeNode.logo} alt={activeNode.company} className={`w-full h-full object-contain filter drop-shadow ${activeNode.id === 'unified' ? 'scale-[1.45]' : ''}`} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 text-slate-800 dark:text-white font-black">
                      <FiBriefcase size={20} />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-black uppercase text-slate-900 dark:text-white">{activeNode.company}</span>
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded border ${activeNode.stageColor}`}>
                        {activeNode.badgeText}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{activeNode.role}</h3>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-400">
                  <span>{activeNode.period} • {activeNode.location}</span>
                </div>
              </div>

              {/* BALANCED 2-COLUMN GRID LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                
                {/* LEFT COLUMN (5/12): Impact, Promotions & Featured Projects */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Core Impact Overview */}
                  <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500 flex items-center gap-1.5 mb-1">
                      <FiAward size={13} /> Core Impact Overview
                    </span>
                    <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                      {activeNode.impactTagline}
                    </p>
                  </div>

                  {/* Promotion Timeline */}
                  {activeNode.promotions && (
                    <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-2">
                        <FiTrendingUp size={14} /> Official Career Progression & Promotion
                      </span>
                      <div className="flex flex-col gap-2 pl-3 border-l-2 border-cyan-500/60">
                        {activeNode.promotions.map((promo, idx) => (
                          <div key={idx} className="flex flex-wrap items-center justify-between text-xs gap-1">
                            <span className={`font-bold ${promo.isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                              {promo.role} {promo.isCurrent && <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest ml-1 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">Promoted (Jul 2026)</span>}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">{promo.period}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Systems & Projects */}
                  {activeNode.keyProjects && (
                    <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2">
                        <FiCpu className="text-purple-500" /> Featured Systems & Projects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeNode.keyProjects.map(proj => (
                          <span key={proj} className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                            {proj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT COLUMN (7/12): Expanded Accomplishments */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-4">
                      <FiZap className="text-cyan-500" /> Expanded Accomplishments & Technical Deliverables
                    </h4>
                    <ul className="space-y-3">
                      {activeNode.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
                          <FiCheckCircle size={15} className="text-cyan-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Skills Tags Bar */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                {activeNode.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Next & Previous Navigation Bar (Bottom Spotlight Section Only) */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex-wrap gap-4">
                <button
                  onClick={() => handleSelectNode(prevNode.id, false)}
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all duration-200 active:scale-95 group shadow-sm"
                >
                  <FiChevronLeft size={18} className="text-cyan-500 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-400 block tracking-widest">PREVIOUS ROLE</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{prevNode.company}</span>
                  </div>
                </button>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                  <span>{currentIndex + 1} / {nodes.length}</span>
                </div>

                <button
                  onClick={() => handleSelectNode(nextNode.id, false)}
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all duration-200 active:scale-95 group shadow-sm"
                >
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-400 block tracking-widest">NEXT ROLE</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{nextNode.company}</span>
                  </div>
                  <FiChevronRight size={18} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
