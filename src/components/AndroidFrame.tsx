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

  // Fluid Full Viewport Mode (Direct Device & Browser rendering)
  if (!isPhoneFrame) {
    return (
      <div className="h-screen w-screen bg-[#F8FAFC] bg-porcelain-mesh text-slate-900 flex flex-col antialiased overflow-hidden select-none m-0 p-0">
        {/* Content Container with 100% Full Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden h-full w-full m-0 p-0">
          {children}
        </div>
      </div>
    );
  }

  // Realistic Android Phone Mockup Frame (Light Minimalist Edition)
  return (
    <div className="h-screen w-screen bg-slate-200/90 py-2 sm:py-4 px-2 sm:px-6 flex items-center justify-center antialiased overflow-hidden select-none">
      {/* Phone chassis */}
      <div className="w-full max-w-[430px] h-full max-h-[920px] bg-white rounded-[44px] shadow-[0_20px_70px_rgba(15,23,42,0.18)] border-[8px] border-slate-800 flex flex-col relative overflow-hidden">
        
        {/* Speaker / Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none">
          {/* Front Camera Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
          {/* Earpiece Grill */}
          <div className="w-12 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Android Status Bar */}
        <div className="bg-white text-slate-600 text-[10px] font-mono px-6 pt-3.5 pb-1 flex items-center justify-between border-b border-slate-100 select-none shrink-0 z-40">
          <span className="font-bold text-slate-900">{currentTime || '10:00'}</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-[9px] font-bold tracking-wider text-emerald-600">SPH 5G</span>
            <Signal className="w-3 h-3 text-slate-600" />
            <Wifi className="w-3 h-3 text-emerald-600" />
            <Battery className="w-3 h-3 text-slate-900" />
          </div>
        </div>

        {/* Main Phone Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-porcelain-mesh text-slate-900">
          {children}
        </div>

        {/* Android Soft Nav Bar */}
        <div className="bg-slate-50 px-8 py-1.5 flex items-center justify-around text-slate-500 border-t border-slate-200 shrink-0 z-40 select-none">
          {/* Back Button */}
          <button
            onClick={onBackPress}
            disabled={!canGoBack}
            className={`p-1.5 rounded-full transition-all active:scale-90 ${
              canGoBack ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-200' : 'text-slate-300'
            }`}
            title="Android Back Button"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Home Button */}
          <button
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-200 active:scale-90 transition-all"
            title="Android Home"
            aria-label="Home"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>

          {/* Recents Button */}
          <button
            className="p-1.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-200 active:scale-90 transition-all"
            title="Android Recents"
            aria-label="Recents"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Home gesture bar */}
        <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mb-1 shrink-0" />
      </div>
    </div>
  );
};

