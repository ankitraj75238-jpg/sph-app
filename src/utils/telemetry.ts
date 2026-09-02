/**
 * SPH Private & Lightweight Analytics Telemetry
 * 
 * - Privacy-focused: Zero PII (no IP logging, no names, no personal data).
 * - Tracks Daily Active Users (DAU), total app opens, active day streak, and portal sessions.
 * - Stores anonymous metrics locally and sends a silent, non-blocking telemetry heartbeat ping.
 */

import { 
  logFirebaseScreenView, 
  logFirebaseStudyModuleOpen, 
  logFirebaseCustomEvent, 
  setFirebaseUserTelemetryProperties 
} from '../lib/firebase';

export interface TelemetryStats {
  anonymousId: string;
  totalOpens: number;
  activeDaysStreak: number;
  todayOpens: number;
  lastActiveDate: string;
  isNewUser: boolean;
  tabViews: Record<string, number>;
  modulesReadCount: number;
}

const STORAGE_KEYS = {
  ANON_ID: 'sph_anon_telemetry_id',
  TOTAL_OPENS: 'sph_telemetry_total_opens',
  LAST_DATE: 'sph_telemetry_last_date',
  STREAK: 'sph_telemetry_streak',
  TODAY_OPENS: 'sph_telemetry_today_opens',
  TAB_VIEWS: 'sph_telemetry_tab_views',
  MODULES_READ: 'sph_telemetry_modules_read',
};

// Generate a random anonymous alphanumeric ID
function generateAnonymousId(): string {
  const chars = 'abcdef0123456789';
  let id = 'sph-usr-';
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// Get or initialize persistent anonymous ID
export function getAnonymousId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEYS.ANON_ID);
    if (!id) {
      id = generateAnonymousId();
      localStorage.setItem(STORAGE_KEYS.ANON_ID, id);
    }
    return id;
  } catch {
    return 'sph-usr-anonymous';
  }
}

// Format local date string YYYY-MM-DD
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Initialize and record an app session open
 */
export function recordAppOpen(): TelemetryStats {
  const anonymousId = getAnonymousId();
  const today = getTodayDateString();

  let totalOpens = 1;
  let activeDaysStreak = 1;
  let todayOpens = 1;
  let isNewUser = false;
  let lastDate = '';
  let tabViews: Record<string, number> = { ankitprep: 1, pareeksha: 0, books_practice: 0 };
  let modulesReadCount = 0;

  try {
    const rawTotal = localStorage.getItem(STORAGE_KEYS.TOTAL_OPENS);
    if (!rawTotal) {
      isNewUser = true;
      totalOpens = 1;
    } else {
      totalOpens = parseInt(rawTotal, 10) + 1;
    }
    localStorage.setItem(STORAGE_KEYS.TOTAL_OPENS, String(totalOpens));

    // Calculate Streak & Today Opens
    lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE) || '';
    const rawStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
    const rawTodayOpens = localStorage.getItem(STORAGE_KEYS.TODAY_OPENS);

    if (lastDate === today) {
      // Same day open
      todayOpens = rawTodayOpens ? parseInt(rawTodayOpens, 10) + 1 : 1;
      activeDaysStreak = rawStreak ? parseInt(rawStreak, 10) : 1;
    } else {
      // New day open (DAU count event)
      todayOpens = 1;
      if (lastDate) {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          activeDaysStreak = rawStreak ? parseInt(rawStreak, 10) + 1 : 1;
        } else {
          activeDaysStreak = 1;
        }
      } else {
        activeDaysStreak = 1;
      }
      localStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
    }

    localStorage.setItem(STORAGE_KEYS.TODAY_OPENS, String(todayOpens));
    localStorage.setItem(STORAGE_KEYS.STREAK, String(activeDaysStreak));

    // Retrieve Tab Views
    const rawTabViews = localStorage.getItem(STORAGE_KEYS.TAB_VIEWS);
    if (rawTabViews) {
      try {
        tabViews = JSON.parse(rawTabViews);
      } catch {
        // use default
      }
    }

    // Retrieve Modules Read
    const rawModules = localStorage.getItem(STORAGE_KEYS.MODULES_READ);
    if (rawModules) {
      modulesReadCount = parseInt(rawModules, 10) || 0;
    }

  } catch {
    // Fail silently in private browsing / blocked storage environments
  }

  const stats: TelemetryStats = {
    anonymousId,
    totalOpens,
    activeDaysStreak,
    todayOpens,
    lastActiveDate: today,
    isNewUser,
    tabViews,
    modulesReadCount,
  };

  // Set Firebase User Properties & Log App Open / DAU event
  setFirebaseUserTelemetryProperties({
    anonymousId,
    activeStreak: activeDaysStreak,
    totalOpens,
  });

  logFirebaseCustomEvent('app_session_start', {
    total_opens: totalOpens,
    streak_days: activeDaysStreak,
    is_new_user: isNewUser,
    date: today,
  });

  // Log initial screen view for AnkitPrep
  logFirebaseScreenView('AnkitPrep', 'SPH_Portal_1');

  // Dispatch silent non-blocking telemetry heartbeat
  sendAnonymousTelemetryPing('app_open', stats);

  return stats;
}

