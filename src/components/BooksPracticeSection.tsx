import React, { useState, useEffect, useCallback } from 'react';
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
  ShieldAlert,
  RotateCw,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { StudyModule } from '../types';

interface BooksPracticeSectionProps {
  onSelectModule: (module: StudyModule) => void;
  onModulesCountChange?: (count: number) => void;
}

const BOOKS_DATA_URL = 'https://ankitraj75238-jpg.github.io/sph-app/books-data.json';

export const BooksPracticeSection: React.FC<BooksPracticeSectionProps> = ({
  onSelectModule,
  onModulesCountChange,
}) => {
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string | null>(null);

  // Fetch dynamic books list from Admin JSON endpoint
  const fetchBooksData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setIsRefreshing(true);
    else setIsLoading(true);
    setFetchError(null);

    try {
      // Append cache-buster timestamp
      const response = await fetch(`${BOOKS_DATA_URL}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      
      let parsedData: any;
      try {
        parsedData = JSON.parse(text);
      } catch {
        // If response is HTML (e.g. GitHub 404 page) or malformed JSON
        throw new Error('Waiting for Admin to publish books-data.json repository.');
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

      // Normalize modules data safely
      const normalizedModules: StudyModule[] = rawList.map((item: any, idx: number) => ({
        id: item.id || item._id || item.slug || `book-${idx + 1}`,
        title: item.title || item.name || item.bookTitle || `Study Material #${idx + 1}`,
        titleHindi: item.titleHindi || item.title_hi || item.hindiTitle || '',
        authorOrCurator: item.authorOrCurator || item.author || item.curator || 'SPH Admin',
        category: item.category || item.genre || item.subject || 'General',
        badge: item.badge || item.tag || (item.isFeatured ? 'FEATURED' : undefined),
        description: item.description || item.desc || item.summary || 'Interactive study module curated for SSC, Railway & Police aspirants.',
        totalItemsCount: item.totalItemsCount || item.itemsCount || item.pages || item.totalCount || 10,
        readTimeEstimate: item.readTimeEstimate || item.readTime || item.duration || '20 mins',
        isPopular: Boolean(item.isPopular),
        isFeatured: Boolean(item.isFeatured),
        coverGradient: item.coverGradient || item.gradient || 'from-emerald-600 via-teal-700 to-slate-900',
        iconName: item.iconName || item.icon || 'BookOpen',
        subSetsCount: item.subSetsCount || item.setsCount || item.sets || 1,
        url: item.url || item.link || item.pdfUrl || item.readerUrl,
        link: item.link || item.url,
        pdfUrl: item.pdfUrl,
        htmlContent: item.htmlContent || item.rawHtmlContent || item.html || item.content,
        rawHtmlContent: item.rawHtmlContent || item.htmlContent || item.html || item.content,
        vocabItems: item.vocabItems || item.vocabulary || item.words,
        practiceQuestions: item.practiceQuestions || item.questions || item.quiz,
        oneLiners: item.oneLiners || item.pointers || item.notes,
      }));

      setModules(normalizedModules);
      if (onModulesCountChange) onModulesCountChange(normalizedModules.length);
      setLastFetchedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.warn('Admin books-data.json not ready or offline:', err.message);
      setFetchError(err.message || 'Unable to connect to books endpoint.');
      setModules([]);
      if (onModulesCountChange) onModulesCountChange(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [onModulesCountChange]);

  useEffect(() => {
    fetchBooksData();
  }, [fetchBooksData]);

  // Compute dynamic categories based on what the Admin has actually added
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
      (mod.badge && mod.badge.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const getModuleIcon = (iconName?: string) => {
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
      case 'FileText':
        return <FileText className="w-5 h-5 text-teal-400 stroke-[2.5]" />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-5 h-5 text-[#10B981] stroke-[2.5]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] text-slate-200 overflow-y-auto select-none p-3.5 sm:p-6">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-end gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none tracking-tight">
                बुक्स & प्रैक्टिस
              </h2>
              <span className="text-[#10B981] font-black text-xs sm:text-sm md:text-base uppercase tracking-wider mb-0.5">
                BOOKS & PRACTICE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl font-medium leading-relaxed">
              Admin-curated study library, master test sets, e-books & interactive HTML readers.
            </p>
          </div>

          {/* Sync status & Refresh Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="refresh-books-library-btn"
              onClick={() => fetchBooksData(true)}
              disabled={isRefreshing || isLoading}
              className="bg-[#1E293B] hover:bg-slate-800 border-2 border-slate-800 hover:border-[#10B981]/50 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-md transition-all active:scale-95 text-slate-300 hover:text-white"
              title="Fetch latest updates from Admin endpoint"
            >
              <RotateCw className={`w-4 h-4 text-[#10B981] ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
              <div className="text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  {isRefreshing ? 'Checking...' : 'Admin Sync'}
                </span>
                <span className="text-xs font-black text-[#10B981] font-mono leading-tight">
                  {modules.length > 0 ? `${modules.length} Live Items` : 'Live Feed'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar & Dynamic Category Filter */}
        <div className="space-y-3">
          {/* Main Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-books-practice-input"
              type="text"
              placeholder="Search books, study sets, topics, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E293B] border-2 border-slate-800 focus:border-[#10B981] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dynamic Category Chips (derived from Admin items) */}
          {dynamicCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wider">
              {dynamicCategories.map((cat) => (
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
          )}
        </div>

        {/* Loading State Skeletons */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="bg-[#1E293B]/60 border-2 border-slate-800/80 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center">
                <RotateCw className="w-6 h-6 text-[#10B981] animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-300">
                Connecting to Admin Books & Practice Server...
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Checking {BOOKS_DATA_URL}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-[#1E293B]/40 border-2 border-slate-800/60 rounded-2xl p-6 h-48 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-slate-800 rounded" />
                    <div className="w-48 h-6 bg-slate-800 rounded" />
                    <div className="w-full h-3 bg-slate-800/60 rounded" />
                  </div>
                  <div className="w-32 h-8 bg-slate-800 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty / Placeholder State */}
        {!isLoading && modules.length === 0 && (
          <div className="bg-[#1E293B] border-2 border-slate-800/90 rounded-3xl p-7 sm:p-12 text-center shadow-xl space-y-5 animate-fade-in my-auto">
            {/* Big Emoji / Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-[#10B981]/40 mx-auto flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              📚
            </div>

            {/* Exact Required Placeholder Text */}
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                📚 जल्द ही नई बुक्स और प्रैक्टिस सेट्स जोड़े जाएंगे
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#10B981] uppercase tracking-wider">
                New Books & Practice Sets Will Be Added Soon
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed pt-1">
                Admin is updating the study materials repository. When new PDF books, master sets, or HTML notes are published to the Admin config, they will appear here automatically.
              </p>
            </div>

            {/* Check Updates / Refresh Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="check-updates-empty-btn"
                onClick={() => fetchBooksData(true)}
                disabled={isRefreshing}
                className="px-6 py-3 bg-[#10B981] hover:opacity-95 text-[#0F172A] font-black uppercase text-xs sm:text-sm tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all w-full sm:w-auto"
              >
                <RotateCw className={`w-4 h-4 stroke-[2.5] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Checking Repository...' : 'Check For Updates'}</span>
              </button>

              <a
                href={BOOKS_DATA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Admin JSON Source</span>
              </a>
            </div>

            {/* Admin Source Info Footnote */}
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              <span>Admin Endpoint: </span>
              <span className="text-slate-400 truncate max-w-xs inline-block align-bottom">{BOOKS_DATA_URL}</span>
            </div>
          </div>
        )}

        {/* Modules List when Items Exist */}
        {!isLoading && modules.length > 0 && (
          <div className="space-y-4">
            
            {/* Search result count */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-black uppercase tracking-wider">
              <span>
                Available Modules ({filteredModules.length} of {modules.length})
              </span>
              {lastFetchedTime && (
                <span className="font-mono text-slate-500">
                  Synced at {lastFetchedTime}
                </span>
              )}
            </div>

            {/* No match for search filter */}
            {filteredModules.length === 0 && (
              <div className="bg-[#1E293B] border-2 border-slate-800 rounded-2xl p-8 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h4 className="text-base font-bold text-white">No matching books found</h4>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-2 px-3.5 py-1.5 bg-slate-800 text-[#10B981] text-xs font-bold rounded-xl border border-slate-700 hover:bg-slate-700"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Grid of Admin modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModules.map((module, idx) => (
                <div
                  key={module.id}
                  onClick={() => onSelectModule(module)}
                  className="group bg-[#1E293B] border-2 border-slate-800 hover:border-[#10B981] rounded-2xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg flex flex-col justify-between active:scale-[0.99]"
                >
                  <div>
                    {/* Top Row: Icon, Category & Index */}
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

                    {/* Curator / Author */}
                    {module.authorOrCurator && (
                      <span className="text-[11px] font-black text-[#10B981] uppercase tracking-wider block mb-1">
                        {module.authorOrCurator}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#10B981] transition-colors leading-snug mb-1">
                      {module.title}
                    </h3>

                    {module.titleHindi && (
                      <p className="text-xs font-bold text-slate-400 mb-2">
                        {module.titleHindi}
                      </p>
                    )}

                    {module.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {module.description}
                      </p>
                    )}

                    {/* Specs Pill Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-[#0F172A] p-3 rounded-xl border border-slate-800 text-center mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Items</span>
                        <span className="text-xs sm:text-sm font-black text-slate-200 font-mono">
                          {module.totalItemsCount || (module.vocabItems?.length || module.practiceQuestions?.length || 10)}+
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Est. Time</span>
                        <span className="text-xs sm:text-sm font-black text-slate-200 font-mono">
                          {module.readTimeEstimate || '15 mins'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Category</span>
                        <span className="text-[11px] font-black text-[#10B981] truncate block">
                          {module.category || 'Study Set'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      Full-Screen HTML Reader
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectModule(module);
                      }}
                      className="px-3.5 py-2 bg-[#10B981] hover:opacity-95 text-[#0F172A] font-black uppercase text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Open Reader</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
