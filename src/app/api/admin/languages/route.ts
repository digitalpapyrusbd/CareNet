import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/api-auth';
import { UserRole } from '@prisma/client';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOCALES_DIR = join(process.cwd(), 'src/lib/locales');

export const GET = withRoles([UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN])(async (request: NextRequest) => {
  // #region agent log
  const logEntry = {location:'api/admin/languages/route.ts:9',message:'GET request received',data:{hasAuthHeader:!!request.headers.get('authorization'),url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'};
  await fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry)}).catch(()=>{});
  // #endregion

  try {

    // Get list of language files
    const languages = [];
    
    if (existsSync(LOCALES_DIR)) {
      const files = await readdir(LOCALES_DIR);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      for (const file of jsonFiles) {
        const code = file.replace('.json', '');
        const filePath = join(LOCALES_DIR, file);
        const stats = await readFile(filePath, 'utf-8').then(() => {
          try {
            return require('fs').statSync(filePath);
          } catch {
            return null;
          }
        });
        
        languages.push({
          code,
          name: getLanguageName(code),
          lastUpdated: stats?.mtime?.toISOString(),
          status: 'active' as const
        });
      }
    }

    return NextResponse.json({ languages });
  } catch (error: any) {
    console.error('Error loading languages:', error);
    return NextResponse.json(
      { error: 'Failed to load languages' },
      { status: 500 }
    );
  }
});

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: 'English',
    bn: 'বাংলা (Bengali)',
    fr: 'Français (French)',
    es: 'Español (Spanish)',
    ar: 'العربية (Arabic)',
    hi: 'हिन्दी (Hindi)',
    ur: 'اردو (Urdu)',
  };
  return names[code] || code.toUpperCase();
}
