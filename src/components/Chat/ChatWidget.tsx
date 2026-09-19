'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiX, 
  FiSend, 
  FiTrash2, 
  FiCpu, 
  FiExternalLink,
  FiCornerDownRight
} from 'react-icons/fi';
import { BsStars, BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import JDMatcherModal from '@/components/Resume/JDMatcherModal';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  model?: string;
  isPredefined?: boolean;
  suggestions?: string[];
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'model',
  text: 
    "Hello! 👋 I'm **Sanket's Portfolio AI Assistant**.\n\n" +
    "I'm trained on Sanket's engineering architecture, production systems, and case studies. Feel free to ask about his core stack, enterprise deliverables, or hiring availability!",
  isPredefined: true,
  suggestions: [
    "🚀 Core Tech Stack",
    "🛠️ Engineering Judgment",
    "📁 Architecture Case Studies",
    "💼 Work Experience",
    "⚡ Match Job Description (JD)",
    "📄 View Resume",
    "✉️ Contact Sanket"
  ],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInResumeSection, setIsInResumeSection] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect when user is viewing the #resume section area
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const resumeEl = document.getElementById('resume');
      if (!resumeEl) return false;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setIsInResumeSection(entry.isIntersecting);
          }
        },
        {
          threshold: 0.08,
          rootMargin: '0px',
        }
      );

      observer.observe(resumeEl);
      return true;
    };

    if (!setupObserver()) {
      const retryTimer = setTimeout(setupObserver, 250);
      return () => {
        clearTimeout(retryTimer);
        observer?.disconnect();
      };
    }

    return () => observer?.disconnect();
  }, []);

  const handleOpenResumeFromFloating = () => {
    if (typeof window !== 'undefined') {
      if (typeof (window as any).__SK_OPEN_RESUME__ === 'function') {
        (window as any).__SK_OPEN_RESUME__();
      }
      const triggerBtn = document.getElementById('sk-view-resume-trigger');
      if (triggerBtn) {
        triggerBtn.click();
      }
      window.dispatchEvent(new CustomEvent('sk-open-resume'));
      try {
        window.history.replaceState(null, '', '#resume');
      } catch (_) {}
      const resumeEl = document.getElementById('resume');
      if (resumeEl) {
        resumeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build brief conversational history for the API
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to receive AI response.');
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.text,
        isPredefined: data.isPredefined,
        suggestions: data.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Connection Error**: ${err?.message || 'Unable to connect to assistant.'}\n\nPlease verify network connection or try one of the quick options below.`,
        suggestions: ["🚀 Core Tech Stack", "📁 Architecture Case Studies", "✉️ Contact Sanket"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Helper function to render simple markdown formatting (links, bold, bullet points)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Check for bullet list item
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const cleanLine = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line;

      // Parse bold & markdown links: [text](url)
      const parts = cleanLine.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);

      const parsedContent = parts.map((part, partIdx) => {
        // Markdown Link
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, linkText, url] = linkMatch;
          const isInternalAnchor = url.startsWith('#');
          return (
            <a
              key={partIdx}
              href={url}
              target={isInternalAnchor ? undefined : '_blank'}
              rel={isInternalAnchor ? undefined : 'noreferrer'}
              onClick={isInternalAnchor ? () => setIsOpen(false) : undefined}
              className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-bold underline underline-offset-2 decoration-cyan-500/50 hover:decoration-cyan-400 transition-colors"
            >
              <span>{linkText}</span>
              {!isInternalAnchor && <FiExternalLink size={11} className="inline shrink-0" />}
            </a>
          );
        }

        // Bold Text
        const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
        if (boldMatch) {
          return (
            <strong key={partIdx} className="font-black text-slate-900 dark:text-white">
              {boldMatch[1]}
            </strong>
          );
        }

        return <span key={partIdx}>{part}</span>;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 mb-1 leading-relaxed">
            {parsedContent}
          </li>
        );
      }

      if (line.trim().startsWith('### ')) {
        return (
          <h4 key={lineIdx} className="text-sm font-black text-cyan-600 dark:text-cyan-300 uppercase tracking-wider mt-3 mb-1">
            {line.replace(/^###\s+/, '')}
          </h4>
        );
      }

      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="mb-1 leading-relaxed">
          {parsedContent}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating PDF Quick Access Button (Placed directly above 'Match JD' button) */}
      <motion.button
        type="button"
        onClick={handleOpenResumeFromFloating}
        disabled={isOpen || isInResumeSection}
        title="View and Open Sanket's Resume (PDF)"
        aria-label="Open Resume Document"
        animate={
          isOpen || isInResumeSection
            ? { opacity: 0, y: 16, scale: 0.88, pointerEvents: 'none' }
            : { opacity: 1, scale: 1, y: 0 }
        }
        whileHover={isOpen || isInResumeSection ? {} : { scale: 1.08 }}
        whileTap={isOpen || isInResumeSection ? {} : { scale: 0.94 }}
        className="fixed bottom-[6.25rem] right-3.5 sm:bottom-[8.5rem] sm:right-6 z-40 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-white/95 dark:bg-[#0c0d24]/95 text-slate-900 dark:text-white border-2 border-rose-500/50 dark:border-rose-400/60 hover:border-rose-600 dark:hover:border-rose-400 shadow-[0_8px_20px_-4px_rgba(244,63,94,0.3)] sm:shadow-[0_10px_28px_-5px_rgba(244,63,94,0.35)] backdrop-blur-xl group transition-all duration-300 select-none cursor-pointer"
      >
        <BsFileEarmarkPdfFill className="text-rose-600 dark:text-rose-400 text-xs sm:text-[15px] group-hover:scale-110 transition-transform shrink-0" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          <span className="sm:hidden">PDF</span>
          <span className="hidden sm:inline">Resume</span>
        </span>
      </motion.button>

      {/* Floating JD Review Button (Placed directly above 'Ask Sanket\'s AI' launcher with attention-grabbing bounce) */}
      <JDMatcherModal
        customTrigger={(openModal) => (
          <motion.button
            type="button"
            onClick={openModal}
            disabled={isOpen}
            title="Match your Job Description with AI against Sanket's profile"
            aria-label="Match Job Description with AI"
            animate={
              isOpen
                ? { opacity: 0, y: 16, scale: 0.88, pointerEvents: 'none' }
                : {
                    opacity: 1,
                    scale: 1,
                    y: [0, -9, 0, -4, 0],
                    transition: {
                      y: {
                        repeat: Infinity,
                        repeatDelay: 2.2,
                        duration: 1.1,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.25 },
                      scale: { duration: 0.25 },
                    },
                  }
            }
            whileHover={isOpen ? {} : { scale: 1.08 }}
            whileTap={isOpen ? {} : { scale: 0.94 }}
            className={`fixed bottom-[3.75rem] right-3.5 sm:bottom-[5.25rem] sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-white/95 dark:bg-[#0c0d24]/95 text-slate-900 dark:text-white border-2 border-purple-500/50 dark:border-purple-400/60 hover:border-purple-600 dark:hover:border-cyan-400 shadow-[0_8px_22px_-4px_rgba(147,51,234,0.25)] sm:shadow-[0_12px_32px_-5px_rgba(147,51,234,0.3)] dark:shadow-[0_12px_35px_-5px_rgba(168,85,247,0.5)] backdrop-blur-xl group transition-colors duration-300 select-none cursor-pointer`}
          >
            {/* Pulsing attention gold radar dot */}
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-amber-500" />
            </span>

            <FaWandMagicSparkles className="text-amber-500 dark:text-amber-300 text-xs sm:text-[14px] group-hover:rotate-12 transition-transform shrink-0" />
            
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              <span className="sm:hidden">JD Match</span>
              <span className="hidden sm:inline">JD Review</span>
            </span>

            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full uppercase tracking-widest shadow-xs">
              AI
            </span>
          </motion.button>
        )}
      />

      {/* Floating Trigger Launcher Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Portfolio Chat"
        className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-xl sm:shadow-2xl shadow-cyan-500/30 border border-cyan-400/40 backdrop-blur-xl group transition-all duration-300 hover:shadow-cyan-500/50"
      >
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-400" />
        </span>
        <BsStars className="text-cyan-200 text-xs sm:text-[16px] group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Assistant</span>
        <span className="sm:hidden">AI Chat</span>
      </motion.button>

      {/* Main Glassmorphic Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[430px] h-[560px] max-h-[82vh] rounded-3xl bg-white/95 dark:bg-[#090a18]/95 border border-slate-200 dark:border-white/15 backdrop-blur-2xl shadow-2xl shadow-slate-900/15 dark:shadow-black/80 flex flex-col overflow-hidden"
          >
            {/* Window Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/30">
                  <FiCpu size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                    <span>Sanket&apos;s AI Assistant</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>

                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400/90 font-medium tracking-wide">
                    Online • Portfolio Architecture
                  </p>
                </div>
              </div>

              {/* Action Buttons: Match JD, Clear & Close */}
              <div className="flex items-center gap-1.5">
                <JDMatcherModal
                  customTrigger={(openModal) => (
                    <button
                      type="button"
                      onClick={openModal}
                      title="Match your Job Description with AI against Sanket's profile"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:to-indigo-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-[10px] font-black transition-all shadow-xs cursor-pointer"
                    >
                      <FaWandMagicSparkles size={11} className="text-amber-500 shrink-0" />
                      <span>Match JD</span>
                    </button>
                  )}
                />
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <FiTrash2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Message Stream Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Meta info badge for AI */}
                    {msg.role === 'model' && (
                      <div className="mt-2.5 pt-1.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400/80">
                          <BsStars size={10} />
                          <span>Portfolio Intelligence</span>
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSendMessage(suggestion)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white transition-all shadow-xs group"
                        >
                          <FiCornerDownRight size={9} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing / Processing Shimmer */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-fit text-slate-600 dark:text-slate-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-300 ml-1">Analyzing portfolio architecture...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input & Footer Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/95 dark:bg-slate-950/70 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Sanket's stack, case studies..."
                  disabled={isLoading}
                  maxLength={1500}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-white/10 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-md shadow-cyan-500/20"
                >
                  <FiSend size={14} />
                </button>
              </form>
              <div className="text-[8.5px] text-center text-slate-500 dark:text-slate-400 mt-2 font-medium">
                🔒 Protected by topic guardrails • Answers restricted to Sanket&apos;s portfolio.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
