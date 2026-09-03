import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics, setUserProperties } from 'firebase/analytics';

// Global safety handler: prevent uncaught promise rejections from Firebase Installations
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const errorStr = String(event.reason?.message || event.reason || '');
    if (
      errorStr.includes('installations') ||
      errorStr.includes('API key not valid') ||
      errorStr.includes('installations/request-failed')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

// Configurable Firebase credentials
const envApiKey = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_API_KEY)?.trim();

export const firebaseConfig = {
  apiKey: envApiKey || "",
  authDomain: "sph-hub.firebaseapp.com",
  projectId: "sph-hub",
  storageBucket: "sph-hub.firebasestorage.app",
  messagingSenderId: "808291816477",
  appId: "1:808291816477:web:115e599bccc31fbffd22f4",
  measurementId: "G-V8HYRNHVM4"
};

// Verify if a real, valid Firebase API key is configured
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'AIzaSyB96mREAcLMLSzAIbaTydru3GtKAGPMylc' &&
  !firebaseConfig.apiKey.includes('PLACEHOLDER') &&
  firebaseConfig.apiKey.startsWith('AIza') &&
  firebaseConfig.apiKey.length > 20
);

// Initialize Firebase App Singleton safely only when configured
export const app: FirebaseApp | null = (() => {
  try {
    if (getApps().length > 0) return getApp();
    if (isFirebaseConfigured && firebaseConfig.apiKey) {
      return initializeApp(firebaseConfig);
    }
    return null;
  } catch (err) {
    console.warn('[SPH Firebase] Initialization skipped:', err);
    return null;
  }
})();

let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;

/**
 * Safely initialize Firebase Analytics with environment capability verification
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!isFirebaseConfigured || !app) {
    return null;
  }
  if (analyticsInstance) return analyticsInstance;
  if (analyticsInitPromise) return analyticsInitPromise;

  analyticsInitPromise = (async () => {
    try {
      const supported = await isSupported();
      if (supported && typeof window !== 'undefined' && app) {
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      }
    } catch {
      // Graceful fallback for sandboxed environments without cookies/indexedDB
    }
    return null;
  })();

  return analyticsInitPromise;
}

/**
 * Log Screen View to Firebase Analytics
 */
export async function logFirebaseScreenView(screenName: string, screenClass = 'SPH_App') {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenClass,
        screen_name: screenName,
        app_name: 'Silent Preparation Hub',
        app_version: '2.4.0',
      });
    }
  } catch {
    // Fail silently in background
  }
}

/**
 * Log Custom Study Module / Practice Book Open Event
 */
export async function logFirebaseStudyModuleOpen(params: {
  moduleId: string;
  moduleTitle: string;
  subject?: string;
  category?: string;
  badge?: string;
  url?: string;
}) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, 'open_study_module', {
        module_id: params.moduleId,
        module_title: params.moduleTitle,
        subject: params.subject || params.category || 'General',
        category: params.category || params.subject || 'Study Material',
        badge: params.badge || 'Standard',
        url: params.url || '',
        timestamp: new Date().toISOString(),
      });
    }
  } catch {
    // Fail silently
  }
}

/**
 * Log Custom Generic Firebase Event
 */
export async function logFirebaseCustomEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, {
        app_platform: 'Android_Web_Hub',
        ...eventParams,
      });
    }
  } catch {
    // Fail silently
  }
}

/**
 * Set Anonymous User Telemetry Properties for DAU / Cohort analytics
 */
export async function setFirebaseUserTelemetryProperties(properties: {
  anonymousId: string;
  activeStreak: number;
  totalOpens: number;
}) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      setUserProperties(analytics, {
        sph_anon_id: properties.anonymousId,
        sph_streak_days: String(properties.activeStreak),
        sph_total_opens: String(properties.totalOpens),
      });
    }
  } catch {
    // Fail silently
  }
}
