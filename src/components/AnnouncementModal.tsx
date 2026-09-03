import React from 'react';
import { motion } from 'motion/react';
import { Bell, X, ExternalLink, Sparkles } from 'lucide-react';
import { AnnouncementConfig, TabType } from '../types';

interface AnnouncementModalProps {
  announcement: AnnouncementConfig;
  onClose: () => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  announcement,
  onClose,
  onNavigateTab,
}) => {
  const handleActionClick = () => {
    if (!announcement.button_url) return;

    const url = announcement.button_url.trim();

    // Check if button_url targets an internal tab (e.g. 'tab:books_practice' or 'tab:ankitprep' or 'tab:pareeksha')
    if (url.startsWith('tab:')) {
      const targetTab = url.replace('tab:', '') as TabType;
      if (['ankitprep', 'pareeksha', 'books_practice'].includes(targetTab)) {
        onNavigateTab?.(targetTab);
        onClose();
        return;
      }
    }

    // Open external URL cleanly
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = url;
    }

    onClose();
  };

  return (
    <div
      id="sph-announcement-overlay"
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md select-none overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
      }}
      onClick={(e) => {
        // Dismiss if user taps outside the modal card
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background ambient glowing auras */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-80 h-80 rounded-full bg-emerald-500/15 blur-[90px] animate-pulse" />
        <div className="absolute w-72 h-72 rounded-full bg-amber-500/15 blur-[80px]" />
      </div>

      <motion.div
        id="sph-announcement-modal"
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(15,23,42,0.22),0_0_1px_1px_rgba(255,255,255,0.9)] text-slate-800 flex flex-col items-center text-center z-10 overflow-hidden"
      >
        {/* Subtle decorative inner corner highlights */}
        <div className="absolute -top-14 -right-14 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-32 h-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

        {/* Top-Right Quick Close Button */}
        <button
          id="sph-announcement-top-close-btn"
          onClick={onClose}
          aria-label="Close Announcement"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 active:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated Pulsing Golden/Emerald Bell Emblem */}
        <div className="relative mb-3.5 mt-1 flex items-center justify-center">
          {/* Animated Pulsing Halo */}
          <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-amber-400/25 via-emerald-400/25 to-teal-400/25 blur-md animate-pulse" />
          
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50 border border-emerald-200/80 shadow-[0_8px_20px_rgba(16,185,129,0.15)] flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, -14, 14, -10, 10, -5, 5, 0],
                scale: [1, 1.06, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatDelay: 3,
                duration: 1.2,
                ease: 'easeInOut',
              }}
            >
              <Bell className="w-8 h-8 text-amber-500 fill-amber-400/30 drop-shadow-sm" />
            </motion.div>

            {/* Glowing Emerald Active Badge */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </div>
        </div>

        {/* Official Announcement Tag */}
        <div 
          id="sph-announcement-tag"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>📢 SPH OFFICIAL NOTICE</span>
        </div>

        {/* Title in bold #0F172A */}
        <h3
          id="sph-announcement-title"
          className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-snug mb-3 px-2"
        >
          {announcement.title}
        </h3>

        {/* Message with clean paragraph formatting */}
        <div
          id="sph-announcement-message"
          className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 max-h-56 overflow-y-auto px-1 space-y-2 text-center select-text"
        >
          {announcement.message.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Action Button (if button_text exists) */}
        {announcement.button_text && announcement.button_url && (
          <button
            id="sph-announcement-action-btn"
            onClick={handleActionClick}
            className="w-full mb-2.5 group py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{announcement.button_text}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Dismiss Button: "बंद करें / Dismiss (✕)" */}
        <button
          id="sph-announcement-dismiss-btn"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-100/90 active:bg-slate-200/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>बंद करें / Dismiss (✕)</span>
        </button>
      </motion.div>
    </div>
  );
};
