import { useState, useEffect } from 'react';

export function useScroll(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // Only trigger if scroll amount is significant
      if (scrollDelta > 10) {
        if (currentScrollY < threshold) {
          setHidden(false);
        } else if (currentScrollY > lastScrollY) { // Scrolling DOWN
          setHidden(true);
        } else { // Scrolling UP
          setHidden(false);
        }
        setLastScrollY(currentScrollY);
      }

      setScrolled(currentScrollY > threshold);
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;

      const touchDelta = touchStart - e.touches[0].clientY;
      if (Math.abs(touchDelta) > 5) {
        setHidden(touchDelta > 0); // Reversed this condition
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [lastScrollY, threshold, touchStart]);

  return { scrolled, hidden };
}
