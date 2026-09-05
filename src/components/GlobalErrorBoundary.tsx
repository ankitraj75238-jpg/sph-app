import React, { Component, ErrorInfo, ReactNode } from 'react';
import { globalErrorBus } from '../utils/errorLogger';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  errorStack?: string;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  public componentDidMount() {
    globalErrorBus.init();
  }


  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected runtime error occurred',
      errorStack: error?.stack,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    globalErrorBus.addLog({
      type: 'error',
      message: `[React Boundary] ${error?.message}`,
      stack: `${error?.stack}\nComponent Stack: ${errorInfo.componentStack}`,
      source: 'GlobalErrorBoundary',
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '', errorStack: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0B1120] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 shadow-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-black text-white tracking-tight mb-2">
            Safe Recovery Mode Active
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
            A runtime exception was intercepted by the Crash-Proof Error Boundary. The Android application has been kept alive safely.
          </p>

          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-left font-mono text-[11px] mb-6 overflow-x-auto shadow-inner max-h-48 text-rose-300">
            <div className="flex items-center gap-2 text-slate-400 font-sans font-bold text-[10px] uppercase tracking-wider mb-2 pb-1 border-b border-slate-800">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span>Captured Exception</span>
            </div>
            <div className="font-bold text-rose-400">{this.state.errorMessage}</div>
            {this.state.errorStack && (
              <pre className="mt-2 text-[10px] text-slate-400 whitespace-pre-wrap opacity-80 overflow-x-auto">
                {this.state.errorStack}
              </pre>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
            >
              Resume App
            </button>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Fresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
