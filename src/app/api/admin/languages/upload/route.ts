import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/middleware/api-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOCALES_DIR = join(process.cwd(), 'src/lib/locales');

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const languageCode = formData.get('languageCode') as string;

    if (!file || !languageCode) {
      return NextResponse.json(
        { error: 'File and language code are required' },
        { status: 400 }
      );
    }

    // Validate language code (ISO 639-1: 2 letters)
    if (!/^[a-z]{2}$/.test(languageCode.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid language code. Must be 2 lowercase letters (ISO 639-1)' },
        { status: 400 }
      );
    }

    // Read and validate JSON
    const fileContent = await file.text();
    let translationData;
    
    try {
      translationData = JSON.parse(fileContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      );
    }

    // Validate structure
    if (typeof translationData !== 'object' || translationData === null) {
      return NextResponse.json(
        { error: 'Translation file must be a JSON object' },
        { status: 400 }
      );
    }

    // Ensure locales directory exists
    if (!existsSync(LOCALES_DIR)) {
      await mkdir(LOCALES_DIR, { recursive: true });
    }

    // Save the file
    const filePath = join(LOCALES_DIR, `${languageCode.toLowerCase()}.json`);
    await writeFile(filePath, JSON.stringify(translationData, null, 2), 'utf-8');

    // Update i18n.ts to include new language (optional - could be done manually)
    // For now, we'll just save the file and let the admin update i18n.ts manually

    return NextResponse.json({
      success: true,
      message: `Language "${languageCode}" uploaded successfully`,
      languageCode: languageCode.toLowerCase()
    });
  } catch (error: any) {
    console.error('Error uploading language:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload language file' },
      { status: 500 }
    );
  }
}
