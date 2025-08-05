import { useEffect } from 'react';

// Mobile optimization hooks and utilities
export const useMobileOptimization = () => {
  useEffect(() => {
    // Prevent zoom on input focus (iOS)
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }

    // Handle iOS safe area
    const handleSafeArea = () => {
      const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0px';
      const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0px';
      
      document.documentElement.style.setProperty('--safe-area-top', safeAreaTop);
      document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom);
    };

    handleSafeArea();
    window.addEventListener('resize', handleSafeArea);
    
    return () => {
      window.removeEventListener('resize', handleSafeArea);
    };
  }, []);
};

// Add mobile-specific CSS classes
export const mobileClasses = {
  touchOptimized: 'touch-manipulation select-none',
  safeArea: 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
  mobileContainer: 'px-4 md:px-6 lg:px-8',
  mobileButton: 'min-h-[44px] min-w-[44px]', // iOS Human Interface Guidelines
  mobileInput: 'text-base md:text-sm', // Prevent zoom on iOS
  mobileTap: 'active:scale-95 transition-transform duration-75'
};

export default { useMobileOptimization, mobileClasses };