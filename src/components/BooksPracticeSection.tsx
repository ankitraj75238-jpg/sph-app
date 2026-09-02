import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Filter, 
  BookMarked,
  Award,
  Zap,
  Globe,
  SpellCheck,
  Calculator,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { StudyModule } from '../types';
import { STUDY_MODULES } from '../data/studyModulesData';

interface BooksPracticeSectionProps {
  onSelectModule: (module: StudyModule) => void;
}

export const BooksPracticeSection: React.FC<BooksPracticeSectionProps> = ({
  onSelectModule
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'English Vocab',
    'General Knowledge',
    'Mathematics',
    'Reasoning',
    'Police & Railway'
  ];

  // Filter modules based on search query and category
  const filteredModules = STUDY_MODULES.filter((mod) => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch = 
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mod.titleHindi && mod.titleHindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.authorOrCurator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'SpellCheck':
        return <SpellCheck className="w-5 h-5 text-cyan-400 stroke-[2.5]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-amber-400 stroke-[2.5]" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-400 stroke-[2.5]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-400 stroke-[2.5]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400 stroke-[2.5]" />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-5 h-5 text-[#10B981] stroke-[2.5]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] text-slate-200 overflow-y-auto select-none p-3.5 sm:p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-end gap-3 sm:gap-4 flex-wrap">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
                बुक्स & प्रैक्टिस
              </h2>
              <span className="text-[#10B981] font-black mb-1 text-sm sm:text-base md:text-lg uppercase tracking-wider">
                BOOKS & PRACTICE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl font-medium">
              Curated master study modules, Sanjeev Thakur Sir 31 Sets, SSC PYQ Vocab books & high-yield one-liners with interactive reader and quiz.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#1E293B] border-2 border-slate-800 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Study Library</span>
                <span className="text-xs sm:text-sm font-black text-[#10B981] font-mono">{STUDY_MODULES.length} Active Modules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Category Filter Chips */}
        <div className="space-y-3">
          {/* Main Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-study-materials-input"
              type="text"
              placeholder="Search study materials, vocab books, Sanjeev Sir sets, GK one-liners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E293B] border-2 border-slate-800 focus:border-[#10B981] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none shadow-inner transition-all"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wider">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#10B981] text-[#0F172A] border-[#10B981] shadow-md'
                    : 'bg-[#1E293B] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Master Module Banner (Sanjeev Thakur Sir 31 Sets) */}
        {selectedCategory === 'All' && !searchQuery && STUDY_MODULES[0] && (
          <div
            onClick={() => onSelectModule(STUDY_MODULES[0])}
            className="group relative bg-gradient-to-br from-emerald-950/80 via-[#1E293B] to-slate-900 border-2 border-[#10B981] rounded-3xl p-5 sm:p-7 cursor-pointer hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-[#10B981] text-[#0F172A] tracking-wider shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    FEATURED MASTER SETS
                  </span>
                  <span className="text-xs font-black text-[#10B981] uppercase tracking-wider">
                    {STUDY_MODULES[0].authorOrCurator}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#10B981] transition-colors">
                  {STUDY_MODULES[0].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {STUDY_MODULES[0].description}
                </p>

                <div className="flex items-center gap-3 pt-1 text-xs text-slate-400 font-mono font-bold">
                  <span className="text-[#10B981]">31 Master Sets</span>
                  <span>•</span>
                  <span>310+ Idioms with Hindi Meaning</span>
                  <span>•</span>
                  <span>Instant CBT Quiz</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <button className="px-5 py-3.5 bg-[#10B981] group-hover:opacity-95 text-[#0F172A] font-black uppercase text-xs sm:text-sm tracking-wider rounded-2xl shadow-lg flex items-center gap-2 transition-transform group-hover:scale-105 active:scale-95">
                  <span>Open 31 Sets Reader</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
              All Study Modules & Practice Decks ({filteredModules.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((module, idx) => (
              <div
                key={module.id}
                onClick={() => onSelectModule(module)}
                className="group bg-[#1E293B] border-2 border-slate-800 hover:border-[#10B981] rounded-2xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon, Index & Category Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                      {getModuleIcon(module.iconName)}
                    </div>

                    <div className="flex items-center gap-2">
                      {module.badge && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 uppercase tracking-wider">
                          {module.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Curator Line */}
                  <span className="text-[11px] font-black text-[#10B981] uppercase tracking-wider block mb-1">
                    {module.authorOrCurator}
                  </span>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#10B981] transition-colors leading-snug mb-1">
                    {module.title}
                  </h3>

                  {module.titleHindi && (
                    <p className="text-xs font-bold text-slate-400 mb-2">
                      {module.titleHindi}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {module.description}
                  </p>

                  {/* Specs Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#0F172A] p-3 rounded-xl border border-slate-800 text-center mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Items</span>
                      <span className="text-xs sm:text-sm font-black text-slate-200 font-mono">{module.totalItemsCount}+</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Read Time</span>
                      <span className="text-xs sm:text-sm font-black text-slate-200 font-mono">{module.readTimeEstimate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Practice</span>
                      <span className="text-xs sm:text-sm font-black text-[#10B981] font-mono">
                        {module.practiceQuestions?.length || module.vocabItems?.length || 10}+ Qs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    Interactive Reader & Quiz
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModule(module);
                    }}
                    className="px-3.5 py-2 bg-[#10B981] hover:opacity-95 text-[#0F172A] font-black uppercase text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Read / Practice</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
