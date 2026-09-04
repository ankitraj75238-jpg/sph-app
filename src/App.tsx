/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { TabType, StudyModule, AnnouncementConfig } from './types';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AndroidFrame } from './components/AndroidFrame';
import { WebViewContainer } from './components/WebViewContainer';
import { BooksPracticeSection } from './components/BooksPracticeSection';
import { InteractiveModuleViewer } from './components/InteractiveModuleViewer';
import { SplashScreen } from './components/SplashScreen';
import { ForceUpdateModal } from './components/ForceUpdateModal';
import { AnnouncementModal } from './components/AnnouncementModal';
import { ExitToast } from './components/ExitToast';
import { recordAppOpen, recordTabVisit, recordModuleRead } from './utils/telemetry';
import { checkAppVersionLock, CURRENT_APP_VERSION, VersionCheckResult } from './utils/versionLock';
import { checkAppAnnouncement } from './utils/announcement';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('ankitprep');
  const [tabHistory, setTabHistory] = useState<TabType[]>(['ankitprep']);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine ?? true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<StudyModule | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [dynamicModulesCount, setDynamicModulesCount] = useState<number>(1);
  const [versionLock, setVersionLock] = useState<VersionCheckResult | null>(null);
  const [showExitToast, setShowExitToast] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<AnnouncementConfig | null>(null);

  // Synchronized state refs to prevent stale closure in async native Capacitor & hardware listeners
  const activeModuleRef = useRef<StudyModule | null>(activeModule);
  const currentTabRef = useRef<TabType>(currentTab);
  const tabHistoryRef = useRef<TabType[]>(tabHistory);
  const announcementRef = useRef<AnnouncementConfig | null>(announcement);
  const lastBackPressRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    activeModuleRef.current = activeModule;
  }, [activeModule]);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    tabHistoryRef.current = tabHistory;
  }, [tabHistory]);

  useEffect(() => {
    announcementRef.current = announcement;
  }, [announcement]);

  // Session-aware announcement dismissal
  const handleDismissAnnouncement = useCallback(() => {
    if (announcementRef.current) {
      try {
        const dismissedKey = `sph_announcement_dismissed_${announcementRef.current.id || announcementRef.current.title}`;
        sessionStorage.setItem(dismissedKey, 'true');
      } catch {
        // Safe fallback for environments with restricted storage
      }
    }
    setAnnouncement(null);
  }, []);

  // Initialize private anonymous telemetry, version lock check & background network pre-warming
  useEffect(() => {
    recordAppOpen();
    
    // Remote Version Lock check
    checkAppVersionLock().then((result) => {
      if (result.isUpdateRequired) {
        setVersionLock(result);
      }
    }).catch(() => {
      // Ignore network errors gracefully
    });

    // In-App Announcement check from books-data.json
    checkAppAnnouncement().then((ann) => {
      if (ann && ann.show) {
        try {
          const dismissedKey = `sph_announcement_dismissed_${ann.id || ann.title}`;
          if (sessionStorage.getItem(dismissedKey) === 'true') {
            return;
          }
        } catch {
          // Safe fallback
        }
        setAnnouncement(ann);
      }
    }).catch(() => {
      // Ignore network errors gracefully
    });

    // High-speed background pre-warming for both websites
    const portalUrls = [
      'https://ankitprep.silentpreparationhub.workers.dev/',
      'https://pareekshakendra.pareekshakendraankit.workers.dev/'
    ];
    portalUrls.forEach((url) => {
      try {
        fetch(url, { mode: 'no-cors', priority: 'high' } as RequestInit).catch(() => {});
      } catch {
        // Safe fallback
      }
    });
  }, []);

  // Sync browser online / offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle Tab Switch
  const handleTabChange = (newTab: TabType) => {
    if (newTab === currentTab) return;
    recordTabVisit(newTab);
    setTabHistory((prev) => [...prev, newTab]);
    setCurrentTab(newTab);
  };

  const handleSelectModule = (module: StudyModule) => {
    recordModuleRead(module.id, module.title, {
      subject: module.category || module.subject,
      category: module.category,
      badge: module.badge,
      url: module.url,
    });
    setActiveModule(module);
  };

  /**
   * Professional Native Back Navigation (Deep Stack Routing):
   * Condition 1: If an HTML book reader or test modal is open, smoothly close the modal.
   * Condition 2: If webview has history, send back command to active iframe.
   * Condition 3: If on 'pareeksha' or 'books_practice' tab, switch back to Tab 1 ('ankitprep' Home).
   * Condition 4: If on Tab 1 root with no open modals, prevent immediate app exit and show sleek floating toast:
   *              "ऐप से बाहर निकलने के लिए दोबारा बैक दबाएं". Double-tap within 2s triggers exitApp().
   */
  const handleDeepBackNavigation = useCallback(() => {
    // Priority Condition (In-App Announcement): Smoothly close announcement modal if open
    if (announcementRef.current) {
      handleDismissAnnouncement();
      return;
    }

    // Condition 1 (Active Modal): Close HTML reader / test modal
    if (activeModuleRef.current) {
      setActiveModule(null);
      return;
    }

    // Condition 2: If on active WebView, attempt iframe history back
    const activeIframe = document.querySelector<HTMLIFrameElement>(`#webview-${currentTabRef.current}`);
    if (activeIframe && activeIframe.contentWindow) {
      try {
        activeIframe.contentWindow.postMessage({ type: 'SPH_NAV_BACK' }, '*');
      } catch {
        // Cross-origin safe
      }
    }

    // Condition 3 (Tab Navigation): Return to Tab 1 (AnkitPrep Home)
    if (currentTabRef.current !== 'ankitprep') {
      setCurrentTab('ankitprep');
      setTabHistory(['ankitprep']);
      return;
    }

    // Condition 4 (Exit Prevention / Double-Tap to Exit) on Tab 1 Root
    const now = Date.now();
    const timeDiff = now - lastBackPressRef.current;

    if (timeDiff < 2000) {
      // User tapped back twice within 2 seconds -> Exit App
      try {
        CapacitorApp.exitApp();
      } catch {
        // Fallback for web environments
      }
    } else {
      // First back tap -> Prevent exit and display floating Hindi confirmation toast
      lastBackPressRef.current = now;
      setShowExitToast(true);

      if (navigator.vibrate) {
        navigator.vibrate(35);
      }

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = setTimeout(() => {
        setShowExitToast(false);
      }, 2000);
    }
  }, []);

  // Back Navigation listener for Capacitor Hardware / Gesture back button and Browser popstate
  useEffect(() => {
    let backListenerHandle: { remove: () => Promise<void> | void } | null = null;

    try {
      CapacitorApp.addListener('backButton', () => {
        handleDeepBackNavigation();
      }).then((handle) => {
        backListenerHandle = handle;
      }).catch(() => {
        // Safe fallback in web mode
      });
    } catch {
      // Non-native fallback
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDeepBackNavigation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (backListenerHandle?.remove) {
        backListenerHandle.remove();
      }
      window.removeEventListener('keydown', handleKeyDown);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [handleDeepBackNavigation]);

  // Back Button state for top bar
  const canGoBack = activeModule !== null || currentTab !== 'ankitprep';

  // Global Refresh Action
  const handleGlobalRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);

    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <>
      {/* Remote Version Lock Modal (Non-dismissible) */}
      {versionLock && versionLock.isUpdateRequired && (
        <ForceUpdateModal
          currentVersion={CURRENT_APP_VERSION}
          appControl={versionLock.appControl}
        />
      )}

      {/* Floating Double-Tap Exit Confirmation Toast */}
      <AnimatePresence>
        {showExitToast && (
          <ExitToast message="ऐप से बाहर निकलने के लिए दोबारा बैक दबाएं" />
        )}
      </AnimatePresence>

      {/* Dynamic In-App Announcement Pop-up Modal */}
      <AnimatePresence>
        {!showSplash && announcement && (
          <AnnouncementModal
            announcement={announcement}
            onClose={handleDismissAnnouncement}
            onNavigateTab={(tab) => {
              handleTabChange(tab);
              handleDismissAnnouncement();
            }}
          />
        )}
      </AnimatePresence>

      {/* Luxury Animated Cold Launch Splash Screen (2-second Silky Easing) */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="sph-splash-overlay"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.04,
              filter: 'blur(4px)',
            }}
            transition={{ 
              duration: 0.55, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
          >
            <SplashScreen 
              durationMs={2000}
              onFinish={() => setShowSplash(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AndroidFrame
        isPhoneFrame={false}
        onBackPress={handleDeepBackNavigation}
        canGoBack={canGoBack}
        currentTab={currentTab}
      >
        {/* Top Application Bar - Clean Production branding for Books & Practice tab */}
        {currentTab === 'books_practice' && (
          <TopBar
            currentTab={currentTab}
            canGoBack={canGoBack}
            onBack={handleDeepBackNavigation}
            onRefresh={handleGlobalRefresh}
            isRefreshing={isRefreshing}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            activeModuleTitle={activeModule?.title}
          />
        )}

        {/* Main Viewport Content Area with Porcelain White Background */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8FAFC] m-0 p-0">
          
          {/* Tab 1: AnkitPrep High-performance Android WebView (Preloaded in Background & Persisted) */}
          <div 
            className={`w-full h-full flex-1 flex flex-col absolute inset-0 transition-opacity duration-150 ${
              currentTab === 'ankitprep' 
                ? 'opacity-100 pointer-events-auto z-10' 
                : 'opacity-0 pointer-events-none -z-10 invisible'
            }`}
          >
            <WebViewContainer
              key={`ankitprep-${refreshKey}`}
              url="https://ankitprep.silentpreparationhub.workers.dev/"
              title="AnkitPrep"
              subtitle="Portal 1"
              isOnline={isOnline}
              onRefreshTrigger={() => setIsRefreshing(false)}
              tabKey="ankitprep"
              isActive={currentTab === 'ankitprep'}
            />
          </div>

          {/* Tab 2: Pareeksha Kendra High-performance Android WebView (Preloaded in Background & Persisted) */}
          <div 
            className={`w-full h-full flex-1 flex flex-col absolute inset-0 transition-opacity duration-150 ${
              currentTab === 'pareeksha' 
                ? 'opacity-100 pointer-events-auto z-10' 
                : 'opacity-0 pointer-events-none -z-10 invisible'
            }`}
          >
            <WebViewContainer
              key={`pareeksha-${refreshKey}`}
              url="https://pareekshakendra.pareekshakendraankit.workers.dev/"
              title="Pareeksha Kendra"
              subtitle="Portal 2"
              isOnline={isOnline}
              onRefreshTrigger={() => setIsRefreshing(false)}
              tabKey="pareeksha"
              isActive={currentTab === 'pareeksha'}
            />
          </div>

          {/* Tab 3: Books & Practice (बुक्स & प्रैक्टिस) Dedicated Educational Section */}
          <div 
            className={`w-full h-full flex-1 flex flex-col absolute inset-0 overflow-y-auto transition-opacity duration-150 ${
              currentTab === 'books_practice' 
                ? 'opacity-100 pointer-events-auto z-10' 
                : 'opacity-0 pointer-events-none -z-10 invisible'
            }`}
          >
            <BooksPracticeSection
              key={`books-${refreshKey}`}
              onSelectModule={handleSelectModule}
              onModulesCountChange={(count) => setDynamicModulesCount(count)}
            />
          </div>

          {/* Full-screen Interactive HTML Quiz & Reader Modal */}
          {activeModule && (
            <InteractiveModuleViewer
              module={activeModule}
              onClose={() => setActiveModule(null)}
            />
          )}
        </main>

        {/* Bottom Android Navigation Bar (Strictly 3 Tabs Only, 65px height) */}
        <BottomNavBar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          modulesCount={dynamicModulesCount}
        />
      </AndroidFrame>
    </>
  );
}
