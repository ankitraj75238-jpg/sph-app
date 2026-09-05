import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  SpellCheck,
  Globe,
  Calculator,
  Cpu,
  ShieldAlert,
  RotateCw,
  FileText,
  Layers,
  FolderOpen,
  Folder,
  List,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { StudyModule } from '../types';
import { OfficialCommunityCard } from './OfficialCommunityCard';
import { LoadingFlowerSpinner } from './LoadingFlowerSpinner';

interface BooksPracticeSectionProps {
  onSelectModule: (module: StudyModule) => void;
  onModulesCountChange?: (count: number) => void;
  onRegisterBackHandler?: (handler: () => boolean) => void;
  isDarkMode?: boolean;
}

const PRIMARY_BOOKS_JSON_URL = 'https://raw.githubusercontent.com/ankitraj75238-jpg/sph-app/main/public/books-data.json';
const SECONDARY_BOOKS_JSON_URL = 'https://ankitraj75238-jpg.github.io/sph-app/books-data.json';
const LOCAL_BOOKS_JSON_URL = '/books-data.json';

export interface SeriesMeta {
  id: string; // '15yr_vocab' | 'parmar_gs' | 'sanjeev_sir' | 'error_pro' | 'black_book' | 'dsssb'
  title: string;
  pillLabel: string;
  emoji: string;
  curator: string;
  badge: string;
  deckHighlight: string;
  description: string;
  accentBgDay: string;
  accentBgNight: string;
  accentBorderDay: string;
  accentBorderNight: string;
  accentTextDay: string;
  accentTextNight: string;
  iconBgDay: string;
  iconBgNight: string;
}

export const MASTER_SERIES_LIST: SeriesMeta[] = [
  {
    id: '15yr_vocab',
    title: '15-Year SSC Vocab Complete Archive',
    pillLabel: '15-Yr Vocab',
    emoji: '🏛️',
    curator: 'SPH Academic Board (2010–2025)',
    badge: '5 MASTER DECKS',
    deckHighlight: '5 Master Decks: Synonyms, Antonyms, OWS, Spelling, Idioms',
    description: 'Complete 15-year SSC PYQ compilation across Synonyms, Antonyms, OWS, Spelling & Idioms with Hindi translations.',
    accentBgDay: 'bg-blue-50/80',
    accentBgNight: 'bg-blue-950/40',
    accentBorderDay: 'border-blue-200',
    accentBorderNight: 'border-blue-800/60',
    accentTextDay: 'text-blue-700',
    accentTextNight: 'text-blue-400',
    iconBgDay: 'bg-blue-100 text-blue-700',
    iconBgNight: 'bg-blue-900/50 text-blue-300',
  },
  {
    id: 'parmar_gs',
    title: 'Parmar Sir Fatman GS Series',
    pillLabel: 'Fatman GS',
    emoji: '🛡️',
    curator: 'Curated by Parmar Sir',
    badge: '23 CHAPTERS BILINGUAL',
    deckHighlight: 'Geography 23 Chapters Bilingual (Hindi + English)',
    description: 'High-yield General Studies Geography curriculum with comprehensive Hindi-English bilingual notes for SSC CGL Tier 1 & 2.',
    accentBgDay: 'bg-emerald-50/80',
    accentBgNight: 'bg-emerald-950/40',
    accentBorderDay: 'border-emerald-200',
    accentBorderNight: 'border-emerald-800/60',
    accentTextDay: 'text-emerald-700',
    accentTextNight: 'text-emerald-400',
    iconBgDay: 'bg-emerald-100 text-emerald-700',
    iconBgNight: 'bg-emerald-900/50 text-emerald-300',
  },
  {
    id: 'aso_rambaan',
    title: 'ASO Rambaan Static GK & GS Series',
    pillLabel: 'ASO Rambaan',
    emoji: '🎯',
    curator: 'ASO Exam Mentors & SPH Board',
    badge: 'RAMBAAN STATIC GK',
    deckHighlight: 'High-Yield Static GK & Topic-wise Exam Master Decks',
    description: 'Curated Static GK, Dance, Festivals, Battles & GS Rambaan notes curated for SSC CGL, CHSL, and Railways.',
    accentBgDay: 'bg-orange-50/80',
    accentBgNight: 'bg-orange-950/40',
    accentBorderDay: 'border-orange-200',
    accentBorderNight: 'border-orange-800/60',
    accentTextDay: 'text-orange-700',
    accentTextNight: 'text-orange-400',
    iconBgDay: 'bg-orange-100 text-orange-700',
    iconBgNight: 'bg-orange-900/50 text-orange-300',
  },
  {
    id: 'sanjeev_sir',
    title: 'Sanjeev Thakur Sir Master Series',
    pillLabel: 'Sanjeev Sir',
    emoji: '👑',
    curator: 'Sanjeev Thakur Sir (RWA)',
    badge: '31 SETS INTERACTIVE',
    deckHighlight: '31 Sets Interactive Practice with Answer Keys',
    description: '31 Intensive Idioms & Phrases test sets with interactive evaluation, scorecards, and complete answer keys.',
    accentBgDay: 'bg-amber-50/80',
    accentBgNight: 'bg-amber-950/40',
    accentBorderDay: 'border-amber-200',
    accentBorderNight: 'border-amber-800/60',
    accentTextDay: 'text-amber-700',
    accentTextNight: 'text-amber-400',
    iconBgDay: 'bg-amber-100 text-amber-700',
    iconBgNight: 'bg-amber-900/50 text-amber-300',
  },
  {
    id: 'error_pro',
    title: 'Error Pro English Grammar Series',
    pillLabel: 'Error Pro',
    emoji: '📖',
    curator: 'SPH Editorial Board',
    badge: 'COMPLETE BOOK',
    deckHighlight: 'Complete Chapter-wise Book for SSC, Banking & Defence',
    description: 'Chapter-wise error spotting, sentence correction, and rule-based English grammar mastery with curated practice sets.',
    accentBgDay: 'bg-purple-50/80',
    accentBgNight: 'bg-purple-950/40',
    accentBorderDay: 'border-purple-200',
    accentBorderNight: 'border-purple-800/60',
    accentTextDay: 'text-purple-700',
    accentTextNight: 'text-purple-400',
    iconBgDay: 'bg-purple-100 text-purple-700',
    iconBgNight: 'bg-purple-900/50 text-purple-300',
  },
  {
    id: 'black_book',
    title: 'Black Book Vocabulary Series',
    pillLabel: 'Black Book',
    emoji: '🖤',
    curator: 'Nikhil Gupta • TCS Archive',
    badge: '1800+ TCS IDIOMS & WORDS',
    deckHighlight: '1800+ TCS Idioms & Phrases, Most Repeated Words & OWS',
    description: 'India’s most celebrated SSC vocabulary handbook with 1800+ TCS idioms, most-repeated words & OWS.',
    accentBgDay: 'bg-slate-100',
    accentBgNight: 'bg-slate-800/60',
    accentBorderDay: 'border-slate-300',
    accentBorderNight: 'border-slate-700',
    accentTextDay: 'text-slate-800',
    accentTextNight: 'text-slate-200',
    iconBgDay: 'bg-slate-200 text-slate-800',
    iconBgNight: 'bg-slate-700 text-slate-200',
  },
  {
    id: 'dsssb',
    title: 'DSSSB Exam Special PYQ Series',
    pillLabel: 'DSSSB',
    emoji: '🏛️',
    curator: 'Delhi Subordinate Services Board Archive',
    badge: '2930 PYQS • 176 CHAPTERS',
    deckHighlight: 'Chapter-wise PYQs across 176 chapters of History, Geography, Polity & Science',
    description: 'Extensive 2,930 chapter-wise previous year questions covering History, Polity, Economy, and General Science.',
    accentBgDay: 'bg-rose-50/80',
    accentBgNight: 'bg-rose-950/40',
    accentBorderDay: 'border-rose-200',
    accentBorderNight: 'border-rose-800/60',
    accentTextDay: 'text-rose-700',
    accentTextNight: 'text-rose-400',
    iconBgDay: 'bg-rose-100 text-rose-700',
    iconBgNight: 'bg-rose-900/50 text-rose-300',
  },
];

