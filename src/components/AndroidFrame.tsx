import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, Circle, Square } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
  onBackPress?: () => void;
  canGoBack?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isPhoneFrame,
  onBackPress,
  canGoBack = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        {/* Android Native Status Bar in fluid mode */}
        <div className="bg-slate-950/90 text-slate-400 text-[11px] font-mono px-4 py-1 flex items-center justify-between border-b border-slate-900/60 select-none">
          <span className="font-semibold text-slate-300">{currentTime || '10:00'}</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-bold text-emerald-400">5G SPH</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  // Realistic Android Phone Mockup Frame
  return (
    <div className="min-h-screen bg-[#050811] py-4 px-2 sm:px-6 flex items-center justify-center antialiased">
      {/* Phone chassis */}
      <div className="w-full max-w-[430px] h-[92vh] max-h-[920px] bg-slate-950 rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[8px] border-slate-800/90 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Speaker / Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
          {/* Front Camera Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
          {/* Earpiece Grill */}
          <div className="w-14 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Android Status Bar */}
        <div className="bg-slate-900 text-slate-400 text-[11px] font-mono px-6 pt-3.5 pb-1 flex items-center justify-between border-b border-slate-800/60 select-none shrink-0 z-40">
          <span className="font-bold text-slate-200">{currentTime || '10:00'}</span>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[9px] font-bold tracking-wider text-emerald-400">SPH 5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Main Phone Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
          {children}
        </div>

        {/* Android Hardware / Soft Nav Bar */}
        <div className="bg-slate-950 px-8 py-2 flex items-center justify-around text-slate-500 border-t border-slate-900/80 shrink-0 z-40 select-none">
          {/* Back Triangle */}
          <button
            onClick={onBackPress}
            disabled={!canGoBack}
            className={`p-1.5 rounded-full transition-all active:scale-90 ${
              canGoBack ? 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80' : 'text-slate-700'
            }`}
            title="Android Back Button"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Home Circle */}
          <button
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 active:scale-90 transition-all"
            title="Android Home"
            aria-label="Home"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>

          {/* Recents Square */}
          <button
            className="p-1.5 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 active:scale-90 transition-all"
            title="Android Recents"
            aria-label="Recents"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Home gesture bar */}
        <div className="w-32 h-1 bg-slate-700/60 rounded-full mx-auto mb-1.5 shrink-0" />
      </div>
    </div>
  );
};
