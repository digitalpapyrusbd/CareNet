import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/api-auth';
import { UserRole } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOCALES_DIR = join(process.cwd(), 'src/lib/locales');

export const GET = withRoles([UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN])(async (
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) => {
  try {

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
});
