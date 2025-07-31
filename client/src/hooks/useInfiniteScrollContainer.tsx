import { useEffect, RefObject } from "react";

interface UseInfiniteScrollContainerParams {
  containerRef: RefObject<HTMLElement>;
  loading: boolean;
  hasMore: boolean;
  error: boolean;
  onLoadMore: () => void;
  thresholdPx?: number;
}

/**
 * useInfiniteScrollContainer
 *
 * Attaches a scroll listener to a container and calls `onLoadMore()`
 * when scrolled within `thresholdPx` of the bottom.
 *
 * @param containerRef – ref to the scrollable container
 * @param loading       – true while a fetch is in flight
 * @param hasMore       – false once there’s no more data
 * @param error         – true if the last fetch errored
 * @param onLoadMore    – callback to load the next page
 * @param thresholdPx   – how many pixels from bottom to trigger (default: 100)
 */
export default function useInfiniteScrollContainer({
  containerRef,
  loading,
  hasMore,
  error,
  onLoadMore,
  thresholdPx = 100,
}: UseInfiniteScrollContainerParams): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      if (loading || error || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollHeight - scrollTop - clientHeight < thresholdPx) {
        onLoadMore();
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, loading, hasMore, error, onLoadMore, thresholdPx]);
}
