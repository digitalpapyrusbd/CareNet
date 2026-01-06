import Script from 'next/script';

export function PerformanceMonitoring() {
  return (
    <>
      {/* Web Vitals Monitoring */}
      <Script
        id="web-vitals"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Report Web Vitals to analytics
            function sendToAnalytics(metric) {
              const body = JSON.stringify({
                name: metric.name,
                value: metric.value,
                rating: metric.rating,
                delta: metric.delta,
                id: metric.id,
              });
              
              // Send to your analytics endpoint
              if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics/vitals', body);
              } else {
                fetch('/api/analytics/vitals', {
                  method: 'POST',
                  body,
                  keepalive: true,
                });
              }
            }

            // Initialize Web Vitals tracking
            if (typeof window !== 'undefined') {
              // Use a try-catch to handle missing web-vitals dependency gracefully
              try {
                import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
                  onCLS(sendToAnalytics);
                  onFID(sendToAnalytics);
                  onFCP(sendToAnalytics);
                  onLCP(sendToAnalytics);
                  onTTFB(sendToAnalytics);
                  onINP(sendToAnalytics);
                }).catch((error) => {
                  console.warn('Web Vitals library not available:', error);
                });
              } catch (error) {
                console.warn('Failed to load Web Vitals:', error);
              }
            }
          `,
        }}
      />

      {/* Fonts are loaded via next/font/google (Inter) - no local preload needed */}

      {/* DNS Prefetch for API */}
      <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || ''} />
      <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || ''} />

      {/* Preconnect to CDN if enabled */}
      {process.env.CDN_ENABLED === 'true' && process.env.CDN_URL && (
        <>
          <link rel="dns-prefetch" href={process.env.CDN_URL} />
          <link rel="preconnect" href={process.env.CDN_URL} crossOrigin="anonymous" />
        </>
      )}
    </>
  );
}