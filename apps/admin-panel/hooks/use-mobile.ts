import { useEffect, useState } from 'react';

/**
 * Hook to detect mobile screen size
 * @param breakpoint - Width threshold for mobile detection (default: 768px)
 * @returns boolean indicating if screen is mobile size
 */
export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}
