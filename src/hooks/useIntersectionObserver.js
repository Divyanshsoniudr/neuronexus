import { useRef, useEffect } from "react";

/**
 * useIntersectionObserver — fires `callback` once when the returned ref's
 * element enters the viewport. Disconnects after the first trigger (one-shot).
 *
 * Uses the Intersection Observer API (MDN Web API).
 *
 * @param {() => void} callback - Called once on entry
 * @param {{ threshold?: number, rootMargin?: string }} options
 * @returns {React.RefObject} - Attach this to the element you want to observe
 */
export function useIntersectionObserver(callback, options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    callback();
                    observer.disconnect(); // fire once only
                }
            },
            { threshold: 0.3, ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return ref;
}
