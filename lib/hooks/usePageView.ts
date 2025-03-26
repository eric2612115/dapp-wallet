// hooks/usePageView.ts
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to track page views
 * This is a simple implementation that could be expanded to work with analytics services
 */
export default function usePageView() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Log page view for analytics
    console.log(`Page view: ${pathname}`);
    
    // Here you would typically call your analytics service
    // Example: analytics.pageView(pathname);
  }, [pathname]);
  
  return null;
}