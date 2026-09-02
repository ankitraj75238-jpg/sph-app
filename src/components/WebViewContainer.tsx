import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  Zap, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { NoInternetScreen } from './NoInternetScreen';

interface WebViewContainerProps {
  url: string;
  title: string;
  subtitle: string;
  isOnline: boolean;
  onRefreshTrigger?: () => void;
  tabKey: string;
}

export const WebViewContainer: React.FC<WebViewContainerProps> = ({
  url,
  title,
  subtitle,
  isOnline,
  onRefreshTrigger,
  tabKey,
}) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [currentIframeUrl, setCurrentIframeUrl] = useState<string>(url);
  const [iframeBlockedNotice, setIframeBlockedNotice] = useState<boolean>(false);
  const [showFloatingControls, setShowFloatingControls] = useState<boolean>(false);

  // Pull to refresh state
  const [pullStartY, setPullStartY] = useState<number>(0);
  const [pullMoveY, setPullMoveY] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshingPull, setIsRefreshingPull] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // High-performance loading simulation
  const startLoadingSimulation = () => {
    setIsLoading(true);
    setLoadingProgress(25);
    setIframeBlockedNotice(false);

    const timer1 = setTimeout(() => setLoadingProgress(65), 150);
    const timer2 = setTimeout(() => setLoadingProgress(92), 380);
    const timer3 = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 700);

    const blockedCheckTimer = setTimeout(() => {
      setIframeBlockedNotice(true);
    }, 5000);

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

  const handleManualReload = () => {
    if (navigator.vibrate) navigator.vibrate(25);
    setIframeKey((prev) => prev + 1);
    if (onRefreshTrigger) onRefreshTrigger();
    startLoadingSimulation();
  };

  const handleOpenExternal = () => {
    window.open(currentIframeUrl, '_blank', 'noopener,noreferrer');
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
      className="w-full h-full flex-1 flex flex-col bg-[#0F172A] relative overflow-hidden select-none m-0 p-0"
      style={{ height: 'calc(100vh - 65px)' }}
    >
      {/* Pull-To-Refresh Top Indicator */}
      {(pullMoveY > 0 || isRefreshingPull) && (
        <div 
          className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-150"
          style={{ height: `${Math.max(pullMoveY, isRefreshingPull ? 55 : 0)}px` }}
        >
          <div className="bg-[#1E293B]/95 border-2 border-[#10B981]/50 text-[#10B981] px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <RefreshCw className={`w-3.5 h-3.5 ${pullMoveY >= 50 || isRefreshingPull ? 'animate-spin text-emerald-300' : ''}`} />
            <span>{isRefreshingPull ? 'Refreshing portal...' : pullMoveY >= 50 ? 'Release to refresh' : 'Pull down to refresh'}</span>
          </div>
        </div>
      )}

      {/* Edge-to-Edge Linear Progress Bar at Top Pixel */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900/60 z-40 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#10B981] via-teal-400 to-emerald-300 transition-all duration-300 ease-out shadow-[0_0_10px_#10B981]"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* 100% Fullscreen WebView Frame without redundant header */}
      <div className="w-full h-full flex-1 relative bg-[#0F172A] overflow-hidden m-0 p-0">
        <iframe
          ref={iframeRef}
          key={`${tabKey}-${iframeKey}`}
          id={`webview-${tabKey}`}
          src={currentIframeUrl}
          title={title}
          className="w-full h-full min-h-full border-0 block bg-[#0F172A] relative z-10 m-0 p-0"
          style={{ width: '100%', height: '100%', border: 0 }}
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

        {/* Discreet Floating Quick Actions Button */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-[#1E293B]/80 hover:bg-[#1E293B] backdrop-blur-md border border-slate-700/80 rounded-full p-1 shadow-2xl transition-all opacity-80 hover:opacity-100">
          <button
            onClick={handleManualReload}
            className="p-2 rounded-full text-slate-400 hover:text-[#10B981] hover:bg-slate-800 transition-colors"
            title="Reload Portal"
            aria-label="Reload"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#10B981]' : ''}`} />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open in Pure Full Browser Window"
            aria-label="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action helper banner if server connection or frame rules take effect */}
        {iframeBlockedNotice && (
          <div className="absolute bottom-14 left-3 right-3 z-30 bg-[#1E293B]/95 border-2 border-slate-700 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-200 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#10B981] shrink-0">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                  <span>{title} High-Speed Portal</span>
                  <span className="text-[9px] text-[#10B981] bg-[#0F172A] px-1.5 py-0.5 rounded border border-slate-700">Live</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  Interact freely inside this fullscreen view or launch full window.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleManualReload}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload</span>
              </button>
              <button
                onClick={handleOpenExternal}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#10B981] hover:opacity-95 text-xs font-black uppercase text-[#0F172A] flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Full Window</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
