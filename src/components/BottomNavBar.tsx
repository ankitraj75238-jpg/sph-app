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
    <nav className="h-[65px] bg-[#1E293B] border-t-2 border-slate-800 text-slate-200 z-40 sticky bottom-0 safe-bottom shadow-2xl select-none shrink-0 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-3 sm:px-6">
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
                className={`relative flex flex-col items-center justify-center py-1 px-1 transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-[#10B981]'
                    : 'text-slate-400 opacity-65 hover:opacity-100'
                }`}
              >
                {/* Tab Icon Container */}
                <div className="relative mb-0.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-[#10B981] text-[#0F172A] shadow-[0_0_14px_rgba(16,185,129,0.5)] scale-105'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </div>

                  {/* Badge */}
                  {tab.badge && (
                    <span
                      className={`absolute -top-1 -right-2 text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full leading-none tracking-tight shadow-md ${
                        isActive 
                          ? 'bg-slate-900 text-[#10B981] border border-[#10B981]/40' 
                          : 'bg-[#10B981] text-[#0F172A]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Tab Title */}
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight truncate max-w-full">
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
