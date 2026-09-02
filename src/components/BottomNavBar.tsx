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
    <nav className="h-[65px] glass-light-nav text-slate-900 z-40 sticky bottom-0 safe-bottom-inset shadow-[0_-4px_24px_rgba(0,0,0,0.04)] select-none shrink-0 flex items-center justify-center">
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
                    ? 'text-slate-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {/* Active Top Accent Line */}
                {isActive && (
                  <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                )}

                {/* Tab Icon Container */}
                <div className="relative mb-0.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] scale-105 font-bold'
                        : 'bg-slate-100/90 text-slate-400 group-hover:bg-slate-200/80 group-hover:text-slate-600 border border-slate-200/70'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                  </div>

                  {/* Dynamic Badge */}
                  {tab.badge && (
                    <span
                      className={`absolute -top-1 -right-2 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight shadow-sm ${
                        isActive 
                          ? 'bg-emerald-600 text-white border border-emerald-400' 
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Tab Title */}
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-tight truncate max-w-full ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-bold'
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