// Offline baseline ensuring all 12 books across all 6 series work offline
const BASELINE_FALLBACK_MODULES: StudyModule[] = [
  // Series 1: 15-Year SSC Vocab Archive (5 Decks)
  {
    id: '3',
    title: 'SSC Synonyms 15 Years PYQ (2010–2025) All Exam Master Deck',
    category: 'English Vocab',
    badge: '15 YEARS SYNONYMS',
    itemsCount: '2010–2025 All SSC PYQs',
    url: '/ssc-synonyms.html',
    iconName: 'SpellCheck',
    seriesId: '15yr_vocab',
    seriesName: '🏛️ 15-Year SSC Vocab Archive',
    description: 'Every synonym asked in SSC CGL, CHSL, CPO, MTS & GD from 2010 to 2025 with Hindi meanings.',
  },
  {
    id: '4',
    title: 'SSC Antonyms 15 Years PYQ (2010–2025) All Exam Master Deck',
    category: 'English Vocab',
    badge: '15 YEARS ANTONYMS',
    itemsCount: '2010–2025 All SSC PYQs',
    url: '/ssc-antonyms.html',
    iconName: 'SpellCheck',
    seriesId: '15yr_vocab',
    seriesName: '🏛️ 15-Year SSC Vocab Archive',
    description: 'Exhaustive antonym archive with precise antonym pairs and examination recurrence metrics.',
  },
  {
    id: '5',
    title: 'SSC One Word Substitution (OWS) 15 Years PYQ Master Deck',
    category: 'English Vocab',
    badge: '15 YEARS OWS',
    itemsCount: '2010–2025 Complete OWS',
    url: '/ssc-ows.html',
    iconName: 'SpellCheck',
    seriesId: '15yr_vocab',
    seriesName: '🏛️ 15-Year SSC Vocab Archive',
    description: 'Master list of 15 years of One Word Substitutions with root word explanations and exam tags.',
  },
  {
    id: '6',
    title: 'SSC Spelling Correction 15 Years PYQ (2010–2025) Master Deck',
    category: 'English Vocab',
    badge: '15 YEARS SPELLING',
    itemsCount: '2010–2025 Complete Spelling',
    url: '/ssc-spelling.html',
    iconName: 'SpellCheck',
    seriesId: '15yr_vocab',
    seriesName: '🏛️ 15-Year SSC Vocab Archive',
    description: 'Commonly misspelled words and high-frequency spelling challenge sets asked by TCS.',
  },
  {
    id: '7',
    title: 'SSC Idioms & Phrases 15 Years PYQ (2010–2025) Master Deck',
    category: 'English Vocab',
    badge: '15 YEARS IDIOMS',
    itemsCount: '2010–2025 Complete PYQs',
    url: '/ssc-idioms-pyq.html',
    iconName: 'SpellCheck',
    seriesId: '15yr_vocab',
    seriesName: '🏛️ 15-Year SSC Vocab Archive',
    description: 'All 15 years of idiom questions with contextual usage, Hindi translations, and origin stories.',
  },
  // Series 2: Parmar Sir Fatman GS Series
  {
    id: '8',
    title: 'Parmar Sir Fatman GS - Geography (23 Chapters Bilingual)',
    category: 'General Studies (GS)',
    badge: '23 CHAPTERS BILINGUAL',
    itemsCount: '23 Chapters (Hindi + English)',
    url: '/fatman-geography.html',
    iconName: 'Globe',
    seriesId: 'parmar_gs',
    seriesName: '🛡️ Parmar Sir Fatman GS Series',
    description: 'Complete Indian and World Geography handwritten notes & chapter decks curated for SSC CGL Tier 1 & 2.',
  },
  // Series 3: Sanjeev Thakur Sir
  {
    id: '1',
    title: 'IDIOMS & PHRASES Complete Set 31 (Sanjeev Sir RWA Practice)',
    category: 'English Vocab',
    badge: '31 MASTER SETS',
    itemsCount: '31 Complete Sets',
    url: '/idioms31.html',
    iconName: 'SpellCheck',
    seriesId: 'sanjeev_sir',
    seriesName: '👑 Sanjeev Thakur Sir Master Series',
    description: 'Interactive practice deck with 31 high-frequency Idioms and Phrases sets designed for SSC CGL, CHSL, and MTS.',
  },
  // Series 4: Error Pro
  {
    id: '2',
    title: 'Error Pro Complete Grammar Book (All Chapters)',
    category: 'English Grammar',
    badge: 'ERROR PRO BOOK',
    itemsCount: 'Complete Book',
    url: '/error-pro.html',
    iconName: 'BookOpen',
    seriesId: 'error_pro',
    seriesName: '📖 Error Pro English Grammar Series',
    description: 'Comprehensive chapter-wise rule guide and error-detection modules for SSC, Banking & Defence examinations.',
  },
  // Series 5: Black Book Vocabulary Series
  {
    id: '9',
    title: 'Black Book of English Vocabulary - 1800+ Top Most Repeated Words',
    category: 'English Vocab',
    badge: 'BLACK BOOK 1800',
    itemsCount: '1800+ Most Repeated PYQs',
    url: '/ssc-synonyms.html',
    iconName: 'SpellCheck',
    seriesId: 'black_book',
    seriesName: '🖤 Black Book Vocabulary Series',
    description: 'Top 1800 most frequent vocabulary words ranked by repetition in SSC exam history.',
  },
  {
    id: '10',
    title: 'Black Book 1800 One Word Substitution (OWS Master Deck)',
    category: 'English Vocab',
    badge: '1800 OWS MASTER',
    itemsCount: '1800 High-Yield OWS',
    url: '/ssc-ows.html',
    iconName: 'SpellCheck',
    seriesId: 'black_book',
    seriesName: '🖤 Black Book Vocabulary Series',
    description: 'Categorized One Word Substitutions with previous year frequency indices and quick mnemonic recall.',
  },
  {
    id: '11',
    title: 'Black Book Idioms & Phrases 1800+ TCS PYQ (36 Master Parts)',
    category: 'English Vocab',
    badge: '1790 QUESTIONS',
    itemsCount: '36 Parts • 1790 Questions',
    url: '/blackbook-idioms-1800.html',
    iconName: 'SpellCheck',
    seriesId: 'black_book',
    seriesName: '🖤 Black Book Vocabulary Series',
    description: '36 systematic sets containing 1,790 TCS previous year idioms and phrases with Hindi explanations.',
  },
  // Series 6: DSSSB Exam Special PYQ Series
  {
    id: '12',
    title: 'DSSSB General Awareness — 176 Chapters PYQ Practice',
    category: 'General Studies (GS)',
    badge: '2930 PYQ QUESTIONS',
    itemsCount: '176 Chapters • 2930 Questions',
    url: '/dsssb-gs-pyq.html',
    iconName: 'Globe',
    seriesId: 'dsssb',
    seriesName: '🏛️ DSSSB Exam Special PYQ Series',
    description: '2,930 previous year questions across 176 chapters of History, Geography, Polity, Science and Economy.',
  },
];

