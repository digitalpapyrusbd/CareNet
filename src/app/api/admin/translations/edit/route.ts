import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { UserRole } from '@prisma/client';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOCALES_DIR = join(process.cwd(), 'src/lib/locales');

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Get authenticated user and verify SUPER_ADMIN role
    const user = getCurrentUser(request);
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Insufficient permissions: SUPER_ADMIN role required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { languageCode, key, value } = body;

    if (!languageCode || !key || value === undefined) {
      return NextResponse.json(
        { error: 'languageCode, key, and value are required' },
        { status: 400 }
      );
    }

    const filePath = join(LOCALES_DIR, `${languageCode.toLowerCase()}.json`);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Language file not found' },
        { status: 404 }
      );
    }

    // Read existing translations
    const content = await readFile(filePath, 'utf-8');
    const translations = JSON.parse(content);

    // Set nested key
    const keys = key.split('.');
    let current = translations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Write updated translations
    await writeFile(filePath, JSON.stringify(translations, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error editing translation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to edit translation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const languageCode = searchParams.get('languageCode');

    if (!languageCode) {
      return NextResponse.json(
        { error: 'languageCode is required' },
        { status: 400 }
      );
    }

    const filePath = join(LOCALES_DIR, `${languageCode.toLowerCase()}.json`);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Language file not found' },
        { status: 404 }
      );
    }

    const content = await readFile(filePath, 'utf-8');
    const translations = JSON.parse(content);

    return NextResponse.json({ translations });
  } catch (error: any) {
    console.error('Error loading translations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load translations' },
      { status: 500 }
    );
  }
}

