import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { NoInternetScreen } from './NoInternetScreen';
import { LoadingFlowerSpinner } from './LoadingFlowerSpinner';

interface WebViewContainerProps {
  url: string;
  title: string;
  subtitle: string;
  isOnline: boolean;
  onRefreshTrigger?: () => void;
  tabKey: string;
  isActive?: boolean;
}

export const WebViewContainer: React.FC<WebViewContainerProps> = ({
  url,
  title,
  subtitle,
  isOnline,
  onRefreshTrigger,
  tabKey,
  isActive = true,
}) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const hasLoadedRef = useRef<boolean>(false);

  // Pull to refresh gesture support
  const [pullStartY, setPullStartY] = useState<number>(0);
  const [pullMoveY, setPullMoveY] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshingPull, setIsRefreshingPull] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Background Preloading & Safety Timeout
  useEffect(() => {
    // If already loaded in background, instantly bypass loader
    if (hasLoadedRef.current) {
      setIsIframeLoaded(true);
      setIsOverlayVisible(false);
      return;
    }

    // Safety fallback: if iframe onload is absorbed by cross-origin security, gracefully reveal page
    const timer = setTimeout(() => {
      hasLoadedRef.current = true;
      setIsIframeLoaded(true);
      setTimeout(() => {
        setIsOverlayVisible(false);
      }, 400);
    }, 10000);

    return () => clearTimeout(timer);
  }, [iframeKey]);

  const handleIframeComplete = () => {
    hasLoadedRef.current = true;
    setIsIframeLoaded(true);
    // Smooth 0.4s fade-out transition before removing overlay
    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 420);
  };

  const handleManualReload = () => {
    if (navigator.vibrate) navigator.vibrate(25);
    hasLoadedRef.current = false;
    setIsIframeLoaded(false);
    setIsOverlayVisible(true);
    setIframeKey((prev) => prev + 1);
    if (onRefreshTrigger) onRefreshTrigger();
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
      }, 800);
    } else {
      setPullMoveY(0);
      setIsPulling(false);
    }
  };

  if (!isOnline) {
    return (
      <NoInternetScreen
        onRetry={handleManualReload}
        isRetrying={!isIframeLoaded}
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
      className="w-full h-full flex-1 flex flex-col bg-[#0B1120] relative overflow-hidden select-none m-0 p-0 hw-accelerate"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 40px)',
      }}
    >
      {/* Pull-To-Refresh Top Indicator */}
      {(pullMoveY > 0 || isRefreshingPull) && (
        <div 
          className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-150"
          style={{ height: `${Math.max(pullMoveY, isRefreshingPull ? 48 : 0)}px` }}
        >
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 text-emerald-400 px-3.5 py-1 rounded-full shadow-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <RefreshCw className={`w-3.5 h-3.5 ${pullMoveY >= 45 || isRefreshingPull ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isRefreshingPull ? 'Refreshing portal...' : pullMoveY >= 45 ? 'Release to refresh' : 'Pull down to refresh'}</span>
          </div>
        </div>
      )}

      {/* Matching Solid Dark/Slate Loader Overlay (Zero White Screen Flash) */}
      {isOverlayVisible && (
        <div 
          className={`absolute inset-0 z-30 flex items-center justify-center bg-[#0B1120] transition-opacity duration-400 ease-out select-none ${
            isIframeLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
        >
          <LoadingFlowerSpinner 
            message="तैयारी शुरू हो रही है..." 
            subMessage={`${title} • High Speed Engine`}
            darkTheme={true}
          />
        </div>
      )}

      {/* 100% Fullscreen WebView Frame with Matching Dark Background (Zero White Flash) */}
      <div className="w-full h-full flex-1 relative bg-[#0B1120] overflow-hidden m-0 p-0">
        <iframe
          ref={iframeRef}
          key={`${tabKey}-${iframeKey}`}
          id={`webview-${tabKey}`}
          src={url}
          title={title}
          loading="eager"
          className="w-full h-full min-h-full border-0 block bg-[#0B1120] relative z-10 m-0 p-0"
          style={{ width: '100%', height: '100%', border: 0 }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-top-navigation-by-user-activation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeComplete}
          onError={handleIframeComplete}
        />
      </div>
    </div>
  );
};
