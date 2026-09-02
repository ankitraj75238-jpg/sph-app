/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TabType, StudyModule } from './types';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AndroidFrame } from './components/AndroidFrame';
import { WebViewContainer } from './components/WebViewContainer';
import { BooksPracticeSection } from './components/BooksPracticeSection';
import { InteractiveModuleViewer } from './components/InteractiveModuleViewer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('ankitprep');
  const [tabHistory, setTabHistory] = useState<TabType[]>(['ankitprep']);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine ?? true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<StudyModule | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [dynamicModulesCount, setDynamicModulesCount] = useState<number>(1);

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
    setTabHistory((prev) => [...prev, newTab]);
    setCurrentTab(newTab);
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
            onSelectModule={(module) => setActiveModule(module)}
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
  );
}
