import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { offlineService } from '@/lib/offline-service';
import { z } from 'zod';

const syncSchema = z.object({
  lastSyncTime: z.string().optional(),
  force: z.boolean().default(false),
});

// Only authenticated users can sync data
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    const user = (request as any).user;

    // Parse request body
    const body = await request.json();
    const validatedData = syncSchema.parse(body);

    // Force sync if requested
    if (validatedData.force) {
      await offlineService.forceSync();
    }

    // Get sync status
    const syncStatus = await offlineService.getSyncStatus();

    return NextResponse.json(
      {
        success: true,
        syncStatus,
        message: 'Sync status retrieved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync status error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get offline data for specific type
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Get data type from query
    const url = new URL(request.url);
    const dataType = url.searchParams.get('type');
    
    if (!dataType) {
      return NextResponse.json(
        { error: 'Data type is required' },
        { status: 400 }
      );
    }

    // Get offline data
    const offlineData = await offlineService.getOfflineData(dataType);

    return NextResponse.json(
      {
        success: true,
        data: offlineData,
        count: offlineData.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get offline data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Clear offline data
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Get data type from query
    const url = new URL(request.url);
    const dataType = url.searchParams.get('type');
    
    if (!dataType) {
      return NextResponse.json(
        { error: 'Data type is required' },
        { status: 400 }
      );
    }

    // Clear offline data
    await offlineService.clearOfflineData();

    return NextResponse.json(
      {
        success: true,
        message: 'Offline data cleared successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Clear offline data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}