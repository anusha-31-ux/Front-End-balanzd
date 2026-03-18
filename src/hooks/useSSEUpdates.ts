import { useEffect } from 'react';
import { getApiUrl } from '@/lib/config';

export type SSEResourceType = 'pricing' | 'banner' | 'testimonials' | 'personal-training';

/** Custom window event name dispatched on every SSE message */
export const DATA_UPDATE_EVENT = 'balanzed:data-update';

/**
 * Opens a persistent SSE connection to /api/events.
 * On each message, dispatches a window CustomEvent so any component
 * can listen without prop-drilling or shared state.
 *
 * Call once at the App level.
 */
export function useSSEUpdates() {
  useEffect(() => {
    const url = getApiUrl('/api/events');
    const es = new EventSource(url);

    es.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { type: SSEResourceType };
        window.dispatchEvent(new CustomEvent(DATA_UPDATE_EVENT, { detail: data }));
      } catch {
        // ignore malformed events
      }
    };

    // EventSource auto-reconnects on error — no manual handling needed
    es.onerror = () => {};

    return () => es.close();
  }, []);
}
