'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiTrash2, FiCopy, FiCheck, FiActivity,
  FiZap, FiCpu, FiMessageSquare, FiUser, FiInfo,
  FiArrowRight, FiPlus, FiClock, FiSidebar, FiChevronRight,
  FiShield, FiDatabase, FiMail, FiFileText
} from 'react-icons/fi';
import AdminShell from '@/components/Admin/AdminShell';
import MarkdownRenderer from '@/components/Admin/MarkdownRenderer';
import { toast } from '@/lib/toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
  isLocal?: boolean;
}

interface ChatSessionItem {
  _id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
}

const QUICK_PROMPTS = [
  {
    icon: '📬',
    title: 'Unread Inquiries',
    prompt: 'How many messages do I have which are not yet read?',
    category: 'Local Query (0 Tokens)',
  },
  {
    icon: '📄',
    title: 'Active Resume Status',
    prompt: 'What is my active resume status and public link?',
    category: 'Local Query (0 Tokens)',
  },
  {
    icon: '🟢',
    title: 'Database Health',
    prompt: 'Check MongoDB database health, connection status, and ping latency.',
    category: 'Local Query (0 Tokens)',
  },
  {
    icon: '✉️',
    title: 'Draft Recruiter Reply',
    prompt: 'Help me draft a high-converting, professional reply to a recruiter reaching out for a Senior Full Stack Engineer role.',
    category: 'AI Copilot Reasoning',
  },
  {
    icon: '🚀',
    title: 'Resume Bullet Points',
    prompt: 'Generate 4 high-impact resume bullet points using the Google XYZ formula for my recent achievements in Next.js 16, React 19, and GenAI.',
    category: 'AI Copilot Reasoning',
  },
  {
    icon: '💼',
    title: 'Consulting Proposal',
    prompt: 'Draft an architectural consulting proposal outlining Next.js 16 App Router migration, WebSocket downsampling, and performance optimization.',
    category: 'AI Copilot Reasoning',
  },
];

