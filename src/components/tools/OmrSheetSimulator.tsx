import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Play, RotateCcw, Check, Sparkles, Trophy, Clock } from 'lucide-react';

export const OmrSheetSimulator: React.FC = () => {
  const [totalQuestions, setTotalQuestions] = useState<number>(50); // 50 or 100
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(3600); // 60 mins
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      setShowResult(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const handleBubbleClick = (qNum: number, option: string) => {
    if (showResult) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      if (copy[qNum] === option) {
        delete copy[qNum]; // un-bubble
      } else {
        copy[qNum] = option;
      }
      return copy;
    });
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setAnswers({});
    setTimerSeconds(totalQuestions === 50 ? 1800 : 3600);
    setIsRunning(false);
    setShowResult(false);
  };

  const attemptedCount = Object.keys(answers).length;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Digital OMR Sheet Simulator</h3>
            <p className="text-xs text-slate-400">Tactile bubble responses with live exam timer & evaluator</p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-amber-300 font-mono font-bold rounded-lg text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              isRunning
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isRunning ? 'Pause' : 'Start Test'}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset OMR Sheet"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Attempted</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">{attemptedCount}</span>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Remaining</span>
          <span className="text-sm font-bold text-slate-400 font-mono">{totalQuestions - attemptedCount}</span>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Sheet Size</span>
          <select
            value={totalQuestions}
            onChange={(e) => {
              setTotalQuestions(Number(e.target.value));
              handleReset();
            }}
            className="bg-transparent text-emerald-400 font-bold outline-none cursor-pointer"
          >
            <option value="50">50 Questions</option>
            <option value="100">100 Questions</option>
          </select>
        </div>
      </div>

      {/* OMR Bubble Grid (Scrollable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-h-72 overflow-y-auto p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => {
          const selected = answers[qNum];
          return (
            <div
              key={qNum}
              className={`flex items-center justify-between p-1.5 px-2.5 rounded-lg border transition-all ${
                selected ? 'bg-slate-900 border-emerald-500/30' : 'border-slate-800/60 hover:bg-slate-900/40'
              }`}
            >
              <span className="font-mono text-xs font-bold text-slate-400 w-7">
                {qNum.toString().padStart(2, '0')}
              </span>

              <div className="flex items-center gap-2">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const isChecked = selected === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleBubbleClick(qNum, opt)}
                      className={`w-7 h-7 rounded-full text-xs font-bold font-mono transition-all flex items-center justify-center ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40 scale-105 ring-2 ring-emerald-400'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Submit */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          Click on any bubble to darken or uncheck.
        </span>
        <button
          onClick={() => {
            setIsRunning(false);
            setShowResult(true);
          }}
          disabled={attemptedCount === 0}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Submit OMR Sheet</span>
        </button>
      </div>

      {showResult && (
        <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-white block">OMR Submission Recorded!</span>
              <span className="text-slate-400 text-[11px]">
                You marked {attemptedCount} out of {totalQuestions} bubbles.
              </span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
          >
            Start New
          </button>
        </div>
      )}
    </div>
  );
};
