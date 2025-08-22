import { useEffect } from 'react';

export const usePagePerformance = (pageName: string) => {
  useEffect(() => {
    // Measure page load performance
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0];
          
          // Log performance metrics (in production, you'd send these to an analytics service)
          console.group(`Performance Metrics - ${pageName}`);
          console.log(`Page Load Time: ${Math.round(pageLoadTime)}ms`);
          console.log(`DOM Content Loaded: ${Math.round(domContentLoaded)}ms`);
          if (firstContentfulPaint) {
            console.log(`First Contentful Paint: ${Math.round(firstContentfulPaint.startTime)}ms`);
          }
          console.groupEnd();
          
          // Warn if performance is poor
          if (pageLoadTime > 3000) {
            console.warn(`Slow page load detected for ${pageName}: ${Math.round(pageLoadTime)}ms`);
          }
        }
      }
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [pageName]);
};

export const useAPIPerformance = () => {
  const measureAPICall = (endpoint: string, startTime: number, endTime: number, success: boolean) => {
    const duration = endTime - startTime;
    
    console.group(`API Performance - ${endpoint}`);
    console.log(`Duration: ${Math.round(duration)}ms`);
    console.log(`Status: ${success ? 'Success' : 'Failed'}`);
    console.groupEnd();
    
    // Warn if API call is slow
    if (duration > 2000) {
      console.warn(`Slow API call detected for ${endpoint}: ${Math.round(duration)}ms`);
    }
  };

  return { measureAPICall };
};