export default function AdminChatPage() {
  const [sessions, setSessions]             = useState<ChatSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen]   = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text:
        "👋 **Welcome to your Executive Admin Copilot & Platform Intelligence Hub!**\n\n" +
        "I am connected directly to your MongoDB database, resume CDN, and portfolio microservices. All conversations are stored in MongoDB with multi-session memory.\n\n" +
        "### What would you like to do?\n" +
        "- 📬 **Check Live Telemetry (Zero Tokens)**: Ask *\"How many unread messages do I have?\"* or *\"Show active resume link\"*.\n" +
        "- ✉️ **Inquiry Reply Drafting**: Paste recruiter messages to generate tailored, persuasive replies.\n" +
        "- 🟢 **Database Health**: Ask *\"Check MongoDB database status and latency\"*.\n" +
        "- 🏗️ **System Architecture & Strategy**: Brainstorm scaling, WebSockets, or consulting proposals.\n\n" +
        "Select a quick prompt below or type your query!",
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'Local Platform & Copilot Cascade',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  // Load Sessions List on Mount
  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const res = await fetch('/api/admin/chat/sessions');
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
    } catch {
      console.warn('Failed to fetch chat sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Load Single Session Message History from MongoDB
  const loadSessionHistory = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/chat/sessions?id=${sessionId}`);
      const data = await res.json();

      if (data.success && data.session && Array.isArray(data.session.messages)) {
        if (data.session.messages.length === 0) {
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              text: 'Conversation initialized. Ready for your questions or drafting tasks!',
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              modelUsed: 'Local Platform Engine',
            },
          ]);
        } else {
          setMessages(data.session.messages);
        }
      } else {
        toast.error('Could not load session history.');
      }
    } catch {
      toast.error('Network error loading chat session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start a Brand New Chat Session
  const createNewSession = async () => {
    try {
      const res = await fetch('/api/admin/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      const data = await res.json();

      if (data.success && data.session) {
        setActiveSessionId(data.session._id);
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            text:
              "👋 **New Conversation Initialized!**\n\n" +
              "Ready to assist with live inbox queries, active resume statistics, database health telemetry, and architectural advice.",
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            modelUsed: 'Local Platform Engine',
          },
        ]);
        loadSessions();
        toast.success('Started new chat conversation.');
      }
    } catch {
      setActiveSessionId(null);
      setMessages([]);
    }
  };

  // Delete a Chat Session from MongoDB
  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    toast.confirmation({
      title: 'Delete Chat Session',
      message: 'Are you sure you want to permanently delete this chat session and its history from MongoDB?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/chat/sessions?id=${sessionId}`, { method: 'DELETE' });
          const data = await res.json();

          if (data.success) {
            setSessions((prev) => prev.filter((s) => s._id !== sessionId));
            if (activeSessionId === sessionId) {
              setActiveSessionId(null);
              setMessages([
                {
                  id: 'welcome',
                  role: 'assistant',
                  text: 'Chat history cleared. Select a conversation from the sidebar or type a new message to start!',
                  timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  modelUsed: 'Local Platform Engine',
                },
              ]);
            }
            toast.success('Chat session deleted.');
          } else {
            toast.error(data.error || 'Failed to delete chat.');
          }
        } catch {
          toast.error('Network error deleting session.');
        }
      },
    });
  };

  // Handle Send Message (routes through Local Engine & Gemini Cascade)
  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isSubmitting) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    // Update conversation state
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsSubmitting(true);

    try {
      // Build conversation history for context
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-10)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId: activeSessionId,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (data.success && data.text) {
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.model || (data.isLocal ? 'Local Platform Engine' : 'Gemini Flash (Admin Copilot)'),
          isLocal: data.isLocal,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.sessionId && activeSessionId !== data.sessionId) {
          setActiveSessionId(data.sessionId);
        }

        // Refresh sessions list in background to reflect new title/timestamp
        loadSessions();
      } else {
        toast.error(data.error || 'Failed to get response from Admin Copilot.');
      }
    } catch {
      toast.error('Network error communicating with Admin Copilot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearCurrentChat = () => {
    if (activeSessionId) {
      deleteSession(activeSessionId, { stopPropagation: () => {} } as any);
    } else {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: 'Conversation reset. Ready for your next query or task!',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Local Platform Engine',
        },
      ]);
      toast.success('Chat cleared.');
    }
  };

  return (
    <AdminShell>
      <div className="flex w-full h-full bg-[#0b0d14] overflow-hidden">
        {/* ── Collapsible History Sidebar ── */}
        <div
          className={`${
            isSidebarOpen ? 'w-64 sm:w-72 md:w-80' : 'w-0'
          } shrink-0 bg-[#0f121d] border-r border-white/[0.08] flex flex-col transition-all duration-300 overflow-hidden relative z-20`}
        >
          {/* Sidebar Top: New Chat Button */}
          <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-[#121522]">
            <button
              onClick={createNewSession}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
            >
              <FiPlus size={14} /> New Chat
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/[0.05]"
              title="Close history sidebar"
            >
              <FiSidebar size={14} />
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">
              Saved Sessions ({sessions.length})
            </p>

            {sessionsLoading ? (
              <div className="flex items-center justify-center p-6 text-slate-400">
                <FiActivity size={16} className="animate-spin mr-2 text-indigo-400" />
                <span className="text-xs">Loading sessions...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <FiClock size={20} className="mx-auto mb-2 text-slate-400 opacity-60" />
                No saved chats yet.
              </div>
            ) : (
              sessions.map((sess) => {
                const isSelected = activeSessionId === sess._id;

                return (
                  <div
                    key={sess._id}
                    onClick={() => loadSessionHistory(sess._id)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm'
                        : 'bg-[#141724]/60 hover:bg-[#1a1e30] text-slate-300 hover:text-white border border-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-semibold truncate text-white">{sess.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                        {sess.lastMessage || `${sess.messageCount} messages`}
                      </p>
                    </div>

                    <button
                      onClick={(e) => deleteSession(sess._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-all cursor-pointer"
                      title="Delete chat session"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Main Chat Canvas Area ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b0d14] relative">
          {/* ── Top Header Toolbar ── */}
          <div className="px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-[#0f121d]/95 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs transition-colors cursor-pointer border border-indigo-500/20"
                  title="Open chat history sidebar"
                >
                  <FiSidebar size={14} />
                </button>
              )}
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <FiZap size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white tracking-tight truncate">
                    Executive Copilot &amp; Intelligence
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[10px] font-mono font-bold text-indigo-300">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Platform Telemetry (0 Tokens) + Gemini Model Cascade
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={createNewSession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-white/[0.08]"
                title="Start a new chat thread"
              >
                <FiPlus size={13} className="text-indigo-400" />
                <span className="hidden sm:inline">New Thread</span>
              </button>
              <button
                onClick={clearCurrentChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer border border-rose-500/20"
                title="Delete current conversation"
              >
                <FiTrash2 size={13} />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            </div>
          </div>

          {/* ── Messages Thread Area ── */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 w-full">
            <div className="w-full space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} w-full`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                        <FiCpu size={15} />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl transition-all relative group ${
                        isUser
                          ? 'max-w-[90%] sm:max-w-3xl bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/15 p-4 sm:p-5'
                          : 'w-full bg-[#121520] border border-white/[0.08] text-slate-100 rounded-tl-sm shadow-lg p-5 sm:p-6'
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm font-medium text-white">
                          {msg.text}
                        </div>
                      ) : (
                        <MarkdownRenderer content={msg.text} className="text-slate-100" />
                      )}

                      {/* Metadata & Actions Bar */}
                      <div
                        className={`mt-3.5 pt-2.5 border-t flex items-center justify-between text-[11px] font-mono ${
                          isUser
                            ? 'border-white/20 text-indigo-100'
                            : 'border-white/[0.06] text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-300">{msg.modelUsed ? msg.modelUsed : isUser ? 'You' : 'Admin Copilot'}</span>
                          {msg.isLocal && (
                            <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 font-bold rounded-md border border-emerald-500/30">
                              ⚡ 0 Tokens
                            </span>
                          )}
                          <span>· {msg.timestamp}</span>
                        </div>

                        {!isUser && (
                          <button
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer border border-white/[0.04]"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-200 shrink-0 mt-1">
                        <FiUser size={15} />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Assistant Loading Indicator */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3.5 justify-start w-full"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                    <FiCpu size={15} />
                  </div>
                  <div className="w-full bg-[#121520] border border-indigo-500/30 rounded-2xl rounded-tl-sm p-4 text-xs text-indigo-200 flex items-center gap-3 shadow-lg shadow-indigo-500/5">
                    <FiActivity size={15} className="animate-spin text-indigo-400" />
                    <span className="font-mono">Evaluating platform telemetry &amp; drafting response...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Quick Prompt Suggestions Grid (Shown only on fresh welcome screen) ── */}
          {messages.length === 1 && messages[0]?.id === 'welcome' && !isSubmitting && (
            <div className="px-3 sm:px-5 md:px-6 pb-3 shrink-0 w-full">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.prompt)}
                    className="flex flex-col justify-between p-3 rounded-xl bg-[#121520] hover:bg-[#181c2b] border border-white/[0.08] hover:border-indigo-500/40 text-left transition-all cursor-pointer group shadow-sm min-h-[90px]"
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{qp.icon}</span>
                        <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {qp.title}
                        </p>
                      </div>
                      <FiArrowRight size={13} className="text-slate-500 group-hover:text-indigo-300 shrink-0 mt-0.5" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-2">{qp.prompt}</p>
                    <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 font-semibold mt-2 w-fit">
                      {qp.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom Interactive Input Bar ── */}
          <div className="p-3 sm:p-4 md:px-6 border-t border-white/[0.08] bg-[#0f121d]/95 backdrop-blur-xl shrink-0 w-full">
            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative bg-[#121520] border border-white/[0.12] focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl p-3 transition-all shadow-xl"
              >
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about unread emails, active resume, database health, or draft an executive reply... (Enter to send)"
                  className="w-full bg-transparent px-3 py-1 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-400 resize-none font-sans leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1.5 px-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="hidden sm:inline">Shift + Enter for new line</span>
                    <span className="text-indigo-300 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                      Local queries answered with 0 tokens
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !inputPrompt.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FiActivity size={13} className="animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <>
                        <FiSend size={13} />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
