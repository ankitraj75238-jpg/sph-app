import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Share2, 
  RotateCcw, 
  Check, 
  Eye, 
  Zap, 
  Layers, 
  Award,
  ChevronRight,
  ChevronLeft,
  Settings,
  Flame,
  Sun,
  Moon,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import { StudyModule, VocabularyItem, PracticeQuestion, OneLinerItem } from '../types';

interface InteractiveModuleViewerProps {
  module: StudyModule;
  onClose: () => void;
}

export const InteractiveModuleViewer: React.FC<InteractiveModuleViewerProps> = ({
  module,
  onClose
}) => {
  // Determine available tabs
  const hasHtmlContent = Boolean(module.htmlContent || module.rawHtmlContent);
  const hasExternalUrl = Boolean(module.url || module.link || module.pdfUrl);
  const hasQuestions = Boolean(module.practiceQuestions && module.practiceQuestions.length > 0);
  const hasVocab = Boolean(module.vocabItems && module.vocabItems.length > 0);
  const hasOneLiners = Boolean(module.oneLiners && module.oneLiners.length > 0);

  // Tabs inside viewer: 'reader' | 'quiz' | 'flashcards' | 'web_reader'
  const [viewMode, setViewMode] = useState<'reader' | 'quiz' | 'flashcards' | 'web_reader'>(
    hasHtmlContent || hasVocab || hasOneLiners ? 'reader' : hasExternalUrl ? 'web_reader' : 'reader'
  );
  
  // Search within module
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubSet, setSelectedSubSet] = useState<number>(1);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Quiz Mode state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; incorrect: number; unattempted: number }>({ correct: 0, incorrect: 0, unattempted: 0 });

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCount, setMasteredCount] = useState<number>(0);

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
  };

  // Reset Quiz
  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setQuizScore({ correct: 0, incorrect: 0, unattempted: 0 });
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#FBF0D9] text-[#433422]';
      case 'dark':
        return 'bg-[#0F172A] text-slate-100';
      case 'light':
      default:
        return 'bg-[#F8FAFC] bg-porcelain-mesh text-slate-900';
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
        return 'bg-white border-slate-200 text-slate-900 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]';
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
    <div className={`fixed inset-0 z-50 flex flex-col antialiased select-none overflow-hidden ${getThemeClass()}`}>
      
      {/* Top Header Bar */}
      <header className="glass-light-header border-b border-slate-200 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 shadow-sm">
        
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="reader-back-btn"
            onClick={onClose}
            className="p-2 -ml-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95 border border-slate-200 shrink-0"
            title="Back to Books & Practice"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600 stroke-[2.5]" />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-2">
              {module.category && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {module.category}
                </span>
              )}
              {module.badge && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hidden sm:inline">
                  {module.badge}
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5">
              {module.title}
            </h2>
          </div>
        </div>

        {/* Right Controls: Font & Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1">
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

          {/* Font Resizer */}
          <button
            onClick={() => setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'sm')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider shadow-sm"
            title="Cycle Font Size"
          >
            A{fontSize === 'sm' ? '↓' : fontSize === 'lg' ? '↑' : ''}
          </button>
        </div>
      </header>

      {/* Sub-Header Navigation Tabs: Reader Mode vs Quiz vs Flashcards vs Online URL */}
      {(hasQuestions || hasVocab || (hasExternalUrl && rawHtml)) && (
        <div className="bg-white/95 border-b border-slate-200 px-3.5 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              id="tab-reader-mode"
              onClick={() => setViewMode('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                viewMode === 'reader'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Full Reader</span>
            </button>

            {hasExternalUrl && (
              <button
                id="tab-web-mode"
                onClick={() => setViewMode('web_reader')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'web_reader'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Web / PDF View</span>
              </button>
            )}

            {questions.length > 0 && (
              <button
                id="tab-quiz-mode"
                onClick={() => setViewMode('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'quiz'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Interactive Quiz ({questions.length} Qs)</span>
              </button>
            )}

            {module.vocabItems && module.vocabItems.length > 0 && (
              <button
                id="tab-flashcards-mode"
                onClick={() => setViewMode('flashcards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  viewMode === 'flashcards'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Flashcard Drill</span>
              </button>
            )}
          </div>

          {/* Search Bar in Reader Mode */}
          {viewMode === 'reader' && (
            <div className="relative w-36 sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search in book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4">

          {/* ================= VIEW MODE: WEB / PDF IFRAME ================= */}
          {viewMode === 'web_reader' && (module.url || module.link || module.pdfUrl) && (
            <div className="w-full h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 overflow-hidden relative shadow-sm">
              <iframe
                src={module.url || module.link || module.pdfUrl}
                title={module.title}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          )}

          {/* ================= VIEW MODE 1: DIGITAL BOOK / HTML READER ================= */}
          {viewMode === 'reader' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Module Info Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {module.authorOrCurator || 'Silent Preparation Hub'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {module.titleHindi || module.title}
                  </h3>
                  {module.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {module.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total</span>
                    <span className="text-sm font-black text-blue-600 font-mono">
                      {module.totalItemsCount || (module.vocabItems?.length || 10)}+ Items
                    </span>
                  </div>
                  <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Read Time</span>
                    <span className="text-sm font-black text-slate-700 font-mono">
                      {module.readTimeEstimate || '15 mins'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct HTML Content Render (Admin Provided) */}
              {rawHtml && (
                <div 
                  className={`${getCardThemeClass()} border rounded-2xl p-5 sm:p-8 shadow-sm leading-relaxed prose prose-slate max-w-none ${getFontSizeClass()}`}
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
                        {/* Top Line: Index, Word, Exam Tag, TTS & Bookmark */}
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
                            {/* Audio Listen */}
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

                            {/* Bookmark */}
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

                        {/* Hindi Meaning */}
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

                        {/* English Meaning & Usage */}
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

                          {item.originOrHint && (
                            <p className="text-xs text-slate-500 leading-relaxed pt-1">
                              <strong className="text-indigo-600">Trick / Mnemonic: </strong>
                              {item.originOrHint}
                            </p>
                          )}

                          {item.synonyms && item.synonyms.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                              <span className="font-bold text-slate-500">Synonyms:</span>
                              {item.synonyms.map((s, sIdx) => (
                                <span key={sIdx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                                  {s}
                                </span>
                              ))}
                            </div>
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

                      {/* Hindi Statement */}
                      {item.statementHi && (
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {item.statementHi}
                        </p>
                      )}

                      {/* English Statement */}
                      {item.statementEn && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-l-2 border-slate-300 pl-3">
                          {item.statementEn}
                        </p>
                      )}

                      {item.highlightKey && (
                        <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono font-bold text-emerald-600">
                          <span>KEY POINTER</span>
                          <span>{item.highlightKey}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ================= VIEW MODE 2: INTERACTIVE CBT QUIZ ================= */}
          {viewMode === 'quiz' && questions.length > 0 && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Quiz Header Stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Interactive Practice Drill
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test your mastery on {module.title} with instant evaluation.
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
                      {/* Question Header */}
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

                      {/* Question Text */}
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

                      {/* Options Grid */}
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

                      {/* Explanation if Submitted */}
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

              {/* Submit Quiz Action Button */}
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
          )}

          {/* ================= VIEW MODE 3: FLASHCARDS DRILL ================= */}
          {viewMode === 'flashcards' && module.vocabItems && module.vocabItems.length > 0 && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Top Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono font-bold text-blue-600">
                  Card {currentFlashcardIndex + 1} of {module.vocabItems.length}
                </span>
                <span className="font-medium">
                  Tap card to flip between English & Hindi
                </span>
              </div>

              {/* Flashcard Component */}
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
                        {module.vocabItems[currentFlashcardIndex].exampleSentence && (
                          <p className="text-xs text-slate-500 italic mt-2">
                            "{module.vocabItems[currentFlashcardIndex].exampleSentence}"
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Click anywhere on this card to flip
                  </div>
                </div>
              )}

              {/* Prev / Next Card Controls */}
              <div className="flex items-center justify-between gap-3">
                <button
                  disabled={currentFlashcardIndex === 0}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIndex((prev) => Math.max(prev - 1, 0));
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-black rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 text-xs uppercase shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(20);
                    setMasteredCount((prev) => prev + 1);
                    if (currentFlashcardIndex < (module.vocabItems?.length || 1) - 1) {
                      setIsFlipped(false);
                      setCurrentFlashcardIndex((prev) => prev + 1);
                    }
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Got It (+1)</span>
                </button>

                <button
                  disabled={currentFlashcardIndex >= (module.vocabItems?.length || 1) - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIndex((prev) => Math.min(prev + 1, (module.vocabItems?.length || 1) - 1));
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-black rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 text-xs uppercase shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
