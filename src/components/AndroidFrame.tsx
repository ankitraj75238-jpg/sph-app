import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, Circle, Square } from 'lucide-react';
import { TabType } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
  onBackPress?: () => void;
  canGoBack?: boolean;
  currentTab?: TabType;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isPhoneFrame,
  onBackPress,
  canGoBack = false,
  currentTab = 'ankitprep',
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

  // Fluid Full Viewport Mode
  if (!isPhoneFrame) {
    return (
      <div className="h-screen w-screen bg-[#0F172A] text-slate-100 flex flex-col antialiased overflow-hidden select-none m-0 p-0">
        {/* Only show status bar on Books & Practice tab to keep WebViews 100% full screen */}
        {currentTab === 'books_practice' && (
          <div className="bg-[#0F172A] text-slate-400 text-[11px] font-mono px-4 py-1 flex items-center justify-between border-b border-slate-800/80 select-none shrink-0 z-50">
            <span className="font-semibold text-slate-300">{currentTime || '10:00'}</span>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[10px] font-black text-[#10B981]">5G SPH</span>
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5 text-[#10B981]" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 flex flex-col relative overflow-hidden h-full w-full m-0 p-0">
          {children}
        </div>
      </div>
    );
  }

  // Realistic Android Phone Mockup Frame
  return (
    <div className="h-screen w-screen bg-[#050811] py-2 sm:py-4 px-2 sm:px-6 flex items-center justify-center antialiased overflow-hidden select-none">
      {/* Phone chassis */}
      <div className="w-full max-w-[430px] h-full max-h-[920px] bg-[#0F172A] rounded-[40px] shadow-[0_25px_70px_rgba(0,0,0,0.9)] border-[7px] border-slate-800 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Speaker / Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none">
          {/* Front Camera Hole */}
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          {/* Earpiece Grill */}
          <div className="w-12 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Android Status Bar */}
        <div className="bg-[#0F172A] text-slate-400 text-[10px] font-mono px-5 pt-3 pb-1 flex items-center justify-between border-b border-slate-800 select-none shrink-0 z-40">
          <span className="font-bold text-slate-200">{currentTime || '10:00'}</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[9px] font-bold tracking-wider text-[#10B981]">SPH 5G</span>
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3 text-[#10B981]" />
            <Battery className="w-3 h-3 text-[#10B981]" />
          </div>
        </div>

        {/* Main Phone Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0F172A]">
          {children}
        </div>

        {/* Android Hardware / Soft Nav Bar */}
        <div className="bg-slate-950 px-8 py-1.5 flex items-center justify-around text-slate-500 border-t border-slate-900 shrink-0 z-40 select-none">
          {/* Back Triangle */}
          <button
            onClick={onBackPress}
            disabled={!canGoBack}
            className={`p-1.5 rounded-full transition-all active:scale-90 ${
              canGoBack ? 'text-slate-300 hover:text-[#10B981] hover:bg-slate-800' : 'text-slate-700'
            }`}
            title="Android Back Button"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Home Circle */}
          <button
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-full text-slate-400 hover:text-[#10B981] hover:bg-slate-800 active:scale-90 transition-all"
            title="Android Home"
            aria-label="Home"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>

          {/* Recents Square */}
          <button
            className="p-1.5 rounded-full text-slate-400 hover:text-[#10B981] hover:bg-slate-800 active:scale-90 transition-all"
            title="Android Recents"
            aria-label="Recents"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Home gesture bar */}
        <div className="w-28 h-1 bg-slate-700/60 rounded-full mx-auto mb-1 shrink-0" />
      </div>
    </div>
  );
};
