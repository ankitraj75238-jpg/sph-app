import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  SpellCheck,
  Globe,
  Calculator,
  Cpu,
  ShieldAlert,
  RotateCw,
  FileText,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { StudyModule } from '../types';
import { SphLogo } from './SphLogo';
import { OfficialCommunityCard } from './OfficialCommunityCard';
import { LoadingFlowerSpinner } from './LoadingFlowerSpinner';

interface BooksPracticeSectionProps {
  onSelectModule: (module: StudyModule) => void;
  onModulesCountChange?: (count: number) => void;
}

const PRIMARY_BOOKS_JSON_URL = 'https://raw.githubusercontent.com/ankitraj75238-jpg/sph-app/main/public/books-data.json';
const SECONDARY_BOOKS_JSON_URL = 'https://ankitraj75238-jpg.github.io/sph-app/books-data.json';
const LOCAL_BOOKS_JSON_URL = '/books-data.json';

// Static baseline fallback to ensure students can always study even offline
const BASELINE_FALLBACK_MODULES: StudyModule[] = [
  {
    id: '1',
    title: 'IDIOMS & PHRASES Complete Set 31 (Sanjeev Sir RWA Practice)',
    category: 'English Vocab',
    badge: '31 MASTER SETS',
    url: 'https://ankitraj75238-jpg.github.io/sph-app/public/idioms31.html',
    iconName: 'SpellCheck',
  }
];

