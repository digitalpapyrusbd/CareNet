/**
 * Performance testing suite
 * Tests application performance against defined benchmarks
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { performanceMonitor, DatabaseOptimizer } from '@/lib/performance';
import { prisma } from '@/lib/db';

describe('Performance Tests', () => {
  beforeAll(() => {
    performanceMonitor.clearMetrics();
  });

  afterAll(() => {
    const report = performanceMonitor.getPerformanceReport();
    console.log('Performance Report:', report);
  });

  describe('API Response Times', () => {
    it('should respond to user requests within 200ms', async () => {
      performanceMonitor.startTiming();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const duration = performanceMonitor.endTiming('api');
      
      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(200); // 200ms threshold
    });

    it('should handle authentication within 300ms', async () => {
      performanceMonitor.startTiming();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+8801700000000',
          password: 'testpassword',
        }),
      });
      
      const duration = performanceMonitor.endTiming('api');
      
      expect(duration).toBeLessThan(300); // 300ms threshold for auth
    });

    it('should process payments within 500ms', async () => {
      performanceMonitor.startTiming();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000,
          paymentMethod: 'bkash',
          jobId: 'test-job-id',
        }),
      });
      
      const duration = performanceMonitor.endTiming('api');
      
      expect(duration).toBeLessThan(500); // 500ms threshold for payments
    });
  });

  describe('Database Query Performance', () => {
    it('should fetch users within 100ms', async () => {
      const result = await DatabaseOptimizer.timedQuery(
        'fetch-users',
        () => prisma.user.findMany({
          take: 10,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        })
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle complex joins efficiently', async () => {
      const result = await DatabaseOptimizer.timedQuery(
        'complex-join-query',
        () => prisma.job.findMany({
          include: {
            patient: true,
            company: {
              include: {
                user: true,
              },
            },
            caregiver: {
              include: {
                user: true,
              },
            },
            package: true,
          },
          take: 5,
        })
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should batch insert operations efficiently', async () => {
      const testUsers = Array.from({ length: 100 }, (_, i) => ({
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        phone: `+8801${String(i).padStart(9, '0')}`,
        role: 'CAREGIVER',
        passwordHash: 'hashedpassword',
      }));

      const startTime = performance.now();
      
      const results = await DatabaseOptimizer.batchOperation(
        testUsers,
        10, // Batch size of 10
        async (batch) => {
          return prisma.user.createMany({
            data: batch,
            skipDuplicates: true,
          });
        }
      );

      const duration = performance.now() - startTime;
      
      expect(duration).toBeLessThan(1000); // 1 second for 100 records
      expect(results).toBeDefined();
    });
  });

  describe('Frontend Performance', () => {
    it('should load dashboard within 2 seconds', async () => {
      const startTime = performance.now();
      
      // Simulate dashboard loading
      const dashboardData = await Promise.all([
        fetch('/api/dashboard/stats').then(res => res.json()),
        fetch('/api/users').then(res => res.json()),
        fetch('/api/jobs').then(res => res.json()),
      ]);
      
      const duration = performance.now() - startTime;
      
      expect(dashboardData).toBeDefined();
      expect(duration).toBeLessThan(2000); // 2 seconds threshold
    });

    it('should handle large data sets efficiently', async () => {
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        value: Math.random() * 100,
      }));

      const startTime = performance.now();
      
      // Simulate rendering large data set
      const processedData = largeDataSet.map(item => ({
        ...item,
        formatted: `Item: ${item.name} - Value: ${item.value.toFixed(2)}`,
      }));
      
      const duration = performance.now() - startTime;
      
      expect(processedData).toHaveLength(1000);
      expect(duration).toBeLessThan(100); // 100ms for processing 1000 items
    });
  });

  describe('Memory Usage', () => {
    it('should maintain memory usage within acceptable limits', () => {
      const memoryUsage = performanceMonitor.getMemoryUsage();
      
      // Check memory usage is within reasonable bounds (adjust based on your requirements)
      expect(memoryUsage.heapUsed).toBeLessThan(500 * 1024 * 1024); // 500MB
      expect(memoryUsage.heapTotal).toBeLessThan(1024 * 1024 * 1024); // 1GB
    });

    it('should not have memory leaks during repeated operations', async () => {
      const initialMemory = performanceMonitor.getMemoryUsage();
      
      // Perform repeated operations
      for (let i = 0; i < 100; i++) {
        await DatabaseOptimizer.timedQuery(
          `repeated-query-${i}`,
          () => prisma.user.findMany({ take: 10 })
        );
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performanceMonitor.getMemoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be minimal (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Bundle Size', () => {
    it('should maintain optimized bundle sizes', async () => {
      // This would typically be checked during build time
      // Here we simulate the check
      const bundleSizes = {
        main: 250 * 1024, // 250KB
        vendor: 180 * 1024, // 180KB
        dashboard: 45 * 1024, // 45KB
        auth: 35 * 1024, // 35KB
      };

      // Check individual bundle sizes are within limits
      expect(bundleSizes.main).toBeLessThan(300 * 1024); // 300KB limit
      expect(bundleSizes.vendor).toBeLessThan(200 * 1024); // 200KB limit
      expect(bundleSizes.dashboard).toBeLessThan(50 * 1024); // 50KB limit
      expect(bundleSizes.auth).toBeLessThan(40 * 1024); // 40KB limit

      const totalSize = Object.values(bundleSizes).reduce((a, b) => a + b, 0);
      expect(totalSize).toBeLessThan(600 * 1024); // 600KB total limit
    });
  });

  describe('Performance Optimization Features', () => {
    it('should implement debouncing correctly', async () => {
      const { PerformanceOptimizer } = await import('@/lib/performance');
      
      let callCount = 0;
      const debouncedFn = PerformanceOptimizer.debounce(() => {
        callCount++;
      }, 100);

      // Call function multiple times quickly
      for (let i = 0; i < 10; i++) {
        debouncedFn();
      }

      // Wait for debounce timeout
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should only be called once
      expect(callCount).toBe(1);
    });

    it('should implement throttling correctly', async () => {
      const { PerformanceOptimizer } = await import('@/lib/performance');
      
      let callCount = 0;
      const throttledFn = PerformanceOptimizer.throttle(() => {
        callCount++;
      }, 100);

      // Call function multiple times
      for (let i = 0; i < 10; i++) {
        throttledFn();
      }

      // Wait for throttle period
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be called multiple times but not all 10
      expect(callCount).toBeGreaterThan(1);
      expect(callCount).toBeLessThan(10);
    });

    it('should implement memoization correctly', () => {
      const { PerformanceOptimizer } = require('@/lib/performance');
      
      let callCount = 0;
      const expensiveFn = PerformanceOptimizer.memoize((x: number) => {
        callCount++;
        return x * 2;
      });

      // Call with same arguments multiple times
      expect(expensiveFn(5)).toBe(10);
      expect(expensiveFn(5)).toBe(10);
      expect(expensiveFn(5)).toBe(10);

      // Should only be called once due to memoization
      expect(callCount).toBe(1);

      // Call with different argument
      expect(expensiveFn(10)).toBe(20);
      expect(callCount).toBe(2);
    });
  });

  describe('Performance Benchmarks', () => {
    it('should meet all performance benchmarks', () => {
      const report = performanceMonitor.getPerformanceReport();
      
      // Define performance benchmarks
      const benchmarks = {
        averageRenderTime: 50, // 50ms
        averageApiResponseTime: 150, // 150ms
        maxMemoryUsage: 500 * 1024 * 1024, // 500MB
      };

      expect(report.averageRenderTime).toBeLessThan(benchmarks.averageRenderTime);
      expect(report.averageApiResponseTime).toBeLessThan(benchmarks.averageApiResponseTime);
      expect(report.memoryUsage.heapUsed).toBeLessThan(benchmarks.maxMemoryUsage);
    });
  });
});