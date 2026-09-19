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
  stageLabel: 'FULL TIME ENGINEERING' | 'FREELANCING' | 'INTERNSHIP & MENTORSHIP' | 'LEARNING & FOUNDATION';
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
    stageLabel: 'FULL TIME ENGINEERING',
    stageColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    badgeText: 'FULL TIME',
    isCurrent: true,
    promotions: [
      { role: 'Senior Full Stack Developer', period: 'Jul 2026 - Present', isCurrent: true },
      { role: 'Full Stack Developer', period: 'Jun 2025 - Jul 2026' }
    ],
    impactTagline: 'Engineering Lead for VisionTech Academy Flagship Platforms, LMS, & EMS Applications',
    highlights: [
      'Promoted to Senior Full Stack Developer in July 2026, leading platform engineering and technical standards across VisionTech Group.',
      'Leading end-to-end full-stack development for VisionTech Academy flagship web portal, Learning Management System (LMS), and Education Management System (EMS).',
      'Engineered server-side rendered (SSR) Next.js 16 App Router systems with Turbopack, optimizing asset delivery, edge caching, and Core Web Vitals performance.',
      'Designed multi-tenant RESTful microservice architectures and optimized MongoDB schemas for real-time student tracking, automated grading pipelines, and live video class scheduling.',
      'Configured AWS cloud infrastructure (Amazon S3, EC2 instances, CloudFront CDN) with containerized deployments and automated CI/CD pipelines.',
      'Mentoring junior developers, conducting peer code reviews, establishing TypeScript standards, and driving Agile development sprints.'
    ],
    skills: ['Next.js 16', 'React 19', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript', 'Tailwind CSS', 'AWS S3/EC2', 'System Design', 'CI/CD Pipelines'],
    keyProjects: ['VisionTech Academy Platform', 'Learning Management System (LMS)', 'Education Management System (EMS)', 'Automated Grading Pipeline']
  },
  {
    id: 'viacerta',
    role: 'Frontend Developer',
    company: 'ViaCerta Abroad',
    period: 'Feb 2025 - Jun 2025 (5 mos)',
    location: 'Delhi, India (Remote)',
    type: 'Full-time',
    stageLabel: 'FULL TIME ENGINEERING',
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
      'Engineered 3 major enterprise-grade capstone projects: GrowSphere (MERN investment platform with Firebase & JWT), Snapdeal Clone (React/Redux e-commerce web app), and ReactForge platform.'
    ],
    skills: ['MERN Stack', 'JavaScript ES6+', 'Data Structures & Algorithms', 'React', 'Node.js', 'MongoDB', 'System Design', 'Firebase'],
    keyProjects: ['GrowSphere MERN Platform', 'Snapdeal E-Commerce Clone', 'ReactForge Laboratory']
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
    <section id="experience" className="relative w-full min-h-screen py-14 sm:py-20 md:py-24 flex flex-col justify-center border-t border-slate-200/80 dark:border-white/5 bg-transparent dark:bg-[#050511] overflow-hidden">
      
      {/* ── Background Kinetic Atmosphere & Floating Gradient Orbs (Continuous from Section 1 & 2) ── */}
      <div 
        className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,black_35%,transparent_85%)] opacity-[0.25] dark:opacity-[0.14] text-slate-400 dark:text-cyan-400"
        style={{
          backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Kinetic Atmospheric Light Drift 1 */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-24 w-[480px] h-[480px] bg-gradient-to-tr from-cyan-400/20 via-sky-300/15 to-transparent dark:from-cyan-600/10 dark:to-transparent rounded-full blur-[130px] pointer-events-none -z-10"
      />

      {/* Kinetic Atmospheric Light Drift 2 */}
      <motion.div
        animate={{
          x: [0, -35, 30, 0],
          y: [0, 40, -25, 0],
          scale: [1, 0.9, 1.18, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 -right-24 w-[480px] h-[480px] bg-gradient-to-bl from-purple-400/20 via-indigo-300/15 to-transparent dark:from-purple-600/10 dark:to-transparent rounded-full blur-[140px] pointer-events-none -z-10"
      />

      <div className="w-full lg:w-[80%] mx-auto px-3.5 sm:px-6 lg:px-0 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest mb-3 backdrop-blur-sm shadow-sm">
            <FiGitBranch size={13} /> Interactive Career Flow Graph
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-700 to-indigo-900 dark:from-white dark:via-cyan-400 dark:to-purple-400 tracking-tight">
            Evolution Flow Diagram
          </h2>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-400 mt-2 max-w-xl mx-auto font-semibold leading-relaxed">
            Visualizing parallel growth tracks: Started freelancing while learning at AlmaBetter, leading into senior engineering leadership. Click any node to auto-scroll to full details.
          </p>
        </motion.div>

        {/* SEAMLESS TREE DIAGRAM MATRIX */}
        <div className="relative mb-8 sm:mb-14 py-3 sm:py-6 px-1 sm:px-2 md:px-6 overflow-hidden">
          
          <div className="relative z-10 flex flex-col items-center gap-7 sm:gap-12">
            
            {/* STAGE LABEL 4: FULL TIME & SENIOR LEADERSHIP */}
            <div className="w-full max-w-2xl text-center">
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-500/40 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest shadow-[0_4px_16px_rgba(6,182,212,0.15)] dark:shadow-[0_0_20px_rgba(6,182,212,0.3)] inline-flex items-center gap-2 backdrop-blur-md">
                <FiBriefcase size={13} /> STAGE 4 • FULL TIME &amp; SENIOR LEADERSHIP
              </span>
            </div>

            {/* LEVEL 4: APEX TARGET (VisionTech Senior Full Stack) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              onClick={() => handleSelectNode('visiontech')}
              className={`cursor-pointer w-full max-w-2xl p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-5 backdrop-blur-2xl ${
                selectedId === 'visiontech'
                  ? 'bg-cyan-50/90 dark:bg-[#0a0a1a] dark:bg-gradient-to-r dark:from-cyan-500/20 dark:via-purple-500/20 dark:to-cyan-500/20 border-cyan-500 dark:border-cyan-400 shadow-[0_20px_45px_-8px_rgba(6,182,212,0.22)] dark:shadow-cyan-500/30 scale-[1.02]'
                  : 'bg-cyan-50/50 dark:bg-[#0a0a1a] border-cyan-200/90 dark:border-white/10 ring-1 ring-cyan-900/[0.04] dark:ring-transparent shadow-[0_10px_30px_-5px_rgba(6,182,212,0.12)] dark:shadow-2xl hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 w-full md:w-auto">
                <div className="w-24 sm:w-36 md:w-40 h-8 sm:h-10 md:h-12 bg-white p-1 sm:p-1.5 rounded-xl flex items-center justify-center shrink-0 border border-cyan-200/80 shadow-md">
                  <Image 
                    src={visiontechLogo} 
                    alt="VisionTech Group" 
                    loading="lazy"
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">VisionTech Group</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/20 px-1.5 sm:px-2 py-0.5 rounded-full border border-cyan-300">FULL TIME</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300">PROMOTED (JUL 2026)</span>
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-black text-cyan-700 dark:text-cyan-400 leading-tight">Senior Full Stack Developer</h4>
                  <p className="text-[10.5px] sm:text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5 truncate sm:whitespace-normal">VisionTech Academy Flagship Platforms, LMS, &amp; EMS</p>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mt-1.5 sm:mt-2">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white border border-cyan-200 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/25 text-[8px] sm:text-[9px] font-black uppercase shadow-2xs">Next.js 16</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white border border-cyan-200 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/25 text-[8px] sm:text-[9px] font-black uppercase shadow-2xs">MERN</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white border border-cyan-200 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/25 text-[8px] sm:text-[9px] font-black uppercase shadow-2xs">AWS</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white border border-cyan-200 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/25 text-[8px] sm:text-[9px] font-black uppercase shadow-2xs">System Architecture</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-cyan-100/80 dark:bg-cyan-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-cyan-300 dark:border-cyan-500/30 self-start md:self-center">
                <span className="text-[9px] sm:text-[10px] text-cyan-900 dark:text-cyan-400 font-black whitespace-nowrap">Jun 2025 - Present</span>
                <FiGitCommit size={15} className="text-cyan-600 dark:text-cyan-400 animate-pulse" />
              </div>
            </motion.div>

            {/* CONNECTING FLOW LINE 1 */}
            <div className="flex flex-col items-center -my-5 sm:-my-8 z-0">
              <div className="w-[2px] h-8 sm:h-12 bg-gradient-to-b from-cyan-500 to-purple-500" />
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
            </div>

            {/* LEVEL 3: CONVERGENCE NODE (ViaCerta Abroad) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              onClick={() => handleSelectNode('viacerta')}
              className={`cursor-pointer w-full max-w-xl p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 backdrop-blur-xl ${
                selectedId === 'viacerta'
                  ? 'bg-sky-50/90 dark:bg-[#0a0a1a] border-cyan-500 dark:border-cyan-400 shadow-[0_16px_36px_-6px_rgba(6,182,212,0.18)] dark:shadow-cyan-500/20'
                  : 'bg-sky-50/50 dark:bg-[#0a0a1a]/80 dark:border-white/10 shadow-[0_8px_20px_-5px_rgba(6,182,212,0.1)] hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 text-white dark:bg-white/10 border border-slate-700 dark:border-white/10 flex items-center justify-center shrink-0 font-black text-xs sm:text-sm shadow-md">
                  VA
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-800 dark:text-slate-400 uppercase tracking-wider sm:tracking-widest">ViaCerta Abroad</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/20 px-1.5 sm:px-2 py-0.5 rounded border border-cyan-300">FULL TIME</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Frontend Developer</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-400 font-medium mt-0.5 truncate sm:whitespace-normal">Interactive Educational Consultancy Workflows &amp; Design Systems</p>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-400 font-black shrink-0 whitespace-nowrap self-start sm:self-center pl-1 sm:pl-0">Feb 2025 - Jun 2025</span>
            </motion.div>

            {/* STAGE LABEL 2 & 3: FREELANCING & INTERNSHIPS (PARALLEL FORK) */}
            <div className="w-full max-w-3xl flex flex-col items-center -my-4 sm:-my-6">
              <div className="w-full text-center mb-1">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest shadow-[0_4px_16px_rgba(168,85,247,0.15)] dark:shadow-[0_0_20px_rgba(168,85,247,0.3)] inline-flex items-center gap-2 backdrop-blur-md">
                  <FiGlobe size={13} />
                  <span className="sm:hidden">STAGE 2 &amp; 3 • FREELANCING &amp; INTERNSHIPS</span>
                  <span className="hidden sm:inline">STAGE 2 &amp; 3 • PARALLEL FREELANCING &amp; INTERNSHIPS (JAN 2024 - FEB 2025)</span>
                </span>
              </div>

              <svg className="w-full h-12 sm:h-16 pointer-events-none" viewBox="0 0 600 60" fill="none">
                <path d="M 300 0 L 300 15 C 300 35, 120 20, 120 60" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 300 0 L 300 15 C 300 35, 480 20, 480 60" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="300" cy="0" r="4" fill="#a855f7" />
                <circle cx="120" cy="60" r="4" fill="#a855f7" />
                <circle cx="480" cy="60" r="4" fill="#06b6d4" />
              </svg>
            </div>

            {/* LEVEL 2: PARALLEL BRANCHES (LEFT: FREELANCE, RIGHT: INTERNSHIPS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
              
              {/* BRANCH A: FREELANCING STAGE */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                onClick={() => handleSelectNode('freelance')}
                className={`cursor-pointer p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-2.5 sm:gap-3 backdrop-blur-xl ${
                  selectedId === 'freelance'
                    ? 'bg-purple-50/90 dark:bg-[#0a0a1a] dark:bg-gradient-to-br dark:from-purple-500/20 dark:via-purple-500/10 dark:to-transparent border-purple-500 dark:border-purple-400 shadow-[0_18px_40px_-8px_rgba(168,85,247,0.2)] dark:shadow-purple-500/20 scale-105'
                    : 'bg-purple-50/50 dark:bg-[#0a0a1a] border-purple-200/90 dark:border-purple-500/30 hover:border-purple-400 shadow-[0_10px_25px_-5px_rgba(168,85,247,0.1)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <span className="text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2 sm:px-2.5 py-0.5 rounded-full border border-purple-300">
                      FREELANCING
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] font-bold text-slate-700 dark:text-slate-400">Jan 2024 - Feb 2025</span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/15 dark:bg-amber-400/20 p-1 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/30 shadow-sm">
                      <Image src={jsLogo} alt="JavaScript Freelance" loading="lazy" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">JavaScript Developer Freelancer</h4>
                      <p className="text-[9.5px] sm:text-[10px] text-purple-800 dark:text-purple-300 font-bold mt-0.5">Started Freelancing while learning!</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                  {['React', 'Node.js', 'Stripe API', 'Dashboards'].map(s => (
                    <span key={s} className="px-1.5 sm:px-2 py-0.5 rounded bg-white border border-purple-200 text-purple-800 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25 text-[7.5px] sm:text-[8px] font-black uppercase shadow-2xs">{s}</span>
                  ))}
                </div>
              </motion.div>

              {/* BRANCH B: INTERNSHIPS & MENTORSHIP STAGE */}
              <div className="flex flex-col gap-2.5 sm:gap-3">
                
                {/* UNIFIED MENTOR INTERNSHIP NODE */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  onClick={() => handleSelectNode('unified')}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                    selectedId === 'unified'
                      ? 'bg-emerald-50/90 dark:bg-[#0a0a1a] border-emerald-500 dark:border-emerald-400 shadow-md'
                      : 'bg-emerald-50/50 dark:bg-[#0a0a1a] border-emerald-200/80 dark:border-white/10 shadow-xs hover:border-emerald-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <div className="w-20 sm:w-28 md:w-32 h-6 sm:h-8 md:h-9 bg-white p-0.5 rounded-lg flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm overflow-hidden">
                        <Image src={unifiedMentorLogo} alt="Unified Mentor" loading="lazy" className="w-full h-full object-contain scale-[1.45]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] sm:text-[9px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">INTERNSHIP</span>
                        <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">Unified Mentor • Full Stack Intern</h4>
                      </div>
                    </div>
                    <span className="text-[8px] sm:text-[9px] text-slate-700 dark:text-slate-400 font-bold shrink-0 whitespace-nowrap self-start sm:self-center pl-0.5 sm:pl-0">Dec 2024 - Jan 2025</span>
                  </div>
                </motion.div>

                {/* ALMABETTER TA INTERNSHIP NODE */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  onClick={() => handleSelectNode('almabetter-ta')}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                    selectedId === 'almabetter-ta'
                      ? 'bg-emerald-50/90 dark:bg-[#0a0a1a] border-emerald-500 dark:border-emerald-400 shadow-md'
                      : 'bg-emerald-50/50 dark:bg-[#0a0a1a] border-emerald-200/80 dark:border-white/10 shadow-xs hover:border-emerald-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <div className="w-20 sm:w-28 md:w-32 h-6 sm:h-8 md:h-9 bg-slate-900/90 dark:bg-transparent p-1 rounded-md flex items-center justify-center shrink-0">
                        <Image src={almabetterLogo} alt="AlmaBetter" loading="lazy" className="w-full h-full object-contain filter drop-shadow" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] sm:text-[9px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">INTERNSHIP</span>
                        <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">AlmaBetter • Teaching Assistant</h4>
                      </div>
                    </div>
                    <span className="text-[8px] sm:text-[9px] text-slate-700 dark:text-slate-400 font-bold shrink-0 whitespace-nowrap self-start sm:self-center pl-0.5 sm:pl-0">Jun 2024 - Jul 2024</span>
                  </div>
                </motion.div>

              </div>

            </div>

            {/* STAGE LABEL 1: LEARNING & FOUNDATION */}
            <div className="flex flex-col items-center -my-4 sm:-my-6">
              <svg className="w-full max-w-3xl h-10 sm:h-14 pointer-events-none" viewBox="0 0 600 50" fill="none">
                <path d="M 120 0 C 120 30, 300 20, 300 50" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 480 0 C 480 30, 300 20, 300 50" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest z-10 shadow-md inline-flex items-center gap-2 backdrop-blur-md">
                <FiBookOpen size={13} />
                <span className="sm:hidden">STAGE 1 • LEARNING &amp; FOUNDATION</span>
                <span className="hidden sm:inline">STAGE 1 • LEARNING &amp; FOUNDATION (APR 2023 - MAR 2024)</span>
              </span>
            </div>

            {/* LEVEL 1: FOUNDATIONAL ROOT (AlmaBetter Trainee) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              onClick={() => handleSelectNode('almabetter-trainee')}
              className={`cursor-pointer w-full max-w-2xl p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-5 backdrop-blur-xl ${
                selectedId === 'almabetter-trainee'
                  ? 'bg-amber-50/90 dark:bg-[#0a0a1a] dark:bg-amber-500/10 border-amber-500 dark:border-amber-400 shadow-[0_16px_36px_-6px_rgba(245,158,11,0.2)] dark:shadow-xl scale-[1.02]'
                  : 'bg-amber-50/50 dark:bg-[#0a0a1a] border-amber-200/90 dark:border-amber-500/30 hover:border-amber-400 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.1)]'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-20 sm:w-32 md:w-36 h-7 sm:h-10 md:h-12 bg-slate-900/90 dark:bg-transparent p-1 sm:p-1.5 rounded-md flex items-center justify-center shrink-0">
                  <Image src={almabetterLogo} alt="AlmaBetter" loading="lazy" className="w-full h-full object-contain filter drop-shadow" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-wider">AlmaBetter Fellowship</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-300">LEARNING</span>
                  </div>
                  <h4 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white">Full Stack Web Developer Trainee</h4>
                  <p className="text-[10.5px] sm:text-xs text-slate-700 dark:text-slate-400 font-semibold mt-0.5 truncate sm:whitespace-normal">Capstone Systems: GrowSphere • Snapdeal Clone • ReactForge</p>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-400 font-bold shrink-0 whitespace-nowrap self-start md:self-center">Apr 2023 - Mar 2024</span>
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
              className="p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-slate-100/70 dark:bg-[#0a0a1a]/90 border border-slate-200/90 dark:border-white/10 ring-1 ring-slate-900/[0.04] dark:ring-transparent backdrop-blur-2xl shadow-[0_25px_55px_-12px_rgba(15,23,42,0.12)] dark:shadow-2xl relative overflow-hidden"
            >
              {/* Header Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200/80 dark:border-white/10 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {activeNode.logo ? (
                    <div className={`w-24 sm:w-32 md:w-40 h-8 sm:h-10 md:h-12 p-1 sm:p-1.5 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-md overflow-hidden ${
                      activeNode.id === 'visiontech' || activeNode.id === 'unified' ? 'bg-white' : 'bg-slate-900/90 dark:bg-transparent border-none shadow-none'
                    }`}>
                      <Image src={activeNode.logo} alt={activeNode.company} loading="lazy" className={`w-full h-full object-contain filter drop-shadow ${activeNode.id === 'unified' ? 'scale-[1.45]' : ''}`} />
                    </div>
                  ) : (
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 text-white dark:bg-white/10 border border-slate-700 dark:border-white/10 flex items-center justify-center shrink-0 font-black">
                      <FiBriefcase size={16} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-900 dark:text-white">{activeNode.company}</span>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase px-2 sm:px-2.5 py-0.5 rounded border ${activeNode.stageColor}`}>
                        {activeNode.badgeText}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">{activeNode.role}</h3>
                  </div>
                </div>

                <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 shrink-0">
                  <span>{activeNode.period} • {activeNode.location}</span>
                </div>
              </div>

              {/* BALANCED 2-COLUMN GRID LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-6">
                
                {/* LEFT COLUMN (5/12): Impact, Promotions & Featured Projects */}
                <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                  
                  {/* Core Impact Overview */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-cyan-50/70 dark:bg-white/5 border border-cyan-200/90 dark:border-white/10 shadow-xs">
                    <span className="text-[8.5px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-400 flex items-center gap-1.5 mb-1">
                      <FiAward size={13} /> Core Impact Overview
                    </span>
                    <p className="text-xs sm:text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {activeNode.impactTagline}
                    </p>
                  </div>

                  {/* Promotion Timeline */}
                  {activeNode.promotions && (
                    <div className="p-3.5 sm:p-4 bg-gradient-to-r from-cyan-100/80 to-purple-100/80 dark:from-cyan-500/10 dark:to-purple-500/10 border border-cyan-300 dark:border-cyan-500/30 rounded-xl sm:rounded-2xl shadow-xs">
                      <span className="text-[8.5px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-400 flex items-center gap-1.5 mb-2">
                        <FiTrendingUp size={14} /> Official Career Progression &amp; Promotion
                      </span>
                      <div className="flex flex-col gap-1.5 sm:gap-2 pl-2.5 sm:pl-3 border-l-2 border-cyan-500/60">
                        {activeNode.promotions.map((promo, idx) => (
                          <div key={idx} className="flex flex-wrap items-center justify-between text-xs gap-1">
                            <span className={`font-bold text-[11px] sm:text-xs ${promo.isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-400'}`}>
                              {promo.role} {promo.isCurrent && <span className="text-[8px] sm:text-[9px] font-black text-cyan-800 dark:text-cyan-400 uppercase tracking-wider sm:tracking-widest ml-1 bg-cyan-100 dark:bg-cyan-500/20 px-1.5 sm:px-2 py-0.5 rounded-md border border-cyan-300 dark:border-cyan-500/30">Promoted (Jul 2026)</span>}
                            </span>
                            <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-400">{promo.period}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Systems & Projects */}
                  {activeNode.keyProjects && (
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-50/70 dark:bg-white/5 border border-purple-200/90 dark:border-white/10 shadow-xs">
                      <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-purple-800 dark:text-slate-400 mb-2 flex items-center gap-2">
                        <FiCpu className="text-purple-700 dark:text-purple-400" /> Featured Systems &amp; Projects
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {activeNode.keyProjects.map(proj => (
                          <span key={proj} className="px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-white border border-purple-200 text-purple-900 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25 text-[9px] sm:text-[10px] font-bold shadow-2xs">
                            {proj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT COLUMN (7/12): Expanded Accomplishments */}
                <div className="lg:col-span-7 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-400 flex items-center gap-2 mb-3 sm:mb-4">
                      <FiZap className="text-cyan-600 dark:text-cyan-400" /> Expanded Accomplishments &amp; Technical Deliverables
                    </h4>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {activeNode.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-xs md:text-sm text-slate-900 dark:text-slate-300 font-medium">
                          <FiCheckCircle size={14} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Skills Tags Bar */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-slate-200/80 dark:border-white/5">
                {activeNode.skills.map(skill => (
                  <span key={skill} className="px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest text-slate-800 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 shadow-2xs">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Next & Previous Navigation Bar (Bottom Spotlight Section Only) */}
              <div className="flex items-center justify-between pt-3.5 sm:pt-6 mt-3.5 sm:mt-6 border-t border-slate-200/80 dark:border-white/10 gap-1.5 sm:gap-4">
                <button
                  onClick={() => handleSelectNode(prevNode.id, false)}
                  className="inline-flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all duration-200 active:scale-95 group shadow-xs shrink-0"
                >
                  <FiChevronLeft size={16} className="text-cyan-600 dark:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-cyan-700 dark:text-cyan-400 block tracking-wider sm:tracking-widest">PREV</span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white max-w-[70px] sm:max-w-none truncate block">{prevNode.company}</span>
                  </div>
                </button>

                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-400 text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest shadow-2xs shrink-0">
                  <span>{currentIndex + 1} / {nodes.length}</span>
                </div>

                <button
                  onClick={() => handleSelectNode(nextNode.id, false)}
                  className="inline-flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all duration-200 active:scale-95 group shadow-xs shrink-0"
                >
                  <div className="text-right">
                    <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-cyan-700 dark:text-cyan-400 block tracking-wider sm:tracking-widest">NEXT</span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white max-w-[70px] sm:max-w-none truncate block">{nextNode.company}</span>
                  </div>
                  <FiChevronRight size={16} className="text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
