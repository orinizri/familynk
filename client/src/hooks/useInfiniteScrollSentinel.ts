import { useRef, useEffect, RefObject } from "react";

interface UseInfiniteScrollSentinelParams {
  containerRef: RefObject<HTMLElement>;
  onLoadMore: () => void;
  hasMore: boolean;
  rootMargin?: string;
}

/**
 * useInfiniteScrollSentinel
 *
 * Calls `onLoadMore()` when the sentinel div scrolls within
 * `rootMargin` of the bottom of the scrollable container.
 *
 * @param containerRef – the scrolling container
 * @param onLoadMore   – callback to load the next page
 * @param hasMore      – false when no more pages
 * @param rootMargin   – how far below the viewport to trigger early load
 * @returns ref to be placed at the sentinel position
 */
export default function useInfiniteScrollSentinel({
  containerRef,
  onLoadMore,
  hasMore,
  rootMargin = "0px 0px 150px 0px",
}: UseInfiniteScrollSentinelParams): RefObject<HTMLDivElement> {
  const sentinelRef = useRef<HTMLDivElement>(null);

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
        root: container,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [containerRef, onLoadMore, hasMore, rootMargin]);

  return sentinelRef;
}