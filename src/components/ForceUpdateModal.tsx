import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  MessageCircle, 
  ArrowUpRight,
  SunMoon,
  Zap,
  Library,
  BookOpen
} from 'lucide-react';
import { AnnouncementConfig } from '../types';

export interface AppControlConfig {
  min_required_version?: number | string;
  min_version?: number | string;
  latest_version?: string | number;
  force_update?: boolean;
  update_title?: string;
  update_message?: string;
  telegram_url?: string;
  telegram_link?: string;
  whatsapp_url?: string;
  apk_download_url?: string;
  button_url?: string;
  button_text?: string;
}

interface ForceUpdateModalProps {
  currentVersion: string | number;
  appControl: AppControlConfig;
  announcement?: AnnouncementConfig | null;
}

const V2_FEATURE_HIGHLIGHTS = [
  {
    icon: Library,
    title: '12+ Complete Master Study Books & PYQ Archives',
    subtitle: '15-Yr Vocab, Parmar Sir Fatman GS, Black Book 1800 & DSSSB PYQs',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
  },
  {
    icon: SunMoon,
    title: 'Full Day & Night (Dark / Light) Mode Engine',
    subtitle: 'Seamless eye-safe study contrast with instant theme memory',
    color: 'from-sky-500/20 to-blue-500/10 text-sky-300 border-sky-500/30',
  },
  {
    icon: Zap,
    title: '120Hz Ultra-Smooth Zero-Stutter Speed & Instant Pre-load',
    subtitle: 'Silky micro-interactions with hardware-accelerated rendering',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    icon: BookOpen,
    title: 'Sectional Book Series (Parmar Sir, Black Book, ASO Rambaan)',
    subtitle: 'Organized two-level directory with offline interactive readers',
    color: 'from-purple-500/20 to-pink-500/10 text-purple-300 border-purple-500/30',
  },
];

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  currentVersion,
  appControl,
  announcement,
}) => {
  const telegramUrl = 
    announcement?.button_url ||
    appControl.button_url ||
    appControl.apk_download_url ||
    appControl.telegram_link ||
    appControl.telegram_url ||
    'https://t.me/pareekshakendraankit';

  const whatsappUrl = appControl.whatsapp_url || 'https://whatsapp.com/channel/0029VbCAg0h3gvWdFXenzf37';
  
  const title = announcement?.title || appControl.update_title || "🔥 SPH APP V2.0 MEGA UPDATE IS LIVE!";
  const message = announcement?.message || appControl.update_message || 
    "A mandatory high-speed V2.0 upgrade is live! Please download the update on Telegram to access all 12+ master study books, 120Hz speed engine, and day/night mode.";
  
  const buttonText = announcement?.button_text || appControl.button_text || "📲 DOWNLOAD V2.0 UPDATE ON TELEGRAM ➔";

  const targetVersion = appControl.latest_version || appControl.min_required_version || "2.0";

  // Prevent back navigation & trap history stack so user cannot bypass
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRedirect = (url: string) => {
    try {
      if (navigator.vibrate) navigator.vibrate(30);
    } catch {
      // Safe fallback
    }
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = url;
    }
  };

  return (
    <div 
      id="sph-v2-force-update-lock-screen"
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#070B19]/98 backdrop-blur-2xl p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      {/* Dynamic Ambient Background Auras */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/25 blur-[120px] animate-pulse" />
        <div className="absolute w-[360px] h-[360px] rounded-full bg-amber-500/20 blur-[100px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-emerald-500/15 blur-[90px]" />
      </div>

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1E293B]/95 via-[#0F172A]/98 to-[#070B19] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(245,158,11,0.25)] text-white text-center flex flex-col items-center z-10 my-auto"
      >
        {/* Top Warning Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider uppercase mb-4 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>MANDATORY UPDATE • V2.0 LOCK</span>
        </div>

        {/* Glowing Rocket/V2 Badge with Gradient Shine */}
        <div className="relative mb-4">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-600/50 via-amber-500/50 to-emerald-500/50 blur-xl animate-pulse" />
          
          <div className="relative w-22 h-22 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-slate-950/80 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Subtle shining light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
              <Rocket className="w-9 h-9 text-amber-400 mb-0.5 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-mono">
                V2.0 LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mb-2 leading-tight">
          {title}
        </h2>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-md">
          {message}
        </p>

        {/* Animated Feature Highlights */}
        <div className="w-full space-y-2 mb-4 text-left">
          {V2_FEATURE_HIGHLIGHTS.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, duration: 0.3 }}
                className={`p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r ${item.color} border flex items-center gap-3`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center shrink-0">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Version Compare Status Card */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-4 grid grid-cols-2 gap-3 text-left">
          <div className="border-r border-slate-800 pr-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current App</div>
            <div className="text-xs sm:text-sm font-extrabold text-rose-400 font-mono mt-0.5">
              v{String(currentVersion)} (Locked)
            </div>
          </div>
          <div className="pl-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required Version</div>
            <div className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
              v{String(targetVersion)} (Official)
            </div>
          </div>
        </div>

        {/* Massive Pulsing CTA Button */}
        <motion.button
          id="btn-download-v2-telegram"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleRedirect(telegramUrl)}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2.5 mb-2.5 group relative overflow-hidden"
        >
          {/* Subtle pulse animation ring */}
          <span className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
          <Send className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform shrink-0" />
          <span className="truncate">{buttonText}</span>
          <ArrowUpRight className="w-4 h-4 opacity-90 shrink-0" />
        </motion.button>

        {/* Secondary Action: WhatsApp Community */}
        <button
          id="btn-join-whatsapp-channel"
          onClick={() => handleRedirect(whatsappUrl)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-[0.98] border border-slate-700/80 text-emerald-400 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Join Official WhatsApp Community</span>
        </button>

        {/* Creator Footer Tag */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Silent Preparation Hub
          </span>
          <span className="font-mono text-slate-400">Doubt: @ankit_123422</span>
        </div>
      </motion.div>
    </div>
  );
};
