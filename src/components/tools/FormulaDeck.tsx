import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Filter } from 'lucide-react';
import { FORMULA_CARDS, FormulaCard } from '../../data/formulaData';

export const FormulaDeck: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Quant', 'Reasoning', 'Static GK', 'Short Tricks'];

  const filteredCards = FORMULA_CARDS.filter((card) => {
    const matchesCat = selectedCategory === 'All' || card.category === selectedCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.examRelevance.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (card: FormulaCard) => {
    navigator.clipboard?.writeText(`${card.title}\n\n${card.formula}\n\nExam Note: ${card.application}`);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Formulas, Short Tricks & Static GK Deck</h3>
            <p className="text-xs text-slate-400">High-yield revision cards with instant copy & search</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search formulas or rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all font-semibold ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400">
                  {card.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                  {card.examRelevance}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {card.title}
              </h4>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-300 whitespace-pre-line mb-2">
                {card.formula}
              </div>

              <p className="text-[11px] text-slate-400 italic leading-tight">
                💡 {card.application}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-900 flex justify-end">
              <button
                onClick={() => handleCopy(card)}
                className="text-[10px] font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                {copiedId === card.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Flashcard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
