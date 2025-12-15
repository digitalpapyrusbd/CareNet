import { renderHook, act, waitFor } from '@testing-library/react';
import { usePullToRefresh } from '../use-pull-to-refresh';

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn(),
});

// Helper to create touch event
const createTouchEvent = (type: string, clientY: number): TouchEvent => {
  const touch = {
    clientY,
    identifier: 0,
    pageX: 0,
    pageY: clientY,
    screenX: 0,
    screenY: clientY,
    target: document.body,
  } as Touch;

  return new TouchEvent(type, {
    touches: type === 'touchend' ? [] : [touch],
    changedTouches: [touch],
    bubbles: true,
    cancelable: true,
  });
};

const dispatchTouch = async (type: string, clientY: number, waitMs = 0) => {
  await act(async () => {
    document.dispatchEvent(createTouchEvent(type, clientY));
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    } else {
      await Promise.resolve();
    }
  });
};

describe('usePullToRefresh Hook', () => {
  let onRefreshMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    onRefreshMock = jest.fn().mockResolvedValue(undefined);
    
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      expect(result.current.isPulling).toBe(false);
      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.pullDistance).toBe(0);
      expect(result.current.progress).toBe(0);
    });

    it('should add touch event listeners on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => usePullToRefresh({ onRefresh: onRefreshMock }));

      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: true });
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
    });

    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
    });
  });

  describe('Pull Gesture', () => {
    it('should detect pull start at top of page', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
      });

      expect(result.current.isPulling).toBe(false); // Not pulling yet, just started
    });

    it('should ignore pull when not at top of page', () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 100,
      });

      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      expect(result.current.isPulling).toBe(false);
      expect(result.current.pullDistance).toBe(0);
    });

    it('should update pull distance on touch move', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 150)); // 50px down
      });

      expect(result.current.pullDistance).toBeGreaterThan(0);
    });

    it('should set isPulling when distance exceeds 10px', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 120)); // 20px down
      });

      expect(result.current.isPulling).toBe(true);
    });

    it('should apply resistance to pull distance', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, resistance: 2 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200)); // 100px down
      });

      // With resistance 2, 100px pull = 50px distance
      expect(result.current.pullDistance).toBeLessThan(100);
      expect(result.current.pullDistance).toBeGreaterThan(0);
    });

    it('should limit pull distance to 1.5x threshold', () => {
      const threshold = 80;
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 1000)); // Very large pull
      });

      expect(result.current.pullDistance).toBeLessThanOrEqual(threshold * 1.5);
    });

    it('should ignore upward swipes', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 200));
        document.dispatchEvent(createTouchEvent('touchmove', 100)); // Upward swipe
      });

      expect(result.current.isPulling).toBe(false);
      expect(result.current.pullDistance).toBe(0);
    });
  });

  describe('Refresh Trigger', () => {
    it('should trigger refresh when pull exceeds threshold', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200)); // 100px down
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).toHaveBeenCalled();
    });

    it('should not trigger refresh when pull below threshold', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 100, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 150)); // 50px down, below threshold
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 150));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).not.toHaveBeenCalled();
    });

    it('should set isRefreshing state during refresh', async () => {
      let resolveRefresh: () => void;
      const refreshPromise = new Promise<void>((resolve) => {
        resolveRefresh = resolve;
      });
      onRefreshMock.mockReturnValue(refreshPromise);

      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      act(() => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
      });

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(true);
      });

      act(() => {
        resolveRefresh!();
      });

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });
    });

    it('should trigger haptic feedback on refresh', async () => {
      const vibrateMock = navigator.vibrate as jest.Mock;

      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(vibrateMock).toHaveBeenCalledWith([10, 50, 10]);
    });

    it('should handle vibrate not available', async () => {
      const originalVibrate = navigator.vibrate;
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: undefined,
      });

      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).toHaveBeenCalled();

      // Restore
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: originalVibrate,
      });
    });

    it('should handle refresh errors gracefully', async () => {
      onRefreshMock.mockRejectedValue(new Error('Refresh failed'));

      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });
    });

    it('should prevent double refresh', async () => {
      let resolveRefresh: () => void;
      const refreshPromise = new Promise<void>((resolve) => {
        resolveRefresh = resolve;
      });
      onRefreshMock.mockReturnValue(refreshPromise);

      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      await dispatchTouch('touchstart', 100);
      await dispatchTouch('touchmove', 200);
      await dispatchTouch('touchend', 200);

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(true);
      });

      // Try to trigger another refresh while first is in progress
      await dispatchTouch('touchstart', 100);
      await dispatchTouch('touchmove', 200);
      await dispatchTouch('touchend', 200);

      // Should only be called once
      expect(onRefreshMock).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolveRefresh!();
      });
    });
  });

  describe('Reset on Touch End', () => {
    it('should reset isPulling on touch end', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 150));
      });

      expect(result.current.isPulling).toBe(true);

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 150));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isPulling).toBe(false);
    });

    it('should reset pullDistance on touch end', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 150));
      });

      expect(result.current.pullDistance).toBeGreaterThan(0);

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 150));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(result.current.pullDistance).toBe(0);
      });
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress percentage', () => {
      const threshold = 100;
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 150)); // 50px down
      });

      // Progress should be (50/100) * 100 = 50%
      expect(result.current.progress).toBeGreaterThan(0);
      expect(result.current.progress).toBeLessThanOrEqual(100);
    });

    it('should cap progress at 100%', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 500)); // Very large pull
      });

      expect(result.current.progress).toBeLessThanOrEqual(100);
    });

    it('should show 0% progress when not pulling', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      expect(result.current.progress).toBe(0);
    });
  });

  describe('Options', () => {
    it('should use custom threshold', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 120, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200)); // 100px, below 120 threshold
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).not.toHaveBeenCalled();
    });

    it('should use custom resistance', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, resistance: 5 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200)); // 100px down
      });

      // With resistance 5, 100px pull = 20px distance
      expect(result.current.pullDistance).toBeLessThan(50);
    });

    it('should disable when enabled is false', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, enabled: false })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      expect(result.current.isPulling).toBe(false);
      expect(result.current.pullDistance).toBe(0);
    });

    it('should use default threshold of 80', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, resistance: 1 })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200)); // 100px, exceeds 80
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).toHaveBeenCalled();
    });

    it('should use default resistance of 2.5', () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock })
      );

      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200)); // 100px down
      });

      // With resistance 2.5, 100px pull = 40px distance
      expect(result.current.pullDistance).toBeGreaterThan(0);
      expect(result.current.pullDistance).toBeLessThan(100);
    });

    it('should be enabled by default', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => usePullToRefresh({ onRefresh: onRefreshMock }));

      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle complete pull-to-refresh cycle', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      // Start pull
      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
      });

      expect(result.current.isPulling).toBe(false);

      // Pull down
      act(() => {
        document.dispatchEvent(createTouchEvent('touchmove', 150));
      });

      expect(result.current.isPulling).toBe(true);
      expect(result.current.pullDistance).toBeGreaterThan(0);

      // Release to refresh
      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 150));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).toHaveBeenCalled();
      
      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
        expect(result.current.isPulling).toBe(false);
        expect(result.current.pullDistance).toBe(0);
      });
    });

    it('should handle multiple quick pulls', async () => {
      const { result } = renderHook(() =>
        usePullToRefresh({ onRefresh: onRefreshMock, threshold: 50, resistance: 1 })
      );

      // First pull (short)
      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 130));
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 130));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).not.toHaveBeenCalled();

      // Second pull (long enough)
      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      await act(async () => {
        document.dispatchEvent(createTouchEvent('touchend', 200));
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onRefreshMock).toHaveBeenCalledTimes(1);
    });

    it('should update event listeners when options change', () => {
      const { rerender } = renderHook(
        ({ onRefresh }) => usePullToRefresh({ onRefresh }),
        { initialProps: { onRefresh: onRefreshMock } }
      );

      const newOnRefresh = jest.fn().mockResolvedValue(undefined);

      rerender({ onRefresh: newOnRefresh });

      // Event listeners should be updated with new callback
      act(() => {
        document.dispatchEvent(createTouchEvent('touchstart', 100));
        document.dispatchEvent(createTouchEvent('touchmove', 200));
      });

      // New callback should be used
      expect(newOnRefresh).not.toHaveBeenCalled(); // Not called until touchend
    });
  });
});
