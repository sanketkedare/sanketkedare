'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiInbox, FiRefreshCw, FiTrash2, FiCopy, FiSend,
  FiChevronDown, FiChevronUp, FiCheck, FiX, FiActivity,
  FiSearch, FiFilter, FiCheckCircle, FiClock, FiMail
} from 'react-icons/fi';
import AdminShell from '@/components/Admin/AdminShell';
import { toast } from '@/lib/toast';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  replied?: boolean;
  repliedAt?: string;
  replyText?: string;
}

type StatusFilter = 'all' | 'unreplied' | 'replied';
type SortOrder = 'newest' | 'oldest';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminInboxPage() {
  const [inquiries, setInquiries]           = useState<Inquiry[]>([]);
  const [inboxLoading, setInboxLoading]     = useState(true);
  const [expandedId, setExpandedId]         = useState<string | null>(null);
  const [deletingInqId, setDeletingInqId]   = useState<string | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [sortOrder, setSortOrder]           = useState<SortOrder>('newest');

  // In-Portal Reply State
  const [replyingInqId, setReplyingInqId]   = useState<string | null>(null);
  const [replySubject, setReplySubject]     = useState('');
  const [replyMessage, setReplyMessage]     = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  /* ── Load Inquiries ──────────────────────────────────────────────── */
  const loadInquiries = async () => {
    setInboxLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
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
  const totalCount = inquiries.length;
  const unrepliedCount = inquiries.filter(i => !i.replied).length;
  const repliedCount = inquiries.filter(i => i.replied).length;

  const filteredInquiries = useMemo(() => {
    let list = [...inquiries];

    // Status filter
    if (statusFilter === 'unreplied') {
      list = list.filter(i => !i.replied);
    } else if (statusFilter === 'replied') {
      list = list.filter(i => i.replied);
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

  const hasActiveFilters = statusFilter !== 'all' || searchQuery.trim() !== '';

  const resetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  /* ── Delete Handlers ─────────────────────────────────────────────── */
  const deleteInquiry = async (id: string) => {
    setDeletingInqId(id);
    try {
      await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
      setInquiries(prev => prev.filter(i => i._id !== id));
      if (expandedId === id) setExpandedId(null);
      if (replyingInqId === id) closeReplyComposer();
      toast.success('Message deleted.');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sk-inquiry-updated'));
      }
    } catch {
      toast.error('Failed to delete message.');
    } finally {
      setDeletingInqId(null);
    }
  };

  const confirmDeleteInquiry = (inquiry: Inquiry) => {
    toast.confirmation({
      title: 'Delete Message',
      message: `Delete message from "${inquiry.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => deleteInquiry(inquiry._id),
    });
  };

  const confirmClearAllInquiries = () => {
    if (inquiries.length === 0) return;
    toast.confirmation({
      title: 'Clear All Inquiries',
      message: `Are you sure you want to permanently delete all ${inquiries.length} inquiries?`,
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setInboxLoading(true);
        try {
          const res = await fetch('/api/admin/inquiries?all=true', { method: 'DELETE' });
          const d = await res.json();
          if (d.success) {
            setInquiries([]);
            setExpandedId(null);
            closeReplyComposer();
            toast.success('All inquiries have been cleared.');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('sk-inquiry-updated'));
            }
          } else {
            toast.error(d.error || 'Failed to clear inquiries.');
          }
        } catch {
          toast.error('Network error while clearing inquiries.');
        } finally {
          setInboxLoading(false);
        }
      },
    });
  };

  /* ── In-Portal Reply Handlers ────────────────────────────────────── */
  const openReplyComposer = (inq: Inquiry) => {
    setReplyingInqId(inq._id);
    setReplySubject(`Re: Portfolio Inquiry from ${inq.name}`);
    setReplyMessage('');
    if (expandedId !== inq._id) {
      setExpandedId(inq._id);
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight">Inbox</h2>
              {totalCount > 0 && (
                <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold text-cyan-300">
                  {totalCount} {totalCount === 1 ? 'Message' : 'Messages'}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200 mt-1">
              Contact form submissions stored in MongoDB with direct email replying
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {inquiries.length > 0 && (
              <button
                onClick={confirmClearAllInquiries}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                title="Delete all messages"
              >
                <FiTrash2 size={13} /> Clear All
              </button>
            )}
            <button
              onClick={loadInquiries}
              className="flex items-center gap-2 text-xs text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-white/10"
            >
              <FiRefreshCw size={13} className={inboxLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Filter & Search Toolbar ── */}
        <div className="bg-[#0a0a1e]/80 border border-white/10 rounded-2xl p-4 space-y-3.5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1.5">
                <FiFilter size={12} /> Filter:
              </span>

              {/* All */}
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  statusFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/8'
                }`}
              >
                All ({totalCount})
              </button>

              {/* Unreplied */}
              <button
                onClick={() => setStatusFilter('unreplied')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  statusFilter === 'unreplied'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/8'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Pending ({unrepliedCount})</span>
              </button>

              {/* Replied */}
              <button
                onClick={() => setStatusFilter('replied')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  statusFilter === 'replied'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/8'
                }`}
              >
                <FiCheck size={11} className="text-emerald-400" strokeWidth={3} />
                <span>Replied ({repliedCount})</span>
              </button>
            </div>

            {/* Sort order toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <FiClock size={12} /> Sort:
              </span>
              <button
                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer"
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
              className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 pl-10 pr-9 text-xs text-white placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Active Filter Summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-slate-300">
                Showing <strong className="text-white">{filteredInquiries.length}</strong> of{' '}
                <strong className="text-white">{totalCount}</strong> messages
                {statusFilter !== 'all' && (
                  <> with status <span className="text-cyan-300 uppercase font-mono">{statusFilter}</span></>
                )}
                {searchQuery.trim() && (
                  <> matching &ldquo;<span className="text-cyan-300">{searchQuery}</span>&rdquo;</>
                )}
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-cyan-300 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FiX size={12} /> Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* ── Inbox Items ── */}
        {inboxLoading && inquiries.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-300">
            <FiActivity size={24} className="animate-spin mr-3" />
            <span className="text-sm">Loading messages...</span>
          </div>
        ) : inquiries.length === 0 ? (
          /* Empty Database */
          <div className="flex flex-col items-center justify-center h-64 text-center bg-[#0a0a1e]/50 border border-white/6 rounded-3xl">
            <FiInbox size={40} className="text-slate-400 mb-4" />
            <p className="text-slate-200 text-sm font-semibold">No inquiries yet</p>
            <p className="text-slate-300 text-xs mt-1">Messages from your contact form appear here automatically</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          /* Empty Filtered Result */
          <div className="flex flex-col items-center justify-center h-56 text-center bg-[#0a0a1e]/50 border border-white/6 rounded-3xl p-6">
            <FiFilter size={36} className="text-slate-400 mb-3" />
            <p className="text-slate-200 text-sm font-semibold">No matching inquiries</p>
            <p className="text-slate-300 text-xs mt-1 max-w-sm">
              No inquiries matched your current filter criteria.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map((inq, i) => {
              const isOpen = expandedId === inq._id;
              const isReplying = replyingInqId === inq._id;

              return (
                <motion.div
                  key={inq._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`bg-[#0a0a1e]/80 border rounded-2xl overflow-hidden transition-all ${
                    isReplying
                      ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'border-white/8 hover:border-white/15'
                  }`}
                >
                  {/* Inquiry Row */}
                  <div
                    onClick={() => setExpandedId(isOpen ? null : inq._id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-all cursor-pointer text-left"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                      {inq.name[0]?.toUpperCase() || 'U'}
                    </div>

                    {/* Sender Info & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white truncate">{inq.name}</span>
                        <span className="text-xs text-slate-300 font-mono shrink-0">{fmtDate(inq.createdAt)}</span>
                        {inq.replied ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            <FiCheck size={10} strokeWidth={3} /> Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-cyan-300 font-mono font-medium mt-0.5">{inq.email}</p>
                      {!isOpen && <p className="text-xs text-slate-200 truncate mt-1 max-w-xl">{inq.message}</p>}
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Copy email */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(inq.email);
                          toast.success(`Copied ${inq.email}`);
                        }}
                        className="p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 transition-all cursor-pointer"
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
                            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                            : 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15'
                        }`}
                        title="Reply directly in portal"
                      >
                        <FiSend size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); confirmDeleteInquiry(inq); }}
                        disabled={deletingInqId === inq._id}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                        title="Delete message"
                      >
                        {deletingInqId === inq._id ? <FiActivity size={14} className="animate-spin" /> : <FiTrash2 size={14} />}
                      </button>

                      {/* Expand / Collapse Chevron */}
                      <div className="text-slate-300 ml-1">
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
                        <div className="px-6 pb-6 pt-2 border-t border-white/6 bg-black/30 space-y-4">
                          {/* Received Message */}
                          <div>
                            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                              Received Message:
                            </p>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-slate-100 leading-relaxed whitespace-pre-wrap font-sans">
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
                              <div className="text-slate-100 whitespace-pre-wrap font-sans leading-relaxed text-xs pl-2 border-l-2 border-emerald-500/30">
                                {inq.replyText}
                              </div>
                            </div>
                          )}

                          {/* Actions Bar */}
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (isReplying) {
                                  closeReplyComposer();
                                } else {
                                  openReplyComposer(inq);
                                }
                              }}
                              className="flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                              <FiSend size={13} />
                              <span>
                                {isReplying
                                  ? 'Close Reply Form'
                                  : inq.replied
                                  ? 'Send Another Reply'
                                  : `Reply to ${inq.email}`}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(inq.message);
                                toast.success('Message copied to clipboard');
                              }}
                              className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-white/10"
                            >
                              <FiCopy size={13} /> Copy Message
                            </button>
                          </div>

                          {/* In-Portal Reply Composer */}
                          <AnimatePresence>
                            {isReplying && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-5 rounded-2xl bg-[#07071a] border border-cyan-500/35 space-y-3.5 shadow-2xl"
                              >
                                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                      <FiSend size={12} />
                                    </div>
                                    <span className="text-xs font-bold text-white">In-Portal Reply</span>
                                    <span className="text-xs text-slate-300">to</span>
                                    <span className="text-xs font-bold text-white">{inq.name}</span>
                                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                                      {inq.email}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={closeReplyComposer}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Close composer"
                                  >
                                    <FiX size={15} />
                                  </button>
                                </div>

                                {/* Subject */}
                                <div>
                                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">Subject</label>
                                  <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    placeholder="Email Subject"
                                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-500/60 text-white text-xs focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                                  />
                                </div>

                                {/* Message */}
                                <div>
                                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">Your Message</label>
                                  <textarea
                                    rows={5}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={`Hi ${inq.name},\n\nThank you for reaching out...`}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-500/60 text-white text-xs focus:outline-none transition-all placeholder:text-slate-500 leading-relaxed resize-none font-sans"
                                  />
                                </div>

                                {/* Composer Footer */}
                                <div className="flex items-center justify-between pt-1">
                                  <button
                                    type="button"
                                    onClick={closeReplyComposer}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isSendingReply || !replyMessage.trim()}
                                    onClick={() => handleSendReply(inq)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isSendingReply ? (
                                      <>
                                        <FiActivity size={13} className="animate-spin" />
                                        <span>Sending Email...</span>
                                      </>
                                    ) : (
                                      <>
                                        <FiSend size={13} />
                                        <span>Send Email Reply</span>
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
