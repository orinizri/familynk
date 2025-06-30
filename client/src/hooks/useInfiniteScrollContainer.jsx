// src/hooks/useInfiniteScrollContainer.js
import { useEffect } from "react";

/**
 * Attaches a scroll listener to a container and calls onLoadMore()
 * when scrolled within `thresholdPx` of the bottom.
 *
 * @param {Object} params
 * @param {React.RefObject<HTMLElement>} params.containerRef – ref to the scrollable container
 * @param {boolean} params.loading       – true while a fetch is in flight
 * @param {boolean} params.hasMore       – false once there’s no more data
 * @param {boolean} params.error         – true if the last fetch errored
 * @param {Function} params.onLoadMore   – callback to load the next page
 * @param {number} [params.thresholdPx=100] – how many pixels from bottom to trigger
 */
export default function useInfiniteScrollContainer({
  containerRef,
  loading,
  hasMore,
  error,
  onLoadMore,
  thresholdPx = 100,
}) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      if (loading || error || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // only when user scrolls within threshold of bottom
      if (scrollHeight - scrollTop - clientHeight < thresholdPx) {
        onLoadMore();
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, loading, hasMore, error, onLoadMore, thresholdPx]);
}
