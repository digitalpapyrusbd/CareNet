/**
 * Performance monitoring and optimization utilities
 * Provides tools for measuring and improving application performance
 */

import { performance } from 'perf_hooks';

// Performance metrics interface
interface PerformanceMetrics {
  renderTime: number;
  apiResponseTime: number;
  bundleSize: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: Date;
}

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;

  /**
   * Start timing a performance measurement
   */
  startTiming(): void {
    this.startTime = performance.now();
  }

  /**
   * End timing and record the duration
   */
  endTiming(operation: string): number {
    const duration = performance.now() - this.startTime;
    this.recordMetric(operation, duration);
    return duration;
  }

  /**
   * Record a performance metric
   */
  private recordMetric(operation: string, duration: number): void {
    const metric: Partial<PerformanceMetrics> = {
      timestamp: new Date(),
    };

    switch (operation) {
      case 'render':
        metric.renderTime = duration;
        break;
      case 'api':
        metric.apiResponseTime = duration;
        break;
      default:
        // Generic timing
        metric.renderTime = duration;
    }

    this.metrics.push(metric as PerformanceMetrics);
  }

  /**
   * Get current memory usage
   */
  getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    averageRenderTime: number;
    averageApiResponseTime: number;
    totalMetrics: number;
    memoryUsage: NodeJS.MemoryUsage;
  } {
    const renderTimes = this.metrics
      .filter(m => m.renderTime)
      .map(m => m.renderTime);
    
    const apiTimes = this.metrics
      .filter(m => m.apiResponseTime)
      .map(m => m.apiResponseTime);

    return {
      averageRenderTime: renderTimes.length > 0 
        ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
        : 0,
      averageApiResponseTime: apiTimes.length > 0 
        ? apiTimes.reduce((a, b) => a + b, 0) / apiTimes.length 
        : 0,
      totalMetrics: this.metrics.length,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Performance monitoring singleton
export const performanceMonitor = new PerformanceMonitor();

// Performance optimization utilities
export class PerformanceOptimizer {
  /**
   * Debounce function for performance optimization
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function for performance optimization
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Memoize function results for performance optimization
   */
  static memoize<T extends (...args: any[]) => any>(
    func: T
  ): (...args: Parameters<T>) => ReturnType<T> {
    const cache = new Map();
    return (...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    };
  }

  /**
   * Lazy load images for performance optimization
   */
  static lazyLoadImages(): void {
    if (typeof window !== 'undefined') {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  /**
   * Optimize bundle loading with code splitting
   */
  static async loadComponent(componentPath: string): Promise<any> {
    try {
      const component = await import(componentPath);
      return component.default;
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      throw error;
    }
  }
}

// Performance middleware for API routes
export function withPerformanceMonitoring(
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    const startTime = performance.now();
    
    try {
      const response = await handler(req);
      const duration = performance.now() - startTime;
      
      // Log performance metrics
      console.log(`API Performance: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${duration.toFixed(2)}ms`);
      
      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`API Error: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };
}

// Database query optimization utilities
export class DatabaseOptimizer {
  /**
   * Add database query timing
   */
  static async timedQuery<T>(
    queryName: string,
    query: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await query();
      const duration = performance.now() - startTime;
      
      // Log slow queries (>100ms)
      if (duration > 100) {
        console.warn(`Slow Query Detected: ${queryName} - ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`Query Error: ${queryName} - ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * Batch database operations for better performance
   */
  static async batchOperation<T, R>(
    items: T[],
    batchSize: number,
    operation: (batch: T[]) => Promise<R[]>
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await operation(batch);
      results.push(...batchResults);
    }
    
    return results;
  }
}

// Frontend performance optimization utilities
export class FrontendOptimizer {
  /**
   * Optimize images with WebP format
   */
  static optimizeImageSrc(src: string, options?: {
    width?: number;
    quality?: number;
  }): string {
    const params = new URLSearchParams();
    
    if (options?.width) {
      params.set('w', options.width.toString());
    }
    
    if (options?.quality) {
      params.set('q', options.quality.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${src}?${queryString}` : src;
  }

  /**
   * Preload critical resources
   */
  static preloadResources(resources: string[]): void {
    if (typeof window !== 'undefined') {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        
        if (resource.endsWith('.css')) {
          link.as = 'style';
        } else if (resource.endsWith('.js')) {
          link.as = 'script';
        } else if (resource.match(/\.(jpg|jpeg|png|webp)$/i)) {
          link.as = 'image';
        }
        
        document.head.appendChild(link);
      });
    }
  }

  /**
   * Implement virtual scrolling for large lists
   */
  static createVirtualScrollContainer(
    containerElement: HTMLElement,
    itemHeight: number,
    renderItem: (index: number) => HTMLElement
  ): void {
    let startIndex = 0;
    let visibleItems = Math.ceil(containerElement.clientHeight / itemHeight) + 2;
    
    const updateVisibleItems = () => {
      const scrollTop = containerElement.scrollTop;
      startIndex = Math.floor(scrollTop / itemHeight);
      
      // Clear container
      containerElement.innerHTML = '';
      
      // Render visible items
      for (let i = startIndex; i < startIndex + visibleItems; i++) {
        const item = renderItem(i);
        item.style.position = 'absolute';
        item.style.top = `${i * itemHeight}px`;
        containerElement.appendChild(item);
      }
    };
    
    containerElement.addEventListener('scroll', 
      PerformanceOptimizer.throttle(updateVisibleItems, 16)
    );
    
    updateVisibleItems();
  }
}

export default {
  performanceMonitor,
  PerformanceOptimizer,
  DatabaseOptimizer,
  FrontendOptimizer,
  withPerformanceMonitoring,
};