export const BooksPracticeSection: React.FC<BooksPracticeSectionProps> = ({
  onSelectModule,
  onModulesCountChange,
}) => {
  const [modules, setModules] = useState<StudyModule[]>(BASELINE_FALLBACK_MODULES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string | null>(null);

  // Helper fetcher
  const tryFetchJson = async (url: string) => {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json, text/plain, */*',
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    return JSON.parse(text);
  };

  // Fetch dynamic books list with multi-tier fallback
  const fetchBooksData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setIsRefreshing(true);
    else setIsLoading(true);

    let parsedData: any = null;

    try {
      // 1. Try Primary GitHub Raw URL
      try {
        parsedData = await tryFetchJson(PRIMARY_BOOKS_JSON_URL);
      } catch {
        // 2. Try Secondary GitHub Pages URL
        try {
          parsedData = await tryFetchJson(SECONDARY_BOOKS_JSON_URL);
        } catch {
          // 3. Try Local Public Asset URL
          parsedData = await tryFetchJson(LOCAL_BOOKS_JSON_URL);
        }
      }

      // Extract raw modules array
      let rawList: any[] = [];
      if (Array.isArray(parsedData)) {
        rawList = parsedData;
      } else if (parsedData && typeof parsedData === 'object') {
        if (Array.isArray(parsedData.books)) rawList = parsedData.books;
        else if (Array.isArray(parsedData.modules)) rawList = parsedData.modules;
        else if (Array.isArray(parsedData.items)) rawList = parsedData.items;
        else if (Array.isArray(parsedData.data)) rawList = parsedData.data;
      }

      if (rawList.length > 0) {
        // Normalize modules data safely without injecting any dummy stats
        const normalizedModules: StudyModule[] = rawList.map((item: any, idx: number) => {
          let resolvedUrl = item.url || item.link || item.pdfUrl || item.readerUrl;
          
          // If URL points to local idioms31.html on GitHub or web, ensure smooth path
          if (resolvedUrl && resolvedUrl.includes('idioms31.html') && !resolvedUrl.startsWith('http')) {
            resolvedUrl = '/idioms31.html';
          }

          // Extract itemsCount ONLY if explicitly provided in JSON
          let itemsCountVal: string | undefined = undefined;
          if (item.itemsCount !== undefined && item.itemsCount !== null && item.itemsCount !== '') {
            itemsCountVal = typeof item.itemsCount === 'number' ? `${item.itemsCount} Sets` : String(item.itemsCount);
          } else if (item.totalItemsCount !== undefined && item.totalItemsCount !== null && item.totalItemsCount !== '') {
            itemsCountVal = typeof item.totalItemsCount === 'number' ? `${item.totalItemsCount} Items` : String(item.totalItemsCount);
          } else if (item.setsCount !== undefined && item.setsCount !== null && item.setsCount !== '') {
            itemsCountVal = typeof item.setsCount === 'number' ? `${item.setsCount} Sets` : String(item.setsCount);
          }

          // Extract time / duration ONLY if explicitly provided in JSON
          let timeVal: string | undefined = undefined;
          if (item.time !== undefined && item.time !== null && item.time !== '') {
            timeVal = String(item.time);
          } else if (item.readTimeEstimate !== undefined && item.readTimeEstimate !== null && item.readTimeEstimate !== '') {
            timeVal = String(item.readTimeEstimate);
          } else if (item.duration !== undefined && item.duration !== null && item.duration !== '') {
            timeVal = String(item.duration);
          } else if (item.readTime !== undefined && item.readTime !== null && item.readTime !== '') {
            timeVal = String(item.readTime);
          }

          return {
            id: String(item.id || item._id || item.slug || `book-${idx + 1}`),
            title: item.title || item.name || item.bookTitle || `Study Material #${idx + 1}`,
            titleHindi: item.titleHindi || item.title_hi || item.hindiTitle || undefined,
            authorOrCurator: item.authorOrCurator || item.author || item.curator || undefined,
            category: item.subject || item.category || item.genre || 'Study Material',
            badge: item.tag || item.badge || (item.isFeatured ? 'FEATURED' : undefined),
            description: item.description || item.desc || item.summary || undefined,
            itemsCount: itemsCountVal,
            readTimeEstimate: timeVal,
            isPopular: Boolean(item.isPopular),
            isFeatured: Boolean(item.isFeatured),
            coverGradient: item.coverGradient || item.gradient || undefined,
            iconName: item.iconName || item.icon || (item.subject?.includes('English') ? 'SpellCheck' : (item.subject?.includes('GS') || item.subject?.includes('Geography') || item.subject?.includes('General Studies') ? 'Globe' : 'BookOpen')),
            url: resolvedUrl || '/idioms31.html',
            link: resolvedUrl || '/idioms31.html',
            pdfUrl: item.pdfUrl,
            htmlContent: item.htmlContent || item.rawHtmlContent || item.html || item.content,
            rawHtmlContent: item.rawHtmlContent || item.htmlContent || item.html || item.content,
            vocabItems: item.vocabItems || item.vocabulary || item.words,
            practiceQuestions: item.practiceQuestions || item.questions || item.quiz,
            oneLiners: item.oneLiners || item.pointers || item.notes,
          };
        });

        setModules(normalizedModules);
        if (onModulesCountChange) onModulesCountChange(normalizedModules.length);
      } else {
        setModules(BASELINE_FALLBACK_MODULES);
        if (onModulesCountChange) onModulesCountChange(BASELINE_FALLBACK_MODULES.length);
      }

      setLastFetchedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Fallback cleanly to baseline data without breaking UI
      setModules(BASELINE_FALLBACK_MODULES);
      if (onModulesCountChange) onModulesCountChange(BASELINE_FALLBACK_MODULES.length);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [onModulesCountChange]);

  useEffect(() => {
    fetchBooksData();
  }, [fetchBooksData]);

  // Compute dynamic categories based on available modules
  const dynamicCategories = [
    'All',
    ...Array.from(new Set(modules.map((m) => m.category).filter(Boolean))) as string[],
  ];

  // Filter modules based on search query and category
  const filteredModules = modules.filter((mod) => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      mod.title.toLowerCase().includes(q) ||
      (mod.titleHindi && mod.titleHindi.toLowerCase().includes(q)) ||
      (mod.description && mod.description.toLowerCase().includes(q)) ||
      (mod.authorOrCurator && mod.authorOrCurator.toLowerCase().includes(q)) ||
      (mod.badge && mod.badge.toLowerCase().includes(q)) ||
      (mod.category && mod.category.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const getModuleIcon = (iconName?: string) => {
    switch (iconName) {
      case 'SpellCheck':
        return <SpellCheck className="w-5 h-5 text-blue-600 stroke-[2.5]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-600 stroke-[2.5]" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-600 stroke-[2.5]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-600 stroke-[2.5]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600 stroke-[2.5]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-teal-600 stroke-[2.5]" />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-5 h-5 text-blue-600 stroke-[2.5]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] bg-porcelain-mesh text-slate-900 overflow-y-auto select-none p-3.5 sm:p-6">
      <div className="max-w-7xl mx-auto w-full space-y-5 pb-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 border-b border-slate-200/90 pb-4">
          <div>
            <div className="flex items-end gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none tracking-tight">
                बुक्स & प्रैक्टिस
              </h2>
              <span className="text-blue-600 font-black text-xs sm:text-sm uppercase tracking-wider mb-0.5">
                BOOKS & PRACTICE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-medium leading-relaxed">
              Curated master test sets, e-books & interactive HTML readers for competitive exams.
            </p>
          </div>

          {/* Sync status & Refresh Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="refresh-books-library-btn"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(20);
                fetchBooksData(true);
              }}
              disabled={isRefreshing || isLoading}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xs transition-all active:scale-95 text-slate-700 hover:text-slate-900"
              title="Sync latest study materials"
              aria-label="Refresh Books Library"
            >
              <RotateCw className={`w-4 h-4 text-blue-600 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
              <div className="text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  {isRefreshing ? 'Syncing...' : 'Library Sync'}
                </span>
                <span className="text-xs font-black text-emerald-600 font-mono leading-tight">
                  {modules.length > 0 ? `${modules.length} Modules Live` : 'Live'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 1. Official WhatsApp & Telegram Community Card */}
        <OfficialCommunityCard />

        {/* 2. Search Bar & Dynamic Category Filter */}
        <div className="space-y-3">
          {/* Main Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-books-practice-input"
              type="text"
              placeholder="Search books, master sets, vocab, PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dynamic Category Chips */}
          {dynamicCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wider">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(10);
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State with Glowing Flower Spinner */}
        {isLoading && (
          <div className="card-light-clean rounded-3xl p-8 text-center my-6">
            <LoadingFlowerSpinner 
              message="स्टडी लाइब्रेरी लोड हो रही है..." 
              subMessage="Silent Preparation Hub • Dynamic Engine"
              darkTheme={false}
            />
          </div>
        )}

        {/* Modules List when Items Exist */}
        {!isLoading && (
          <div className="space-y-4">
            
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>
                Study Modules ({filteredModules.length})
              </span>
              {lastFetchedTime && (
                <span className="font-mono text-slate-400 text-[11px]">
                  Updated {lastFetchedTime}
                </span>
              )}
            </div>

            {/* No match for search filter */}
            {filteredModules.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2 shadow-sm">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900">No matching study material found</h4>
                <p className="text-xs text-slate-500">
                  Try adjusting your search keywords or select another subject category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-2 px-4 py-2 bg-slate-100 text-blue-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-200"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Grid of Minimalist Study Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModules.map((module) => {
                const hasStats = Boolean(module.itemsCount || module.readTimeEstimate);

                return (
                  <div
                    key={module.id}
                    onClick={() => {
                      if (navigator.vibrate) navigator.vibrate(20);
                      onSelectModule(module);
                    }}
                    className="group bg-white border border-slate-200 hover:border-blue-500/80 rounded-3xl p-5 sm:p-6 cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_-4px_rgba(37,99,235,0.08)] flex flex-col justify-between relative overflow-hidden card-touch-interactive hw-accelerate"
                  >
                    <div>
                      {/* Top Row: Icon, Tag & Subject/Category */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-100 group-hover:scale-105 transition-transform">
                          {getModuleIcon(module.iconName)}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {module.category && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                              {module.category}
                            </span>
                          )}
                          {module.badge && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                              {module.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Curator / Author (only if provided in JSON) */}
                      {module.authorOrCurator && (
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider block mb-1">
                          {module.authorOrCurator}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug tracking-tight mb-1">
                        {module.title}
                      </h3>

                      {/* Hindi Title (only if provided in JSON) */}
                      {module.titleHindi && (
                        <p className="text-xs font-bold text-slate-600 mb-2">
                          {module.titleHindi}
                        </p>
                      )}

                      {/* Description (only if provided in JSON) */}
                      {module.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {module.description}
                        </p>
                      )}

                      {/* Dynamic Stats Row (ONLY if explicitly defined in JSON) */}
                      {hasStats && (
                        <div className="flex items-center gap-2 mt-2 mb-3 flex-wrap">
                          {module.itemsCount && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 text-xs font-bold font-mono">
                              <Layers className="w-3.5 h-3.5 text-blue-600" />
                              <span>{module.itemsCount}</span>
                            </div>
                          )}
                          {module.readTimeEstimate && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 text-xs font-bold font-mono">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{module.readTimeEstimate}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-3">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Interactive Reader
                      </span>

                      <button
                        id={`open-reader-${module.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.vibrate) navigator.vibrate(20);
                          onSelectModule(module);
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 group-hover:shadow-md active:scale-95 shrink-0"
                      >
                        <span>OPEN READER</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

