'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiShare2, FiCheck, FiMail, FiLinkedin, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import PersonalInfo from '@/lib/personal-info';

export default function FooterShareSection() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFullInfo, setCopiedFullInfo] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPortfolioUrl(window.location.origin);
    }
  }, []);

  const urlToShare = PersonalInfo.website || 'https://www.sanketkedare.com';

  // Professional, executive share payload
  const fullInfoText = `${PersonalInfo.name} | ${PersonalInfo.role}\n\nWebsite: ${urlToShare}\nLinkedIn: ${PersonalInfo.linkedIn}\nGitHub: ${PersonalInfo.github}\nEmail: ${PersonalInfo.email}\nPhone: +91 ${PersonalInfo.mobile}`;

  // Copy Full Profile Details
  const handleCopyFullInfo = async () => {
    try {
      await navigator.clipboard.writeText(fullInfoText);
      setCopiedFullInfo(true);
      setTimeout(() => setCopiedFullInfo(false), 3000);
    } catch (err) {
      console.error('Failed to copy info:', err);
    }
  };

  // Platform Share Handlers
  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullInfoText)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlToShare)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullInfoText)}`, '_blank');
  };

  const shareSystemNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${PersonalInfo.name} - ${PersonalInfo.role}`,
          text: fullInfoText,
        });
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      shareWhatsApp();
    }
  };

  // Copy Portfolio Link Only
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${PersonalInfo.name} Portfolio`,
          text: `${PersonalInfo.name} | ${PersonalInfo.role}`,
          url: urlToShare,
        });
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${PersonalInfo.name} Portfolio: ${urlToShare}`)}`, '_blank');
    }
  };

  return (
    <div className="w-full my-12 pt-10 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* ============================================================== */}
      {/* Profile & Contact Card                                         */}
      {/* ============================================================== */}
      <div className="md:col-span-7 p-6 md:p-8 rounded-3xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-[9px] md:text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em]">
              Share Profile
            </span>
          </div>
          <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Share Profile Summary
          </h4>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 opacity-80">
            Share or copy Sanket&apos;s contact details, portfolio link, and professional profiles in a single message.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 pt-2">
          {/* Copy Contact Card */}
          <button
            onClick={handleCopyFullInfo}
            title="Copy Contact Card"
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition-all duration-300 shadow-md active:scale-95 col-span-2 sm:col-span-2"
          >
            {copiedFullInfo ? (
              <>
                <FiCheck size={16} className="text-emerald-400 dark:text-emerald-600" />
                <span className="text-emerald-400 dark:text-emerald-600 font-black">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy size={16} />
                <span>Copy Card</span>
              </>
            )}
          </button>

          {/* WhatsApp */}
          <button
            onClick={shareWhatsApp}
            title="Share via WhatsApp"
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all duration-300 shadow-md active:scale-95"
          >
            <FaWhatsapp size={16} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={shareLinkedIn}
            title="Share via LinkedIn"
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white font-bold text-xs transition-all duration-300 shadow-md active:scale-95"
          >
            <FiLinkedin size={16} />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={shareTwitter}
            title="Share via X (Twitter)"
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/20 text-white font-bold text-xs transition-all duration-300 shadow-md active:scale-95 border border-slate-700 dark:border-white/10"
          >
            <FaXTwitter size={15} />
            <span className="hidden sm:inline">X</span>
          </button>

          {/* System Share */}
          <button
            onClick={shareSystemNative}
            title="Share Options"
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all duration-300 shadow-md active:scale-95"
          >
            <FiShare2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>

        </div>
      </div>

      {/* ============================================================== */}
      {/* Portfolio URL Card                                             */}
      {/* ============================================================== */}
      <div className="md:col-span-5 p-6 md:p-8 rounded-3xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-[9px] md:text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em]">
              Direct Link
            </span>
          </div>
          <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Portfolio Website URL
          </h4>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 opacity-80">
            Copy or share the website link directly: <strong className="text-slate-800 dark:text-white font-mono">{urlToShare}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Copy URL Button */}
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
          >
            {copiedLink ? (
              <>
                <FiCheck size={16} className="text-emerald-300" />
                <span>URL Copied!</span>
              </>
            ) : (
              <>
                <FiCopy size={16} />
                <span>Copy URL</span>
              </>
            )}
          </button>

          {/* Share URL Button */}
          <button
            onClick={handleShareLink}
            className="py-3.5 px-4 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 font-black text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <FiShare2 size={16} />
            <span>Share Link</span>
          </button>
        </div>
      </div>

    </div>
  );
}
