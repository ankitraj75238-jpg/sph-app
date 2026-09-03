import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  MessageCircle, 
  ArrowUpRight 
} from 'lucide-react';

export interface AppControlConfig {
  min_required_version?: number;
  latest_version?: string | number;
  force_update?: boolean;
  update_title?: string;
  update_message?: string;
  telegram_url?: string;
  telegram_link?: string;
  whatsapp_url?: string;
  apk_download_url?: string;
}

interface ForceUpdateModalProps {
  currentVersion: number;
  appControl: AppControlConfig;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  currentVersion,
  appControl,
}) => {
  const telegramUrl = appControl.telegram_link || appControl.telegram_url || 'https://t.me/pareekshakendraankit';
  const whatsappUrl = appControl.whatsapp_url || 'https://whatsapp.com/channel/0029VbCAg0h3gvWdFXenzf37';
  const targetUrl = appControl.apk_download_url || telegramUrl;

  const title = appControl.update_title || '🚀 Mandatory Update Required!';
  const message = appControl.update_message || 
    'A newer, high-speed version of Silent Preparation Hub (SPH) is now available with new books, fresh practice sets, and critical bug fixes. Please update immediately to continue your preparation.';

  const minVersion = appControl.min_required_version ?? 1.0;
  const latestVersion = appControl.latest_version ?? minVersion;

  const handleRedirect = (url: string) => {
    try {
      window.location.href = url;
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      id="sph-force-update-lock"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#070B19]/95 backdrop-blur-xl p-4 select-none overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      {/* Background Ambient Glowing Auras */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />
        <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-[90px]" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-gradient-to-b from-[#1E293B]/90 via-[#0F172A]/95 to-[#090E1D] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.2)] text-white text-center flex flex-col items-center z-10"
      >
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase mb-5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Action Required • App Lock</span>
        </div>

        {/* Central 3D Animated Rocket Emblem */}
        <div className="relative mb-5">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-blue-600/40 via-amber-500/40 to-emerald-500/40 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300/40">
            <Rocket className="w-10 h-10 text-slate-950 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-display mb-2">
          {title}
        </h2>

        {/* Subtitle / Message */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {message}
        </p>

        {/* Version Compare Card */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 mb-5 grid grid-cols-2 gap-3 text-left">
          <div className="border-r border-slate-800 pr-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Installed</div>
            <div className="text-sm font-extrabold text-rose-400 font-mono mt-0.5">v{currentVersion.toFixed(1)} (Outdated)</div>
          </div>
          <div className="pl-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required Version</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">v{latestVersion} (Latest)</div>
          </div>
        </div>

        {/* Primary Action Button: Telegram Update */}
        <button
          onClick={() => handleRedirect(targetUrl)}
          className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2.5 mb-3 group"
        >
          <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          <span>DOWNLOAD UPDATE ON TELEGRAM</span>
          <ArrowUpRight className="w-4 h-4 opacity-80" />
        </button>

        {/* Secondary Action: WhatsApp Community */}
        <button
          onClick={() => handleRedirect(whatsappUrl)}
          className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-[0.98] border border-slate-700 text-emerald-400 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Join Official WhatsApp Channel</span>
        </button>

        {/* Creator Footer Tag */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Sparkles className="w-3 h-3" /> SPH Official
          </span>
          <span className="font-mono text-slate-400">Doubt: @ankit_123422</span>
        </div>
      </motion.div>
    </div>
  );
};
