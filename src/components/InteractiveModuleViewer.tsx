import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  RotateCcw, 
  Check, 
  Zap, 
  Layers, 
  Award,
  BookOpen,
  CheckCircle2, 
  XCircle,
  Flame,
  Sun,
  Moon,
  ExternalLink,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { StudyModule } from '../types';
import { LoadingFlowerSpinner } from './LoadingFlowerSpinner';
import { logFirebaseCustomEvent } from '../lib/firebase';

interface InteractiveModuleViewerProps {
  module: StudyModule;
  onClose: () => void;
}

export const InteractiveModuleViewer: React.FC<InteractiveModuleViewerProps> = ({
  module,
  onClose
}) => {
  // Resolve item URL cleanly (with fallback support)
  const itemUrl = module.url || module.link || module.pdfUrl;
  const hasExternalUrl = Boolean(itemUrl);
  const hasHtmlContent = Boolean(module.htmlContent || module.rawHtmlContent);
  const hasQuestions = Boolean(module.practiceQuestions && module.practiceQuestions.length > 0);
  const hasVocab = Boolean(module.vocabItems && module.vocabItems.length > 0);
  const hasOneLiners = Boolean(module.oneLiners && module.oneLiners.length > 0);

  // Default to 'web_reader' whenever a URL is present
  const [viewMode, setViewMode] = useState<'web_reader' | 'reader' | 'quiz' | 'flashcards'>(
    hasExternalUrl ? 'web_reader' : hasQuestions ? 'quiz' : 'reader'
  );
  
  // Iframe states
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isIframeError, setIsIframeError] = useState<boolean>(false);

  // Search & Reader states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubSet, setSelectedSubSet] = useState<number>(1);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Quiz Mode state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; incorrect: number; unattempted: number }>({ correct: 0, incorrect: 0, unattempted: 0 });

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Android Hardware Back Gesture and Keyboard Escape support
  useEffect(() => {
    // Push dummy state to capture back button gesture
    window.history.pushState({ modal: 'sph_reader' }, '');

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Reset loading state on URL/Key change
  useEffect(() => {
    setIsIframeLoading(true);
    setIsIframeError(false);
    
    // Safety timer to prevent perpetual loading screen
    const timer = setTimeout(() => {
      setIsIframeLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [itemUrl, iframeKey]);

  // Filter items
  const filteredVocab = (module.vocabItems || []).filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.word.toLowerCase().includes(term) ||
      (item.hindiMeaning && item.hindiMeaning.toLowerCase().includes(term)) ||
      (item.englishMeaning && item.englishMeaning.toLowerCase().includes(term))
    );
  });

  const filteredOneLiners = (module.oneLiners || []).filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.statementEn.toLowerCase().includes(term) ||
      item.statementHi.toLowerCase().includes(term) ||
      (item.topic && item.topic.toLowerCase().includes(term))
    );
  });

  const questions = module.practiceQuestions || [];

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (navigator.vibrate) navigator.vibrate(20);
  };

  // Text-To-Speech for English words and sentences
  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Quiz Option Selection
  const handleSelectOption = (qId: string, optionIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
    if (navigator.vibrate) navigator.vibrate(25);
  };

  // Handle Quiz Submission
  const handleSubmitQuiz = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setQuizScore({ correct, incorrect, unattempted });
    setIsQuizSubmitted(true);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);

    logFirebaseCustomEvent('quiz_submitted', {
      module_id: module.id,
      module_title: module.title,
      score_correct: correct,
      score_incorrect: incorrect,
      score_unattempted: unattempted,
      total_questions: questions.length,
      accuracy_percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0,
    });
  };

  // Reset Quiz
  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore({ correct: 0, incorrect: 0, unattempted: 0 });
  };

  // Reload iframe
  const handleReloadIframe = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setIsIframeLoading(true);
    setIsIframeError(false);
    setIframeKey((prev) => prev + 1);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#FBF0D9] text-[#433422]';
      case 'dark':
        return 'bg-[#0F172A] text-slate-100';
      case 'light':
      default:
        return 'bg-[#F8FAFC] text-slate-900';
    }
  };

  const getCardThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#F4E4C1] border-[#E2CE9F] text-[#433422] shadow-sm';
      case 'dark':
        return 'bg-[#1E293B] border-slate-800 text-slate-100 shadow-md';
      case 'light':
      default:
        return 'bg-white border-slate-200 text-slate-900 shadow-sm';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      case 'md':
      default:
        return 'text-sm';
    }
  };

  const rawHtml = module.htmlContent || module.rawHtmlContent;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col antialiased select-none overflow-hidden ${getThemeClass()} transition-colors duration-200`}>
      
      {/* Top Header Bar with Safe-Area Inset Padding */}
      <header 
        className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 pb-2.5 flex items-center justify-between gap-3 shrink-0 shadow-sm z-30"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)' }}
      >
        
        {/* Left: Rounded Back Button, Subject Tag & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="reader-back-btn"
            onClick={onClose}
            className="p-2.5 -ml-1 text-slate-800 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-all active:scale-90 border border-slate-200 shrink-0 shadow-2xs"
            title="Back to Hub"
            aria-label="Back to Books & Practice"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600 stroke-[2.5]" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                {module.category || 'Study Module'}
              </span>
              {module.badge && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 hidden sm:inline">
                  {module.badge}
                </span>
              )}
            </div>
            <h2 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate mt-0.5 leading-snug">
              {module.title}
            </h2>
          </div>
        </div>

        {/* Right Controls: Reload & External */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {hasExternalUrl && viewMode === 'web_reader' && (
            <button
              onClick={handleReloadIframe}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-2xs"
              title="Reload Page"
              aria-label="Reload"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 ${isIframeLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

          {itemUrl && (
            <a
              href={itemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-2xs hidden sm:flex items-center gap-1"
              title="Open in Browser"
              aria-label="Open in external browser"
            >
              <ExternalLink className="w-4 h-4 text-slate-700" />
            </a>
          )}

          {viewMode === 'reader' && (
            <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 gap-1">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'}`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sub-Mode Tabs (if extra quiz or notes available) */}
      {((hasQuestions && hasExternalUrl) || (hasVocab && hasExternalUrl) || (hasQuestions && hasHtmlContent)) && (
        <div className="bg-slate-50 border-b border-slate-200 px-3.5 sm:px-6 py-1.5 flex items-center justify-between gap-2 shrink-0 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {hasExternalUrl && (
              <button
                id="tab-interactive-html-mode"
                onClick={() => setViewMode('web_reader')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'web_reader'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Interactive Reader</span>
              </button>
            )}

            {(hasHtmlContent || hasVocab || hasOneLiners) && (
              <button
                id="tab-notes-reader-mode"
                onClick={() => setViewMode('reader')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'reader'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Study Notes</span>
              </button>
            )}

            {questions.length > 0 && (
              <button
                id="tab-practice-quiz-mode"
                onClick={() => setViewMode('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'quiz'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Practice Drill ({questions.length} Qs)</span>
              </button>
            )}

            {module.vocabItems && module.vocabItems.length > 0 && (
              <button
                id="tab-vocab-flashcards-mode"
                onClick={() => setViewMode('flashcards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'flashcards'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Flashcards</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Full-Screen Viewport Content */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col bg-white">

        {/* ================= 1. FULL-SCREEN INTERACTIVE HTML / WEB READER ================= */}
        {viewMode === 'web_reader' && itemUrl && (
          <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col bg-white">
            
            {/* Smooth Glowing Floral / Orbital Loading Spinner Overlay */}
            {isIframeLoading && !isIframeError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center animate-fade-in pointer-events-none">
                <LoadingFlowerSpinner 
                  message="तैयारी शुरू हो रही है..." 
                  subMessage={module.title}
                />
              </div>
            )}

            {/* Offline / Error Fallback */}
            {isIframeError && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
                  <WifiOff className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Unable to Load Book Resource
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mb-4 leading-relaxed">
                  Please verify your network connection or try reopening the study module.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReloadIframe}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Loading</span>
                  </button>
                </div>
              </div>
            )}

            {/* Edge-to-Edge 100% Fullscreen Iframe */}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={itemUrl}
              title={module.title}
              onLoad={() => {
                setIsIframeLoading(false);
                setIsIframeError(false);
              }}
              onError={() => {
                setIsIframeLoading(false);
                setIsIframeError(true);
              }}
              className="w-full h-full flex-1 border-0 bg-white m-0 p-0 block"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-top-navigation-by-user-activation"
            />
          </div>
        )}

        {/* ================= 2. FORMATTED STUDY NOTES / HTML VIEWER ================= */}
        {viewMode === 'reader' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-5">
              
              {/* Module Header Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">
                    {module.authorOrCurator || 'Silent Preparation Hub'}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {module.titleHindi || module.title}
                  </h3>
                  {module.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {module.description}
                    </p>
                  )}
                </div>

                {(module.itemsCount || module.totalItemsCount || module.readTimeEstimate) && (
                  <div className="flex items-center gap-2.5 shrink-0">
                    {(module.itemsCount || module.totalItemsCount) && (
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total</span>
                        <span className="text-xs font-black text-blue-600 font-mono">
                          {module.itemsCount || `${module.totalItemsCount} Items`}
                        </span>
                      </div>
                    )}
                    {module.readTimeEstimate && (
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Time</span>
                        <span className="text-xs font-black text-slate-700 font-mono">
                          {module.readTimeEstimate}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Direct HTML Content Render */}
              {rawHtml && (
                <div 
                  className={`${getCardThemeClass()} border rounded-3xl p-5 sm:p-8 shadow-sm leading-relaxed prose prose-slate max-w-none ${getFontSizeClass()}`}
                  dangerouslySetInnerHTML={{ __html: rawHtml }}
                />
              )}

              {/* Master Sets Selector if subSets exist */}
              {module.subSetsCount && module.subSetsCount > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Select Master Set (1 to {module.subSetsCount})</span>
                    </h4>
                    <span className="text-[11px] font-bold text-blue-600">
                      Active: Set 0{selectedSubSet}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                    {Array.from({ length: Math.min(module.subSetsCount, 31) }, (_, i) => i + 1).map((setNum) => (
                      <button
                        key={setNum}
                        onClick={() => setSelectedSubSet(setNum)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                          selectedSubSet === setNum
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                        }`}
                      >
                        Set 0{setNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* List of Vocabulary / Idioms Items */}
              {module.vocabItems && module.vocabItems.length > 0 && (
                <div className="space-y-3">
                  {filteredVocab.map((item, idx) => {
                    const isBookmarked = bookmarkedIds.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`${getCardThemeClass()} border rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:border-blue-400 group`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-2.5 py-1 bg-slate-100 text-blue-600 font-black text-xs rounded-lg border border-slate-200 font-mono">
                              #{idx + 1}
                            </span>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                              {item.word}
                            </h4>
                            {item.examTag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.examTag}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => speakText(item.id, `${item.word}. Meaning: ${item.englishMeaning}`)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                speakingId === item.id 
                                  ? 'bg-blue-600 text-white border-blue-600 animate-pulse' 
                                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                              }`}
                              title="Listen Pronunciation"
                            >
                              <Volume2 className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            <button
                              onClick={() => toggleBookmark(item.id)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isBookmarked 
                                  ? 'bg-amber-50 text-amber-600 border-amber-300' 
                                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                              }`}
                              title={isBookmarked ? 'Bookmarked' : 'Bookmark this item'}
                            >
                              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {item.hindiMeaning && (
                          <div className="bg-amber-50/70 p-2.5 sm:p-3 rounded-xl border border-amber-200/80 mb-3">
                            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-0.5">
                              हिन्दी अर्थ (Hindi Meaning)
                            </span>
                            <p className="text-sm sm:text-base font-bold text-amber-950">
                              {item.hindiMeaning}
                            </p>
                          </div>
                        )}

                        <div className={`space-y-1.5 ${getFontSizeClass()}`}>
                          {item.englishMeaning && (
                            <p className="text-slate-700 font-medium leading-relaxed">
                              <strong className="text-slate-900 font-bold">English Meaning: </strong>
                              {item.englishMeaning}
                            </p>
                          )}

                          {item.exampleSentence && (
                            <p className="text-slate-600 leading-relaxed italic bg-slate-50 p-2 rounded-lg border-l-2 border-blue-500">
                              <strong className="text-blue-600 not-italic font-bold">Example: </strong>
                              "{item.exampleSentence}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List of GK One-Liners Items */}
              {module.oneLiners && module.oneLiners.length > 0 && (
                <div className="space-y-3">
                  {filteredOneLiners.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`${getCardThemeClass()} border rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 text-blue-600 font-black text-xs rounded-lg border border-slate-200 font-mono">
                            #{idx + 1}
                          </span>
                          {item.category && (
                            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {item.category} {item.topic ? `• ${item.topic}` : ''}
                            </span>
                          )}
                        </div>
                        {item.examAppearance && (
                          <span className="text-[10px] font-bold text-slate-500">
                            {item.examAppearance}
                          </span>
                        )}
                      </div>

                      {item.statementHi && (
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {item.statementHi}
                        </p>
                      )}

                      {item.statementEn && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-l-2 border-slate-300 pl-3">
                          {item.statementEn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= 3. INTERACTIVE PRACTICE DRILL ================= */}
        {viewMode === 'quiz' && questions.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
              
              {/* Quiz Header Stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Interactive Practice Drill
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instant scoring and detailed solution explanations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
                    {Object.keys(selectedAnswers).length} / {questions.length} Solved
                  </span>
                  {isQuizSubmitted && (
                    <button
                      onClick={handleResetQuiz}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-200"
                      title="Retake Quiz"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scorecard Banner if Submitted */}
              {isQuizSubmitted && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-500 rounded-2xl p-5 sm:p-6 shadow-sm animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
                          Quiz Completed!
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                        Your Score: {quizScore.correct} / {questions.length}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Accuracy: {Math.round((quizScore.correct / Math.max(quizScore.correct + quizScore.incorrect, 1)) * 100)}%
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100/70 border border-emerald-300 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] font-black text-emerald-800 uppercase block">Correct</span>
                        <span className="text-base font-black text-emerald-700 font-mono">+{quizScore.correct}</span>
                      </div>
                      <div className="bg-rose-100/70 border border-rose-300 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] font-black text-rose-800 uppercase block">Incorrect</span>
                        <span className="text-base font-black text-rose-700 font-mono">-{quizScore.incorrect}</span>
                      </div>
                      <div className="bg-slate-100 border border-slate-300 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase block">Skipped</span>
                        <span className="text-base font-black text-slate-700 font-mono">{quizScore.unattempted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isAnswered = userAns !== undefined;
                  const isCorrect = isAnswered && userAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 text-blue-600 font-black text-xs rounded-lg border border-slate-200 font-mono">
                            Q0{idx + 1}
                          </span>
                          {q.examTag && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {q.examTag}
                            </span>
                          )}
                        </div>

                        {isQuizSubmitted && (
                          <div className="flex items-center gap-1.5">
                            {isCorrect ? (
                              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                              </span>
                            ) : isAnswered ? (
                              <span className="text-xs font-black text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <XCircle className="w-3.5 h-3.5" /> Incorrect
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                Skipped
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {q.question}
                        </p>
                        {q.questionHi && (
                          <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            {q.questionHi}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          const isOptionCorrect = optIdx === q.correctAnswer;

                          let optionStyles = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300';

                          if (isQuizSubmitted) {
                            if (isOptionCorrect) {
                              optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                            } else if (isSelected && !isCorrect) {
                              optionStyles = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                            } else {
                              optionStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                            }
                          } else if (isSelected) {
                            optionStyles = 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isQuizSubmitted}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optionStyles}`}
                            >
                              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5 text-slate-700">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <div className="flex-1">
                                <span>{opt}</span>
                                {q.optionsHi && q.optionsHi[optIdx] && (
                                  <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">
                                    {q.optionsHi[optIdx]}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {isQuizSubmitted && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs animate-fade-in">
                          <span className="font-black text-blue-600 uppercase tracking-wider block">
                            Explanation & Key Rule:
                          </span>
                          <p className="text-slate-700 font-medium">
                            {q.explanation}
                          </p>
                          {q.explanationHi && (
                            <p className="text-slate-500 font-normal mt-1">
                              {q.explanationHi}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isQuizSubmitted && (
                <div className="pt-2">
                  <button
                    onClick={handleSubmitQuiz}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-sm tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Submit & View Solutions</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= 4. FLASHCARDS DRILL ================= */}
        {viewMode === 'flashcards' && module.vocabItems && module.vocabItems.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono font-bold text-blue-600">
                  Card {currentFlashcardIndex + 1} of {module.vocabItems.length}
                </span>
                <span className="font-medium">
                  Tap card to flip between English & Hindi
                </span>
              </div>

              {module.vocabItems[currentFlashcardIndex] && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-6 sm:p-10 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all shadow-sm text-center group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 font-black uppercase tracking-widest">
                    <span>{isFlipped ? 'Answer & Meaning' : 'Front (Word / Idiom)'}</span>
                    <span className="text-blue-600">Flip ↺</span>
                  </div>

                  <div className="py-6 space-y-3">
                    {!isFlipped ? (
                      <>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {module.vocabItems[currentFlashcardIndex].word}
                        </h3>
                        {module.vocabItems[currentFlashcardIndex].examTag && (
                          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {module.vocabItems[currentFlashcardIndex].examTag}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-xl sm:text-2xl font-black text-amber-700">
                          {module.vocabItems[currentFlashcardIndex].hindiMeaning}
                        </p>
                        <p className="text-sm sm:text-base text-slate-700 font-medium max-w-lg mx-auto">
                          {module.vocabItems[currentFlashcardIndex].englishMeaning}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex justify-center items-center text-xs text-slate-400 font-bold">
                    <span>Click anywhere on card to flip</span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  disabled={currentFlashcardIndex === 0}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-sm"
                >
                  ← Previous
                </button>
                <button
                  disabled={currentFlashcardIndex === module.vocabItems.length - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIndex((prev) => Math.min(module.vocabItems!.length - 1, prev + 1));
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-40 shadow-sm"
                >
                  Next Card →
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
