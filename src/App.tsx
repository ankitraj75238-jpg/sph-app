/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TabType, StudyModule } from './types';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AndroidFrame } from './components/AndroidFrame';
import { WebViewContainer } from './components/WebViewContainer';
import { BooksPracticeSection } from './components/BooksPracticeSection';
import { InteractiveModuleViewer } from './components/InteractiveModuleViewer';
import { SplashScreen } from './components/SplashScreen';
import { ForceUpdateModal } from './components/ForceUpdateModal';
import { recordAppOpen, recordTabVisit, recordModuleRead } from './utils/telemetry';
import { checkAppVersionLock, CURRENT_APP_VERSION, VersionCheckResult } from './utils/versionLock';

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

  // Initialize private anonymous telemetry & check remote version lock on mount
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

  // Back Button Navigation handler
  const canGoBack = activeModule !== null || tabHistory.length > 1;

  const handleBack = useCallback(() => {
    if (activeModule) {
      setActiveModule(null);
      return;
    }

    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // remove current
      const previousTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setCurrentTab(previousTab);
    }
  }, [activeModule, tabHistory]);

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

      {/* Luxury Animated Cold Launch Splash Screen */}
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
              ease: [0.32, 0.72, 0, 1] 
            }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
          >
            <SplashScreen 
              durationMs={2200}
              onFinish={() => setShowSplash(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AndroidFrame
        isPhoneFrame={false}
        onBackPress={handleBack}
        canGoBack={canGoBack}
        currentTab={currentTab}
      >
        {/* Top Application Bar - Clean Production branding for Books & Practice tab */}
        {currentTab === 'books_practice' && (
          <TopBar
            currentTab={currentTab}
            canGoBack={canGoBack}
            onBack={handleBack}
            onRefresh={handleGlobalRefresh}
            isRefreshing={isRefreshing}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            activeModuleTitle={activeModule?.title}
          />
        )}

        {/* Main Viewport Content Area with Porcelain White Background */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8FAFC] m-0 p-0">
          
          {/* Tab 1: AnkitPrep High-performance Android WebView (100% Fullscreen Viewport) */}
          {currentTab === 'ankitprep' && (
            <WebViewContainer
              key={`ankitprep-${refreshKey}`}
              url="https://ankitprep.silentpreparationhub.workers.dev/"
              title="AnkitPrep"
              subtitle="Portal 1"
              isOnline={isOnline}
              onRefreshTrigger={() => setIsRefreshing(false)}
              tabKey="ankitprep"
            />
          )}

          {/* Tab 2: Pareeksha Kendra High-performance Android WebView (100% Fullscreen Viewport) */}
          {currentTab === 'pareeksha' && (
            <WebViewContainer
              key={`pareeksha-${refreshKey}`}
              url="https://pareekshakendra.pareekshakendraankit.workers.dev/"
              title="Pareeksha Kendra"
              subtitle="Portal 2"
              isOnline={isOnline}
              onRefreshTrigger={() => setIsRefreshing(false)}
              tabKey="pareeksha"
            />
          )}

          {/* Tab 3: Books & Practice (बुक्स & प्रैक्टिस) Dedicated Educational Section */}
          {currentTab === 'books_practice' && (
            <BooksPracticeSection
              key={`books-${refreshKey}`}
              onSelectModule={handleSelectModule}
              onModulesCountChange={(count) => setDynamicModulesCount(count)}
            />
          )}

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
