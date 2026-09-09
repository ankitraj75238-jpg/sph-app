/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { PushNotifications } from '@capacitor/push-notifications';
import { TabType, StudyModule } from './types';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AndroidFrame } from './components/AndroidFrame';
import { WebViewContainer } from './components/WebViewContainer';
import { BooksPracticeSection } from './components/BooksPracticeSection';
import { InteractiveModuleViewer } from './components/InteractiveModuleViewer';
import { SplashScreen } from './components/SplashScreen';
import { ForceUpdateModal } from './components/ForceUpdateModal';
import { ExitToast } from './components/ExitToast';
import { recordAppOpen, recordTabVisit, recordModuleRead } from './utils/telemetry';
import { checkAppVersionLock, CURRENT_APP_VERSION, VersionCheckResult } from './utils/versionLock';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('ankitprep');
  const [tabHistory, setTabHistory] = useState<TabType[]>(['ankitprep']);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine ?? true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sph_theme_mode') === 'dark';
    } catch {
      return false;
    }
  });
  const [activeModule, setActiveModule] = useState<StudyModule | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [dynamicModulesCount, setDynamicModulesCount] = useState<number>(1);
  const [versionLock, setVersionLock] = useState<VersionCheckResult | null>(null);
  const [showExitToast, setShowExitToast] = useState<boolean>(false);

  // Sync dark class on documentElement and persist theme mode
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sph_theme_mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sph_theme_mode', 'light');
      }
    } catch {
      // Safe fallback
    }
  }, [isDarkMode]);

  // Synchronized state refs to prevent stale closure in async native Capacitor & hardware listeners
  const activeModuleRef = useRef<StudyModule | null>(activeModule);
  const currentTabRef = useRef<TabType>(currentTab);
  const tabHistoryRef = useRef<TabType[]>(tabHistory);
  const lastBackPressRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const booksBackHandlerRef = useRef<(() => boolean) | null>(null);
  const versionLockRef = useRef<VersionCheckResult | null>(versionLock);

  useEffect(() => {
    versionLockRef.current = versionLock;
  }, [versionLock]);

  useEffect(() => {
    activeModuleRef.current = activeModule;
  }, [activeModule]);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    tabHistoryRef.current = tabHistory;
  }, [tabHistory]);

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
  const handleTabChange = useCallback((newTab: TabType) => {
    if (newTab === currentTabRef.current) return;
    recordTabVisit(newTab);
    setTabHistory((prev) => [...prev, newTab]);
    setCurrentTab(newTab);
  }, []);

  // Safe Native Push Notification Lifecycle
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const listenerRemovers: Array<() => void> = [];

    const initializeNativePush = async () => {
      try {
        await PushNotifications.createChannel({
          id: 'sph_alerts',
          name: 'SPH Live Exam Alerts',
          description: 'Real-time mock tests, books, and study updates',
          importance: 5,
          visibility: 1,
          sound: 'default',
          vibration: true,
          lights: true,
          lightColor: '#10B981'
        });

        const perm = await PushNotifications.requestPermissions();
        if (perm.receive === 'granted') {
          await PushNotifications.register();
        }

        const regHandle = await PushNotifications.addListener('registration', (token) => {
          console.log('[SPH Push] FCM Registration Token:', token.value);
        });
        listenerRemovers.push(() => { regHandle.remove(); });

        const errHandle = await PushNotifications.addListener('registrationError', (error: any) => {
          console.warn('[SPH Push] FCM Registration Error:', error);
        });
        listenerRemovers.push(() => { errHandle.remove(); });

        const recvHandle = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('[SPH Push] Push Notification Received:', notification);
        });
        listenerRemovers.push(() => { recvHandle.remove(); });

        const actionHandle = await PushNotifications.addListener('pushNotificationActionPerformed', (notificationAction) => {
          try {
            const data = notificationAction?.notification?.data;
            if (data?.tab && (data.tab === 'ankitprep' || data.tab === 'pareeksha' || data.tab === 'books_practice')) {
              handleTabChange(data.tab as TabType);
            }
          } catch (actionErr) {
            console.warn('[SPH Push] Error handling notification action:', actionErr);
          }
        });
        listenerRemovers.push(() => { actionHandle.remove(); });
      } catch (err) {
        console.warn('[SPH Push] Push notification lifecycle handled non-fatal exception:', err);
      }
    };

    initializeNativePush();

    return () => {
      listenerRemovers.forEach((remover) => {
        try {
          remover();
        } catch {}
      });
    };
  }, [handleTabChange]);

  const handleSelectModule = (module: StudyModule) => {
    recordModuleRead(module.id, module.title, {
      subject: module.category || module.subject,
      category: module.category,
      badge: module.badge,
      url: module.url,
    });
    setActiveModule(module);
  };

  // Back navigation handling
  const handleDeepBackNavigation = useCallback(() => {
    if (versionLockRef.current && versionLockRef.current.isUpdateRequired) {
      return;
    }

    if (activeModuleRef.current) {
      setActiveModule(null);
      return;
    }

    if (currentTabRef.current === 'books_practice' && booksBackHandlerRef.current) {
      const handled = booksBackHandlerRef.current();
      if (handled) {
        return;
      }
    }

    const activeIframe = document.querySelector<HTMLIFrameElement>(`#webview-${currentTabRef.current}`);
    if (activeIframe && activeIframe.contentWindow) {
      try {
        activeIframe.contentWindow.postMessage({ type: 'SPH_NAV_BACK' }, '*');
      } catch {}
    }

    if (currentTabRef.current !== 'ankitprep') {
      setCurrentTab('ankitprep');
      setTabHistory(['ankitprep']);
      return;
    }

    const now = Date.now();
    const timeDiff = now - lastBackPressRef.current;

    if (timeDiff < 2000) {
      try {
        CapacitorApp.exitApp();
      } catch {}
    } else {
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

  useEffect(() => {
    let backListenerHandle: { remove: () => Promise<void> | void } | null = null;

    try {
      CapacitorApp.addListener('backButton', () => {
        handleDeepBackNavigation();
      }).then((handle) => {
        backListenerHandle = handle;
      }).catch(() => {});
    } catch {}

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

  const canGoBack = activeModule !== null || currentTab !== 'ankitprep';

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
          announcement={versionLock.announcement}
        />
      )}

      {/* Floating Double-Tap Exit Confirmation Toast */}
      <AnimatePresence>
        {showExitToast && (
          <ExitToast message="ऐप से बाहर निकलने के लिए दोबारा बैक दबाएं" />
        )}
      </AnimatePresence>

      {/* Animated Splash Screen */}
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
              durationMs={1800}
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

        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0B1120] m-0 p-0">
          
          {/* Tab 1: AnkitPrep */}
          <div 
            id="tab-pane-ankitprep"
            className={`w-full h-full flex-1 flex flex-col absolute inset-0 hw-accelerate ${
              currentTab === 'ankitprep' 
                ? 'visible z-10 opacity-100' 
                : 'invisible -z-10 opacity-0 pointer-events-none'
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

          {/* Tab 2: Pareeksha Kendra */}
          <div 
            id="tab-pane-pareeksha"
            className={`w-full h-full flex-1 flex flex-col absolute inset-0 hw-accelerate ${
              currentTab === 'pareeksha' 
                ? 'visible z-10 opacity-100' 
                : 'invisible -z-10 opacity-0 pointer-events-none'
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

          {/* Tab 3: Books & Practice */}
          <div 
            id="tab-pane-books-practice"
            className={`w-full h-full flex-1 flex flex-col absolute inset-0 overflow-y-auto hw-accelerate theme-crossfade ${
              isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'
            } ${
              currentTab === 'books_practice' 
                ? 'visible z-10 opacity-100' 
                : 'invisible -z-10 opacity-0 pointer-events-none'
            }`}
          >
            <BooksPracticeSection
              key={`books-${refreshKey}`}
              onSelectModule={handleSelectModule}
              onModulesCountChange={(count) => setDynamicModulesCount(count)}
              onRegisterBackHandler={(handler) => { booksBackHandlerRef.current = handler; }}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Interactive HTML Viewer Modal */}
          {activeModule && (
            <InteractiveModuleViewer
              module={activeModule}
              onClose={() => setActiveModule(null)}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          modulesCount={dynamicModulesCount}
        />
      </AndroidFrame>
    </>
  );
}
