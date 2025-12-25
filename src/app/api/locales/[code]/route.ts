import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOCALES_DIR = join(process.cwd(), 'src/lib/locales');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
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

    return NextResponse.json(jsonData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error loading locale:', error);
    return NextResponse.json(
      { error: 'Failed to load locale file' },
      { status: 500 }
    );
  }
}
