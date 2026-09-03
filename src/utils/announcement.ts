import { AnnouncementConfig } from '../types';

const PRIMARY_REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/ankitraj75238-jpg/sph-app/main/public/books-data.json';
const SECONDARY_REMOTE_CONFIG_URL = 'https://ankitraj75238-jpg.github.io/sph-app/books-data.json';
const LOCAL_CONFIG_URL = '/books-data.json';

/**
 * Checks for in-app announcements in books-data.json.
 * Validates that announcement exists and announcement.show === true.
 */
export async function checkAppAnnouncement(): Promise<AnnouncementConfig | null> {
  const fetchJson = async (url: string) => {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json, text/plain, */*' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  };

  const extractAnnouncement = (data: any): AnnouncementConfig | null => {
    if (!data) return null;
    let ann: any = null;

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.announcement && typeof data.announcement === 'object') {
        ann = data.announcement;
      }
    } else if (Array.isArray(data)) {
      // Check if any object in the array has an announcement property
      const itemWithAnn = data.find((item: any) => item && typeof item === 'object' && item.announcement);
      if (itemWithAnn) {
        ann = itemWithAnn.announcement;
      }
    }

    if (ann && ann.show === true && ann.title) {
      return {
        show: true,
        title: String(ann.title).trim(),
        message: String(ann.message || '').trim(),
        button_text: ann.button_text ? String(ann.button_text).trim() : undefined,
        button_url: ann.button_url ? String(ann.button_url).trim() : undefined,
        id: ann.id ? String(ann.id) : String(ann.title),
      };
    }

    return null;
  };

  // 1. Try Primary Remote GitHub Raw
  try {
    const remoteData = await fetchJson(PRIMARY_REMOTE_CONFIG_URL);
    const ann = extractAnnouncement(remoteData);
    if (ann) return ann;
  } catch {
    // Continue to next source
  }

  // 2. Try Secondary Remote GitHub Pages
  try {
    const secondaryData = await fetchJson(SECONDARY_REMOTE_CONFIG_URL);
    const ann = extractAnnouncement(secondaryData);
    if (ann) return ann;
  } catch {
    // Continue to next source
  }

  // 3. Try Local Bundled /books-data.json
  try {
    const localData = await fetchJson(LOCAL_CONFIG_URL);
    const ann = extractAnnouncement(localData);
    if (ann) return ann;
  } catch {
    // Silent fallback
  }

  return null;
}
