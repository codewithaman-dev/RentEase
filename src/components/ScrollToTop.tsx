import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensures that navigating between pages (especially from the footer)
 * automatically scrolls the window back to the top (0, 0), eliminating the need for manual scrolling.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

