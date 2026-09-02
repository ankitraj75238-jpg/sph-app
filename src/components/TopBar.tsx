import React from 'react';
import { 
  RotateCw, 
  ArrowLeft, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  Share2
} from 'lucide-react';
import { TabType } from '../types';
import { SphLogo } from './SphLogo';

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
        return 'बुक्स & प्रैक्टिस • Master Study Library';
      default:
        return 'SSC | Railway | Police';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Silent Preparation Hub (SPH)',
        text: 'Silent Preparation Hub (SPH) - High-performance Android preparation portal with AnkitPrep, Pareeksha Kendra, and Books & Practice study modules!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <header className="glass-light-header text-slate-900 z-40 sticky top-0 transition-all select-none">
      {/* App Bar Main Row */}
      <div className="px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left Side: Back Button & SPH Shield Logo / Title */}
        <div className="flex items-center gap-3 min-w-0">
          {canGoBack && (
            <button
              id="topbar-back-btn"
              onClick={onBack}
              className="p-2 -ml-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-95 flex items-center justify-center shrink-0 border border-slate-200"
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            </button>
          )}

          {/* SPH Academic Shield Logo Emblem */}
          <SphLogo size={36} />

          {/* Title & Subtitle */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase truncate leading-tight">
                Silent Preparation Hub
              </h1>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 tracking-[0.14em] uppercase truncate leading-tight">
              {getTabSubtitle()}
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Server / Network Status Indicator Pill */}
          <button
            id="network-toggle-btn"
            onClick={onToggleOnline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold uppercase transition-all ${
              isOnline
                ? 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 shadow-sm'
                : 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
            }`}
            title={isOnline ? 'Server: Active' : 'Simulating Offline (Click to reconnect)'}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`} />
            <span className="hidden xs:inline">{isOnline ? 'Active' : 'Offline'}</span>
          </button>

          {/* Refresh Action Button */}
          <button
            id="topbar-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all active:scale-95 ${
              isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            aria-label="Refresh Page"
            title="Refresh current portal"
          >
            <RotateCw className={`w-4 h-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Phone Frame Toggle */}
          <button
            id="phone-frame-toggle-btn"
            onClick={onTogglePhoneFrame}
            className={`p-2 rounded-xl transition-all border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-100 hidden md:flex items-center justify-center ${
              isPhoneFrame ? 'text-blue-600 bg-blue-50 border-blue-300' : ''
            }`}
            aria-label="Toggle Phone Frame Mode"
            title={isPhoneFrame ? 'Switch to Full Screen layout' : 'Switch to Android Handset Frame mode'}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle-btn"
            onClick={onToggleFullscreen}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all hidden sm:flex items-center justify-center"
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            id="share-app-btn"
            onClick={handleShare}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
            aria-label="Share App"
            title="Share Silent Preparation Hub"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accent Glowing Border Line */}
      <div className="h-[2px] w-full bg-slate-100">
        <div className={`h-full ${isRefreshing ? 'w-full animate-pulse' : 'w-full'} bg-gradient-to-r from-transparent via-blue-500 to-emerald-500 transition-all duration-300`} />
      </div>
    </header>
  );
};

