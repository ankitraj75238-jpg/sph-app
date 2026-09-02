import React from 'react';
import { Send, MessageCircle, ExternalLink, Users, Sparkles, ShieldCheck } from 'lucide-react';

export const OfficialCommunityCard: React.FC = () => {
  const openExternalLink = (url: string) => {
    if (navigator.vibrate) navigator.vibrate(25);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] relative overflow-hidden">
      {/* Decorative Background Accent Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-none">
                Join Official Community
              </h3>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              आधिकारिक WhatsApp और Telegram चैनल से सीधे जुड़ें
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free Resources</span>
        </div>
      </div>

      {/* 2 Modern Quick-Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        
        {/* Button 1: WhatsApp Official Channel */}
        <button
          onClick={() => openExternalLink('https://whatsapp.com/channel/0029Vb8YQJZElah28mUs922k')}
          className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#25D366]/[0.06] hover:bg-[#25D366]/[0.12] border border-[#25D366]/30 hover:border-[#25D366]/60 transition-all duration-200 text-left active:scale-[0.98] shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              </div>
              {/* Pulsing Live Member Dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                  PAREEKSHA KENDRA Channel
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 block truncate">
                Daily WhatsApp Quizzes & Instant PDF Notes
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-xl bg-white/80 border border-[#25D366]/30 flex items-center justify-center text-emerald-700 shrink-0 ml-2 group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-2xs">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Button 2: Telegram Channel */}
        <button
          onClick={() => openExternalLink('https://t.me/PAREEKSHA_KENDRA')}
          className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#0088cc]/[0.06] hover:bg-[#0088cc]/[0.12] border border-[#0088cc]/30 hover:border-[#0088cc]/60 transition-all duration-200 text-left active:scale-[0.98] shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-md shadow-[#0088cc]/30 group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
              </div>
              {/* Pulsing Live Dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-800 transition-colors truncate">
                  Official Daily Quizzes & PYQs
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-700 block truncate">
                Official Telegram Channel • Free Doubt Solving
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-xl bg-white/80 border border-[#0088cc]/30 flex items-center justify-center text-blue-700 shrink-0 ml-2 group-hover:bg-[#0088cc] group-hover:text-white transition-all shadow-2xs">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </button>

      </div>
    </div>
  );
};
