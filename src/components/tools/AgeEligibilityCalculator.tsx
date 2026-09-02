import React, { useState } from 'react';
import { Calendar, UserCheck, Shield, CheckCircle2, XCircle } from 'lucide-react';

export const AgeEligibilityCalculator: React.FC = () => {
  const [dob, setDob] = useState<string>('2001-05-15');
  const [cutoffDate, setCutoffDate] = useState<string>('2025-01-01');
  const [category, setCategory] = useState<'UR' | 'OBC' | 'SC_ST' | 'EWS'>('UR');

  // Calculate precise age
  const birth = new Date(dob);
  const cutoff = new Date(cutoffDate);

  let years = cutoff.getFullYear() - birth.getFullYear();
  let months = cutoff.getMonth() - birth.getMonth();
  let days = cutoff.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const exactAgeYears = years + (months / 12) + (days / 365);

  const getRelaxationYears = () => {
    if (category === 'OBC') return 3;
    if (category === 'SC_ST') return 5;
    return 0; // UR / EWS
  };

  const relaxation = getRelaxationYears();

  const exams = [
    { name: 'SSC CGL (General Posts)', min: 18, max: 27 + relaxation, maxGeneral: 27 },
    { name: 'SSC CGL (Statistical / Inspector)', min: 18, max: 30 + relaxation, maxGeneral: 30 },
    { name: 'SSC CHSL (10+2 LDC/DEO)', min: 18, max: 27 + relaxation, maxGeneral: 27 },
    { name: 'SSC GD Constable', min: 18, max: 23 + relaxation, maxGeneral: 23 },
    { name: 'RRB NTPC Graduate Level', min: 18, max: 33 + relaxation + 3, maxGeneral: 33 }, // Railway 3 yr covid relaxation
    { name: 'UP Police Constable (Male/Female)', min: 18, max: 25 + relaxation + 3, maxGeneral: 25 },
    { name: 'Delhi Police Executive Constable', min: 18, max: 25 + relaxation, maxGeneral: 25 },
    { name: 'Railway Group D (Trackman/Pointsman)', min: 18, max: 33 + relaxation + 3, maxGeneral: 33 },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Govt Exam Age Eligibility Calculator</h3>
          <p className="text-xs text-slate-400">Accurate cut-off age checker with Category Age Relaxations</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">Date of Birth (DOB)</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none focus:border-purple-400 text-xs"
          />
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">Exam Cut-off Date</label>
          <input
            type="date"
            value={cutoffDate}
            onChange={(e) => setCutoffDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none focus:border-purple-400 text-xs"
          />
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">Category & Reservation</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold outline-none focus:border-purple-400 text-xs"
          >
            <option value="UR">UR (Unreserved / General)</option>
            <option value="EWS">EWS (Economically Weaker)</option>
            <option value="OBC">OBC (+3 Years Relaxation)</option>
            <option value="SC_ST">SC / ST (+5 Years Relaxation)</option>
          </select>
        </div>
      </div>

      {/* Calculated Age Ribbon */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-900 p-3.5 rounded-xl border border-purple-500/30 flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Your Age on Cut-off Date</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {years} <span className="text-xs font-normal text-slate-400">years,</span> {months} <span className="text-xs font-normal text-slate-400">months,</span> {days} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
        </div>
        {relaxation > 0 && (
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-bold border border-purple-500/30">
            +{relaxation} Yrs Benefit Applied
          </span>
        )}
      </div>

      {/* Exam Eligibility Matrix */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {exams.map((ex, idx) => {
          const isEligible = exactAgeYears >= ex.min && exactAgeYears <= ex.max;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                isEligible
                  ? 'bg-slate-950/60 border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-slate-950/30 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                {isEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-white block">{ex.name}</span>
                  <span className="text-[10px] text-slate-400">
                    Age limit: {ex.min} to {ex.max} years (Base limit: {ex.maxGeneral})
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isEligible
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {isEligible ? 'ELIGIBLE' : 'OVER-AGE / INELIGIBLE'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
