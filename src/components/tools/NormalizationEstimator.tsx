import React, { useState } from 'react';
import { TrendingUp, HelpCircle, Activity, ArrowRight, Award } from 'lucide-react';

export const NormalizationEstimator: React.FC = () => {
  const [candidateRawScore, setCandidateRawScore] = useState<number>(142.5);
  const [shiftMean, setShiftMean] = useState<number>(118.0);
  const [baseShiftMean, setBaseShiftMean] = useState<number>(126.0);
  const [shiftTopAvg, setShiftTopAvg] = useState<number>(172.0);
  const [allTopAvg, setAllTopAvg] = useState<number>(184.0);

  // SSC / Railway standard normalization formula:
  // Normalized Score = ((M_tg - M_qg) / (M_ti - M_iq)) * (M_ij - M_iq) + M_qg
  // Where:
  // M_tg = Average marks of top 0.1% candidates across all shifts
  // M_qg = Sum of mean and std dev across all shifts (base mean)
  // M_ti = Average marks of top 0.1% in candidate's shift
  // M_iq = Mean marks in candidate's shift
  // M_ij = Candidate's raw marks

  const numerator = Math.max(1, allTopAvg - baseShiftMean);
  const denominator = Math.max(1, shiftTopAvg - shiftMean);
  const shiftDiff = candidateRawScore - shiftMean;
  const normalizedScore = (numerator / denominator) * shiftDiff + baseShiftMean;
  const scoreShiftDelta = normalizedScore - candidateRawScore;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">SSC & Railway Normalization Estimator</h3>
          <p className="text-xs text-slate-400">Multi-shift percentile standard deviation model</p>
        </div>
      </div>

      {/* Input Variables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">
            Your Shift Raw Score (M_ij)
          </label>
          <input
            type="number"
            step="0.5"
            value={candidateRawScore}
            onChange={(e) => setCandidateRawScore(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 outline-none"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">Your actual score from response key</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">
            Your Shift Average Marks (M_iq)
          </label>
          <input
            type="number"
            step="0.5"
            value={shiftMean}
            onChange={(e) => setShiftMean(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 outline-none"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">Lower average indicates a tougher shift</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">
            Top 0.1% Average in Your Shift (M_ti)
          </label>
          <input
            type="number"
            step="0.5"
            value={shiftTopAvg}
            onChange={(e) => setShiftTopAvg(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 outline-none"
          />
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">
            Overall Top 0.1% Mean Across All Shifts (M_tg)
          </label>
          <input
            type="number"
            step="0.5"
            value={allTopAvg}
            onChange={(e) => setAllTopAvg(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 outline-none"
          />
        </div>
      </div>

      {/* Output Panel */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-cyan-500/30 shadow-lg mb-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Estimated Normalized Score
            </span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-black text-cyan-400 font-mono">
                {normalizedScore.toFixed(3)}
              </span>
              <span className="text-xs font-bold text-slate-400">marks</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Shift Impact</span>
              <span className={`text-sm font-bold font-mono ${scoreShiftDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scoreShiftDelta >= 0 ? `+${scoreShiftDelta.toFixed(2)}` : scoreShiftDelta.toFixed(2)} pts
              </span>
            </div>
            <Award className="w-6 h-6 text-cyan-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Short Explainer Note */}
      <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
        <span className="font-semibold text-slate-300">💡 Exam Commission Principle:</span> In hard shifts (lower shift mean), candidates receive positive normalization boost to equalize difficulty with easier shifts.
      </div>
    </div>
  );
};
