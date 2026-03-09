import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — scrolls to the top of the page on every route change.
 * Placed inside <BrowserRouter> in App.jsx.
 * Uses the History API (window.scrollTo) which is the SPA-native approach.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
