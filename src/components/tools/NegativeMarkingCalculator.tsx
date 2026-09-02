import React, { useState } from 'react';
import { Calculator, CheckCircle, XCircle, AlertTriangle, RefreshCw, Trophy, Sparkles } from 'lucide-react';

export const NegativeMarkingCalculator: React.FC = () => {
  const [examPreset, setExamPreset] = useState<'ssc' | 'railway' | 'police' | 'custom'>('ssc');
  const [totalQuestions, setTotalQuestions] = useState<number>(100);
  const [marksPerCorrect, setMarksPerCorrect] = useState<number>(2);
  const [penaltyPerWrong, setPenaltyPerWrong] = useState<number>(0.5); // 1/4th of 2
  const [correctCount, setCorrectCount] = useState<number>(76);
  const [wrongCount, setWrongCount] = useState<number>(14);

  const handlePresetChange = (preset: 'ssc' | 'railway' | 'police' | 'custom') => {
    setExamPreset(preset);
    if (preset === 'ssc') {
      setTotalQuestions(100);
      setMarksPerCorrect(2);
      setPenaltyPerWrong(0.5); // 1/4th penalty
      setCorrectCount(76);
      setWrongCount(14);
    } else if (preset === 'railway') {
      setTotalQuestions(100);
      setMarksPerCorrect(1);
      setPenaltyPerWrong(0.33); // 1/3rd penalty
      setCorrectCount(72);
      setWrongCount(18);
    } else if (preset === 'police') {
      setTotalQuestions(150);
      setMarksPerCorrect(2);
      setPenaltyPerWrong(0.5); // 0.5 penalty
      setCorrectCount(110);
      setWrongCount(22);
    }
  };

  const attemptedCount = correctCount + wrongCount;
  const unattemptedCount = Math.max(0, totalQuestions - attemptedCount);
  const positiveMarksTotal = correctCount * marksPerCorrect;
  const negativeMarksTotal = wrongCount * penaltyPerWrong;
  const netScore = Math.max(0, positiveMarksTotal - negativeMarksTotal);
  const maxPossibleMarks = totalQuestions * marksPerCorrect;
  const percentageScore = maxPossibleMarks > 0 ? ((netScore / maxPossibleMarks) * 100).toFixed(2) : '0';
  const accuracyPercentage = attemptedCount > 0 ? ((correctCount / attemptedCount) * 100).toFixed(1) : '0';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Negative Marking Score Calculator</h3>
            <p className="text-xs text-slate-400">Calculate net raw marks with precision penalties (1/3, 1/4)</p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => handlePresetChange('ssc')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              examPreset === 'ssc' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SSC
          </button>
          <button
            onClick={() => handlePresetChange('railway')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              examPreset === 'railway' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            RRB
          </button>
          <button
            onClick={() => handlePresetChange('police')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              examPreset === 'police' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Police
          </button>
          <button
            onClick={() => setExamPreset('custom')}
            className={`px-2 py-1 rounded-lg transition-all ${
              examPreset === 'custom' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Input Sliders & Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Correct Answers */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Correct Answers (+{marksPerCorrect} each)
            </span>
            <span className="text-sm font-bold font-mono text-emerald-300">{correctCount}</span>
          </div>
          <input
            type="range"
            min="0"
            max={totalQuestions}
            value={correctCount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCorrectCount(val);
              if (val + wrongCount > totalQuestions) {
                setWrongCount(totalQuestions - val);
              }
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0</span>
            <span>{totalQuestions / 2}</span>
            <span>{totalQuestions}</span>
          </div>
        </div>

        {/* Wrong Answers */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Incorrect / Negative (-{penaltyPerWrong} each)
            </span>
            <span className="text-sm font-bold font-mono text-rose-300">{wrongCount}</span>
          </div>
          <input
            type="range"
            min="0"
            max={totalQuestions - correctCount}
            value={wrongCount}
            onChange={(e) => setWrongCount(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0</span>
            <span>Penalty: -{negativeMarksTotal.toFixed(2)}</span>
            <span>Max {totalQuestions - correctCount}</span>
          </div>
        </div>
      </div>

      {/* Custom Parameters toggle */}
      {examPreset === 'custom' && (
        <div className="grid grid-cols-3 gap-2.5 mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Total Questions</label>
            <input
              type="number"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Marks / Correct</label>
            <input
              type="number"
              step="0.5"
              value={marksPerCorrect}
              onChange={(e) => setMarksPerCorrect(Math.max(0.1, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Penalty / Wrong</label>
            <input
              type="number"
              step="0.05"
              value={penaltyPerWrong}
              onChange={(e) => setPenaltyPerWrong(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
            />
          </div>
        </div>
      )}

      {/* Results Summary Bento */}
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-4 rounded-xl border border-slate-800/90 shadow-inner">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Net Raw Score</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
              {netScore.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block">/ {maxPossibleMarks}</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Accuracy Rate</span>
            <span className={`text-xl sm:text-2xl font-extrabold font-mono ${
              Number(accuracyPercentage) >= 80 ? 'text-emerald-400' : Number(accuracyPercentage) >= 65 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {accuracyPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block">{correctCount} of {attemptedCount}</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Negative Loss</span>
            <span className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono">
              -{negativeMarksTotal.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block">{wrongCount} mistakes</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total % Marks</span>
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
              {percentageScore}%
            </span>
            <span className="text-[10px] text-slate-500 block">{unattemptedCount} Unattempted</span>
          </div>
        </div>

        {/* Insight Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300">
          <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {Number(accuracyPercentage) >= 85
              ? 'Excellent accuracy! Your negative mark deduction is well within the top 1% topper zone.'
              : Number(accuracyPercentage) >= 70
              ? 'Good score, but aim to reduce blind guesses to protect your normalized rank.'
              : 'Caution: High negative deductions are reducing your overall rank. Focus on question selection.'}
          </span>
        </div>
      </div>
    </div>
  );
};
