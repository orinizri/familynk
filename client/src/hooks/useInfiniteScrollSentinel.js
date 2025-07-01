/**
 * useInfiniteScrollSentinel
 *
 * Calls onLoadMore() when the sentinel div scrolls within
 * `rootMargin` of the bottom of the scrollable container.
 *
 * @param {Object} params
 * @param {React.RefObject<HTMLElement>} params.containerRef – the scrolling container
 * @param {Function} params.onLoadMore   – callback to load the next page
 * @param {boolean}  params.hasMore      – false when no more pages
 * @param {string}   [params.rootMargin='0px 0px 150px 0px']
 *   how far below the viewport to trigger early load
 * @returns {React.RefObject<HTMLElement>}
 */
import { useRef, useEffect } from "react";

export default function useInfiniteScrollSentinel({
  containerRef,
  onLoadMore,
  hasMore,
  rootMargin = "0px 0px 150px 0px",
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: container, // ← your scrollable Box
        rootMargin, // e.g. '0px 0px 150px 0px'
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [containerRef, onLoadMore, hasMore, rootMargin]);

  return sentinelRef;
}
