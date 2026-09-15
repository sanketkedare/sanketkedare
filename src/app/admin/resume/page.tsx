'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      toast.warning('Filename cannot be empty.');
      return;
    }
    setIsRenaming(true);
    try {
      const res = await fetch(`/api/admin/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: trimmed }),
      });
      const data = await res.json();
      if (data.success && data.resume) {
        setResumes(prev => prev.map(r => r._id === id ? { ...r, filename: data.resume.filename } : r));
        toast.success(`Renamed to "${data.resume.filename}"`);
        setRenamingId(null);
        setRenameValue('');
      } else {
        toast.error(data.error || 'Failed to rename resume.');
      }
    } catch {
      toast.error('Network error while renaming.');
    } finally {
      setIsRenaming(false);
    }
  };

  /* ── Delete Resume ───────────────────────────────────────────────── */
  const handleDeleteResume = async (id: string) => {
    setDeletingId(id);
    try {
      const res  = await fetch(`/api/admin/resumes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (data.newActiveResume) {
          setResumes(prev =>
            prev
              .filter(r => r._id !== id)
              .map(r => ({
                ...r,
                isActive: r._id === data.newActiveResume._id,
              }))
          );
          toast.success(
            `Resume deleted. "${data.newActiveResume.filename}" is now active.`,
            'Active Resume Updated'
          );
        } else {
          setResumes(prev => prev.filter(r => r._id !== id));
          toast.success('Resume deleted successfully.');
        }

        if (previewUrl && resumes.find(r => r._id === id)?.url === previewUrl) {
          setPreviewUrl(null);
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sk-resume-updated', {
              detail: { url: data.newActiveResume?.url || '' },
            })
          );
        }
      } else {
        toast.error(data.error || 'Failed to delete resume.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteResume = (resume: ResumeRecord) => {
    toast.confirmation({
      title: 'Delete Resume',
      message: `Are you sure you want to delete "${resume.filename}"? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => handleDeleteResume(resume._id),
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
              <h2 className="text-2xl font-black text-white tracking-tight">Resume Collection</h2>
              {resumes.length > 0 && (
                <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold text-cyan-300">
                  {resumes.length} {resumes.length === 1 ? 'Version' : 'Versions'}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200 mt-1">
              Every upload is stored in MongoDB. Only the active one is served publicly.
            </p>
          </div>
          <button
            onClick={loadResumes}
            className="flex items-center gap-2 text-xs text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-white/10"
          >
            <FiRefreshCw size={13} className={resumesLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Upload Card */}
        <div className="bg-[#0a0a1e]/80 border border-dashed border-cyan-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <FiUploadCloud className="text-cyan-400" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">Upload New Resume PDF</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Uploads to Cloudinary → stored in MongoDB → set as active automatically
              </p>
            </div>
            <div className="shrink-0">
              <label
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isUploading
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
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
          <div className="flex items-center justify-center h-48 text-slate-300">
            <FiActivity size={22} className="animate-spin mr-3" />
            <span className="text-sm">Loading resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-center bg-[#0a0a1e]/50 border border-white/6 rounded-3xl">
            <FiFileText size={40} className="text-slate-400 mb-4" />
            <p className="text-slate-200 text-sm font-semibold">No resumes yet</p>
            <p className="text-slate-300 text-xs mt-1">Upload a PDF above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-[#0a0a1e]/80 border rounded-2xl overflow-hidden transition-all ${
                  resume.isActive ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5' : 'border-white/8'
                }`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* File icon + Active indicator */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        resume.isActive ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-white/5 border border-white/8'
                      }`}
                    >
                      <FiFileText size={18} className={resume.isActive ? 'text-cyan-400' : 'text-slate-300'} />
                    </div>
                    {resume.isActive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-[#0a0a1e]">
                        <FiCheck size={9} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Info & Rename */}
                  <div className="flex-1 min-w-0">
                    {renamingId === resume._id ? (
                      <div className="flex items-center gap-2 py-0.5 flex-wrap sm:flex-nowrap">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
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
                            className="w-full px-3 py-1.5 pr-12 rounded-xl bg-white/10 border border-cyan-500/50 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-300 select-none">
                            .pdf
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => saveRename(resume._id)}
                            disabled={isRenaming}
                            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
                            title="Save filename"
                          >
                            {isRenaming ? <FiActivity size={12} className="animate-spin" /> : <FiCheck size={12} />}
                            <span>Save</span>
                          </button>

                          <button
                            onClick={cancelRename}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
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
                          <span className="text-sm font-semibold text-white truncate max-w-xs hover:text-cyan-300 transition-colors">
                            {resume.filename}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(resume);
                            }}
                            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-all cursor-pointer"
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
                        <p className="text-xs text-slate-300 mt-0.5 font-mono">{fmtDate(resume.uploadedAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Rename Action Button */}
                    {renamingId !== resume._id && (
                      <button
                        onClick={() => startRename(resume)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/15 border border-white/10 transition-all cursor-pointer"
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
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-white/10 text-slate-200 hover:text-white hover:bg-white/15 border-white/10'
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
                      className="p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 transition-all cursor-pointer"
                      title="Open PDF in new tab"
                    >
                      <FiExternalLink size={14} />
                    </a>

                    {/* Set Active */}
                    {!resume.isActive && (
                      <button
                        onClick={() => handleSetActive(resume._id)}
                        disabled={activatingId === resume._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
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
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
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
                      className="overflow-hidden border-t border-white/8 bg-black/50"
                    >
                      <div className="px-5 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-mono text-xs text-slate-200 font-semibold">Inline Document Preview</span>
                        <div className="flex items-center gap-3">
                          <a
                            href={resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-cyan-300 hover:text-white text-xs font-semibold"
                          >
                            <FiExternalLink size={12} /> Open Full PDF
                          </a>
                          <button
                            onClick={() => setPreviewUrl(null)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            <FiChevronUp size={13} /> Collapse Preview
                          </button>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col items-center justify-center">
                        <img
                          src={resume.url.replace(/\.pdf$/i, '.jpg')}
                          alt="Resume Preview"
                          className="max-h-[550px] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                        <button
                          onClick={() => setPreviewUrl(null)}
                          className="mt-4 flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-medium cursor-pointer transition-colors border border-white/10"
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
