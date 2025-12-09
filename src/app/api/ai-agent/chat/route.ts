/**
 * AI Agent Chat API Route
 * Handles text-based chat requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIAgentService } from '@/services/ai-agent/ai-agent-service';
import { UserRole, Language } from '@/types/ai-agent';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, userRole, currentRoute, language } = body;

        // Validate input
        if (!message || !userRole || !currentRoute) {
            return NextResponse.json(
                { error: 'Missing required fields: message, userRole, currentRoute' },
                { status: 400 }
            );
        }

        // Create agent service
        const agentService = new AIAgentService(
            userRole as UserRole,
            currentRoute,
            (language as Language) || 'bn'
        );

        // Process command
        const response = await agentService.processCommand(message);

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('AI Agent chat error:', error);

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                message: 'Sorry, I encountered an error.',
                messageBengali: 'দুঃখিত, একটি ত্রুটি হয়েছে।'
            },
            { status: 500 }
        );
    }
}
