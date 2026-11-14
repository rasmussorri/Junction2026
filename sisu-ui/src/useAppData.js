import { useEffect, useState } from 'react';
import { loadAppData, sameAppData } from './data-client.js';

export function useAppData() {
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState('');
  const [refreshError, setRefreshError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let map, busy = false, initialized = false;
    async function refresh() {
      if (busy || controller.signal.aborted || document.visibilityState === 'hidden') return;
      busy = true;
      try {
        const next = await loadAppData({ signal: controller.signal, map });
        if (controller.signal.aborted) return;
        map = next.map;
        initialized = true;
        setLoaded(previous => sameAppData(previous, next) ? previous : next);
        setError('');
        setRefreshError(next.data.snapshot.state === 'serving_previous_snapshot' ? 'The latest import could not be loaded. Showing the last validated dataset.' : '');
      } catch (failure) {
        if (!controller.signal.aborted) {
          if (initialized) setRefreshError('Data refresh failed. Showing the last loaded dataset.');
          else setError(failure.message);
        }
      } finally { busy = false; }
    }
    refresh();
    const timer = setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return { loaded, error, refreshError };
}
