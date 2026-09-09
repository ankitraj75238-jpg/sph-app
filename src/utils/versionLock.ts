import { AppControlConfig } from '../components/ForceUpdateModal';
import { AnnouncementConfig } from '../types';

// New App Version is 3.0 (Old installed apps are 2.0)
export const CURRENT_APP_VERSION = "3.0";

const PRIMARY_REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/ankitraj75238-jpg/sph-app/main/public/books-data.json';
const SECONDARY_REMOTE_CONFIG_URL = 'https://ankitraj75238-jpg.github.io/sph-app/public/books-data.json';
const LOCAL_CONFIG_URL = '/books-data.json';

export interface VersionCheckResult {
  isUpdateRequired: boolean;
  currentVersion: string;
  minRequiredVersion: string;
  appControl: AppControlConfig;
  announcement?: AnnouncementConfig | null;
}

/**
 * Returns true if currentVersion is strictly older than minRequiredVersion.
 */
export function isVersionOlder(current: string, minRequired: string): boolean {
  const parseParts = (v: string) =>
    String(v)
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map((p) => parseInt(p.trim(), 10) || 0);

  const cParts = parseParts(current);
  const rParts = parseParts(minRequired);
  const len = Math.max(cParts.length, rParts.length);

  for (let i = 0; i < len; i++) {
    const c = cParts[i] || 0;
    const r = rParts[i] || 0;
    if (c < r) return true;
    if (c > r) return false;
  }
  return false;
}

/**
 * Checks remote version configuration from books-data.json.
 * Only locks if the installed app is older than minRequiredVersion.
 */
export async function checkAppVersionLock(): Promise<VersionCheckResult> {
  // Test override via query param
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('test_force_update') === 'true') {
        return {
          isUpdateRequired: true,
          currentVersion: "2.0",
          minRequiredVersion: "3.0",
          appControl: {
            min_required_version: "3.0",
            latest_version: "3.0",
            force_update: false,
            update_title: "🚀 नया SPH V3.0 MEGA UPDATE आ चुका है!",
            telegram_url: "https://t.me/PAREEKSHA_KENDRA",
            button_url: "https://t.me/PAREEKSHA_KENDRA",
            button_text: "📲 TELEGRAM से नया APK डाउनलोड करें ➔",
          },
          announcement: {
            title: "🚀 नया SPH V3.0 MEGA UPDATE आ चुका है!",
            message: "पुराना वर्ज़न बंद कर दिया गया है। 120Hz सुपरफास्ट स्पीड, बिना एरर के AI क्विज़ और नई किताबों के लिए तुरंत नया V3.0 ऐप डाउनलोड करें!",
            button_text: "📲 TELEGRAM से नया APK डाउनलोड करें ➔",
            button_url: "https://t.me/PAREEKSHA_KENDRA",
            min_version: "3.0",
          },
        };
      }
    } catch {
      // Safe fallback
    }
  }

  const fetchConfig = async (url: string) => {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_nocache=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json, text/plain, */*' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  };

  let remoteData: any = null;

  try {
    try {
      remoteData = await fetchConfig(PRIMARY_REMOTE_CONFIG_URL);
    } catch {
      try {
        remoteData = await fetchConfig(SECONDARY_REMOTE_CONFIG_URL);
      } catch {
        remoteData = await fetchConfig(LOCAL_CONFIG_URL);
      }
    }
  } catch (err) {
    return {
      isUpdateRequired: false,
      currentVersion: CURRENT_APP_VERSION,
      minRequiredVersion: CURRENT_APP_VERSION,
      appControl: {},
      announcement: null,
    };
  }

  const appControl: AppControlConfig = (remoteData && typeof remoteData === 'object' && remoteData.app_control)
    ? remoteData.app_control
    : {};

  const announcement: AnnouncementConfig | null = (remoteData && typeof remoteData === 'object' && remoteData.announcement)
    ? remoteData.announcement
    : null;

  const minRequiredVersion = String(
    announcement?.min_version ??
    announcement?.min_required_version ??
    appControl.min_required_version ??
    appControl.min_version ??
    CURRENT_APP_VERSION
  );

  // CRITICAL FIX: Only lock if the app version is ACTUALLY older than minRequiredVersion!
  // This ensures v3.0 will NEVER be locked, while v2.0 is 100% locked!
  const isVersionOutdated = isVersionOlder(CURRENT_APP_VERSION, minRequiredVersion);

  return {
    isUpdateRequired: isVersionOutdated,
    currentVersion: CURRENT_APP_VERSION,
    minRequiredVersion,
    appControl: {
      ...appControl,
      telegram_url: appControl.telegram_url || "https://t.me/PAREEKSHA_KENDRA",
      button_url: appControl.button_url || "https://t.me/PAREEKSHA_KENDRA",
      button_text: appControl.button_text || "📲 TELEGRAM से नया APK डाउनलोड करें ➔",
      update_title: appControl.update_title || "🚀 नया SPH V3.0 MEGA UPDATE आ चुका है!"
    },
    announcement,
  };
}
