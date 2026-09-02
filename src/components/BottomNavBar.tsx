import React from 'react';
import { 
  Globe, 
  GraduationCap, 
  BookOpen, 
  Sparkles 
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
  modulesCount = 6
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
      badge: '31 Sets',
    },
  ];

  return (
    <nav className="bg-[#1E293B] border-t-2 border-slate-800 text-slate-200 z-40 sticky bottom-0 safe-bottom shadow-2xl select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 items-center justify-items-stretch py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`bottom-nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 transition-all duration-200 group active:scale-95 ${
                  isActive
                    ? 'text-[#10B981]'
                    : 'text-slate-400 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Tab Icon Container */}
                <div className="relative mb-1">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-[#10B981] text-[#0F172A] shadow-[0_0_16px_rgba(16,185,129,0.5)] scale-105'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  {/* Badge */}
                  {tab.badge && (
                    <span
                      className={`absolute -top-1 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight shadow-md ${
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
                <span className="text-[9px] font-medium text-slate-500 truncate max-w-full hidden sm:block">
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