/**
 * Record tab switch event
 */
export function recordTabVisit(tabName: string) {
  try {
    const rawTabViews = localStorage.getItem(STORAGE_KEYS.TAB_VIEWS);
    let tabViews: Record<string, number> = { ankitprep: 0, pareeksha: 0, books_practice: 0 };
    if (rawTabViews) {
      try {
        tabViews = JSON.parse(rawTabViews);
      } catch {
        // ignore
      }
    }
    tabViews[tabName] = (tabViews[tabName] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.TAB_VIEWS, JSON.stringify(tabViews));

    // Map Tab to Firebase Screen View
    const screenMap: Record<string, string> = {
      ankitprep: 'AnkitPrep',
      pareeksha: 'Pareeksha Kendra',
      books_practice: 'Books & Practice',
    };
    const screenName = screenMap[tabName] || tabName;
    logFirebaseScreenView(screenName, `SPH_Tab_${tabName}`);

    sendAnonymousTelemetryPing('tab_view', {
      anonymousId: getAnonymousId(),
      tab: tabName,
      screenName,
      viewCount: tabViews[tabName],
    });
  } catch {
    // ignore
  }
}

/**
 * Record study material / module reader open event
 */
export function recordModuleRead(
  moduleId: string, 
  moduleTitle?: string,
  extra?: { subject?: string; category?: string; badge?: string; url?: string }
) {
  try {
    const rawModules = localStorage.getItem(STORAGE_KEYS.MODULES_READ);
    const count = (rawModules ? parseInt(rawModules, 10) : 0) + 1;
    localStorage.setItem(STORAGE_KEYS.MODULES_READ, String(count));

    // Log Firebase Analytics Event for opening study material / practice book
    logFirebaseStudyModuleOpen({
      moduleId,
      moduleTitle: moduleTitle || 'Untitled Study Module',
      subject: extra?.subject || extra?.category || 'General',
      category: extra?.category || extra?.subject || 'Study Module',
      badge: extra?.badge,
      url: extra?.url,
    });

    logFirebaseScreenView(`Reader: ${moduleTitle || moduleId}`, 'SPH_Module_Reader');

    sendAnonymousTelemetryPing('module_read', {
      anonymousId: getAnonymousId(),
      moduleId,
      moduleTitle,
      totalModulesRead: count,
    });
  } catch {
    // ignore
  }
}

/**
 * Retrieve current telemetry stats
 */
export function getTelemetryStats(): TelemetryStats {
  const anonymousId = getAnonymousId();
  const today = getTodayDateString();

  let totalOpens = 1;
  let activeDaysStreak = 1;
  let todayOpens = 1;
  let lastDate = today;
  let tabViews: Record<string, number> = { ankitprep: 1, pareeksha: 0, books_practice: 0 };
  let modulesReadCount = 0;

  try {
    totalOpens = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_OPENS) || '1', 10);
    activeDaysStreak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '1', 10);
    todayOpens = parseInt(localStorage.getItem(STORAGE_KEYS.TODAY_OPENS) || '1', 10);
    lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE) || today;
    const rawTabViews = localStorage.getItem(STORAGE_KEYS.TAB_VIEWS);
    if (rawTabViews) tabViews = JSON.parse(rawTabViews);
    modulesReadCount = parseInt(localStorage.getItem(STORAGE_KEYS.MODULES_READ) || '0', 10);
  } catch {
    // ignore
  }

  return {
    anonymousId,
    totalOpens,
    activeDaysStreak,
    todayOpens,
    lastActiveDate: lastDate,
    isNewUser: totalOpens <= 1,
    tabViews,
    modulesReadCount,
  };
}

/**
 * Silent non-blocking heartbeat ping dispatcher
 */
function sendAnonymousTelemetryPing(eventName: string, payload: any) {
  // Silent execution wrapped in setTimeout to guarantee 0 impact on UI rendering
  setTimeout(() => {
    try {
      const pingData = JSON.stringify({
        event: eventName,
        app: 'SPH_Android_Hub',
        version: '2.4.0',
        timestamp: new Date().toISOString(),
        ...payload,
      });

      // Try sendBeacon first if supported (completely non-blocking)
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // Standard lightweight endpoint fallback
        const beaconSent = navigator.sendBeacon('/api/telemetry', pingData);
        if (beaconSent) return;
      }

      // Safe fetch fallback
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData,
        mode: 'no-cors',
        keepalive: true,
      }).catch(() => {
        // Silent catch: telemetry failure must never impact the user
      });
    } catch {
      // Silent catch
    }
  }, 100);
}
