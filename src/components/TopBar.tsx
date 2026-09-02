import React from 'react';
import { 
  RotateCw, 
  ArrowLeft, 
  Wifi, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  Share2
} from 'lucide-react';
import { TabType } from '../types';

interface TopBarProps {
  currentTab: TabType;
  canGoBack: boolean;
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isOnline: boolean;
  onToggleOnline: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeModuleTitle?: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  canGoBack,
  onBack,
  onRefresh,
  isRefreshing,
  isOnline,
  onToggleOnline,
  isPhoneFrame,
  onTogglePhoneFrame,
  isFullscreen,
  onToggleFullscreen,
  activeModuleTitle
}) => {
  const getTabSubtitle = () => {
    if (activeModuleTitle) return `Reading: ${activeModuleTitle}`;
    switch (currentTab) {
      case 'ankitprep':
        return 'AnkitPrep • SSC | Railway | Police';
      case 'pareeksha':
        return 'Pareeksha Kendra • Online Exam Platform';
      case 'books_practice':
        return 'बुक्स & प्रैक्टिस • 31 Master Sets & Study Materials';
      default:
        return 'SSC | Railway | Police';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Silent Preparation Hub (SPH)',
        text: 'Silent Preparation Hub (SPH) - High-performance Android preparation portal with AnkitPrep, Pareeksha Kendra, and Books & Practice interactive study modules!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <header className="bg-[#1E293B] border-b-2 border-slate-800 text-slate-200 z-40 sticky top-0 transition-all shadow-xl select-none">
      {/* App Bar Main Row */}
      <div className="px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left Side: Back Button & Logo / Title */}
        <div className="flex items-center gap-3 min-w-0">
          {canGoBack && (
            <button
              id="topbar-back-btn"
              onClick={onBack}
              className="p-2 -ml-1 text-slate-300 hover:text-[#10B981] hover:bg-slate-800 rounded-xl transition-colors active:scale-95 flex items-center justify-center shrink-0 border border-slate-700/50"
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#10B981] stroke-[2.5]" />
            </button>
          )}

          {/* Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-[#10B981] shadow-md shrink-0">
            <span className="text-xs tracking-tighter font-black text-[#10B981]">SPH</span>
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tighter uppercase truncate leading-tight">
                Silent Preparation Hub
              </h1>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#10B981] tracking-[0.2em] uppercase truncate leading-tight">
              {getTabSubtitle()}
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Server / Network Status Indicator Pill */}
          <button
            id="network-toggle-btn"
            onClick={onToggleOnline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold uppercase transition-all ${
              isOnline
                ? 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-[#10B981]'
                : 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
            }`}
            title={isOnline ? 'Server: Active (Click to simulate offline)' : 'Simulating Offline (Click to reconnect)'}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse' : 'bg-rose-500'}`} />
            <span className="hidden xs:inline">{isOnline ? 'Active' : 'Offline'}</span>
          </button>

          {/* Refresh Action Button */}
          <button
            id="topbar-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 text-[#10B981] hover:bg-slate-700 rounded-xl border border-slate-700/60 transition-all active:scale-95 ${
              isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            aria-label="Refresh Page"
            title="Refresh current portal (or pull down to refresh)"
          >
            <RotateCw className={`w-5 h-5 text-[#10B981] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Phone Frame Toggle */}
          <button
            id="phone-frame-toggle-btn"
            onClick={onTogglePhoneFrame}
            className={`p-2 rounded-xl transition-all border border-slate-700/60 text-slate-300 hover:text-[#10B981] hover:bg-slate-700 hidden md:flex items-center justify-center ${
              isPhoneFrame ? 'text-[#10B981] bg-slate-800 border-[#10B981]/50' : ''
            }`}
            aria-label="Toggle Phone Frame Mode"
            title={isPhoneFrame ? 'Switch to Full Screen layout' : 'Switch to Android Handset Frame mode'}
          >
            <Smartphone className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle-btn"
            onClick={onToggleFullscreen}
            className="p-2 text-slate-300 hover:text-[#10B981] hover:bg-slate-700 rounded-xl border border-slate-700/60 transition-all hidden sm:flex items-center justify-center"
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Share */}
          <button
            id="share-app-btn"
            onClick={handleShare}
            className="p-2 text-slate-300 hover:text-[#10B981] hover:bg-slate-700 rounded-xl border border-slate-700/60 transition-all"
            aria-label="Share App"
            title="Share Silent Preparation Hub"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Accent Neon Bar */}
      <div className="h-0.5 w-full bg-slate-900">
        <div className={`h-full ${isRefreshing ? 'w-full animate-pulse' : 'w-full'} bg-[#10B981] shadow-[0_0_8px_#10B981] transition-all duration-300`} />
      </div>
    </header>
  );
};
