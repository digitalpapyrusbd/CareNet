/**
 * useAIAgent Hook
 * React hook for AI agent functionality
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AIAgentService } from '@/services/ai-agent/ai-agent-service';
import {
    AgentState,
    AgentResponse,
    Message,
    Language,
    UserRole
} from '@/types/ai-agent';

interface UseAIAgentOptions {
    userRole: UserRole;
    currentRoute: string;
    language?: Language;
    autoStart?: boolean;
}

interface UseAIAgentReturn {
    // State
    agentState: AgentState;
    messages: Message[];

    // Actions
    sendMessage: (message: string) => Promise<AgentResponse | null>;
    startListening: () => void;
    stopListening: () => void;
    toggleListening: () => void;
    setLanguage: (language: Language) => void;
    resetAgent: () => void;

    // Status
    isListening: boolean;
    isProcessing: boolean;
    isSpeaking: boolean;
    error: string | null;
}

export function useAIAgent(options: UseAIAgentOptions): UseAIAgentReturn {
    const { userRole, currentRoute, language = 'bn', autoStart = false } = options;

    const [agentState, setAgentState] = useState<AgentState>({
        isActive: false,
        isListening: false,
        isProcessing: false,
        isSpeaking: false,
        language
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    const agentServiceRef = useRef<AIAgentService | null>(null);

    // Initialize agent service
    useEffect(() => {
        if (!agentServiceRef.current) {
            agentServiceRef.current = new AIAgentService(userRole, currentRoute, language);
            setAgentState(prev => ({ ...prev, isActive: true }));

            if (autoStart) {
                agentServiceRef.current.startListening();
                setAgentState(prev => ({ ...prev, isListening: true }));
            }
        }

        return () => {
            if (agentServiceRef.current) {
                agentServiceRef.current.stopListening();
            }
        };
    }, [userRole, currentRoute, language, autoStart]);

    // Update messages from context
    useEffect(() => {
        if (agentServiceRef.current) {
            const context = agentServiceRef.current.getContext();
            setMessages(context.conversationHistory);
        }
    }, [agentState.isProcessing]);

    /**
     * Send text message
     */
    const sendMessage = useCallback(async (message: string): Promise<AgentResponse | null> => {
        if (!agentServiceRef.current || !message.trim()) {
            return null;
        }

        setAgentState(prev => ({ ...prev, isProcessing: true }));
        setError(null);

        try {
            const response = await agentServiceRef.current.processCommand(message);

            // Update messages
            const context = agentServiceRef.current.getContext();
            setMessages(context.conversationHistory);

            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to process message';
            setError(errorMessage);
            return null;
        } finally {
            setAgentState(prev => ({ ...prev, isProcessing: false }));
        }
    }, []);

    /**
     * Start voice listening
     */
    const startListening = useCallback(() => {
        if (!agentServiceRef.current) return;

        try {
            agentServiceRef.current.startListening();
            setAgentState(prev => ({ ...prev, isListening: true }));
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to start listening');
        }
    }, []);

    /**
     * Stop voice listening
     */
    const stopListening = useCallback(() => {
        if (!agentServiceRef.current) return;

        try {
            agentServiceRef.current.stopListening();
            setAgentState(prev => ({ ...prev, isListening: false }));
        } catch (err: any) {
            setError(err.message || 'Failed to stop listening');
        }
    }, []);

    /**
     * Toggle voice listening
     */
    const toggleListening = useCallback(() => {
        if (agentState.isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [agentState.isListening, startListening, stopListening]);

    /**
     * Set language
     */
    const setLanguageCallback = useCallback((newLanguage: Language) => {
        if (!agentServiceRef.current) return;

        agentServiceRef.current.setLanguage(newLanguage);
        setAgentState(prev => ({ ...prev, language: newLanguage }));
    }, []);

    /**
     * Reset agent
     */
    const resetAgent = useCallback(() => {
        if (!agentServiceRef.current) return;

        agentServiceRef.current.reset();
        setMessages([]);
        setError(null);
        setAgentState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            isSpeaking: false
        }));
    }, []);

    return {
        agentState,
        messages,
        sendMessage,
        startListening,
        stopListening,
        toggleListening,
        setLanguage: setLanguageCallback,
        resetAgent,
        isListening: agentState.isListening,
        isProcessing: agentState.isProcessing,
        isSpeaking: agentState.isSpeaking,
        error
    };
}
