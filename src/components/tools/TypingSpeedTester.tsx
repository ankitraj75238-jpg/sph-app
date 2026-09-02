import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Award, CheckCircle2, AlertCircle, Timer } from 'lucide-react';

export const TypingSpeedTester: React.FC = () => {
  const samplePassage = `Staff Selection Commission conducts the Data Entry Speed Test for qualifying candidates for postal assistant, sorting assistant, and court clerk posts. Aspirants must achieve a consistent keystroke rhythm with high typographical accuracy while maintaining strict composure during the examination window. Practice daily to conquer your exam goal.`;

  const [inputVal, setInputVal] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: any = null;
    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
    }

    setInputVal(val);

    if (val.length >= samplePassage.length) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setInputVal('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Calculations
  const wordsTyped = inputVal.trim() ? inputVal.trim().split(/\s+/).length : 0;
  const minutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0.01;
  const grossWPM = Math.round(wordsTyped / minutes);

  // Character accuracy check
  let correctChars = 0;
  for (let i = 0; i < inputVal.length; i++) {
    if (inputVal[i] === samplePassage[i]) {
      correctChars++;
    }
  }
  const accuracy = inputVal.length > 0 ? Math.round((correctChars / inputVal.length) * 100) : 100;
  const netWPM = Math.round((grossWPM * accuracy) / 100);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">SSC / Railway DEST Typing Speed Tester</h3>
            <p className="text-xs text-slate-400">Official qualifying benchmark: 30 WPM (Hindi) / 35 WPM (English)</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors"
          title="Reset Practice"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Passage */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 mb-3 text-xs leading-relaxed font-mono select-none">
        {samplePassage.split('').map((char, index) => {
          let color = 'text-slate-400';
          if (index < inputVal.length) {
            color = inputVal[index] === char ? 'text-emerald-400 bg-emerald-950/50' : 'text-rose-400 bg-rose-950/50 underline';
          }
          return (
            <span key={index} className={color}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Typing Input */}
      <textarea
        ref={inputRef}
        rows={3}
        value={inputVal}
        onChange={handleInputChange}
        placeholder="Start typing the passage above here to activate speed timer..."
        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:border-teal-400 outline-none resize-none mb-3"
      />

      {/* Realtime Speed Metrics */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Net Speed</span>
          <span className="text-lg font-bold text-teal-400 font-mono">{netWPM} <span className="text-[10px] font-normal">WPM</span></span>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Accuracy</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{accuracy}%</span>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Time Taken</span>
          <span className="text-lg font-bold text-slate-300 font-mono">{elapsedSeconds}s</span>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Exam Status</span>
          <span className={`text-xs font-bold font-mono ${netWPM >= 35 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {netWPM >= 35 ? 'QUALIFIED' : 'PRACTICE'}
          </span>
        </div>
      </div>
    </div>
  );
};
