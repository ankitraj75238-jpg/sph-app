import React from 'react';
import { 
  Globe, 
  GraduationCap, 
  BookOpen
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
      sublabel: 'Portal 1',
      icon: Globe,
      badge: 'Live',
    },
    {
      id: 'pareeksha' as TabType,
      label: 'Pareeksha Kendra',
      sublabel: 'Portal 2',
      icon: GraduationCap,
      badge: 'Speed',
    },
    {
      id: 'books_practice' as TabType,
      label: 'Books & Practice',
      sublabel: 'बुक्स & प्रैक्टिस',
      icon: BookOpen,
      badge: modulesCount > 0 ? `${modulesCount}` : 'New',
    },
  ];

  return (
    <nav 
      className="h-[65px] glass-dark-nav text-slate-200 z-40 sticky bottom-0 select-none shrink-0 flex items-center justify-center shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
      }}
    >
      <div className="max-w-4xl w-full mx-auto px-2 sm:px-6">
        <div className="grid grid-cols-3 items-center justify-items-stretch">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`bottom-nav-tab-${tab.id}`}
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(15);
                  onTabChange(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-95 group ${
                  isActive
                    ? 'text-white'
                    : 'text-[#94A3B8] hover:text-slate-200'
                }`}
              >
                {/* Active Top Glowing Accent Line */}
                {isActive && (
                  <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 w-10 h-1 bg-[#10B981] rounded-full shadow-[0_0_12px_#10B981]" />
                )}

                {/* Tab Icon Container */}
                <div className="relative mb-0.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-[#10B981] text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] scale-105 font-bold'
                        : 'bg-slate-800/80 text-[#94A3B8] group-hover:bg-slate-850 group-hover:text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                  </div>

                  {/* Dynamic Badge */}
                  {tab.badge && (
                    <span
                      className={`absolute -top-1 -right-2 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight shadow-sm ${
                        isActive 
                          ? 'bg-slate-950 text-[#10B981] border border-[#10B981]/50' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Tab Title */}
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-tight truncate max-w-full ${
                  isActive ? 'text-white font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'text-[#94A3B8] font-semibold'
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

