import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensures that navigating between pages (especially from the footer)
 * automatically scrolls the window back to the top (0, 0), eliminating the need for manual scrolling.
 * Listens to pathname, search, and history key for instant reset on all route and query transitions.
 */
export const ScrollToTop = () => {
  const { pathname, search, key } = useLocation();

  useEffect(() => {
    // Disable browser default scroll restoration so it doesn't fight programmatic scroll
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const scrollToTop = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' as ScrollBehavior,
        });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // 1. Immediate scroll
    scrollToTop();

    // 2. Next animation frame (after initial DOM flush)
    const rafId = requestAnimationFrame(scrollToTop);

    // 3. Short timeout for lazy-loaded route chunks (Suspense)
    const timeoutId = setTimeout(scrollToTop, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname, search, key]);

  return null;
};
