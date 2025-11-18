'use client';

import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let startY = 0;
    let currentPullDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if scrolled to top
      if (window.scrollY > 0) return;

      startY = e.touches[0].clientY;
      touchStartY.current = startY;
      currentPullDistance = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 0 || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY;

      if (deltaY > 0) {
        // Apply resistance to pull distance
        currentPullDistance = Math.min(deltaY / resistance, threshold * 1.5);
        setPullDistance(currentPullDistance);

        if (currentPullDistance > 10) {
          setIsPulling(true);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (currentPullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }

        try {
          await onRefresh();
        } catch {
          // Error handled by parent component
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
      currentPullDistance = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, resistance, onRefresh, isRefreshing]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    progress: Math.min((pullDistance / threshold) * 100, 100),
  };
}
