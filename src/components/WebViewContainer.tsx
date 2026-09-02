import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
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

  // Pull to refresh gesture support
  const [pullStartY, setPullStartY] = useState<number>(0);
  const [pullMoveY, setPullMoveY] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshingPull, setIsRefreshingPull] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // High-performance loading simulation bar
  const startLoadingSimulation = () => {
    setIsLoading(true);
    setLoadingProgress(30);

    const timer1 = setTimeout(() => setLoadingProgress(70), 120);
    const timer2 = setTimeout(() => setLoadingProgress(95), 350);
    const timer3 = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
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
      const pullDist = Math.min(distance * 0.4, 75);
      setPullMoveY(pullDist);
    } else {
      setPullMoveY(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullMoveY >= 45 && !isRefreshingPull) {
      setIsRefreshingPull(true);
      if (navigator.vibrate) navigator.vibrate(40);
      handleManualReload();
      setTimeout(() => {
        setIsRefreshingPull(false);
        setPullMoveY(0);
        setIsPulling(false);
      }, 700);
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
      className="w-full h-full flex-1 flex flex-col bg-[#F8FAFC] relative overflow-hidden select-none m-0 p-0"
      style={{ height: 'calc(100vh - 65px)' }}
    >
      {/* Pull-To-Refresh Top Indicator */}
      {(pullMoveY > 0 || isRefreshingPull) && (
        <div 
          className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-150"
          style={{ height: `${Math.max(pullMoveY, isRefreshingPull ? 48 : 0)}px` }}
        >
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 text-blue-600 px-3.5 py-1 rounded-full shadow-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <RefreshCw className={`w-3.5 h-3.5 ${pullMoveY >= 45 || isRefreshingPull ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshingPull ? 'Refreshing portal...' : pullMoveY >= 45 ? 'Release to refresh' : 'Pull down to refresh'}</span>
          </div>
        </div>
      )}

      {/* Edge-to-Edge Linear Progress Bar at Top Pixel */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-40 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* 100% Fullscreen WebView Frame with No Bottom Overlays */}
      <div className="w-full h-full flex-1 relative bg-white overflow-hidden m-0 p-0">
        <iframe
          ref={iframeRef}
          key={`${tabKey}-${iframeKey}`}
          id={`webview-${tabKey}`}
          src={url}
          title={title}
          className="w-full h-full min-h-full border-0 block bg-white relative z-10 m-0 p-0"
          style={{ width: '100%', height: '100%', border: 0 }}
          // Fully enabled JavaScript, DOM Storage, Forms, Popups, Modals, Cache for exam portals
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-top-navigation-by-user-activation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => {
            setLoadingProgress(100);
            setIsLoading(false);
          }}
          onError={() => {
            setIsLoading(false);
          }}
        />
      </div>
    </div>
  );
};
