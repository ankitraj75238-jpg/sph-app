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
  Moon
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
  // Tabs inside viewer: 'reader' | 'quiz' | 'flashcards'
  const [viewMode, setViewMode] = useState<'reader' | 'quiz' | 'flashcards'>('reader');
  
  // Search within module
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubSet, setSelectedSubSet] = useState<number>(1);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'black'>('dark');
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
      item.hindiMeaning.toLowerCase().includes(term) ||
      item.englishMeaning.toLowerCase().includes(term)
    );
  });

  const filteredOneLiners = (module.oneLiners || []).filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.statementEn.toLowerCase().includes(term) ||
      item.statementHi.toLowerCase().includes(term) ||
      item.topic.toLowerCase().includes(term)
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
        return 'bg-[#2A2318] text-[#F3EAD9]';
      case 'black':
        return 'bg-black text-slate-200';
      case 'dark':
      default:
        return 'bg-[#0F172A] text-slate-200';
    }
  };

  const getCardThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#382F22] border-[#524431] text-[#F3EAD9]';
      case 'black':
        return 'bg-[#111111] border-neutral-800 text-slate-200';
      case 'dark':
      default:
        return 'bg-[#1E293B] border-slate-800 text-slate-200';
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

  return (
    <div className={`fixed inset-0 z-50 flex flex-col antialiased select-none overflow-hidden ${getThemeClass()}`}>
      
      {/* Top Header Bar */}
      <header className="bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-800 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 shadow-md">
        
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="reader-back-btn"
            onClick={onClose}
            className="p-2 -ml-1 text-slate-300 hover:text-[#10B981] hover:bg-slate-800 rounded-xl transition-all active:scale-95 border border-slate-700/50 shrink-0"
            title="Back to Books & Practice"
          >
            <ArrowLeft className="w-5 h-5 text-[#10B981] stroke-[2.5]" />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                {module.category}
              </span>
              {module.badge && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hidden sm:inline">
                  {module.badge}
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
              {module.title}
            </h2>
          </div>
        </div>

        {/* Right Controls: View Mode Switcher, Font & Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700/60 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-[#10B981] text-[#0F172A]' : 'text-slate-400'}`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'sepia' ? 'bg-[#10B981] text-[#0F172A]' : 'text-slate-400'}`}
              title="Sepia Reading Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Resizer */}
          <button
            onClick={() => setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'sm')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/60 text-xs font-black uppercase tracking-wider"
            title="Cycle Font Size"
          >
            A{fontSize === 'sm' ? '↓' : fontSize === 'lg' ? '↑' : ''}
          </button>
        </div>
      </header>

      {/* Sub-Header Navigation Tabs: Reader Mode vs Interactive Quiz vs Flashcards */}
      <div className="bg-[#1E293B]/70 border-b border-slate-800 px-3.5 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-reader-mode"
            onClick={() => setViewMode('reader')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              viewMode === 'reader'
                ? 'bg-[#10B981] text-[#0F172A] border-[#10B981] shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Digital Book Reader</span>
          </button>

          {questions.length > 0 && (
            <button
              id="tab-quiz-mode"
              onClick={() => setViewMode('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                viewMode === 'quiz'
                  ? 'bg-[#10B981] text-[#0F172A] border-[#10B981] shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
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
                  ? 'bg-[#10B981] text-[#0F172A] border-[#10B981] shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:border-[#10B981] outline-none"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4">

          {/* ================= VIEW MODE 1: DIGITAL BOOK READER ================= */}
          {viewMode === 'reader' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Module Info Banner */}
              <div className="bg-[#1E293B] border-2 border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">
                      {module.authorOrCurator}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {module.titleHindi || module.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {module.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-[#0F172A] px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Total</span>
                    <span className="text-sm font-black text-[#10B981] font-mono">{module.totalItemsCount}+ Items</span>
                  </div>
                  <div className="bg-[#0F172A] px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Read Time</span>
                    <span className="text-sm font-black text-slate-300 font-mono">{module.readTimeEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Master Sets Selector if 31 sets exist */}
              {module.subSetsCount && module.subSetsCount > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Select Master Set (1 to {module.subSetsCount})</span>
                    </h4>
                    <span className="text-[11px] font-bold text-[#10B981]">
                      Active: Set 0{selectedSubSet}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                    {Array.from({ length: Math.min(module.subSetsCount, 15) }, (_, i) => i + 1).map((setNum) => (
                      <button
                        key={setNum}
                        onClick={() => setSelectedSubSet(setNum)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                          selectedSubSet === setNum
                            ? 'bg-[#10B981] text-[#0F172A] border-[#10B981] shadow-md'
                            : 'bg-[#1E293B] text-slate-400 hover:text-white border-slate-800'
                        }`}
                      >
                        Set 0{setNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* List of Vocabulary / Idioms Items */}
              {module.vocabItems && (
                <div className="space-y-3">
                  {filteredVocab.map((item, idx) => {
                    const isBookmarked = bookmarkedIds.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`${getCardThemeClass()} border-2 rounded-2xl p-4 sm:p-5 shadow-md transition-all hover:border-[#10B981]/70 group`}
                      >
                        {/* Top Line: Index, Word, Exam Tag, TTS & Bookmark */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-2.5 py-1 bg-slate-800 text-[#10B981] font-black text-xs rounded-lg border border-slate-700 font-mono">
                              #{idx + 1}
                            </span>
                            <h4 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-[#10B981] transition-colors">
                              {item.word}
                            </h4>
                            {item.examTag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                                  ? 'bg-[#10B981] text-[#0F172A] border-[#10B981] animate-pulse' 
                                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
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
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                              }`}
                              title={isBookmarked ? 'Bookmarked' : 'Bookmark this item'}
                            >
                              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Hindi Meaning */}
                        <div className="bg-[#0F172A]/80 p-2.5 sm:p-3 rounded-xl border border-slate-800/90 mb-3">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block mb-0.5">
                            हिन्दी अर्थ (Hindi Meaning)
                          </span>
                          <p className="text-sm sm:text-base font-bold text-amber-200">
                            {item.hindiMeaning}
                          </p>
                        </div>

                        {/* English Meaning & Usage */}
                        <div className={`space-y-1.5 ${getFontSizeClass()}`}>
                          <p className="text-slate-300 font-medium leading-relaxed">
                            <strong className="text-white font-bold">English Meaning: </strong>
                            {item.englishMeaning}
                          </p>

                          {item.exampleSentence && (
                            <p className="text-slate-400 leading-relaxed italic bg-slate-900/40 p-2 rounded-lg border-l-2 border-[#10B981]">
                              <strong className="text-[#10B981] not-italic font-bold">Example: </strong>
                              "{item.exampleSentence}"
                            </p>
                          )}

                          {item.originOrHint && (
                            <p className="text-xs text-slate-400 leading-relaxed pt-1">
                              <strong className="text-teal-400">Trick / Mnemonic: </strong>
                              {item.originOrHint}
                            </p>
                          )}

                          {item.synonyms && item.synonyms.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                              <span className="font-bold text-slate-400">Synonyms:</span>
                              {item.synonyms.map((s, sIdx) => (
                                <span key={sIdx} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
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
              {module.oneLiners && (
                <div className="space-y-3">
                  {filteredOneLiners.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`${getCardThemeClass()} border-2 rounded-2xl p-4 sm:p-5 shadow-md space-y-2.5`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-800 text-[#10B981] font-black text-xs rounded-lg border border-slate-700 font-mono">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                            {item.category} • {item.topic}
                          </span>
                        </div>
                        {item.examAppearance && (
                          <span className="text-[10px] font-bold text-slate-400">
                            {item.examAppearance}
                          </span>
                        )}
                      </div>

                      {/* Hindi Statement */}
                      <p className="text-sm sm:text-base font-bold text-white leading-snug">
                        {item.statementHi}
                      </p>

                      {/* English Statement */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal border-l-2 border-slate-700 pl-3">
                        {item.statementEn}
                      </p>

                      {item.highlightKey && (
                        <div className="bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-[#10B981]">
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
          {viewMode === 'quiz' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Quiz Header Stats */}
              <div className="bg-[#1E293B] border-2 border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-lg">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Interactive Practice Drill
                  </h3>
                  <p className="text-xs text-slate-400">
                    Test your mastery on {module.title} with instant feedback.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#10B981] bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
                    {Object.keys(selectedAnswers).length} / {questions.length} Solved
                  </span>
                  {isQuizSubmitted && (
                    <button
                      onClick={handleResetQuiz}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700"
                      title="Retake Quiz"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scorecard Banner if Submitted */}
              {isQuizSubmitted && (
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#1E293B] border-2 border-[#10B981] rounded-2xl p-5 sm:p-6 shadow-xl animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                          Quiz Completed!
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">
                        Your Score: {quizScore.correct} / {questions.length}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Accuracy: {Math.round((quizScore.correct / Math.max(quizScore.correct + quizScore.incorrect, 1)) * 100)}%
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] font-black text-emerald-400 uppercase block">Correct</span>
                        <span className="text-base font-black text-emerald-300 font-mono">+{quizScore.correct}</span>
                      </div>
                      <div className="bg-rose-500/20 border border-rose-500/30 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] font-black text-rose-400 uppercase block">Incorrect</span>
                        <span className="text-base font-black text-rose-300 font-mono">-{quizScore.incorrect}</span>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Skipped</span>
                        <span className="text-base font-black text-slate-300 font-mono">{quizScore.unattempted}</span>
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
                      className="bg-[#1E293B] border-2 border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-4"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-800 text-[#10B981] font-black text-xs rounded-lg border border-slate-700 font-mono">
                            Q0{idx + 1}
                          </span>
                          {q.examTag && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {q.examTag}
                            </span>
                          )}
                        </div>

                        {isQuizSubmitted && (
                          <div className="flex items-center gap-1.5">
                            {isCorrect ? (
                              <span className="text-xs font-black text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                              </span>
                            ) : isAnswered ? (
                              <span className="text-xs font-black text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                <XCircle className="w-3.5 h-3.5" /> Incorrect
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                Skipped
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1">
                        <p className="text-sm sm:text-base font-black text-white leading-snug">
                          {q.question}
                        </p>
                        {q.questionHi && (
                          <p className="text-xs sm:text-sm text-slate-400 font-medium">
                            {q.questionHi}
                          </p>
                        )}
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          const isOptionCorrect = optIdx === q.correctAnswer;

                          let optionStyles = 'bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700';

                          if (isQuizSubmitted) {
                            if (isOptionCorrect) {
                              optionStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            } else if (isSelected && !isCorrect) {
                              optionStyles = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                            } else {
                              optionStyles = 'bg-[#0F172A] border-slate-800 text-slate-500 opacity-60';
                            }
                          } else if (isSelected) {
                            optionStyles = 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] font-bold shadow-md';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isQuizSubmitted}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optionStyles}`}
                            >
                              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <div className="flex-1">
                                <span>{opt}</span>
                                {q.optionsHi && q.optionsHi[optIdx] && (
                                  <span className="block text-[11px] text-slate-400 mt-0.5 font-normal">
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
                        <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs animate-fade-in">
                          <span className="font-black text-[#10B981] uppercase tracking-wider block">
                            Explanation & Key Rule:
                          </span>
                          <p className="text-slate-300 font-medium">
                            {q.explanation}
                          </p>
                          {q.explanationHi && (
                            <p className="text-slate-400 font-normal mt-1">
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
                    className="w-full py-4 bg-[#10B981] hover:opacity-95 text-[#0F172A] font-black uppercase text-sm tracking-wider rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Submit & View Solutions</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ================= VIEW MODE 3: FLASHCARDS DRILL ================= */}
          {viewMode === 'flashcards' && module.vocabItems && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Top Controls */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono font-bold text-[#10B981]">
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
                  className="bg-[#1E293B] border-2 border-slate-800 hover:border-[#10B981] rounded-3xl p-6 sm:p-10 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all shadow-xl text-center group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center text-xs text-slate-500 font-black uppercase tracking-widest">
                    <span>{isFlipped ? 'Answer & Meaning' : 'Front (Word / Idiom)'}</span>
                    <span className="text-[#10B981]">Flip ↺</span>
                  </div>

                  <div className="py-6 space-y-3">
                    {!isFlipped ? (
                      <>
                        <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#10B981] transition-colors">
                          {module.vocabItems[currentFlashcardIndex].word}
                        </h3>
                        {module.vocabItems[currentFlashcardIndex].examTag && (
                          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {module.vocabItems[currentFlashcardIndex].examTag}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-xl sm:text-2xl font-black text-amber-400">
                          {module.vocabItems[currentFlashcardIndex].hindiMeaning}
                        </p>
                        <p className="text-sm sm:text-base text-slate-200 font-medium max-w-lg mx-auto">
                          {module.vocabItems[currentFlashcardIndex].englishMeaning}
                        </p>
                        {module.vocabItems[currentFlashcardIndex].exampleSentence && (
                          <p className="text-xs text-slate-400 italic mt-2">
                            "{module.vocabItems[currentFlashcardIndex].exampleSentence}"
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500">
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
                  className="px-4 py-2.5 bg-[#1E293B] hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-black rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 text-xs uppercase"
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
                  className="px-4 py-2.5 bg-[#10B981] hover:opacity-95 text-[#0F172A] font-black rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5"
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
                  className="px-4 py-2.5 bg-[#1E293B] hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-black rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 text-xs uppercase"
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
