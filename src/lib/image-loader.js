/**
 * Custom image loader for CDN integration
 * Handles image optimization and CDN URL generation
 */

const cdnService = require('./cdn-service');

/**
 * Custom webpack image loader
 */
module.exports = function imageLoader(content) {
  const config = this.getOptions();
  const { resourcePath } = this;
  
  // Get CDN configuration
  const cdnConfig = cdnService.getConfig();
  
  // If CDN is not configured, return original content
  if (!cdnService.isConfigured()) {
    return content;
  }
  
  // Process image based on configuration
  try {
    // For Next.js image optimization
    if (config.loaderFile === './src/lib/image-loader.js') {
      const imageOptimization = {
        loader: 'custom',
        loaderFile: './src/lib/image-loader.js',
        path: `${cdnConfig.baseUrl}/_next/static/image`,
        minimumCacheTTL: cdnConfig.cacheTTL,
        formats: [
          {
            name: 'avif',
            format: 'avif',
          },
          {
            name: 'webp',
            format: 'webp',
          },
        ],
      };
      
      return JSON.stringify(imageOptimization);
    }
    
    return content;
  } catch (error) {
    console.error('Image loader error:', error);
    return content;
  }
};

module.exports.raw = true;