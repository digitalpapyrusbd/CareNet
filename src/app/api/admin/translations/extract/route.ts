import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { TextExtractor } from '@/utils/textExtractor';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  // #region agent log
  const logEntry = {location:'api/admin/translations/extract/route.ts:6',message:'POST request received',data:{hasAuthHeader:!!request.headers.get('authorization')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'};
  await fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry)}).catch(()=>{});
  // #endregion

  try {
    // Authenticate the user first
    const authResult = await authenticate(request);
    if (authResult) {
      // #region agent log
      await fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/admin/translations/extract/route.ts:16',message:'Authentication failed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'L'})}).catch(()=>{});
      // #endregion
      return authResult;
    }

    // Get authenticated user
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    // #region agent log
    await fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/admin/translations/extract/route.ts:32',message:'User authenticated',data:{userId:user.id,userRole:user.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
    // #endregion

    // STRICT ROLE CHECK: Only SUPER_ADMIN can extract translations
    if (user.role !== UserRole.SUPER_ADMIN) {
      // #region agent log
      await fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/admin/translations/extract/route.ts:40',message:'Insufficient permissions',data:{userRole:user.role,required:'SUPER_ADMIN'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Insufficient permissions: SUPER_ADMIN role required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type } = body; // 'all' | 'menu' | 'content'

    const extractor = new TextExtractor();
    const result = await extractor.extractAll();

    // Filter based on type
    let filteredTranslations = result.translations;
    
    if (type === 'menu') {
      // Extract only navigation/menu items
      filteredTranslations = {
        navigation: result.translations.navigation || {},
        common: {
          home: result.translations.common?.home,
          profile: result.translations.common?.profile,
          settings: result.translations.common?.settings,
          logout: result.translations.common?.logout,
        },
      };
    } else if (type === 'content') {
      // Extract everything except navigation
      const { navigation, ...rest } = result.translations;
      filteredTranslations = rest;
    }

    return NextResponse.json({
      ...result,
      translations: filteredTranslations,
    });
  } catch (error: any) {
    // #region agent log
    await fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/admin/translations/extract/route.ts:54',message:'Error caught in route handler',data:{errorName:error?.name,errorMessage:error?.message,errorStack:error?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'P'})}).catch(()=>{});
    // #endregion
    console.error('Error extracting text:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract text' },
      { status: 500 }
    );
  }
}
