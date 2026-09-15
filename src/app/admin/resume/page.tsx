'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText, FiUploadCloud, FiExternalLink, FiCheck, FiRefreshCw,
  FiTrash2, FiChevronDown, FiChevronUp, FiZap, FiEdit2, FiX, FiActivity
} from 'react-icons/fi';
import AdminShell from '@/components/Admin/AdminShell';
import { toast } from '@/lib/toast';

interface ResumeRecord {
  _id: string;
  url: string;
  filename: string;
  isActive: boolean;
  uploadedAt: string;
  publicId?: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminResumePage() {
  const [resumes, setResumes]               = useState<ResumeRecord[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [isUploading, setIsUploading]       = useState(false);
  const [activatingId, setActivatingId]     = useState<string | null>(null);
  const [deletingId, setDeletingId]         = useState<string | null>(null);
  const [previewUrl, setPreviewUrl]         = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rename state
  const [renamingId, setRenamingId]   = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isRenaming, setIsRenaming]   = useState(false);

  /* ── Load Resumes ────────────────────────────────────────────────── */
  const loadResumes = async () => {
    setResumesLoading(true);
    try {
      const res = await fetch('/api/admin/resumes');
      const data = await res.json();
      if (data.success && Array.isArray(data.resumes)) {
        setResumes(data.resumes);
      }
    } catch {
      toast.error('Failed to load resumes.');
    } finally {
      setResumesLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  /* ── Upload Handler ──────────────────────────────────────────────── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('PDF must be under 10MB.');
      return;
    }

    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('filename', file.name);

    try {
      const res  = await fetch('/api/admin/resume', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success && data.resume) {
        setResumes(prev => [
          data.resume,
          ...prev.map(r => ({ ...r, isActive: false })),
        ]);
        toast.success(`"${data.resume.filename}" uploaded and set as active!`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sk-resume-updated', {
              detail: { url: data.resume.url },
            })
          );
        }
      } else {
        toast.error(data.error || 'Upload failed.');
      }
    } catch {
      toast.error('Network error during upload.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* ── Set Active Resume ───────────────────────────────────────────── */
  const handleSetActive = async (id: string) => {
    setActivatingId(id);
    try {
      const res  = await fetch(`/api/admin/resumes/${id}`, { method: 'PATCH' });
      const data = await res.json();

      if (data.success && data.resume) {
        setResumes(prev =>
          prev.map(r => ({ ...r, isActive: r._id === id }))
        );
        toast.success(`"${data.resume.filename}" is now the active resume!`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sk-resume-updated', {
              detail: { url: data.resume.url },
            })
          );
        }
      } else {
        toast.error(data.error || 'Failed to activate resume.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setActivatingId(null);
    }
  };

  /* ── Rename Resume ───────────────────────────────────────────────── */
  const startRename = (resume: ResumeRecord) => {
    setRenamingId(resume._id);
    setRenameValue(resume.filename.replace(/\.pdf$/i, ''));
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const saveRename = async (id: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      toast.error('Filename cannot be empty.');
      return;
    }

    const cleanFilename = trimmed.replace(/\.pdf$/i, '') + '.pdf';
    setIsRenaming(true);

    try {
      const res = await fetch(`/api/admin/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: cleanFilename }),
      });
      const data = await res.json();

      if (data.success && data.resume) {
        setResumes(prev =>
          prev.map(r => (r._id === id ? { ...r, filename: data.resume.filename } : r))
        );
        toast.success('Resume renamed successfully!');
        cancelRename();
      } else {
        toast.error(data.error || 'Failed to rename resume.');
      }
    } catch {
      toast.error('Network error while renaming.');
    } finally {
      setIsRenaming(false);
    }
  };

  /* ── Delete Handler ──────────────────────────────────────────────── */
  const confirmDeleteResume = (resume: ResumeRecord) => {
    toast.confirmation({
      title: 'Delete Resume Version',
      message: `Are you sure you want to permanently delete "${resume.filename}"? This action cannot be undone.`,
      confirmText: 'Delete Permanently',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setDeletingId(resume._id);
        try {
          const res  = await fetch(`/api/admin/resumes/${resume._id}`, { method: 'DELETE' });
          const data = await res.json();

          if (data.success) {
            setResumes(prev => {
              const updated = prev.filter(r => r._id !== resume._id);
              if (data.newActiveResumeId) {
                return updated.map(r => ({
                  ...r,
                  isActive: r._id === data.newActiveResumeId,
                }));
              }
              return updated;
            });

            if (previewUrl === resume.url) setPreviewUrl(null);
            toast.success(data.message || `Deleted "${resume.filename}".`);

            if (data.newActiveResumeUrl && typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('sk-resume-updated', {
                  detail: { url: data.newActiveResumeUrl },
                })
              );
            }
          } else {
            toast.error(data.error || 'Delete failed.');
          }
        } catch {
          toast.error('Network error during deletion.');
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  return (
    <AdminShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">Resume Collection</h2>
              {resumes.length > 0 && (
                <span className="px-3 py-1 bg-white/[0.06] border border-white/[0.1] rounded-xl text-xs font-mono font-medium text-slate-200">
                  {resumes.length} {resumes.length === 1 ? 'Version' : 'Versions'}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Every upload is stored in MongoDB. Only the active version is served publicly on your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/chat"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title="Ask Admin Copilot to review resume keywords and bullets"
            >
              <FiZap size={13} className="text-indigo-400" />
              <span>AI Resume Review</span>
            </Link>
            <button
              onClick={loadResumes}
              className="flex items-center gap-2 text-xs text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-white/[0.08] font-medium"
            >
              <FiRefreshCw size={13} className={resumesLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-[#0f1422] border border-dashed border-white/[0.15] hover:border-indigo-500/40 rounded-3xl p-5 sm:p-6 transition-colors shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <FiUploadCloud className="text-indigo-400" size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white">Upload New Resume PDF</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploads to Cloudinary → stored in MongoDB → set as active automatically
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <label
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer w-full sm:w-auto shadow-sm ${
                  isUploading
                    ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isUploading ? (
                  <>
                    <FiRefreshCw size={14} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <FiUploadCloud size={14} /> Choose PDF
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Resume List */}
        {resumesLoading && resumes.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <FiActivity size={22} className="animate-spin mr-3 text-indigo-400" />
            <span className="text-sm">Loading resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-center bg-[#0f1422] border border-white/[0.06] rounded-3xl">
            <FiFileText size={40} className="text-slate-500 mb-4 opacity-60" />
            <p className="text-slate-200 text-sm font-semibold">No resumes yet</p>
            <p className="text-slate-400 text-xs mt-1">Upload a PDF above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-[#0f1422] border rounded-2xl overflow-hidden transition-all shadow-md ${
                  resume.isActive ? 'border-indigo-500/50 shadow-indigo-500/5 ring-1 ring-indigo-500/20 bg-[#131929]' : 'border-white/[0.08]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* File icon + Active indicator */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          resume.isActive ? 'bg-indigo-500/20 border border-indigo-500/40' : 'bg-white/[0.05] border border-white/[0.08]'
                        }`}
                      >
                        <FiFileText size={18} className={resume.isActive ? 'text-indigo-400' : 'text-slate-400'} />
                      </div>
                      {resume.isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-[#0f1422]">
                          <FiCheck size={9} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Info & Rename */}
                    <div className="flex-1 min-w-0">
                      {renamingId === resume._id ? (
                        <div className="flex items-center gap-2 py-0.5 flex-wrap sm:flex-nowrap">
                          <div className="relative flex-1 min-w-[160px] max-w-sm">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveRename(resume._id);
                                if (e.key === 'Escape') cancelRename();
                              }}
                              autoFocus
                              placeholder="Enter filename"
                              className="w-full px-3 py-1.5 pr-12 rounded-xl bg-black/40 border border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-xs font-semibold focus:outline-none"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 select-none">
                              .pdf
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => saveRename(resume._id)}
                              disabled={isRenaming}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
                              title="Save filename"
                            >
                              {isRenaming ? <FiActivity size={12} className="animate-spin" /> : <FiCheck size={12} />}
                              <span>Save</span>
                            </button>

                            <button
                              onClick={cancelRename}
                              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
                              title="Cancel rename"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => setPreviewUrl(previewUrl === resume.url ? null : resume.url)}
                          className="cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white truncate max-w-xs hover:text-indigo-300 transition-colors">
                              {resume.filename}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startRename(resume);
                              }}
                              className="p-1 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all cursor-pointer"
                              title="Rename PDF"
                            >
                              <FiEdit2 size={12} />
                            </button>
                            {resume.isActive && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{fmtDate(resume.uploadedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-start sm:justify-end pt-2 sm:pt-0 border-t border-white/[0.06] sm:border-0 shrink-0">
                    {/* Rename Action Button */}
                    {renamingId !== resume._id && (
                      <button
                        onClick={() => startRename(resume)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                        title="Rename PDF"
                      >
                        <FiEdit2 size={12} />
                        <span className="hidden sm:inline">Rename</span>
                      </button>
                    )}

                    {/* Collapse / Uncollapse Toggle */}
                    <button
                      onClick={() => setPreviewUrl(previewUrl === resume.url ? null : resume.url)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        previewUrl === resume.url
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                          : 'bg-white/[0.06] text-slate-200 hover:text-white hover:bg-white/[0.12] border-white/[0.08]'
                      }`}
                      title={previewUrl === resume.url ? 'Collapse preview' : 'Uncollapse / Expand preview'}
                    >
                      {previewUrl === resume.url ? (
                        <>
                          <FiChevronUp size={14} />
                          <span>Collapse</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown size={14} />
                          <span>Preview</span>
                        </>
                      )}
                    </button>

                    {/* Open in new tab */}
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                      title="Open PDF in new tab"
                    >
                      <FiExternalLink size={14} />
                    </a>

                    {/* Set Active */}
                    {!resume.isActive && (
                      <button
                        onClick={() => handleSetActive(resume._id)}
                        disabled={activatingId === resume._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-indigo-600/20 text-slate-200 hover:text-indigo-300 border border-white/[0.08] hover:border-indigo-500/30 transition-all cursor-pointer"
                        title="Set as active"
                      >
                        {activatingId === resume._id ? (
                          <FiActivity size={12} className="animate-spin" />
                        ) : (
                          <FiZap size={12} />
                        )}
                        Set Active
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => confirmDeleteResume(resume)}
                      disabled={deletingId === resume._id}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer"
                      title="Delete"
                    >
                      {deletingId === resume._id ? (
                        <FiActivity size={14} className="animate-spin" />
                      ) : (
                        <FiTrash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline PDF preview */}
                <AnimatePresence>
                  {previewUrl === resume.url && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-white/[0.08] bg-black/40"
                    >
                      <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
                        <span className="font-mono text-xs text-slate-300 font-semibold">Inline Document Preview</span>
                        <div className="flex items-center gap-3">
                          <a
                            href={resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
                          >
                            <FiExternalLink size={12} /> Open Full PDF
                          </a>
                          <button
                            onClick={() => setPreviewUrl(null)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            <FiChevronUp size={13} /> Collapse Preview
                          </button>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col items-center justify-center">
                        <img
                          src={resume.url.replace(/\.pdf$/i, '.jpg')}
                          alt="Resume Preview"
                          className="max-h-[550px] w-auto object-contain rounded-xl shadow-2xl border border-white/[0.08]"
                        />
                        <button
                          onClick={() => setPreviewUrl(null)}
                          className="mt-4 flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-colors border border-white/[0.08]"
                        >
                          <FiChevronUp size={14} /> Collapse Preview
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminShell>
  );
}
