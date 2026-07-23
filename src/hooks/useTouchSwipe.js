import { useRef, useEffect } from "react";

/**
 * Custom hook for detecting touch swipe gestures (left, right, up, down)
 */
export function useTouchSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minDistance = 50 }) {
  const touchStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = (e) => {
      if (!touchStartPos.current.x || !touchStartPos.current.y) return;

      const touchEndPosX = e.changedTouches[0].clientX;
      const touchEndPosY = e.changedTouches[0].clientY;

      const distanceX = touchStartPos.current.x - touchEndPosX;
      const distanceY = touchStartPos.current.y - touchEndPosY;

      const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

      if (isHorizontal) {
        if (distanceX > minDistance && onSwipeLeft) {
          onSwipeLeft();
        } else if (distanceX < -minDistance && onSwipeRight) {
          onSwipeRight();
        }
      } else {
        if (distanceY > minDistance && onSwipeUp) {
          onSwipeUp();
        } else if (distanceY < -minDistance && onSwipeDown) {
          onSwipeDown();
        }
      }

      touchStartPos.current = { x: 0, y: 0 };
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minDistance]);
}
