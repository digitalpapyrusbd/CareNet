import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/middleware/api-auth';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOCALES_DIR = join(process.cwd(), 'src/lib/locales');

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const code = params.code.toLowerCase();
    const filePath = join(LOCALES_DIR, `${code}.json`);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Language file not found' },
        { status: 404 }
      );
    }

    const content = await readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(content);

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(jsonData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${code}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Error downloading language:', error);
    return NextResponse.json(
      { error: 'Failed to download language file' },
      { status: 500 }
    );
  }
}
