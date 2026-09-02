import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Maximize2, 
  AlertTriangle,
  Lock,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { NoInternetScreen } from './NoInternetScreen';

interface WebViewContainerProps {
  url: string;
  title: string;
  subtitle: string;
  isOnline: boolean;
  onRefreshTrigger?: () => void;
  tabKey: string;
  onCanGoBackChange?: (canGoBack: boolean) => void;
}

export const WebViewContainer: React.FC<WebViewContainerProps> = ({
  url,
  title,
  subtitle,
  isOnline,
  onRefreshTrigger,
  tabKey,
  onCanGoBackChange
}) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [currentIframeUrl, setCurrentIframeUrl] = useState<string>(url);
  const [historyStack, setHistoryStack] = useState<string[]>([url]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [iframeBlockedNotice, setIframeBlockedNotice] = useState<boolean>(false);

  // Pull to refresh state
  const [pullStartY, setPullStartY] = useState<number>(0);
  const [pullMoveY, setPullMoveY] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshingPull, setIsRefreshingPull] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Simulate Android WebChromeClient onProgressChanged & V8 acceleration
  const startLoadingSimulation = () => {
    setIsLoading(true);
    setLoadingProgress(20);
    setIframeBlockedNotice(false);

    const timer1 = setTimeout(() => setLoadingProgress(60), 120);
    const timer2 = setTimeout(() => setLoadingProgress(90), 380);
    const timer3 = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 750);

    const blockedCheckTimer = setTimeout(() => {
      setIframeBlockedNotice(true);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(blockedCheckTimer);
    };
  };

  useEffect(() => {
    const cleanup = startLoadingSimulation();
    return cleanup;
  }, [url, iframeKey, tabKey]);

  useEffect(() => {
    if (onCanGoBackChange) {
      onCanGoBackChange(historyIndex > 0);
    }
  }, [historyIndex, onCanGoBackChange]);

  const handleManualReload = () => {
    if (navigator.vibrate) navigator.vibrate(25);
    setIframeKey((prev) => prev + 1);
    if (onRefreshTrigger) onRefreshTrigger();
    startLoadingSimulation();
  };

  const handleOpenExternal = () => {
    window.open(currentIframeUrl, '_blank', 'noopener,noreferrer');
  };

  // In-app Back Navigation
  const handleGoBackInternal = () => {
    if (historyIndex > 0) {
      const prevUrl = historyStack[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      setCurrentIframeUrl(prevUrl);
      setIframeKey((prev) => prev + 1);
      if (navigator.vibrate) navigator.vibrate(20);
    }
  };

  // Pull-to-refresh touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 5) {
      setPullStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshingPull) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY;
    if (distance > 0 && containerRef.current && containerRef.current.scrollTop <= 5) {
      const pullDist = Math.min(distance * 0.45, 90);
      setPullMoveY(pullDist);
    } else {
      setPullMoveY(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullMoveY >= 50 && !isRefreshingPull) {
      setIsRefreshingPull(true);
      if (navigator.vibrate) navigator.vibrate(40);
      handleManualReload();
      setTimeout(() => {
        setIsRefreshingPull(false);
        setPullMoveY(0);
        setIsPulling(false);
      }, 900);
    } else {
      setPullMoveY(0);
      setIsPulling(false);
    }
  };

  if (!isOnline) {
    return (
      <NoInternetScreen
        onRetry={handleManualReload}
        isRetrying={isLoading}
        targetUrl={url}
        errorMessage={`Cannot connect to ${title}. Please check your internet connection.`}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 flex flex-col bg-[#0F172A] relative overflow-hidden select-none"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Pull-To-Refresh Top Indicator */}
      {(pullMoveY > 0 || isRefreshingPull) && (
        <div 
          className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-150"
          style={{ height: `${Math.max(pullMoveY, isRefreshingPull ? 55 : 0)}px` }}
        >
          <div className="bg-[#1E293B]/95 border-2 border-[#10B981]/50 text-[#10B981] px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <RefreshCw className={`w-3.5 h-3.5 ${pullMoveY >= 50 || isRefreshingPull ? 'animate-spin text-emerald-300' : ''}`} />
            <span>{isRefreshingPull ? 'Refreshing portal...' : pullMoveY >= 50 ? 'Release to refresh' : 'Pull down to refresh'}</span>
          </div>
        </div>
      )}

      {/* Android WebView Linear Progress Bar */}
      {isLoading && (
        <div className="w-full h-1 bg-slate-900 z-30 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#10B981] via-teal-400 to-emerald-300 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* Mini WebView Address & Navigation Bar */}
      <div className="bg-[#1E293B] border-b-2 border-slate-800 px-3.5 py-2 flex items-center justify-between text-xs text-slate-300 z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          {historyIndex > 0 && (
            <button
              onClick={handleGoBackInternal}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[#10B981] transition-all"
              title="Go Back in WebView History"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}

          <Lock className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          <span className="font-mono text-xs font-bold text-slate-200 truncate">
            {currentIframeUrl.replace(/^https?:\/\//, '')}
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 uppercase tracking-wider shrink-0 hidden sm:inline">
            JS + DOM Storage
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleManualReload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[#10B981] transition-colors border border-slate-700/60"
            title="Reload WebView"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#10B981]' : ''}`} />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
            title="Open in Pure Browser Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main WebView Frame */}
      <div className="flex-1 relative w-full h-full bg-[#0F172A] overflow-hidden">
        <iframe
          ref={iframeRef}
          key={`${tabKey}-${iframeKey}`}
          id={`webview-${tabKey}`}
          src={currentIframeUrl}
          title={title}
          className="w-full h-full border-0 bg-[#0F172A] relative z-10"
          // Fully enabled JavaScript, DOM Storage, Forms, Popups, Modals, Cache for exam platforms
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-top-navigation-by-user-activation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => {
            setLoadingProgress(100);
            setIsLoading(false);
          }}
          onError={() => {
            setIsLoading(false);
            setIframeBlockedNotice(true);
          }}
        />

        {/* Action helper banner if server response or frame rules take effect */}
        {iframeBlockedNotice && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#1E293B]/95 border-2 border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-200 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#10B981] shrink-0">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                  <span>{title} High-Speed Portal</span>
                  <span className="text-[10px] text-[#10B981] bg-[#0F172A] px-2 py-0.5 rounded border border-slate-700">SPH Dedicated</span>
                </div>
                <p className="text-xs text-slate-400 leading-tight mt-0.5">
                  Interact freely inside this WebView or launch in direct full window for fullscreen mock exams.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleManualReload}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>
              <button
                onClick={handleOpenExternal}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#10B981] hover:opacity-95 text-xs font-black uppercase text-[#0F172A] flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full View</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
