const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// Read .env manually to avoid dependency issues
const envPath = path.join(process.cwd(), '.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            envVars[match[1]] = value;
        }
    });

    if (!envVars.UPSTASH_REDIS_REST_URL || !envVars.UPSTASH_REDIS_REST_TOKEN) {
        console.error('❌ Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in .env');
        process.exit(1);
    }

    const redis = new Redis({
        url: envVars.UPSTASH_REDIS_REST_URL,
        token: envVars.UPSTASH_REDIS_REST_TOKEN,
    });

    async function test() {
        console.log('Testing Redis connection...');
        console.log(`URL: ${envVars.UPSTASH_REDIS_REST_URL}`);
        try {
            await redis.set('test_connection_verification', 'working');
            const value = await redis.get('test_connection_verification');

            if (value === 'working') {
                console.log('✅ Redis connection successful! Test key set and retrieved.');
                await redis.del('test_connection_verification'); // Clean up
                process.exit(0);
            } else {
                console.error('❌ Redis connection established but value mismatch:', value);
                process.exit(1);
            }
        } catch (error) {
            console.error('❌ Redis connection failed:', error.message);
            console.error(error);
            process.exit(1);
        }
    }

    test();

} catch (err) {
    console.error('Failed to read .env file:', err.message);
    process.exit(1);
}
