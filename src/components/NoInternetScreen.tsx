import React from 'react';
import { WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NoInternetScreenProps {
  onRetry: () => void;
  isRetrying: boolean;
  errorMessage?: string;
}

export const NoInternetScreen: React.FC<NoInternetScreenProps> = ({
  onRetry,
  isRetrying,
  errorMessage = 'Unable to establish secure connection to exam server.'
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC] bg-porcelain-mesh text-slate-900 select-none animate-fade-in">
      {/* Visual Indicator */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-sm">
          <WifiOff className="w-10 h-10 animate-bounce" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 rounded-full p-1.5 text-amber-500 shadow-sm">
          <AlertCircle className="w-4 h-4" />
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1.5">
        No Internet Connection
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        {errorMessage} Please verify your Wi-Fi or Mobile Data connection. Your quiz progress and offline modules remain available.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          id="retry-connection-btn"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs sm:text-sm tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Reconnecting...' : 'Retry Connection'}</span>
        </button>
      </div>

      {/* Quick Checklist */}
      <div className="mt-8 pt-6 border-t border-slate-200 w-full max-w-sm text-left">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Diagnostic Checklist:
        </span>
        <ul className="text-xs text-slate-600 space-y-1.5">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Ensure Mobile Data or Wi-Fi is turned ON</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Turn Airplane mode ON and OFF to refresh signal</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Books & Practice modules are ready for instant reading</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
