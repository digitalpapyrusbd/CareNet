/**
 * AI Agent Provider
 * React Context provider for AI agent state (optional wrapper)
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';
import { UserRole, Language } from '@/types/ai-agent';

interface AIAgentProviderProps {
    children: ReactNode;
    userRole?: UserRole;
    language?: Language;
    enabled?: boolean;
}

const AIAgentContext = createContext<{
    enabled: boolean;
}>({
    enabled: true
});

export function AIAgentProvider({
    children,
    userRole,
    language = 'bn',
    enabled = true
}: AIAgentProviderProps) {
    return (
        <AIAgentContext.Provider value={{ enabled }}>
            {children}
            {enabled && userRole && <AIAssistant userRole={userRole} language={language} />}
        </AIAgentContext.Provider>
    );
}

export function useAIAgentContext() {
    return useContext(AIAgentContext);
}
