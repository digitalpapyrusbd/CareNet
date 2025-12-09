/**
 * Performance monitoring middleware for Next.js API routes
 * Tracks response times, memory usage, and performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { performance } from 'perf_hooks';
import { performanceMonitor } from '@/lib/performance';
import React from 'react';

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  FAST: 100,      // Excellent performance
  GOOD: 200,      // Good performance
  ACCEPTABLE: 500, // Acceptable performance
  SLOW: 1000,     // Slow performance
} as const;

// Performance monitoring middleware
export function performanceMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    
    // Generate unique request ID for tracking
    const requestId = Math.random().toString(36).substring(7);
    
    try {
      // Execute the original handler
      const response = await handler(req);
      
      // Calculate performance metrics
      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      const responseTime = endTime - startTime;
      const memoryDelta = {
        rss: endMemory.rss - startMemory.rss,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      };
      
      // Determine performance level
      let performanceLevel = 'EXCELLENT';
      let performanceColor = '#22c55e'; // green
      
      if (responseTime > PERFORMANCE_THRESHOLDS.SLOW) {
        performanceLevel = 'SLOW';
        performanceColor = '#ef4444'; // red
      } else if (responseTime > PERFORMANCE_THRESHOLDS.ACCEPTABLE) {
        performanceLevel = 'ACCEPTABLE';
        performanceColor = '#f59e0b'; // amber
      } else if (responseTime > PERFORMANCE_THRESHOLDS.GOOD) {
        performanceLevel = 'GOOD';
        performanceColor = '#3b82f6'; // blue
      } else if (responseTime > PERFORMANCE_THRESHOLDS.FAST) {
        performanceLevel = 'FAST';
        performanceColor = '#10b981'; // emerald
      }
      
      // Log performance metrics
      const logData = {
        requestId,
        method: req.method,
        url: req.url,
        responseTime: `${responseTime.toFixed(2)}ms`,
        performanceLevel,
        memoryUsage: {
          current: endMemory,
          delta: memoryDelta,
        },
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
      
      // Log to console (in production, this would go to a monitoring service)
      if (responseTime > PERFORMANCE_THRESHOLDS.ACCEPTABLE) {
        console.warn(`⚠️  Slow API Response:`, logData);
      } else {
        console.log(`📊 Performance:`, logData);
      }
      
      // Add performance headers to response
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);
      response.headers.set('X-Performance-Level', performanceLevel);
      response.headers.set('X-Memory-Usage', JSON.stringify(endMemory));
      
      // Record metrics for monitoring
      performanceMonitor.startTiming();
      performanceMonitor.endTiming('api');
      
      return response;
      
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log error with performance data
      console.error(`❌ API Error:`, {
        requestId,
        method: req.method,
        url: req.url,
        responseTime: `${responseTime.toFixed(2)}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    }
  };
}

// Performance monitoring for client-side navigation
export function trackPagePerformance(pageName: string) {
  if (typeof window !== 'undefined') {
    // Track page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation' as any)[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      console.log(`📄 Page Performance: ${pageName}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint' as any)[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint' as any)[1]?.startTime,
      });
      
      // Send to analytics service in production
      if (process.env.NODE_ENV === 'production') {
        // gtag('event', 'page_performance', {
        //   page_name: pageName,
        //   load_time: loadTime,
        // });
      }
    });
    
    // Track Core Web Vitals
    // Note: web-vitals library would need to be installed separately
    // if ('web-vitals' in window) {
    //   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //     getCLS((metric: any) => console.log(`CLS: ${metric.name}`, metric));
    //     getFID((metric: any) => console.log(`FID: ${metric.name}`, metric));
    //     getFCP((metric: any) => console.log(`FCP: ${metric.name}`, metric));
    //     getLCP((metric: any) => console.log(`LCP: ${metric.name}`, metric));
    //     getTTFB((metric: any) => console.log(`TTFB: ${metric.name}`, metric));
    //   });
    // }
  }
}

// Database query performance monitoring
export function trackDatabaseQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  const startMemory = process.memoryUsage();
  
  return query()
    .then((result) => {
      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      const queryTime = endTime - startTime;
      
      const metrics = {
        queryName,
        queryTime: `${queryTime.toFixed(2)}ms`,
        memoryDelta: {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };
      
      // Log slow queries
      if (queryTime > 100) {
        console.warn(`🐌 Slow Query:`, metrics);
      } else {
        console.log(`💾 Database Query:`, metrics);
      }
      
      return result;
    })
    .catch((error) => {
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      console.error(`❌ Query Error:`, {
        queryName,
        queryTime: `${queryTime.toFixed(2)}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    });
}

// Performance monitoring for React components
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const TrackedComponent = (props: P) => {
    if (typeof window !== 'undefined') {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        console.log(`⚛️  Component Render: ${componentName}`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });
        
        performanceMonitor.startTiming();
        performanceMonitor.endTiming('render');
      });
    }
    
    return React.createElement(Component, props);
  };
  
  TrackedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return TrackedComponent;
}

// Performance alerting system
export class PerformanceAlerts {
  private static alerts: Map<string, number> = new Map();
  
  static checkThresholds(
    metric: string,
    value: number,
    threshold: number,
    alertMessage: string
  ): void {
    if (value > threshold) {
      const alertCount = this.alerts.get(metric) || 0;
      this.alerts.set(metric, alertCount + 1);
      
      // Only alert every 5th occurrence to avoid spam
      if (alertCount % 5 === 0) {
        console.warn(`🚨 Performance Alert: ${alertMessage}`, {
          metric,
          value,
          threshold,
          alertCount,
          timestamp: new Date().toISOString(),
        });
        
        // In production, send to monitoring service
        if (process.env.NODE_ENV === 'production') {
          // Send alert to monitoring service
        }
      }
    } else {
      // Reset alert count when performance improves
      this.alerts.delete(metric);
    }
  }
  
  static checkMemoryUsage(): void {
    const memory = process.memoryUsage();
    const memoryThreshold = 1024 * 1024 * 1024; // 1GB
    
    this.checkThresholds(
      'memory_usage',
      memory.heapUsed,
      memoryThreshold,
      `High memory usage detected: ${(memory.heapUsed / 1024 / 1024).toFixed(2)}MB`
    );
  }
  
  static checkResponseTime(endpoint: string, responseTime: number): void {
    const responseTimeThreshold = 1000; // 1 second
    
    this.checkThresholds(
      `response_time_${endpoint}`,
      responseTime,
      responseTimeThreshold,
      `Slow response time for ${endpoint}: ${responseTime.toFixed(2)}ms`
    );
  }
}

// Performance monitoring utilities
export const performanceUtils = {
  // Measure function execution time
  measureTime: async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);
    return { result, duration };
  },
  
  // Create performance marker
  mark: (name: string): void => {
    if (typeof window !== 'undefined') {
      performance.mark(name);
    }
  },
  
  // Measure time between markers
  measure: (name: string, startMark: string, endMark?: string): number => {
    if (typeof window !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        return measure ? measure.duration : 0;
      } catch (error) {
        console.warn(`Performance measure failed: ${name}`, error);
        return 0;
      }
    }
    return 0;
  },
};

export default {
  performanceMiddleware,
  trackPagePerformance,
  trackDatabaseQuery,
  withPerformanceTracking,
  PerformanceAlerts,
  performanceUtils,
};