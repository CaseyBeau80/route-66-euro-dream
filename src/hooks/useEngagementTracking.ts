import { useEffect, useRef } from 'react';
import { track, TrackProps } from '@/lib/track';

/**
 * Fires `event` once the page has been visible/open for `delayMs`.
 * Never fires on initial render, and only when `enabled` is true
 * (i.e. real content is on screen). Tab must stay visible.
 */
export const useDwellEvent = (
  event: string,
  enabled: boolean,
  delayMs = 5000,
  props: TrackProps = {}
) => {
  const fired = useRef(false);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    if (!enabled || fired.current) return;
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'hidden') return;

    const timer = window.setTimeout(() => {
      if (fired.current) return;
      if (document.visibilityState !== 'visible') return;
      fired.current = true;
      track(event, propsRef.current);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [event, enabled, delayMs]);
};

/**
 * Fires `event` once the user has scrolled past `threshold` (0-1) of the page.
 * Requires an actual scroll interaction; never fires on initial render.
 */
export const useScrollDepthEvent = (
  event: string,
  enabled: boolean,
  threshold = 0.5,
  props: TrackProps = {}
) => {
  const fired = useRef(false);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    if (!enabled || fired.current) return;
    if (typeof window === 'undefined') return;

    const onScroll = () => {
      if (fired.current) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = window.scrollY / scrollable;
      if (depth >= threshold) {
        fired.current = true;
        window.removeEventListener('scroll', onScroll);
        track(event, propsRef.current);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [event, enabled, threshold]);
};