// Helper to determine which series a module belongs to
export const getBookSeriesId = (module: StudyModule): string => {
  if (module.seriesId) {
    const sId = module.seriesId.toLowerCase();
    if (sId.includes('15yr') || sId.includes('15_year') || sId.includes('ssc_15')) return '15yr_vocab';
    if (sId.includes('parmar')) return 'parmar_gs';
    if (sId.includes('aso') || sId.includes('rambaan')) return 'aso_rambaan';
    if (sId.includes('sanjeev')) return 'sanjeev_sir';
    if (sId.includes('error')) return 'error_pro';
    if (sId.includes('black')) return 'black_book';
    if (sId.includes('dsssb')) return 'dsssb';
  }

  const text = `${module.title} ${module.description || ''} ${module.badge || ''}`.toLowerCase();
  if (text.includes('parmar') || text.includes('fatman') || text.includes('geography')) return 'parmar_gs';
  if (text.includes('aso rambaan') || text.includes('rambaan') || text.includes('ashutosh')) return 'aso_rambaan';
  if (text.includes('sanjeev') || text.includes('rwa') || text.includes('set 31') || text.includes('31 master')) return 'sanjeev_sir';
  if (text.includes('error pro') || text.includes('grammar book')) return 'error_pro';
  if (text.includes('black book')) return 'black_book';
  if (text.includes('dsssb')) return 'dsssb';
  if (text.includes('synonyms') || text.includes('antonyms') || text.includes('ows') || text.includes('spelling') || text.includes('idioms') || text.includes('15 years')) {
    return '15yr_vocab';
  }

  return '15yr_vocab';
};

