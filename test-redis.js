const Redis = require("ioredis");

// Test Redis connection
async function testRedisConnection() {
  console.log("Testing Redis connection...");

  // Test with environment variables
  const upstashUrl = process.env.UPSTASH_REDIS_URL;
  const upstashToken = process.env.UPSTASH_REDIS_TOKEN;
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT || 6379;
  const redisPassword = process.env.REDIS_PASSWORD;

  console.log("Environment variables:");
  console.log("- UPSTASH_REDIS_URL:", upstashUrl ? "Set" : "Not set");
  console.log("- UPSTASH_REDIS_TOKEN:", upstashToken ? "Set" : "Not set");
  console.log("- REDIS_HOST:", redisHost || "localhost");
  console.log("- REDIS_PORT:", redisPort);
  console.log("- REDIS_PASSWORD:", redisPassword ? "Set" : "Not set");

  let redis;

  if (upstashUrl && upstashToken) {
    console.log("\\nTesting Upstash Redis connection...");
    try {
      redis = new Redis(upstashUrl, {
        password: upstashToken,
        tls: {},
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      await redis.ping();
      console.log("✅ Upstash Redis connection successful!");

      // Test basic operations
      await redis.set("test-key", "test-value");
      const value = await redis.get("test-key");
      await redis.del("test-key");

      console.log("✅ Basic Redis operations work!");
      console.log("Test value:", value);
    } catch (error) {
      console.error("❌ Upstash Redis connection failed:", error.message);
      if (error.code === "ENOTFOUND") {
        console.log("This is a DNS resolution error. Check your Upstash URL.");
      }
    }
  } else if (redisHost && redisHost.includes(".upstash.io") && redisPassword) {
    console.log("\\nTesting Upstash Redis connection (host/port format)...");
    try {
      redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        tls: {},
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      await redis.ping();
      console.log("✅ Upstash Redis connection successful!");

      // Test basic operations
      await redis.set("test-key", "test-value");
      const value = await redis.get("test-key");
      await redis.del("test-key");

      console.log("✅ Basic Redis operations work!");
      console.log("Test value:", value);
    } catch (error) {
      console.error("❌ Upstash Redis connection failed:", error.message);
      if (error.code === "ENOTFOUND") {
        console.log("This is a DNS resolution error. Check your Upstash host.");
      }
    }
  } else {
    console.log("\\nTesting standard Redis connection...");
    try {
      redis = new Redis({
        host: redisHost || "localhost",
        port: redisPort,
        password: redisPassword,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      await redis.ping();
      console.log("✅ Standard Redis connection successful!");

      // Test basic operations
      await redis.set("test-key", "test-value");
      const value = await redis.get("test-key");
      await redis.del("test-key");

      console.log("✅ Basic Redis operations work!");
      console.log("Test value:", value);
    } catch (error) {
      console.error("❌ Standard Redis connection failed:", error.message);
      if (error.code === "ENOTFOUND") {
        console.log("This is a DNS resolution error.");
      } else if (error.code === "ECONNREFUSED") {
        console.log(
          "This is a connection refused error. Check if Redis is running.",
        );
      }
    }
  }

  if (redis) {
    redis.disconnect();
  }
}

testRedisConnection().catch(console.error);
