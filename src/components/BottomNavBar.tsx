import React from 'react';
import { 
  Globe, 
  GraduationCap, 
  BookOpen,
  Sparkles,
  Instagram
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  modulesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  modulesCount = 0
}) => {
  const tabs = [
    {
      id: 'ankitprep' as TabType,
      label: 'AnkitPrep',
      icon: Globe,
      badge: 'Live',
    },
    {
      id: 'pareeksha' as TabType,
      label: 'Pareeksha',
      icon: GraduationCap,
      badge: 'Speed',
    },
    {
      id: 'books_practice' as TabType,
      label: 'Books',
      icon: BookOpen,
      badge: modulesCount > 0 ? `${modulesCount}` : 'New',
    },
    {
      id: 'ai_quiz' as TabType,
      label: 'AI Quiz',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'reels' as TabType,
      label: 'Reels',
      icon: Instagram,
      badge: '🔥',
    },
  ];

  return (
    <nav 
      className="h-[68px] bg-white text-slate-800 z-40 sticky bottom-0 select-none shrink-0 flex items-center justify-center border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
      }}
    >
      <div className="max-w-4xl w-full mx-auto px-0.5 sm:px-4">
        <div className="grid grid-cols-5 items-center justify-items-stretch">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isReels = tab.id === 'reels';

            return (
              <button
                key={tab.id}
                id={`bottom-nav-tab-${tab.id}`}
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(15);
                  onTabChange(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-0.5 transition-all duration-200 active:scale-95 group ${
                  isActive
                    ? 'text-slate-950'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {/* Active Top Accent Line */}
                {isActive && (
                  <div className={`absolute -top-[14px] left-1/2 -translate-x-1/2 w-7 h-1 rounded-full shadow-sm ${
                    isReels 
                      ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]' 
                      : 'bg-[#10B981]'
                  }`} />
                )}

                {/* Tab Icon Container */}
                <div className="relative mb-0.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? isReels 
                          ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md scale-105 font-bold'
                          : 'bg-[#10B981] text-white shadow-[0_4px_16px_rgba(16,185,129,0.35)] scale-105 font-bold'
                        : 'bg-slate-100 text-slate-500 border border-slate-200/80 group-hover:bg-slate-200/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
                  </div>

                  {/* Dynamic Badge */}
                  {tab.badge && (
                    <span
                      className={`absolute -top-1 -right-2 text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight shadow-sm ${
                        isActive 
                          ? isReels 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-slate-900 text-white border border-slate-900' 
                          : 'bg-slate-200/90 text-slate-700 border border-slate-300/80'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Tab Title */}
                <span className={`text-[8.5px] sm:text-[10px] font-black uppercase tracking-tight truncate max-w-full ${
                  isActive 
                    ? isReels 
                      ? 'text-rose-600 font-extrabold' 
                      : 'text-slate-900 font-extrabold' 
                    : 'text-slate-500 font-bold'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
