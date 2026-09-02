import React from 'react';
import { WifiOff, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface NoInternetScreenProps {
  onRetry: () => void;
  isRetrying: boolean;
  targetUrl?: string;
  errorMessage?: string;
}

export const NoInternetScreen: React.FC<NoInternetScreenProps> = ({
  onRetry,
  isRetrying,
  targetUrl,
  errorMessage = 'Unable to establish secure connection to exam server.'
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100 select-none animate-fade-in">
      {/* Visual Indicator */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/40">
          <WifiOff className="w-10 h-10 animate-bounce" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 rounded-full p-1.5 text-amber-400">
          <AlertCircle className="w-4 h-4" />
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-xl font-bold tracking-tight text-white mb-2">
        No Internet Connection
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
        {errorMessage} Please verify your Wi-Fi or Mobile Data connection. Your quiz progress and answers remain cached.
      </p>

      {/* Target URL Pill */}
      {targetUrl && (
        <div className="mb-6 px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono truncate max-w-xs">
          {targetUrl}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          id="retry-connection-btn"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Reconnecting...' : 'Retry Connection'}</span>
        </button>
      </div>

      {/* Diagnostic Tips */}
      <div className="mt-8 pt-6 border-t border-slate-900 w-full max-w-sm text-left">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Diagnostic Checklist:
        </span>
        <ul className="text-xs text-slate-500 space-y-1.5">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Ensure Airplane Mode is turned OFF</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Check if other tabs or apps have active internet</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Hardware acceleration & DOM storage are enabled</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
