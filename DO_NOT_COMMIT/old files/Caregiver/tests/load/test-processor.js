/**
 * Custom processor for Artillery load testing
 * Handles response processing and custom metrics
 */

module.exports = {
  // Process HTTP responses
  responseProcessor: (requestParams, response, context, ee, userContext) => {
    const { statusCode } = response;
    const { url } = requestParams;
    
    // Log response times for analysis
    if (statusCode >= 200 && statusCode < 300) {
      ee.emit('counter', `http.${statusCode}.ok`, 1);
    } else {
      ee.emit('counter', `http.${statusCode}.error`, 1);
    }
    
    // Track endpoint-specific metrics
    const endpoint = url.split('/').pop() || 'root';
    ee.emit('histogram', `endpoint.${endpoint}.response_time`, response.timings.phases.total);
    
    return response;
  },
  
  // Custom metrics processor
  metricsProcessor: (metrics, events) => {
    // Calculate success rate
    const totalRequests = metrics.http.requests;
    const successfulRequests = metrics.http['2xx'] || 0;
    const successRate = (successfulRequests / totalRequests) * 100;
    
    console.log(`\n📊 Load Test Results:`);
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Average Response Time: ${metrics.http.response_time.mean.toFixed(2)}ms`);
    console.log(`95th Percentile: ${metrics.http.response_time.p95.toFixed(2)}ms`);
    console.log(`99th Percentile: ${metrics.http.response_time.p99.toFixed(2)}ms`);
    
    // Performance thresholds check
    if (successRate < 99) {
      console.warn(`⚠️  Low success rate: ${successRate.toFixed(2)}% (target: >99%)`);
    }
    
    if (metrics.http.response_time.p95 > 1000) {
      console.warn(`⚠️  High 95th percentile: ${metrics.http.response_time.p95.toFixed(2)}ms (target: <1000ms)`);
    }
    
    if (metrics.http.response_time.mean > 500) {
      console.warn(`⚠️  High average response time: ${metrics.http.response_time.mean.toFixed(2)}ms (target: <500ms)`);
    }
    
    return metrics;
  },
  
  // Error handler
  errorHandler: (err, context) => {
    console.error(`❌ Load Test Error:`, err);
    return {
      error: err.message,
      timestamp: new Date().toISOString(),
      context: context
    };
  }
};