/**
 * AI Agent Routes API
 * Returns available routes for current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableRoutes } from '@/services/ai-agent/navigation-mapper';
import { UserRole, Language } from '@/types/ai-agent';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userRole = searchParams.get('userRole') as UserRole;
        const language = (searchParams.get('language') as Language) || 'bn';

        if (!userRole) {
            return NextResponse.json(
                { error: 'Missing required parameter: userRole' },
                { status: 400 }
            );
        }

        const routes = getAvailableRoutes(userRole, language);

        return NextResponse.json({ routes });
    } catch (error: any) {
        console.error('AI Agent routes error:', error);

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