export const BooksPracticeSection: React.FC<BooksPracticeSectionProps> = ({
  onSelectModule,
  onModulesCountChange,
  onRegisterBackHandler,
  isDarkMode = false,
}) => {
  const [modules, setModules] = useState<StudyModule[]>(BASELINE_FALLBACK_MODULES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string | null>(null);

  // Two-Level Directory State
  // Level 1: selectedSeriesId is null (shows the 6 Master Series Cards)
  // Level 2: selectedSeriesId is string (shows sub-decks for that series)
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  // Quick Direct List Mode Toggle: "📂 View All 10 Decks (Direct List)"
  const [isDirectListMode, setIsDirectListMode] = useState<boolean>(false);
  
  // Zero-stutter startup engine flag
  const [isRenderReady, setIsRenderReady] = useState<boolean>(false);

  // Top scroll anchor
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fast Startup: Defer heavy node rendering by 1 animation frame
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setIsRenderReady(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Hardware back button handler logic
  const handleGoBack = useCallback(() => {
    if (selectedSeriesId !== null) {
      setSelectedSeriesId(null);
      if (navigator.vibrate) navigator.vibrate(15);
      return true; // handled
    }
    if (isDirectListMode) {
      setIsDirectListMode(false);
      if (navigator.vibrate) navigator.vibrate(15);
      return true; // handled
    }
    return false; // let parent handle tab switch or exit
  }, [selectedSeriesId, isDirectListMode]);

  // Register with parent App.tsx for Android hardware back button
  useEffect(() => {
    if (onRegisterBackHandler) {
      onRegisterBackHandler(handleGoBack);
    }
  }, [onRegisterBackHandler, handleGoBack]);

  // Browser back button popstate listener
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedSeriesId !== null) {
        setSelectedSeriesId(null);
      } else if (isDirectListMode) {
        setIsDirectListMode(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedSeriesId, isDirectListMode]);

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
        const normalizedModules: StudyModule[] = rawList.map((item: any, idx: number) => {
          let resolvedUrl = item.url || item.link || item.pdfUrl || item.readerUrl;
          
          if (resolvedUrl && resolvedUrl.includes('idioms31.html') && !resolvedUrl.startsWith('http')) {
            resolvedUrl = '/idioms31.html';
          }

          let itemsCountVal: string | undefined = undefined;
          if (item.itemsCount !== undefined && item.itemsCount !== null && item.itemsCount !== '') {
            itemsCountVal = typeof item.itemsCount === 'number' ? `${item.itemsCount} Sets` : String(item.itemsCount);
          } else if (item.totalItemsCount !== undefined && item.totalItemsCount !== null && item.totalItemsCount !== '') {
            itemsCountVal = typeof item.totalItemsCount === 'number' ? `${item.totalItemsCount} Items` : String(item.totalItemsCount);
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
            readTimeEstimate: item.time || item.readTimeEstimate || item.duration || undefined,
            isPopular: Boolean(item.isPopular),
            isFeatured: Boolean(item.isFeatured),
            seriesId: item.seriesId,
            seriesName: item.seriesName,
            iconName: item.iconName || item.icon || (item.subject?.includes('English') ? 'SpellCheck' : (item.subject?.includes('GS') || item.subject?.includes('Geography') || item.subject?.includes('General Studies') ? 'Globe' : 'BookOpen')),
            url: resolvedUrl || '/idioms31.html',
            link: resolvedUrl || '/idioms31.html',
            pdfUrl: item.pdfUrl,
            htmlContent: item.htmlContent || item.rawHtmlContent || item.html || item.content,
            rawHtmlContent: item.rawHtmlContent || item.htmlContent || item.html || item.content,
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

  // Group books by series
  const seriesWithBooks = useMemo(() => {
    return MASTER_SERIES_LIST.map((series) => {
      const books = modules.filter((m) => getBookSeriesId(m) === series.id);
      return {
        ...series,
        books,
        deckCount: books.length,
      };
    });
  }, [modules]);

  // Filter series cards that contain decks (or all series if none matched)
  const activeSeriesCards = useMemo(() => {
    const populated = seriesWithBooks.filter((s) => s.deckCount > 0);
    return populated.length > 0 ? populated : seriesWithBooks;
  }, [seriesWithBooks]);

  // Active Series Meta (for Level 2)
  const activeSeries = useMemo(() => {
    if (!selectedSeriesId) return null;
    return seriesWithBooks.find((s) => s.id === selectedSeriesId) || null;
  }, [selectedSeriesId, seriesWithBooks]);

  // Global search filtering across all decks
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    return modules.filter((mod) => {
      return (
        mod.title.toLowerCase().includes(q) ||
        (mod.titleHindi && mod.titleHindi.toLowerCase().includes(q)) ||
        (mod.description && mod.description.toLowerCase().includes(q)) ||
        (mod.authorOrCurator && mod.authorOrCurator.toLowerCase().includes(q)) ||
        (mod.badge && mod.badge.toLowerCase().includes(q)) ||
        (mod.category && mod.category.toLowerCase().includes(q))
      );
    });
  }, [modules, searchQuery]);

  // Filtered decks for active series (if user searches inside Level 2)
  const activeSeriesFilteredBooks = useMemo(() => {
    if (!activeSeries) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeSeries.books;

    return activeSeries.books.filter((b) => {
      return (
        b.title.toLowerCase().includes(q) ||
        (b.titleHindi && b.titleHindi.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.badge && b.badge.toLowerCase().includes(q))
      );
    });
  }, [activeSeries, searchQuery]);

  // Navigate to Level 2
  const handleOpenSeries = (seriesId: string) => {
    if (navigator.vibrate) navigator.vibrate(15);
    try {
      window.history.pushState({ sph_level: 'series', id: seriesId }, '');
    } catch {
      // safe
    }
    setSelectedSeriesId(seriesId);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Determine subject accent color (#2563EB for English, #10B981 for GS/Others)
  const isGsOrGeneral = (category?: string, title?: string) => {
    const combined = `${category || ''} ${title || ''}`.toLowerCase();
    return combined.includes('gs') || combined.includes('geography') || combined.includes('general') || combined.includes('dsssb');
  };

  const getModuleIcon = (iconName?: string, isGs = false) => {
    const iconClass = `w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] ${
      isDarkMode 
        ? (isGs ? 'text-[#10B981]' : 'text-blue-400') 
        : (isGs ? 'text-[#10B981]' : 'text-[#2563EB]')
    }`;

    switch (iconName) {
      case 'SpellCheck':
        return <SpellCheck className={iconClass} />;
      case 'Globe':
        return <Globe className={iconClass} />;
      case 'Calculator':
        return <Calculator className={iconClass} />;
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'ShieldAlert':
        return <ShieldAlert className={iconClass} />;
      case 'FileText':
        return <FileText className={iconClass} />;
      case 'BookOpen':
      default:
        return <BookOpen className={iconClass} />;
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={`flex-1 flex flex-col overflow-y-auto select-none p-3.5 sm:p-6 zero-stutter-layer theme-crossfade ${
        isDarkMode 
          ? 'bg-[#0F172A] bg-obsidian-mesh text-slate-100' 
          : 'bg-[#F8FAFC] bg-porcelain-mesh text-slate-900'
      }`}
    >
      <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-5 pb-16">
        
        {/* Top Header Section */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 border-b pb-4 theme-crossfade ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200/90'
        }`}>
          <div>
            <div className="flex items-end gap-2.5 sm:gap-3 flex-wrap">
              <h2 className={`text-2xl sm:text-3xl font-black leading-none tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                बुक्स & प्रैक्टिस
              </h2>
              <span className={`font-black text-xs sm:text-sm uppercase tracking-wider mb-0.5 ${
                isDarkMode ? 'text-emerald-400' : 'text-blue-600'
              }`}>
                TWO-LEVEL SERIES DIRECTORY
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-1 font-medium leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {selectedSeriesId 
                ? `Viewing series folder • Tap 'Back to Books Directory' or phone back button to return.`
                : `Organized into 6 Master Book Series folders with instant interactive readers.`}
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
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl flex items-center gap-2 border shadow-2xs transition-all active:scale-95 theme-crossfade ${
                isDarkMode 
                  ? 'bg-[#1E293B] border-slate-700 hover:border-emerald-500 text-slate-200' 
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
              }`}
              title="Sync latest study materials"
              aria-label="Refresh Books Library"
            >
              <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'} ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
              <div className="text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  {isRefreshing ? 'Syncing...' : 'Live Books'}
                </span>
                <span className={`text-xs font-black font-mono leading-tight ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {modules.length > 0 ? `${modules.length} Decks` : 'Online'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 1. Official WhatsApp & Telegram Community Card */}
        <OfficialCommunityCard isDarkMode={isDarkMode} />

        {/* 2. Search Bar + Clean Top Toggle: "📂 View All 10 Decks (Direct List)" */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Main Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-books-practice-input"
                type="text"
                placeholder={selectedSeriesId ? `Search inside ${activeSeries?.title || 'series'}...` : "Search across all books, Parmar Sir, Sanjeev Sir, Black Book, PYQs..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-2xl pl-11 pr-16 py-3 text-xs sm:text-sm font-semibold outline-none shadow-2xs transition-all border theme-crossfade ${
                  isDarkMode 
                    ? 'bg-[#1E293B] border-slate-700 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-lg ${
                    isDarkMode ? 'text-slate-300 bg-slate-700 hover:text-white' : 'text-slate-600 bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Top Toggle Button: "📂 View All 10 Decks (Direct List)" (when on Level 1) */}
            {!selectedSeriesId && (
              <button
                id="toggle-direct-list-mode-btn"
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(15);
                  setIsDirectListMode(prev => !prev);
                  setSearchQuery('');
                }}
                className={`px-4 py-3 rounded-2xl flex items-center justify-center gap-2 border font-black text-xs tracking-tight transition-all active:scale-95 shrink-0 shadow-2xs ${
                  isDirectListMode
                    ? isDarkMode
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-[#2563EB] text-white border-[#2563EB] font-black shadow-xs'
                    : isDarkMode
                      ? 'bg-[#1E293B] hover:bg-slate-800 text-emerald-400 border-emerald-800/60 hover:border-emerald-500'
                      : 'bg-blue-50/80 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300'
                }`}
                title="Toggle between series folders and complete all-in-one deck list"
              >
                {isDirectListMode ? (
                  <>
                    <Folder className="w-4 h-4" />
                    <span>🗂️ View Series Directory (Folders)</span>
                  </>
                ) : (
                  <>
                    <List className="w-4 h-4" />
                    <span>📂 View All {modules.length} Decks (Direct List)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={`rounded-3xl p-8 text-center my-6 border ${
            isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <LoadingFlowerSpinner 
              message="स्टडी डायरेक्टरी लोड हो रही है..." 
              subMessage="Silent Preparation Hub • Series Directory Engine"
              darkTheme={isDarkMode}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW A: Search Results (Active when user types into search query) */}
        {/* ========================================================================= */}
        {!isLoading && isRenderReady && searchQuery.trim().length > 0 && !selectedSeriesId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider px-1 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-500" />
                <span>Search Results • {searchResults.length} {searchResults.length === 1 ? 'Deck Found' : 'Decks Found'}</span>
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-500 hover:underline capitalize"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className={`rounded-3xl p-8 text-center space-y-2 border ${
                isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  No matching books found for "{searchQuery}"
                </h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Try searching with broader terms like 'vocab', 'grammar', 'geography', or '15 years'.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`mt-2 px-4 py-2 text-xs font-bold rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'bg-slate-100 text-blue-600 border-slate-200'
                  }`}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {searchResults.map((module) => {
                  const isGs = isGsOrGeneral(module.category, module.title);
                  const isTest = module.seriesId === 'sanjeev_sir' || module.title.toLowerCase().includes('set 31') || module.title.toLowerCase().includes('practice');
                  const itemsTag = module.itemsCount || module.badge || (isGs ? '23 Chapters Bilingual' : '15 Years PYQ');

                  return (
                    <div
                      key={module.id}
                      id={`search-card-${module.id}`}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(15);
                        onSelectModule(module);
                      }}
                      className={`group w-full rounded-2xl p-3.5 sm:p-4.5 border transition-all duration-200 cursor-pointer active:scale-[0.98] select-none shadow-xs ${
                        isDarkMode 
                          ? 'bg-[#1E293B] border-slate-700/80 hover:border-emerald-500/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]' 
                          : 'bg-white border-slate-200 hover:border-blue-500/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_-2px_rgba(37,99,235,0.08)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                          isDarkMode 
                            ? (isGs 
                                ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
                                : 'bg-[#2563EB]/15 border-[#2563EB]/30 text-blue-400')
                            : (isGs 
                                ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]' 
                                : 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#2563EB]')
                        }`}>
                          {getModuleIcon(module.iconName, isGs)}
                        </div>

                        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                          <h4 className={`text-xs sm:text-sm font-bold leading-snug tracking-tight truncate transition-colors ${
                            isDarkMode 
                              ? 'text-white group-hover:text-emerald-400' 
                              : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {module.title}
                          </h4>

                          <p className={`text-[11px] sm:text-xs font-medium truncate mt-0.5 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {module.titleHindi || module.description || module.authorOrCurator || 'Official High-Yield SPH Study Deck'}
                          </p>

                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
                            {itemsTag && (
                              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                isDarkMode 
                                  ? 'bg-slate-900/80 text-slate-200 border-slate-700/80' 
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                <Layers className={`w-3 h-3 ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                                <span>{itemsTag}</span>
                              </span>
                            )}
                            {module.category && (
                              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                isDarkMode 
                                  ? (isGs 
                                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                                      : 'bg-blue-950/60 text-blue-400 border-blue-800/60')
                                  : (isGs 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                      : 'bg-blue-50 text-blue-700 border-blue-200')
                              }`}>
                                {module.category}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 pl-1">
                          <button
                            id={`btn-open-search-reader-${module.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (navigator.vibrate) navigator.vibrate(15);
                              onSelectModule(module);
                            }}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
                              isDarkMode 
                                ? 'bg-[#10B981] hover:bg-emerald-400 text-slate-950 shadow-[0_2px_12px_rgba(16,185,129,0.3)]' 
                                : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                            }`}
                          >
                            <span>{isTest ? 'View Test' : 'Open Reader'}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW B: Direct All-In-One List Mode (When User Taps Toggle Button) */}
        {/* ========================================================================= */}
        {!isLoading && isRenderReady && !selectedSeriesId && isDirectListMode && searchQuery.trim().length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider px-1 text-slate-400">
              <span className="flex items-center gap-1.5">
                <List className="w-4 h-4 text-emerald-500" />
                <span>All {modules.length} Study Decks (Direct List View)</span>
              </span>
              <button
                onClick={() => setIsDirectListMode(false)}
                className="text-xs text-blue-500 hover:underline capitalize"
              >
                Switch to Folders
              </button>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {modules.map((module) => {
                const isGs = isGsOrGeneral(module.category, module.title);
                const isTest = module.seriesId === 'sanjeev_sir' || module.title.toLowerCase().includes('set 31') || module.title.toLowerCase().includes('practice');
                const itemsTag = module.itemsCount || module.badge || (isGs ? '23 Chapters Bilingual' : '15 Years PYQ');

                return (
                  <div
                    key={module.id}
                    id={`direct-book-card-${module.id}`}
                    onClick={() => {
                      if (navigator.vibrate) navigator.vibrate(15);
                      onSelectModule(module);
                    }}
                    className={`group w-full rounded-2xl p-3.5 sm:p-4.5 border transition-all duration-200 cursor-pointer active:scale-[0.98] select-none shadow-xs ${
                      isDarkMode 
                        ? 'bg-[#1E293B] border-slate-700/80 hover:border-emerald-500/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]' 
                        : 'bg-white border-slate-200 hover:border-blue-500/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_-2px_rgba(37,99,235,0.08)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                        isDarkMode 
                          ? (isGs 
                              ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
                              : 'bg-[#2563EB]/15 border-[#2563EB]/30 text-blue-400')
                          : (isGs 
                              ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]' 
                              : 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#2563EB]')
                      }`}>
                        {getModuleIcon(module.iconName, isGs)}
                      </div>

                      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                        <h4 className={`text-xs sm:text-sm font-bold leading-snug tracking-tight truncate transition-colors ${
                          isDarkMode 
                            ? 'text-white group-hover:text-emerald-400' 
                            : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                          {module.title}
                        </h4>

                        <p className={`text-[11px] sm:text-xs font-medium truncate mt-0.5 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {module.titleHindi || module.description || module.authorOrCurator || 'Official High-Yield SPH Study Deck'}
                        </p>

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
                          {itemsTag && (
                            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                              isDarkMode 
                                ? 'bg-slate-900/80 text-slate-200 border-slate-700/80' 
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              <Layers className={`w-3 h-3 ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                              <span>{itemsTag}</span>
                            </span>
                          )}
                          {module.category && (
                            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              isDarkMode 
                                ? (isGs 
                                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                                    : 'bg-blue-950/60 text-blue-400 border-blue-800/60')
                                : (isGs 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200')
                            }`}>
                              {module.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 pl-1">
                        <button
                          id={`btn-open-direct-reader-${module.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.vibrate) navigator.vibrate(15);
                            onSelectModule(module);
                          }}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
                            isDarkMode 
                              ? 'bg-[#10B981] hover:bg-emerald-400 text-slate-950 shadow-[0_2px_12px_rgba(16,185,129,0.3)]' 
                              : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          <span>{isTest ? 'View Test' : 'Open Reader'}</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEVEL 1: Master Series Directory (Default Front View) */}
        {/* 6 Clean Vertical Master Book Series Cards (Top-to-Bottom Stack) */}
        {/* ========================================================================= */}
        {!isLoading && isRenderReady && !selectedSeriesId && !isDirectListMode && searchQuery.trim().length === 0 && (
          <div className="space-y-4">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-emerald-500" />
                <span>{activeSeriesCards.length} Master Book Series Folders</span>
              </span>
              <span className="font-mono text-slate-400 text-[11px]">
                {modules.length} Total Decks
              </span>
            </div>

            {/* Vertical Stack: The Master Series Cards */}
            <div className="space-y-3 sm:space-y-3.5">
              {activeSeriesCards.map((series, idx) => {
                return (
                  <div
                    key={series.id}
                    id={`series-folder-card-${series.id}`}
                    onClick={() => handleOpenSeries(series.id)}
                    className={`group w-full rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer active:scale-[0.985] select-none shadow-xs ${
                      isDarkMode 
                        ? 'bg-[#1E293B] border-slate-700/90 hover:border-emerald-500/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.14)]' 
                        : 'bg-white border-slate-200/90 hover:border-blue-500/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_22px_-2px_rgba(37,99,235,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      
                      {/* Left: Prominent Emoji / Icon Container with colored backdrop */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-2xs text-2xl sm:text-3xl ${
                        isDarkMode
                          ? `${series.accentBgNight} ${series.accentBorderNight}`
                          : `${series.accentBgDay} ${series.accentBorderDay}`
                      }`}>
                        <span>{series.emoji}</span>
                      </div>

                      {/* Middle: Series Title, Content Highlight, and Badge */}
                      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                        {/* Title */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-sm sm:text-base font-black leading-snug tracking-tight transition-colors ${
                            isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {series.title}
                          </h3>
                        </div>

                        {/* Deck Highlight / Subtitle */}
                        <p className={`text-xs sm:text-[13px] font-semibold mt-1 leading-snug ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {series.deckHighlight}
                        </p>

                        {/* Badges & Curator row */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                            isDarkMode 
                              ? `${series.accentBgNight} ${series.accentTextNight} ${series.accentBorderNight}` 
                              : `${series.accentBgDay} ${series.accentTextDay} ${series.accentBorderDay}`
                          }`}>
                            {series.badge}
                          </span>
                          <span className={`text-[10px] sm:text-[11px] font-medium truncate ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {series.curator}
                          </span>
                        </div>
                      </div>

                      {/* Right: High-Contrast [Open Series ➔] Action Pill */}
                      <div className="shrink-0 pl-1">
                        <button
                          id={`btn-open-series-${series.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSeries(series.id);
                          }}
                          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
                            isDarkMode 
                              ? 'bg-[#10B981] hover:bg-emerald-400 text-slate-950 shadow-[0_2px_14px_rgba(16,185,129,0.35)]' 
                              : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          <span>Open Series</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* LEVEL 2: Series Decks View (When a Master Series is Tapped) */}
        {/* ========================================================================= */}
        {!isLoading && isRenderReady && selectedSeriesId && activeSeries && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            
            {/* Top Navigation Bar with Back Button */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                id="btn-back-to-directory"
                onClick={handleGoBack}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 border font-bold text-xs sm:text-sm tracking-tight transition-all active:scale-95 shadow-2xs ${
                  isDarkMode 
                    ? 'bg-[#1E293B] hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700 hover:border-emerald-500' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-blue-400'
                }`}
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Back to Books Directory</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                  isDarkMode 
                    ? `${activeSeries.accentBgNight} ${activeSeries.accentTextNight} ${activeSeries.accentBorderNight}` 
                    : `${activeSeries.accentBgDay} ${activeSeries.accentTextDay} ${activeSeries.accentBorderDay}`
                }`}>
                  {activeSeries.books.length} {activeSeries.books.length === 1 ? 'Deck' : 'Decks'} Available
                </span>
              </div>
            </div>

            {/* Series Header Banner */}
            <div className={`rounded-2xl p-4 sm:p-5 border shadow-2xs ${
              isDarkMode 
                ? `${activeSeries.accentBgNight} ${activeSeries.accentBorderNight}` 
                : `${activeSeries.accentBgDay} ${activeSeries.accentBorderDay}`
            }`}>
              <div className="flex items-start gap-3.5">
                <span className="text-3xl sm:text-4xl shrink-0 leading-none">{activeSeries.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base sm:text-lg font-black tracking-tight leading-snug ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {activeSeries.title}
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-[13px] font-medium mt-1 leading-relaxed ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {activeSeries.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] sm:text-[11px] font-bold ${
                      isDarkMode ? activeSeries.accentTextNight : activeSeries.accentTextDay
                    }`}>
                      {activeSeries.curator}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical List of Decks in this Series */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                <span>Series Study Modules ({activeSeriesFilteredBooks.length})</span>
                <span className="font-mono text-[11px]">Instant Reader Enabled</span>
              </div>

              {activeSeriesFilteredBooks.length === 0 ? (
                <div className={`rounded-2xl p-6 text-center border ${
                  isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <p className="text-xs text-slate-400">No decks found matching your search within this series.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs font-bold text-blue-500 hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                activeSeriesFilteredBooks.map((module) => {
                  const isGs = isGsOrGeneral(module.category, module.title);
                  const isTest = activeSeries.id === 'sanjeev_sir' || module.title.toLowerCase().includes('set 31') || module.title.toLowerCase().includes('practice');
                  const itemsTag = module.itemsCount || module.badge || (isGs ? '23 Chapters Bilingual' : '15 Years PYQ');

                  return (
                    <div
                      key={module.id}
                      id={`series-deck-card-${module.id}`}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(15);
                        onSelectModule(module);
                      }}
                      className={`group w-full rounded-2xl p-3.5 sm:p-4.5 border transition-all duration-200 cursor-pointer active:scale-[0.98] select-none shadow-xs ${
                        isDarkMode 
                          ? 'bg-[#1E293B] border-slate-700/80 hover:border-emerald-500/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]' 
                          : 'bg-white border-slate-200 hover:border-blue-500/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_-2px_rgba(37,99,235,0.08)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 sm:gap-4">
                        
                        {/* Left: Clean rounded icon/badge with subject color */}
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                          isDarkMode 
                            ? (isGs 
                                ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
                                : 'bg-[#2563EB]/15 border-[#2563EB]/30 text-blue-400')
                            : (isGs 
                                ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]' 
                                : 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#2563EB]')
                        }`}>
                          {getModuleIcon(module.iconName, isGs)}
                        </div>

                        {/* Middle: Deck Title, Subtitle, and Tag */}
                        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                          <h4 className={`text-xs sm:text-sm font-bold leading-snug tracking-tight truncate transition-colors ${
                            isDarkMode 
                              ? 'text-white group-hover:text-emerald-400' 
                              : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {module.title}
                          </h4>

                          <p className={`text-[11px] sm:text-xs font-medium truncate mt-0.5 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {module.titleHindi || module.description || module.authorOrCurator || 'Official High-Yield SPH Study Deck'}
                          </p>

                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
                            {itemsTag && (
                              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                isDarkMode 
                                  ? 'bg-slate-900/80 text-slate-200 border-slate-700/80' 
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                <Layers className={`w-3 h-3 ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'}`} />
                                <span>{itemsTag}</span>
                              </span>
                            )}
                            {module.category && (
                              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                isDarkMode 
                                  ? (isGs 
                                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                                      : 'bg-blue-950/60 text-blue-400 border-blue-800/60')
                                  : (isGs 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                      : 'bg-blue-50 text-blue-700 border-blue-200')
                              }`}>
                                {module.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Sleek, high-contrast action pill button 'Open Reader ➔' (or 'View Test ➔') */}
                        <div className="shrink-0 pl-1">
                          <button
                            id={`btn-open-reader-${module.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (navigator.vibrate) navigator.vibrate(15);
                              onSelectModule(module);
                            }}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
                              isDarkMode 
                                ? 'bg-[#10B981] hover:bg-emerald-400 text-slate-950 shadow-[0_2px_12px_rgba(16,185,129,0.3)]' 
                                : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                            }`}
                          >
                            <span>{isTest ? 'View Test' : 'Open Reader'}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
