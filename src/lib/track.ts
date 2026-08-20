/**
 * Lightweight engagement event tracking.
 *
 * Sends to whichever analytics provider is already present on the page:
 *   1. gtag.js (wired up in index.html)
 *   2. a plausible-style `window.plausible(event, { props })` shim
 *   3. otherwise a no-op
 *
 * Never throws, and is safe during SSR / prerender (no `window`).
 */

export type TrackProps = Record<string, unknown>;

type PlausibleFn = (event: string, options?: { props?: TrackProps }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[] };
    gtag?: (...args: unknown[]) => void;
  }
}

export const track = (event: string, props: TrackProps = {}): void => {
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let delivered = false;

    if (typeof window.gtag === 'function') {
      window.gtag('event', event, props);
      delivered = true;
    }

    if (typeof window.plausible === 'function') {
      window.plausible(event, { props });
      delivered = true;
    }

    if (!delivered) {
      // No provider present: dispatch a DOM event so any late-loading
      // analytics shim can pick it up. Harmless if nobody listens.
      window.dispatchEvent(new CustomEvent('analytics:event', { detail: { event, props } }));
    }
  } catch {
    /* analytics must never break the app */
  }
};

export default track;
