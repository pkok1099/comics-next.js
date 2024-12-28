import { useState, useEffect, useCallback } from 'react';

const useScrollVisibility = (isDropdownOpen: boolean) => {
  const [buttonVisible, setButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScrollY;

    if (Math.abs(scrollDelta) > 5 && !isDropdownOpen) {
      setButtonVisible(scrollDelta < 0);
    }
    setLastScrollY(currentScroll);
  }, [lastScrollY, isDropdownOpen]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { buttonVisible };
};

export default useScrollVisibility;
