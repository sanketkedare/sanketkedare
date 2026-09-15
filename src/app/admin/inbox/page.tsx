'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiInbox, FiRefreshCw, FiTrash2, FiCopy, FiSend,
  FiChevronDown, FiChevronUp, FiCheck, FiX, FiActivity,
  FiSearch, FiFilter, FiCheckCircle, FiClock, FiMail, FiZap,
  FiEye, FiEyeOff, FiRotateCcw, FiAlertCircle
} from 'react-icons/fi';
import AdminShell from '@/components/Admin/AdminShell';
import { toast } from '@/lib/toast';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
  readAt?: string;
  replied?: boolean;
  repliedAt?: string;
  replyText?: string;
  deleted?: boolean;
  deletedAt?: string;
}

type StatusFilter = 'all' | 'unread' | 'pending' | 'replied' | 'recycle_bin';
type SortOrder = 'newest' | 'oldest';

function fmtDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminInboxPage() {
  const [inquiries, setInquiries]           = useState<Inquiry[]>([]);
  const [inboxLoading, setInboxLoading]     = useState(true);
  const [expandedId, setExpandedId]         = useState<string | null>(null);
  const [processingId, setProcessingId]     = useState<string | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [sortOrder, setSortOrder]           = useState<SortOrder>('newest');

  // Counts State
  const [counts, setCounts] = useState({
    active: 0,
    unread: 0,
    pending: 0,
    recycle: 0,
  });

  // In-Portal Reply State
  const [replyingInqId, setReplyingInqId]   = useState<string | null>(null);
  const [replySubject, setReplySubject]     = useState('');
  const [replyMessage, setReplyMessage]     = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // AI Copilot Draft State
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState(false);
  const [draftingInqId, setDraftingInqId]             = useState<string | null>(null);

  /* ── Load Inquiries from API ─────────────────────────────────────── */
  const loadInquiries = async () => {
    setInboxLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries?view=all');
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch {
      toast.error('Failed to load inquiries.');
    } finally {
      setInboxLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    // Poll every 15 seconds for incoming contact submissions
    const interval = setInterval(loadInquiries, 15000);
    return () => clearInterval(interval);
  }, []);

  /* ── Filter & Sort Logic ─────────────────────────────────────────── */
  const filteredInquiries = useMemo(() => {
    let list = [...inquiries];

    // Status filter
    if (statusFilter === 'recycle_bin') {
      list = list.filter(i => i.deleted === true);
    } else {
      // Hide deleted inquiries from normal inbox views
      list = list.filter(i => !i.deleted);

      if (statusFilter === 'unread') {
        list = list.filter(i => !i.read);
      } else if (statusFilter === 'pending') {
        list = list.filter(i => !i.replied);
      } else if (statusFilter === 'replied') {
        list = list.filter(i => i.replied);
      }
    }

    // Search keyword filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q) ||
        (i.replyText && i.replyText.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortOrder === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [inquiries, statusFilter, searchQuery, sortOrder]);

  const hasActiveFilters = (statusFilter !== 'all' && statusFilter !== 'recycle_bin') || searchQuery.trim() !== '';

  const resetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  /* ── Read / Unread Status Handlers ───────────────────────────────── */
  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setInquiries(prev =>
      prev.map(i => (i._id === id ? { ...i, read: true, readAt: new Date().toISOString() } : i))
    );
    setCounts(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));

    try {
      await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'mark_read' }),
      });
    } catch {
      // Silent catch for background read sync
    }
  };

  const toggleReadStatus = async (inq: Inquiry) => {
    const action = inq.read ? 'mark_unread' : 'mark_read';
    const newRead = !inq.read;

    // Optimistic UI update
    setInquiries(prev =>
      prev.map(i => (i._id === inq._id ? { ...i, read: newRead, readAt: newRead ? new Date().toISOString() : undefined } : i))
    );
    setCounts(prev => ({
      ...prev,
      unread: newRead ? Math.max(0, prev.unread - 1) : prev.unread + 1,
    }));

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inq._id, action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(newRead ? 'Marked as read' : 'Marked as unread');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCardExpand = (inq: Inquiry) => {
    if (expandedId === inq._id) {
      setExpandedId(null);
    } else {
      setExpandedId(inq._id);
      // Auto-mark as read when opened in active view
      if (!inq.read && !inq.deleted) {
        markAsRead(inq._id);
      }
    }
  };

  /* ── Soft Delete (Move to Recycle Bin) & Restore Handlers ───────── */
  const softDeleteInquiry = async (inq: Inquiry) => {
    setProcessingId(inq._id);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inq._id, action: 'soft_delete' }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev =>
          prev.map(i => (i._id === inq._id ? { ...i, deleted: true, deletedAt: new Date().toISOString() } : i))
        );
        setCounts(prev => ({
          ...prev,
          active: Math.max(0, prev.active - 1),
          recycle: prev.recycle + 1,
          unread: !inq.read ? Math.max(0, prev.unread - 1) : prev.unread,
        }));
        if (expandedId === inq._id) setExpandedId(null);
        if (replyingInqId === inq._id) closeReplyComposer();
        toast.success(`Moved "${inq.name}"'s message to Recycle Bin.`);
      } else {
        toast.error(data.error || 'Failed to move to Recycle Bin.');
      }
    } catch {
      toast.error('Network error moving message.');
    } finally {
      setProcessingId(null);
    }
  };

  const restoreInquiry = async (inq: Inquiry) => {
    setProcessingId(inq._id);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inq._id, action: 'restore' }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev =>
          prev.map(i => (i._id === inq._id ? { ...i, deleted: false, deletedAt: undefined } : i))
        );
        setCounts(prev => ({
          ...prev,
          active: prev.active + 1,
          recycle: Math.max(0, prev.recycle - 1),
          unread: !inq.read ? prev.unread + 1 : prev.unread,
        }));
        toast.success(`Restored "${inq.name}"'s message back to Inbox.`);
      } else {
        toast.error(data.error || 'Failed to restore message.');
      }
    } catch {
      toast.error('Network error restoring message.');
    } finally {
      setProcessingId(null);
    }
  };

  const confirmMoveAllToRecycleBin = () => {
    const activeList = inquiries.filter(i => !i.deleted);
    if (activeList.length === 0) return;

    toast.confirmation({
      title: 'Move All to Recycle Bin',
      message: `Move all ${activeList.length} active messages to the Recycle Bin? (You can restore them anytime).`,
      confirmText: 'Move to Recycle Bin',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setInboxLoading(true);
        try {
          const res = await fetch('/api/admin/inquiries', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'soft_delete_all' }),
          });
          const d = await res.json();
          if (d.success) {
            setInquiries(prev => prev.map(i => ({ ...i, deleted: true, deletedAt: new Date().toISOString() })));
            setExpandedId(null);
            closeReplyComposer();
            toast.success('All messages moved to Recycle Bin.');
            loadInquiries();
          } else {
            toast.error(d.error || 'Failed to move inquiries.');
          }
        } catch {
          toast.error('Network error while moving inquiries.');
        } finally {
          setInboxLoading(false);
        }
      },
    });
  };

  const restoreAllFromRecycleBin = async () => {
    setInboxLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore_all' }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success('All messages restored to Inbox!');
        loadInquiries();
      } else {
        toast.error(d.error || 'Failed to restore all messages.');
      }
    } catch {
      toast.error('Network error while restoring inquiries.');
    } finally {
      setInboxLoading(false);
    }
  };

  /* ── In-Portal Reply Handlers ────────────────────────────────────── */
  const openReplyComposer = (inq: Inquiry) => {
    setReplyingInqId(inq._id);
    setReplySubject(`Re: Portfolio Inquiry from ${inq.name}`);
    setReplyMessage('');
    if (expandedId !== inq._id) {
      setExpandedId(inq._id);
    }
    if (!inq.read) {
      markAsRead(inq._id);
    }
  };

  const closeReplyComposer = () => {
    setReplyingInqId(null);
    setReplySubject('');
    setReplyMessage('');
  };

  const handleSendReply = async (inq: Inquiry) => {
    if (!replyMessage.trim()) {
      toast.warning('Please enter a reply message.');
      return;
    }

    setIsSendingReply(true);
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: inq._id,
          toEmail: inq.email,
          toName: inq.name,
          subject: replySubject,
          replyMessage: replyMessage,
          originalMessage: inq.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Reply sent successfully to ${inq.email}!`);
        // Update local inquiry to reflect replied status
        setInquiries(prev =>
          prev.map(i =>
            i._id === inq._id
              ? {
                  ...i,
                  replied: true,
                  repliedAt: new Date().toISOString(),
                  replyText: replyMessage.trim(),
                  read: true,
                }
              : i
          )
        );
        closeReplyComposer();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sk-inquiry-updated'));
        }
      } else {
        toast.error(data.error || 'Failed to send reply email.');
      }
    } catch {
      toast.error('Network error while sending reply.');
    } finally {
      setIsSendingReply(false);
    }
  };

  /* ── AI Copilot Auto-Draft Handler ───────────────────────────────── */
  const generateAiDraft = async (inq: Inquiry) => {
    setIsGeneratingAiDraft(true);
    setDraftingInqId(inq._id);
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Draft an executive, high-converting, and warm email response from Sanket Kedare to this contact inquiry:
Sender Name: ${inq.name}
Sender Email: ${inq.email}
Message: "${inq.message}"

Tone & Format Guidelines:
- Start with "Hi ${inq.name},"
- Warmly thank them for reaching out through the portfolio
- If technical or project-related, highlight Sanket's Full Stack / Software Architecture background
- Propose a 15-minute introductory call or next step
- Sign off with:
Best regards,
Sanket Kedare
Senior Full Stack Developer & Software Architect
sanketkedare200@gmail.com | +91 8624851910
Only output the email body, no metadata or commentary.`,
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setReplyMessage(data.text);
        if (!replySubject || replySubject.trim() === '') {
          setReplySubject(`Re: Inquiry from ${inq.name} — Sanket Kedare`);
        }
        toast.success('AI draft generated! Review and edit before sending.');
      } else {
        toast.error(data.error || 'Failed to generate AI draft.');
      }
    } catch {
      toast.error('Network error generating AI draft.');
    } finally {
      setIsGeneratingAiDraft(false);
      setDraftingInqId(null);
    }
  };

  const openComposerWithAiDraft = async (inq: Inquiry) => {
    openReplyComposer(inq);
    await generateAiDraft(inq);
  };

  return (
    <AdminShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* ── Top Header Bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white tracking-tight">Inbox</h2>
              {counts.active > 0 && (
                <span className="px-3 py-1 bg-white/[0.06] border border-white/[0.1] rounded-xl text-xs font-mono font-medium text-slate-200">
                  {counts.active} {counts.active === 1 ? 'Active Message' : 'Active Messages'}
                </span>
              )}
              {counts.unread > 0 && (
                <span className="px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-xl text-xs font-mono font-semibold text-indigo-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  {counts.unread} Unread
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Contact form submissions stored in MongoDB with soft-delete Recycle Bin and zero context loss
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {statusFilter === 'recycle_bin' ? (
              counts.recycle > 0 && (
                <button
                  onClick={restoreAllFromRecycleBin}
                  className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm font-semibold"
                  title="Restore all deleted messages back to Inbox"
                >
                  <FiRotateCcw size={13} /> Restore All to Inbox
                </button>
              )
            ) : (
              counts.active > 0 && (
                <button
                  onClick={confirmMoveAllToRecycleBin}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer font-medium"
                  title="Move all active messages to Recycle Bin"
                >
                  <FiTrash2 size={13} /> Move All to Recycle Bin
                </button>
              )
            )}
            <button
              onClick={loadInquiries}
              className="flex items-center gap-2 text-xs text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-white/[0.08] font-medium"
            >
              <FiRefreshCw size={13} className={inboxLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Filter & Search Toolbar ── */}
        <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-4 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1.5">
                <FiFilter size={12} /> View:
              </span>

              {/* All Active */}
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/[0.06]'
                }`}
              >
                All Active ({counts.active})
              </button>

              {/* Unread */}
              <button
                onClick={() => setStatusFilter('unread')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                  statusFilter === 'unread'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/[0.06]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Unread ({counts.unread})</span>
              </button>

              {/* Pending Replies */}
              <button
                onClick={() => setStatusFilter('pending')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/[0.06]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Pending Reply ({counts.pending})</span>
              </button>

              {/* Replied */}
              <button
                onClick={() => setStatusFilter('replied')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                  statusFilter === 'replied'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/[0.06]'
                }`}
              >
                <FiCheck size={11} className="text-emerald-400" strokeWidth={3} />
                <span>Replied</span>
              </button>

              {/* Recycle Bin (Trash) */}
              <button
                onClick={() => setStatusFilter('recycle_bin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                  statusFilter === 'recycle_bin'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border-white/[0.06]'
                }`}
                title="View soft-deleted messages"
              >
                <FiTrash2 size={12} className={statusFilter === 'recycle_bin' ? 'text-rose-300' : 'text-slate-400'} />
                <span>Recycle Bin ({counts.recycle})</span>
              </button>
            </div>

            {/* Sort order toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <FiClock size={12} /> Sort:
              </span>
              <button
                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inquiries by sender name, email address, or message content..."
              className="w-full bg-black/30 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 pl-10 pr-9 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/[0.06]">
              <span>
                Showing {filteredInquiries.length} of {statusFilter === 'recycle_bin' ? counts.recycle : counts.active} messages
              </span>
              <button onClick={resetFilters} className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* ── Recycle Bin Banner Notice ── */}
        {statusFilter === 'recycle_bin' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FiAlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>
                <strong>Recycle Bin</strong>: Soft-deleted messages are safely stored here. No messages are permanently deleted. You can restore any message back to your Inbox.
              </span>
            </div>
            {counts.recycle > 0 && (
              <button
                onClick={restoreAllFromRecycleBin}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl font-bold transition-all cursor-pointer border border-emerald-500/40 text-xs flex items-center gap-1"
              >
                <FiRotateCcw size={12} /> Restore All
              </button>
            )}
          </div>
        )}

        {/* ── Inquiry Cards List ── */}
        {inboxLoading && inquiries.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <FiActivity size={22} className="animate-spin mr-3 text-indigo-400" />
            <span className="text-sm">Loading inquiries...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-center bg-[#0f1422] border border-white/[0.06] rounded-3xl">
            {statusFilter === 'recycle_bin' ? (
              <>
                <FiTrash2 size={40} className="text-slate-500 mb-4 opacity-60" />
                <p className="text-slate-200 text-sm font-semibold">Recycle Bin is Empty</p>
                <p className="text-slate-400 text-xs mt-1">No soft-deleted messages found.</p>
              </>
            ) : hasActiveFilters ? (
              <>
                <FiSearch size={40} className="text-slate-500 mb-4 opacity-60" />
                <p className="text-slate-200 text-sm font-semibold">No messages match your filters</p>
                <button onClick={resetFilters} className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer font-medium">
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <FiInbox size={40} className="text-slate-500 mb-4 opacity-60" />
                <p className="text-slate-200 text-sm font-semibold">Inbox is Empty</p>
                <p className="text-slate-400 text-xs mt-1">New contact submissions will appear here live.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map((inq, i) => {
              const isOpen = expandedId === inq._id;
              const isReplying = replyingInqId === inq._id;
              const isUnread = !inq.read && !inq.deleted;
              const isDeleted = inq.deleted;

              return (
                <motion.div
                  key={inq._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`bg-[#0f1422] border rounded-2xl overflow-hidden transition-all shadow-md ${
                    isUnread
                      ? 'border-l-4 border-l-indigo-500 border-indigo-500/30 bg-[#131929]'
                      : isDeleted
                      ? 'border-rose-500/20 bg-rose-950/5 opacity-85'
                      : inq.replied
                      ? 'border-white/[0.06]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  {/* Card Header Row */}
                  <div
                    onClick={() => handleCardExpand(inq)}
                    className="flex items-center gap-3.5 p-4 sm:p-5 cursor-pointer select-none transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Avatar Icon */}
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm ${
                        isUnread
                          ? 'bg-indigo-600/25 border-indigo-500/40 text-indigo-300 shadow-sm'
                          : isDeleted
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : inq.replied
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-white/[0.05] border-white/[0.08] text-slate-300'
                      }`}>
                        {inq.name[0]?.toUpperCase() || 'U'}
                      </div>
                      {isUnread && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full ring-2 ring-[#0f1422] animate-pulse" />
                      )}
                    </div>

                    {/* Sender Info & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'font-semibold text-slate-200'}`}>
                          {inq.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono shrink-0">
                          {fmtDate(inq.createdAt)}
                        </span>

                        {/* Status Badges */}
                        {isDeleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                            <FiTrash2 size={10} /> Deleted
                          </span>
                        ) : isUnread ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Unread
                          </span>
                        ) : inq.replied ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            <FiCheck size={10} strokeWidth={3} /> Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                            Read
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 font-mono font-medium mt-0.5 truncate">
                        {inq.email}
                      </p>

                      {!isOpen && (
                        <p className={`text-xs truncate mt-1 ${isUnread ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>
                          {inq.message}
                        </p>
                      )}
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {isDeleted ? (
                        /* Restore Button in Recycle Bin */
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreInquiry(inq);
                          }}
                          disabled={processingId === inq._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          title="Restore message to Inbox"
                        >
                          {processingId === inq._id ? <FiActivity size={12} className="animate-spin" /> : <FiRotateCcw size={12} />}
                          <span>Restore</span>
                        </button>
                      ) : (
                        <>
                          {/* AI Draft Quick Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openComposerWithAiDraft(inq);
                            }}
                            disabled={isGeneratingAiDraft && draftingInqId === inq._id}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                            title="Generate AI response draft"
                          >
                            {isGeneratingAiDraft && draftingInqId === inq._id ? (
                              <>
                                <FiActivity size={12} className="animate-spin text-indigo-400" />
                                <span>Drafting...</span>
                              </>
                            ) : (
                              <>
                                <FiZap size={12} className="text-indigo-400" />
                                <span>AI Draft</span>
                              </>
                            )}
                          </button>

                          {/* Toggle Read / Unread */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReadStatus(inq);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                            title={inq.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            {inq.read ? <FiEyeOff size={14} /> : <FiEye size={14} className="text-indigo-400" />}
                          </button>

                          {/* Copy email */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(inq.email);
                              toast.success(`Copied ${inq.email}`);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                            title="Copy email address"
                          >
                            <FiCopy size={14} />
                          </button>

                          {/* In-Portal Reply Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isReplying) {
                                closeReplyComposer();
                              } else {
                                openReplyComposer(inq);
                              }
                            }}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              isReplying
                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                            }`}
                            title="Reply directly in portal"
                          >
                            <FiSend size={14} />
                          </button>

                          {/* Soft Delete (Move to Recycle Bin) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              softDeleteInquiry(inq);
                            }}
                            disabled={processingId === inq._id}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer"
                            title="Move to Recycle Bin"
                          >
                            {processingId === inq._id ? <FiActivity size={14} className="animate-spin" /> : <FiTrash2 size={14} />}
                          </button>
                        </>
                      )}

                      {/* Expand / Collapse Chevron */}
                      <div className="text-slate-400 ml-1">
                        {isOpen ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-white/[0.06] bg-black/25 space-y-4">
                          {/* Received Message */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                                Received Message:
                              </p>
                              {inq.readAt && (
                                <span className="text-[10px] font-mono text-slate-500">
                                  Read on {fmtDate(inq.readAt)}
                                </span>
                              )}
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                              {inq.message}
                            </div>
                          </div>

                          {/* Sent Reply Box if already replied */}
                          {inq.replied && inq.replyText && (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                              <div className="flex items-center justify-between gap-2 text-emerald-400 font-bold mb-2">
                                <span className="flex items-center gap-1.5">
                                  <FiCheck size={13} strokeWidth={3} /> Your Sent Reply:
                                </span>
                                {inq.repliedAt && (
                                  <span className="text-[11px] text-emerald-300/80 font-mono font-normal">
                                    {fmtDate(inq.repliedAt)}
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-200 whitespace-pre-wrap font-sans leading-relaxed text-xs pl-2 border-l-2 border-emerald-500/30">
                                {inq.replyText}
                              </div>
                            </div>
                          )}

                          {/* Actions Bar (when not in Recycle Bin) */}
                          {!isDeleted && (
                            <div className="flex items-center gap-2 sm:gap-3 pt-1 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isReplying) {
                                    closeReplyComposer();
                                  } else {
                                    openReplyComposer(inq);
                                  }
                                }}
                                className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                              >
                                <FiSend size={13} />
                                <span>
                                  {isReplying
                                    ? 'Close Reply Form'
                                    : inq.replied
                                    ? 'Send Another Reply'
                                    : `Reply to ${inq.name}`}
                                </span>
                              </button>

                              {/* AI Copilot Draft Button */}
                              <button
                                type="button"
                                onClick={() => openComposerWithAiDraft(inq)}
                                disabled={isGeneratingAiDraft && draftingInqId === inq._id}
                                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                              >
                                {isGeneratingAiDraft && draftingInqId === inq._id ? (
                                  <>
                                    <FiActivity size={13} className="animate-spin text-indigo-400" />
                                    <span>Drafting with AI...</span>
                                  </>
                                ) : (
                                  <>
                                    <FiZap size={13} className="text-indigo-400" />
                                    <span>AI Draft Reply</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleReadStatus(inq)}
                                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-3 py-2 rounded-xl transition-all cursor-pointer border border-white/[0.08]"
                              >
                                {inq.read ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                                <span>{inq.read ? 'Mark as Unread' : 'Mark as Read'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(inq.message);
                                  toast.success('Message copied to clipboard');
                                }}
                                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-3 py-2 rounded-xl transition-all cursor-pointer border border-white/[0.08]"
                              >
                                <FiCopy size={13} /> Copy Message
                              </button>

                              <button
                                type="button"
                                onClick={() => softDeleteInquiry(inq)}
                                disabled={processingId === inq._id}
                                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 px-3 py-2 rounded-xl transition-all cursor-pointer ml-auto"
                              >
                                <FiTrash2 size={13} /> Move to Recycle Bin
                              </button>
                            </div>
                          )}

                          {/* In-Portal Reply Composer */}
                          <AnimatePresence>
                            {isReplying && !isDeleted && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 sm:p-5 rounded-2xl bg-[#131929] border border-indigo-500/30 space-y-3.5 shadow-2xl"
                              >
                                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 flex-wrap gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                                      <FiSend size={12} />
                                    </div>
                                    <span className="text-xs font-bold text-white">In-Portal Reply</span>
                                    <span className="text-xs text-slate-400">to</span>
                                    <span className="text-xs font-bold text-white truncate max-w-[120px]">{inq.name}</span>
                                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 truncate max-w-[180px]">
                                      {inq.email}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => generateAiDraft(inq)}
                                      disabled={isGeneratingAiDraft && draftingInqId === inq._id}
                                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                      title="Re-generate draft using AI"
                                    >
                                      {isGeneratingAiDraft && draftingInqId === inq._id ? (
                                        <FiActivity size={12} className="animate-spin" />
                                      ) : (
                                        <FiZap size={12} className="text-indigo-400" />
                                      )}
                                      <span>AI Re-Draft</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={closeReplyComposer}
                                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
                                      title="Close composer"
                                    >
                                      <FiX size={15} />
                                    </button>
                                  </div>
                                </div>

                                {/* Subject */}
                                <div>
                                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-medium">Subject</label>
                                  <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    placeholder="Email Subject"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-xs sm:text-sm focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                                  />
                                </div>

                                {/* Message */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="block text-[11px] font-mono text-slate-400 font-medium">Your Message</label>
                                    <span className="text-[10px] font-mono text-indigo-300">AI Assisted Composer</span>
                                  </div>
                                  <textarea
                                    rows={6}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={`Hi ${inq.name},\n\nThank you for reaching out...`}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-xs sm:text-sm focus:outline-none transition-all placeholder:text-slate-500 leading-relaxed resize-none font-sans"
                                  />
                                </div>

                                {/* Composer Footer */}
                                <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={closeReplyComposer}
                                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => generateAiDraft(inq)}
                                      disabled={isGeneratingAiDraft && draftingInqId === inq._id}
                                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      {isGeneratingAiDraft && draftingInqId === inq._id ? (
                                        <>
                                          <FiActivity size={12} className="animate-spin" /> Drafting...
                                        </>
                                      ) : (
                                        <>
                                          <FiZap size={12} className="text-indigo-400" /> AI Draft
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={isSendingReply || !replyMessage.trim()}
                                    onClick={() => handleSendReply(inq)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    {isSendingReply ? (
                                      <>
                                        <FiActivity size={13} className="animate-spin" /> Sending...
                                      </>
                                    ) : (
                                      <>
                                        <FiSend size={13} /> Send Email Reply
                                      </>
                                    )}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AdminShell>
  );
}
