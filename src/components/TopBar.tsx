import React from 'react';
import { 
  RotateCw, 
  ArrowLeft, 
  Sun, 
  Moon,
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
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  activeModuleTitle?: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  canGoBack,
  onBack,
  onRefresh,
  isRefreshing,
  isDarkMode = false,
  onToggleDarkMode,
  activeModuleTitle,
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Silent Preparation Hub (SPH)',
        text: 'Silent Preparation Hub (SPH) - SSC, Railway, Police & Defence Master Study Platform',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      if (navigator.vibrate) navigator.vibrate(20);
    }
  };

  return (
    <header 
      className="glass-light-header text-slate-900 z-40 sticky top-0 transition-all select-none border-b border-slate-200/90 shadow-xs"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 40px)',
      }}
    >
      {/* App Bar Main Row */}
      <div className="px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left Side: Back Button (if canGoBack) & SPH Shield Logo / Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {canGoBack && (
            <button
              id="topbar-back-btn"
              onClick={onBack}
              className="p-2 -ml-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-2xl transition-colors active:scale-95 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs"
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            </button>
          )}

          {/* SPH Academic Shield Logo Emblem */}
          <SphLogo size={36} />

          {/* Brand Name & Required Subtitle */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight uppercase truncate leading-tight">
              Silent Preparation Hub
            </h1>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 tracking-wide uppercase truncate leading-tight mt-0.5">
              {activeModuleTitle ? `Reading: ${activeModuleTitle}` : 'SSC • Railway • Police • Defence'}
            </span>
          </div>
        </div>

        {/* Right Side Actions: Theme Toggle, Refresh, Share */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Subtle Dark / Light Mode Toggle */}
          {onToggleDarkMode && (
            <button
              id="theme-mode-toggle-btn"
              onClick={onToggleDarkMode}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all active:scale-95 shadow-2xs"
              aria-label="Toggle Theme Mode"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          )}

          {/* Subtle Refresh Button */}
          <button
            id="topbar-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all active:scale-95 shadow-2xs ${
              isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            aria-label="Refresh Current Page"
            title="Refresh current page"
          >
            <RotateCw className={`w-4 h-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            id="share-app-btn"
            onClick={handleShare}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all active:scale-95 shadow-2xs hidden sm:flex items-center justify-center"
            aria-label="Share App"
            title="Share Silent Preparation Hub"
          >
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Accent Glowing Border Line */}
      <div className="h-[2px] w-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${isRefreshing ? 'w-full animate-progress-indeterminate' : 'w-full'} bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 transition-all duration-300`} />
      </div>
    </header>
  );
};
