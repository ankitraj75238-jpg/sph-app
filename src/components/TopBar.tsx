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
      className={`z-40 sticky top-0 theme-crossfade select-none shadow-xs ${
        isDarkMode 
          ? 'glass-obsidian-header text-slate-100 border-b border-slate-700/80 shadow-md' 
          : 'glass-light-header text-slate-900 border-b border-slate-200/90 shadow-xs'
      }`}
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
              className={`p-2 -ml-1 rounded-2xl transition-all active:scale-95 flex items-center justify-center shrink-0 border shadow-2xs ${
                isDarkMode 
                  ? 'text-slate-200 hover:text-emerald-400 hover:bg-slate-800 border-slate-700' 
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
              }`}
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className={`w-5 h-5 stroke-[2.5] ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
            </button>
          )}

          {/* SPH Academic Shield Logo Emblem */}
          <SphLogo size={36} />

          {/* Brand Name & Required Subtitle */}
          <div className="flex flex-col min-w-0">
            <h1 className={`text-sm sm:text-base md:text-lg font-black tracking-tight uppercase truncate leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Silent Preparation Hub
            </h1>
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-wide uppercase truncate leading-tight mt-0.5 ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              {activeModuleTitle ? `Reading: ${activeModuleTitle}` : 'SSC • Railway • Police • Defence'}
            </span>
          </div>
        </div>

        {/* Right Side Actions: Theme Toggle, Refresh, Share */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Universal Sun / Moon (☀️/🌙) Theme Mode Switcher */}
          {onToggleDarkMode && (
            <button
              id="theme-mode-toggle-btn"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-2xl border transition-all active:scale-95 shadow-2xs flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700 hover:border-slate-600' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-blue-300'
              }`}
              aria-label="Toggle Theme Mode"
              title={isDarkMode ? 'Switch to Day Mode (☀️)' : 'Switch to Night Mode (🌙)'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse-subtle" />
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
            className={`p-2 rounded-2xl border transition-all active:scale-95 shadow-2xs flex items-center justify-center ${
              isDarkMode 
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-blue-600 border-slate-200 hover:bg-slate-100'
            } ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            aria-label="Refresh Current Page"
            title="Refresh current page"
          >
            <RotateCw className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'} ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            id="share-app-btn"
            onClick={handleShare}
            className={`p-2 rounded-2xl border transition-all active:scale-95 shadow-2xs hidden sm:flex items-center justify-center ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            aria-label="Share App"
            title="Share Silent Preparation Hub"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accent Glowing Border Line */}
      <div className={`h-[2px] w-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className={`h-full ${isRefreshing ? 'w-full animate-progress-indeterminate' : 'w-full'} bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 transition-all duration-300`} />
      </div>
    </header>
  );
};
