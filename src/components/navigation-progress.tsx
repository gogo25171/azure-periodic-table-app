'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

/** Custom event any component can fire before a programmatic navigation. */
export const NAVIGATION_START_EVENT = 'periodic-table:navigation-start';

/** Safety net: never leave the bar on screen if a navigation never resolves. */
const MAX_DURATION_MS = 15000;

/**
 * Thin progress bar shown at the top of the page while a route is loading.
 *
 * Opening a resource renders a server component, so there is a delay between
 * the click and the sidebar; without feedback the page looks frozen. The App
 * Router exposes no navigation events in Next 13, so link clicks are observed
 * in the capture phase and the bar is completed when the pathname changes.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<number | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    if (timeout.current) clearTimeout(timeout.current);
    if (hide.current) clearTimeout(hide.current);
    tick.current = null;
    timeout.current = null;
    hide.current = null;
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setProgress(12);

    // Creeps towards 90%: the remaining 10% is filled when the route lands.
    tick.current = setInterval(() => {
      setProgress((current) => {
        if (current === null) return current;
        const remaining = 90 - current;
        return remaining <= 1 ? current : current + Math.max(remaining * 0.08, 0.5);
      });
    }, 200);

    timeout.current = setTimeout(() => {
      logger.warn('navigation', 'Navigation took too long, hiding the progress bar');
      clearTimers();
      setProgress(null);
    }, MAX_DURATION_MS);
  }, [clearTimers]);

  const complete = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    if (timeout.current) clearTimeout(timeout.current);
    tick.current = null;
    timeout.current = null;

    setProgress((current) => (current === null ? null : 100));
    hide.current = setTimeout(() => setProgress(null), 250);
  }, []);

  // The pathname changed: the new route is rendered, the bar can finish.
  useEffect(() => {
    complete();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      // Same-origin navigations only, and not a jump to the current page.
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      start();
    };

    const onProgrammaticNavigation = () => start();

    document.addEventListener('click', onClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, onProgrammaticNavigation);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, onProgrammaticNavigation);
    };
  }, [start]);

  if (progress === null) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent"
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.7)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
