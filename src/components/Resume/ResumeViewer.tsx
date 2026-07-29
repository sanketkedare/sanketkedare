'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, FiDownload, FiShare2, FiX, 
  FiCheck, FiFileText, FiZoomIn, FiZoomOut, FiRotateCcw, 
  FiLoader, FiMaximize2, FiMinimize2 
} from 'react-icons/fi';
import PersonalInfo from '@/lib/personal-info';

const RESUME_PDF = '/Sanket_Kedare_Full_Stack_Developer_Nextjs_Nodejs_Generative_AI_System_Design.pdf';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function ResumeViewer() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfPagesCount, setPdfPagesCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [pdfError, setPdfError] = useState('');

  // Separate refs for inline and fullscreen containers to avoid duplicate ref binding
  const inlineContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const inlineScrollWrapperRef = useRef<HTMLDivElement>(null);
  const fullscreenScrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setResumeUrl(`${window.location.origin}${RESUME_PDF}`);
    }
  }, []);

  const closeFullScreen = () => {
    setIsFullScreen(false);
    document.body.style.overflow = '';

    // Smoothly scroll window back to #resume section anchor
    setTimeout(() => {
      const resumeElement = document.getElementById('resume');
      if (resumeElement) {
        resumeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = '#resume';
      }
    }, 50);
  };

  // Lock background body scroll when fullscreen modal is active
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  // Close fullscreen on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        closeFullScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Prevent browser tab zoom when scrolling over PDF viewer with Ctrl key
  useEffect(() => {
    const activeWrapper = isFullScreen ? fullscreenScrollWrapperRef.current : inlineScrollWrapperRef.current;
    if (!activeWrapper) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        setZoomLevel((z) => Math.min(2.5, Math.max(0.7, z + delta)));
      }
    };

    activeWrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => activeWrapper.removeEventListener('wheel', handleWheel);
  }, [isViewerOpen, isFullScreen]);

  // Load PDF.js script dynamically
  const loadPdfJsScript = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js failed to initialize'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load PDF script'));
      document.body.appendChild(script);
    });
  };

  // Render high-res PDF pages into active target container
  const renderPdfPages = async () => {
    const activeContainer = isFullScreen ? fullscreenContainerRef.current : inlineContainerRef.current;
    if (!activeContainer) return;

    setIsLoadingPdf(true);
    setPdfError('');

    try {
      const pdfjs = await loadPdfJsScript();
      const loadingTask = pdfjs.getDocument(RESUME_PDF);
      const pdf = await loadingTask.promise;
      
      setPdfPagesCount(pdf.numPages);

      activeContainer.innerHTML = '';

      const baseRenderScale = 1.8;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: baseRenderScale });

        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'relative flex flex-col items-center mb-8 last:mb-0 shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-200 dark:border-white/10 w-full max-w-3xl';

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.className = 'w-full h-auto block';

        pageWrapper.appendChild(canvas);

        const badge = document.createElement('div');
        badge.className = 'absolute bottom-3 right-3 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg';
        badge.innerText = `Page ${i} of ${pdf.numPages}`;
        pageWrapper.appendChild(badge);

        activeContainer.appendChild(pageWrapper);

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
        }
      }
    } catch (err: any) {
      console.error('PDF Render error:', err);
      setPdfError(err?.message || 'Unable to render PDF preview');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  useEffect(() => {
    if (isFullScreen) {
      const timer = setTimeout(() => {
        renderPdfPages();
      }, 50);
      return () => clearTimeout(timer);
    } else if (isViewerOpen) {
      const timer = setTimeout(() => {
        renderPdfPages();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isViewerOpen, isFullScreen]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = RESUME_PDF;
    a.setAttribute('download', 'Sanket_Kedare_Full_Stack_Developer_Nextjs_Nodejs_Generative_AI_System_Design.pdf');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Share actual PDF file object + Position, Contact Info & Portfolio URL
  const handleShare = async () => {
    const websiteUrl = PersonalInfo.website || 'https://www.sanketkedare.com';
    
    // Clean structured message without raw PDF URL string
    const shareText = `${PersonalInfo.name} | ${PersonalInfo.role}\n\nContact Details:\n• Email: ${PersonalInfo.email}\n• Phone: +91 ${PersonalInfo.mobile}\n• Location: ${PersonalInfo.location}\n\nPortfolio: ${websiteUrl}`;

    try {
      // Fetch PDF file to share actual File object
      const res = await fetch(RESUME_PDF);
      const blob = await res.blob();
      const pdfFile = new File([blob], 'Sanket_Kedare_Resume.pdf', { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `${PersonalInfo.name} - Resume`,
          text: shareText,
          files: [pdfFile],
        });
        return;
      }
    } catch (e) {
      console.log('File share fallback:', e);
    }

    // Fallback to text share or clipboard copy if file share is not supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${PersonalInfo.name} - Resume & Contact Details`,
          text: shareText,
        });
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy resume share info:', err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Closed State: Simple View Resume Button */}
      {!isViewerOpen && (
        <div className="flex items-center justify-center pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsViewerOpen(true)}
            className="group relative flex items-center gap-3 px-8 md:px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-xs md:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer"
          >
            <FiEye size={20} className="group-hover:scale-110 transition-transform" />
            <span>View Resume (PDF)</span>
          </motion.button>
        </div>
      )}

      {/* Single Seamless Container View when Opened */}
      <AnimatePresence>
        {isViewerOpen && !isFullScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full flex flex-col gap-4 pt-4"
          >
            {/* Header Toolbar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <FiFileText size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                    Sanket Kedare Resume
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {pdfPagesCount > 0 ? `${pdfPagesCount} Pages • High Resolution Document` : 'Loading PDF...'}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    title="Zoom Out"
                  >
                    <FiZoomOut size={15} />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 px-2 min-w-[42px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.1))}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    title="Zoom In"
                  >
                    <FiZoomIn size={15} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1.0)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    title="Reset Zoom"
                  >
                    <FiRotateCcw size={13} />
                  </button>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullScreen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all border border-slate-200 dark:border-white/10"
                  title="Fullscreen Mode"
                >
                  <FiMaximize2 size={14} />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md"
                  title="Download PDF"
                >
                  <FiDownload size={14} />
                  <span>Download</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all border border-slate-200 dark:border-white/10"
                  title="Share Resume PDF"
                >
                  {copied ? <FiCheck size={14} className="text-emerald-500" /> : <FiShare2 size={14} />}
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all ml-1 border border-slate-200 dark:border-white/10"
                  title="Close Viewer"
                >
                  <FiX size={18} />
                </button>

              </div>
            </div>

            {/* Inline Scrollable Viewport */}
            <div 
              ref={inlineScrollWrapperRef}
              className="w-full h-[650px] md:h-[750px] overflow-auto py-6 px-2 flex justify-center custom-scrollbar"
            >
              {isLoadingPdf && (
                <div className="flex flex-col items-center justify-center py-24 text-cyan-500 gap-3">
                  <FiLoader size={36} className="animate-spin" />
                  <p className="text-xs font-bold tracking-widest uppercase">Rendering Document...</p>
                </div>
              )}

              {pdfError && (
                <div className="text-center py-20 text-red-500">
                  <p className="text-sm font-bold mb-2">Unable to render PDF preview</p>
                  <p className="text-xs opacity-80 mb-4">{pdfError}</p>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl"
                  >
                    Download PDF Directly
                  </button>
                </div>
              )}

              {/* Inline Canvas Container */}
              <div 
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="w-full max-w-3xl flex flex-col items-center"
              >
                <div ref={inlineContainerRef} className="w-full flex flex-col items-center" />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex flex-col p-4 md:p-6 overflow-hidden"
          >
            {/* Fullscreen Toolbar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <FiFileText size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm md:text-base font-bold text-white tracking-wide">
                    Sanket Kedare Resume
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Fullscreen Preview Mode
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-xl p-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    title="Zoom Out"
                  >
                    <FiZoomOut size={18} />
                  </button>
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 min-w-[50px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.1))}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    title="Zoom In"
                  >
                    <FiZoomIn size={18} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1.0)}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    title="Reset Zoom"
                  >
                    <FiRotateCcw size={16} />
                  </button>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  <FiDownload size={16} />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={closeFullScreen}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Exit Fullscreen & Return to Resume"
                >
                  <FiMinimize2 size={20} />
                </button>

                <button
                  onClick={closeFullScreen}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all ml-1"
                  title="Close Fullscreen"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Fullscreen Scrollable Viewport */}
            <div 
              ref={fullscreenScrollWrapperRef}
              className="flex-1 w-full max-w-7xl mx-auto overflow-auto p-4 md:p-8 flex justify-center custom-scrollbar mt-4"
            >
              {isLoadingPdf && (
                <div className="flex flex-col items-center justify-center py-24 text-cyan-400 gap-3">
                  <FiLoader size={36} className="animate-spin" />
                  <p className="text-xs font-bold tracking-widest uppercase">Rendering Document...</p>
                </div>
              )}

              {pdfError && (
                <div className="text-center py-20 text-red-400">
                  <p className="text-sm font-bold mb-2">Unable to render PDF preview</p>
                  <p className="text-xs opacity-80 mb-4">{pdfError}</p>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl"
                  >
                    Download PDF Directly
                  </button>
                </div>
              )}

              {/* Fullscreen Canvas Container */}
              <div 
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="w-full max-w-4xl flex flex-col items-center pt-2"
              >
                <div ref={fullscreenContainerRef} className="w-full flex flex-col items-center" />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
