import { AppControlConfig } from '../components/ForceUpdateModal';

export const CURRENT_APP_VERSION = 1.0;

const PRIMARY_REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/ankitraj75238-jpg/sph-app/main/public/books-data.json';
const SECONDARY_REMOTE_CONFIG_URL = 'https://ankitraj75238-jpg.github.io/sph-app/books-data.json';
const LOCAL_CONFIG_URL = '/books-data.json';

export interface VersionCheckResult {
  isUpdateRequired: boolean;
  currentVersion: number;
  minRequiredVersion: number;
  appControl: AppControlConfig;
}

/**
 * Checks remote version configuration from GitHub raw books-data.json
 * If CURRENT_APP_VERSION < min_required_version or force_update === true, triggers lock.
 */
export async function checkAppVersionLock(): Promise<VersionCheckResult> {
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
    };
  }

  const appControl: AppControlConfig = (remoteData && typeof remoteData === 'object' && remoteData.app_control)
    ? remoteData.app_control
    : {};

  const minRequiredVersion = typeof appControl.min_required_version === 'number'
    ? appControl.min_required_version
    : typeof appControl.min_required_version === 'string'
      ? parseFloat(appControl.min_required_version)
      : CURRENT_APP_VERSION;

  const isForceLocked = Boolean(appControl.force_update);
  const isVersionOutdated = CURRENT_APP_VERSION < minRequiredVersion;

  return {
    isUpdateRequired: isVersionOutdated || isForceLocked,
    currentVersion: CURRENT_APP_VERSION,
    minRequiredVersion,
    appControl,
  };
}
