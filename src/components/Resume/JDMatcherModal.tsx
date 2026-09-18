'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCpu, FiPaperclip, FiMapPin, FiX, FiCheckCircle, 
  FiAlertCircle, FiArrowRight, FiFileText, FiLoader, FiUserCheck, FiLock, FiGlobe, FiSend 
} from 'react-icons/fi';
import { FaWandMagicSparkles, FaGoogle } from 'react-icons/fa6';
import { auth, googleProvider, signInWithPopup, signOut } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface JDAnalysisResult {
  companyName: string;
  companyLocation: string;
  jobTitle: string;
  matchScore: number;
  verdict: string;
  fitSummary: string;
  matchingSkills: string[];
  missingSkills: string[];
  tailoredPitch: string;
  recommendedProjects: string[];
}

export default function JDMatcherModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  
  // Geolocation & Recruiter Telemetry
  const [recruiterLocation, setRecruiterLocation] = useState('Detecting location...');
  const [isLocating, setIsLocating] = useState(true);
  
  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form Inputs
  const [jdText, setJdText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recruiterNameInput, setRecruiterNameInput] = useState('');
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisResult, setAnalysisResult] = useState<JDAnalysisResult | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock background scroll and hide navbar when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.classList.add('resume-fullscreen-active');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('resume-fullscreen-active');
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('resume-fullscreen-active');
    };
  }, [isOpen]);

  // 1. Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setRecruiterNameInput(currentUser.displayName || currentUser.email?.split('@')[0] || '');
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Automatic Browser Geolocation & Reverse Geocoding
  useEffect(() => {
    if (!isOpen) return;

    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const data = await res.json();
              const city = data.address?.city || data.address?.town || data.address?.state_district || 'City';
              const country = data.address?.country || 'Country';
              setRecruiterLocation(`${city}, ${country}`);
              setIsLocating(false);
              return;
            }
          } catch (e) {
            console.log('Reverse geocode fallback note:', e);
          }
          fetchIpLocationFallback();
        },
        (err) => {
          console.log('Browser geolocation denied or error:', err.message);
          fetchIpLocationFallback();
        },
        { timeout: 8000 }
      );
    } else {
      fetchIpLocationFallback();
    }
  }, [isOpen]);

  const fetchIpLocationFallback = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.country_name) {
          setRecruiterLocation(`${data.city}, ${data.country_name}`);
          setIsLocating(false);
          return;
        }
      }
    } catch (e) {
      console.log('IP location fallback note:', e);
    }
    setRecruiterLocation('Global / Remote Recruiter');
    setIsLocating(false);
  };

  // 1-Click Firebase Google Authentication
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setRecruiterNameInput(result.user.displayName || result.user.email?.split('@')[0] || '');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to authenticate with Google Firebase');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisResult(null);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAnalysisResult(null);

    if (!user) {
      setErrorMsg('Mandatory email verification required. Please verify your email with 1-click Google sign-in.');
      return;
    }

    if (activeTab === 'paste' && !jdText.trim()) {
      setErrorMsg('Please paste the Job Description text or a Job Posting URL link.');
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      setErrorMsg('Please select or upload a document file (.pdf, .docx, .txt).');
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('recruiterLocation', recruiterLocation);
      formData.append('recruiterEmail', user.email || '');
      formData.append('recruiterName', recruiterNameInput.trim() || user.displayName || user.email?.split('@')[0] || 'Recruiter');
      formData.append('jdText', activeTab === 'paste' ? jdText : '');

      if (activeTab === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch('/api/jd-match', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process Job Description');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing AI match');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setJdText('');
    setSelectedFile(null);
    setErrorMsg('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setAnalysisResult(null);
    setErrorMsg('');
  };

  return (
    <>
      {/* Trigger Button - Simple, clear, easy to understand text */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2.5 px-7 md:px-9 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-2xl font-black text-xs md:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer"
      >
        <FaWandMagicSparkles size={18} className="group-hover:rotate-12 transition-transform text-amber-300" />
        <span>Match Job Description</span>
        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-xs ml-0.5">
          AI
        </span>
      </motion.button>

      {/* Portal Lightbox Modal directly on document.body */}
      {isMounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              data-fullscreen-modal="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto w-screen h-screen"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-3xl bg-white dark:bg-[#0c1021] border border-slate-200/90 dark:border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-cyan-500/5 p-6 md:p-8 my-auto max-h-[92vh] overflow-y-auto text-left custom-scrollbar"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shadow-xs">
                      <FiCpu size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        AI Job Description Matcher
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                        <FiMapPin className="text-cyan-600 dark:text-cyan-400" />
                        <span>{isLocating ? 'Detecting your location...' : `HR Location: ${recruiterLocation}`}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/15 transition-all cursor-pointer"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {!analysisResult ? (
                  /* Form Input Section */
                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {/* 1-Click Minimal Firebase Verification Badge */}
                    <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 flex flex-col gap-3">
                      {user ? (
                        <div className="w-full space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                                <FiUserCheck size={15} />
                              </div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                ✓ Verified Recruiter Session
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => signOut(auth)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                            >
                              Sign Out
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                                Recruiter Name
                              </label>
                              <input
                                type="text"
                                value={recruiterNameInput}
                                onChange={(e) => setRecruiterNameInput(e.target.value)}
                                placeholder="Enter your full name..."
                                className="w-full bg-white dark:bg-white/10 border border-slate-300/90 dark:border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                                Verified Email
                              </label>
                              <input
                                type="text"
                                disabled
                                value={user.email || ''}
                                className="w-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                              <FiLock size={18} />
                            </div>
                            <div className="text-left">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Mandatory Email Verification
                              </span>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                1-click email authentication to unlock AI JD matching &amp; report delivery
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isAuthLoading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                          >
                            {isAuthLoading ? (
                              <FiLoader className="animate-spin" size={14} />
                            ) : (
                              <FaGoogle className="text-amber-400 dark:text-amber-500" size={14} />
                            )}
                            <span>Verify Email with Google</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {authError && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200/90 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 text-xs font-bold rounded-xl flex items-center gap-2">
                        <FiAlertCircle size={16} />
                        <span>{authError}</span>
                      </div>
                    )}

                    {/* Input Choice Tabs: Paste Text vs Attach Document */}
                    <div>
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/90 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => setActiveTab('paste')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'paste'
                              ? 'bg-cyan-600 text-white shadow-sm dark:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-500/30'
                              : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          Paste JD Text or Job Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('file')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'file'
                              ? 'bg-purple-600 text-white shadow-sm dark:bg-purple-500/20 dark:text-purple-400 dark:border dark:border-purple-500/30'
                              : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <FiPaperclip size={14} />
                          <span>Attach File (.PDF / .DOCX / .TXT)</span>
                        </button>
                      </div>

                      <div className="mt-4">
                        {activeTab === 'paste' ? (
                          <textarea
                            rows={7}
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste Job Description text or Job Link URL here (e.g. https://linkedin.com/jobs/... or https://company.com/careers)... Gemini AI will automatically fetch web content, extract Company Name & Location, and evaluate candidate match."
                            className="w-full bg-slate-50 border border-slate-300/90 dark:bg-white/5 dark:border-white/10 rounded-2xl p-4 text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-600 focus:bg-white dark:focus:border-cyan-400 resize-none font-mono transition-colors"
                          />
                        ) : (
                          <div className="border-2 border-dashed border-slate-300/90 dark:border-white/15 rounded-2xl p-8 text-center bg-slate-50/90 hover:bg-slate-100/90 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.txt"
                              onChange={handleFileChange}
                              id="jd-file-input"
                              className="hidden"
                            />
                            <label htmlFor="jd-file-input" className="cursor-pointer flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 flex items-center justify-center">
                                <FiFileText size={24} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {selectedFile ? selectedFile.name : 'Click to upload or drag JD document'}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                  Supports PDF, DOCX, and TXT files
                                </p>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200/90 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 text-xs font-bold rounded-xl">
                        <FiAlertCircle size={16} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Submit Action */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/90 dark:border-white/10">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isAnalyzing || !user}
                        className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isAnalyzing ? (
                          <>
                            <FiLoader size={16} className="animate-spin" />
                            <span>AI Evaluating Candidate &amp; Sending Report...</span>
                          </>
                        ) : (
                          <>
                            <FaWandMagicSparkles size={16} />
                            <span>Analyze Match</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Results Display Section */
                  <div className="mt-6 space-y-6">
                    {/* Score & AI Extraction Banner */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl border border-indigo-500/30">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {(() => {
                          const score = analysisResult.matchScore;
                          let label = 'Not Matched';
                          let badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                          let icon = <FiAlertCircle size={20} className="text-rose-400" />;

                          if (score > 80) {
                            label = 'Perfectly Matched';
                            badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                            icon = <FaWandMagicSparkles size={18} className="text-emerald-400" />;
                          } else if (score >= 66) {
                            label = 'Matched';
                            badgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                            icon = <FiCheckCircle size={20} className="text-cyan-400" />;
                          } else if (score >= 50) {
                            label = 'Slightly Matched';
                            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                            icon = <FiCheckCircle size={20} className="text-amber-400" />;
                          }

                          return (
                            <div className={`px-4 py-2.5 rounded-2xl border font-black text-sm md:text-base flex items-center gap-2.5 shadow-md ${badgeStyle}`}>
                              {icon}
                              <span>{label}</span>
                            </div>
                          );
                        })()}

                        <div className="text-left">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                            {analysisResult.verdict}
                          </span>
                          <h4 className="text-lg md:text-xl font-black text-white">
                            {analysisResult.companyName} • {analysisResult.jobTitle}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1">
                              <FiGlobe className="text-purple-400" size={12} />
                              Company Location: <strong className="text-white">{analysisResult.companyLocation}</strong>
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all text-white cursor-pointer"
                      >
                        Analyze Another JD
                      </button>
                    </div>

                    {/* Verification Email Confirmation Banner */}
                    {user?.email && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 dark:bg-emerald-500/10 dark:border-emerald-500/20 flex items-center gap-3">
                        <FiSend className="text-emerald-600 dark:text-emerald-400 shrink-0" size={18} />
                        <div className="text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                          <strong className="font-extrabold text-emerald-950 dark:text-emerald-200">Automated Thanks &amp; Report Email Dispatched!</strong> A copy of this candidate evaluation report has been sent to <strong>{user.email}</strong>.
                        </div>
                      </div>
                    )}

                    {/* Executive Fit Summary */}
                    <div className="p-5 bg-slate-100/80 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 rounded-2xl">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2 flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" />
                        <span>Executive Candidate Fit Summary</span>
                      </h5>
                      <p className="text-xs md:text-sm text-slate-900 dark:text-slate-300 font-medium leading-relaxed">
                        {analysisResult.fitSummary}
                      </p>
                    </div>

                    {/* Matching & Missing Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50/90 border border-emerald-200/90 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-2xl">
                        <h6 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-400 mb-2">
                          Key Matched Stack &amp; Capabilities
                        </h6>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.matchingSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-extrabold px-2.5 py-1 bg-emerald-200/80 text-emerald-950 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-lg"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50/90 border border-amber-200/90 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-2xl">
                        <h6 className="text-xs font-extrabold text-amber-900 dark:text-amber-400 mb-2">
                          Skill Growth / Ramp-Up Areas
                        </h6>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.missingSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-extrabold px-2.5 py-1 bg-amber-200/80 text-amber-950 dark:bg-amber-500/20 dark:text-amber-300 rounded-lg"
                            >
                              • {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tailored Value Pitch */}
                    <div className="p-5 bg-purple-50/90 border border-purple-200/90 dark:bg-purple-500/10 dark:border-purple-500/20 rounded-2xl">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-purple-950 dark:text-purple-400 mb-2">
                        Why Hire Sanket for This Role?
                      </h5>
                      <p className="text-xs md:text-sm text-slate-900 dark:text-slate-300 font-semibold leading-relaxed">
                        {analysisResult.tailoredPitch}
                      </p>
                    </div>

                    {/* Recommended Portfolio Projects */}
                    {analysisResult.recommendedProjects && analysisResult.recommendedProjects.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
                          Recommended Projects to Inspect
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.recommendedProjects.map((project, idx) => (
                            <a
                              key={idx}
                              href="#projects"
                              onClick={handleClose}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-white/10 text-slate-900 dark:text-white text-xs font-bold transition-all shadow-xs"
                            >
                              <span>{project}</span>
                              <FiArrowRight size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200/90 dark:border-white/10 text-center">
                      <button
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
                      >
                        Done Reviewing
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
