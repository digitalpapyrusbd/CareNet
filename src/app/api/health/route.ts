import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db-utils';

export async function GET() {
  try {
    // Check database connection
    const dbHealth = await checkDatabaseConnection();
    
    // Check environment variables
    const envHealth = {
      database: !!process.env.DATABASE_URL,
      jwt: !!process.env.JWT_SECRET,
      redis: !!process.env.UPSTASH_REDIS_URL,
    };

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: dbHealth,
      environmentVariables: envHealth,
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}