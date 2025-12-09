/**
 * CDN Service Configuration
 * Handles CDN configuration for image optimization and static assets
 */

interface CDNConfig {
  baseUrl: string;
  enabled: boolean;
  regions: string[];
  cacheTTL: number;
}

class CDNService {
  private config: CDNConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load CDN configuration from environment variables
   */
  private loadConfig(): CDNConfig {
    return {
      baseUrl: process.env.CDN_URL || 'https://cdn.caregiver-platform.com',
      enabled: process.env.CDN_ENABLED === 'true',
      regions: ['us-east-1', 'ap-south-1'], // Bangladesh would use ap-south-1
      cacheTTL: parseInt(process.env.CDN_CACHE_TTL || '2592000'), // 30 days in seconds
    };
  }

  /**
   * Get current CDN configuration
   */
  getConfig(): CDNConfig {
    return this.config;
  }

  /**
   * Check if CDN is configured and enabled
   */
  isConfigured(): boolean {
    return this.config.enabled && this.config.baseUrl.length > 0;
  }

  /**
   * Get optimized image URL for CDN
   */
  getOptimizedImageUrl(src: string, options?: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  }): string {
    if (!this.isConfigured()) {
      return src;
    }

    const url = new URL(src, this.config.baseUrl);
    const params = new URLSearchParams();

    if (options?.width) {
      params.set('w', options.width.toString());
    }

    if (options?.quality) {
      params.set('q', options.quality.toString());
    }

    if (options?.format && options.format !== 'auto') {
      params.set('f', options.format);
    }

    const queryString = params.toString();
    return queryString ? `${url.toString()}?${queryString}` : url.toString();
  }

  /**
   * Get CDN domain for image optimization
   */
  getImageDomain(): string {
    if (!this.isConfigured()) {
      return '';
    }
    
    try {
      return new URL(this.config.baseUrl).hostname;
    } catch (error) {
      console.warn('Invalid CDN URL:', error);
      return '';
    }
  }

  /**
   * Get cache headers for CDN responses
   */
  getCacheHeaders(): Record<string, string> {
    if (!this.isConfigured()) {
      return {
        'Cache-Control': 'public, max-age=31536000, immutable',
      };
    }

    return {
      'Cache-Control': `public, max-age=${this.config.cacheTTL}, immutable`,
      'X-CDN-Cache-Status': 'HIT',
      'X-CDN-Provider': 'caregiver-platform-cdn',
    };
  }

  /**
   * Purge CDN cache for specific URLs
   */
  async purgeCache(urls: string[]): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('CDN not configured, skipping cache purge');
      return true;
    }

    try {
      // Implementation would depend on CDN provider
      // This is a placeholder for CDN API calls
      const purgeEndpoint = `${this.config.baseUrl}/api/cache/purge`;
      
      const response = await fetch(purgeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CDN_API_KEY}`,
        },
        body: JSON.stringify({ urls }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to purge CDN cache:', error);
      return false;
    }
  }

  /**
   * Get CDN statistics
   */
  async getStats(): Promise<{
    hits: number;
    misses: number;
    bandwidth: number;
  } | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const statsEndpoint = `${this.config.baseUrl}/api/stats`;
      
      const response = await fetch(statsEndpoint, {
        headers: {
          'Authorization': `Bearer ${process.env.CDN_API_KEY}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch CDN stats:', error);
      return null;
    }
  }
}

// Singleton instance
const cdnService = new CDNService();

// Helper function to use the singleton instance
export function getOptimizedImageUrl(src: string, options?: {
  width?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}): string {
  return cdnService.getOptimizedImageUrl(src, options);
}

export default cdnService;
export { CDNService, type CDNConfig };