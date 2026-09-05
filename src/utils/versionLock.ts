import { AppControlConfig } from '../components/ForceUpdateModal';
import { AnnouncementConfig } from '../types';

export const CURRENT_APP_VERSION = "2.0";

const PRIMARY_REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/ankitraj75238-jpg/sph-app/main/public/books-data.json';
const SECONDARY_REMOTE_CONFIG_URL = 'https://ankitraj75238-jpg.github.io/sph-app/books-data.json';
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
 * Examples:
 *  isVersionOlder("1.0", "2.0") => true
 *  isVersionOlder("2.0", "2.0") => false
 *  isVersionOlder("2.0", "2.1") => true
 *  isVersionOlder("2.0", "1.9") => false
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
 * Checks remote version configuration from books-data.json (announcement & app_control).
 * If CURRENT_APP_VERSION < min_version or force_update === true, triggers lock.
 */
export async function checkAppVersionLock(): Promise<VersionCheckResult> {
  // Allow manual inspection and testing via query parameter '?test_force_update=true'
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('test_force_update') === 'true') {
        return {
          isUpdateRequired: true,
          currentVersion: "1.0",
          minRequiredVersion: "2.0",
          appControl: {
            min_required_version: "2.0",
            latest_version: "2.0",
            force_update: true,
            update_title: "🔥 SPH APP V2.0 MEGA UPDATE IS LIVE!",
            telegram_url: "https://t.me/pareekshakendraankit",
            button_url: "https://t.me/pareekshakendraankit",
            button_text: "📲 DOWNLOAD V2.0 UPDATE ON TELEGRAM ➔",
          },
          announcement: {
            title: "🔥 SPH APP V2.0 MEGA UPDATE IS LIVE!",
            message: "Upgrade to Silent Preparation Hub V2.0 for all 12+ master study books, 120Hz zero-stutter speed, day & night theme, and offline interactive readers!",
            button_text: "📲 DOWNLOAD V2.0 UPDATE ON TELEGRAM ➔",
            button_url: "https://t.me/pareekshakendraankit",
            min_version: "2.0",
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
    // 1. Try Primary GitHub Raw
    try {
      remoteData = await fetchConfig(PRIMARY_REMOTE_CONFIG_URL);
    } catch {
      // 2. Try Secondary GitHub Pages
      try {
        remoteData = await fetchConfig(SECONDARY_REMOTE_CONFIG_URL);
      } catch {
        // 3. Try Local fallback
        remoteData = await fetchConfig(LOCAL_CONFIG_URL);
      }
    }
  } catch (err) {
    // If all network calls fail, allow user to continue on current version
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

  // Check min_version across announcement and app_control
  const minRequiredVersion = String(
    announcement?.min_version ??
    announcement?.min_required_version ??
    appControl.min_required_version ??
    appControl.min_version ??
    CURRENT_APP_VERSION
  );

  const isForceLocked = Boolean(announcement?.force_update || appControl.force_update);
  const isVersionOutdated = isVersionOlder(CURRENT_APP_VERSION, minRequiredVersion);

  return {
    isUpdateRequired: isVersionOutdated || isForceLocked,
    currentVersion: CURRENT_APP_VERSION,
    minRequiredVersion,
    appControl,
    announcement,
  };
}
