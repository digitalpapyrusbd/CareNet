/**
 * Context Manager
 * Manages conversation context and session state
 */

import { AgentContext, Message, PendingAction, UserRole, Language } from '@/types/ai-agent';
import { AI_AGENT_CONFIG } from './config';

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Context Manager Class
 */
export class ContextManager {
    private context: AgentContext;
    private autoSaveTimer: NodeJS.Timeout | null = null;

    constructor(userRole: UserRole, currentRoute: string, language: Language = 'bn') {
        this.context = {
            currentRoute,
            userRole,
            conversationHistory: [],
            language,
            lastActivity: new Date(),
            sessionId: generateSessionId()
        };

        // Start auto-save timer
        this.startAutoSave();
    }

    /**
     * Get current context
     */
    getContext(): AgentContext {
        return { ...this.context };
    }

    /**
     * Update current route
     */
    setCurrentRoute(route: string): void {
        this.context.currentRoute = route;
        this.updateActivity();
    }

    /**
     * Get current route
     */
    getCurrentRoute(): string {
        return this.context.currentRoute;
    }

    /**
     * Set user role
     */
    setUserRole(role: UserRole): void {
        this.context.userRole = role;
        this.updateActivity();
    }

    /**
     * Get user role
     */
    getUserRole(): UserRole {
        return this.context.userRole;
    }

    /**
     * Set language
     */
    setLanguage(language: Language): void {
        this.context.language = language;
        this.updateActivity();
    }

    /**
     * Get language
     */
    getLanguage(): Language {
        return this.context.language;
    }

    /**
     * Add message to conversation history
     */
    addMessage(role: 'user' | 'agent', content: string): void {
        const message: Message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role,
            content,
            timestamp: new Date(),
            language: this.context.language
        };

        this.context.conversationHistory.push(message);

        // Keep only last N messages
        const maxHistory = AI_AGENT_CONFIG.context.maxHistory;
        if (this.context.conversationHistory.length > maxHistory) {
            this.context.conversationHistory = this.context.conversationHistory.slice(-maxHistory);
        }

        this.updateActivity();
    }

    /**
     * Get conversation history
     */
    getHistory(): Message[] {
        return [...this.context.conversationHistory];
    }

    /**
     * Get last N messages
     */
    getLastMessages(count: number): Message[] {
        return this.context.conversationHistory.slice(-count);
    }

    /**
     * Clear conversation history
     */
    clearHistory(): void {
        this.context.conversationHistory = [];
        this.updateActivity();
    }

    /**
     * Set pending action
     */
    setPendingAction(action: PendingAction): void {
        this.context.pendingAction = action;
        this.updateActivity();
    }

    /**
     * Get pending action
     */
    getPendingAction(): PendingAction | undefined {
        return this.context.pendingAction;
    }

    /**
     * Clear pending action
     */
    clearPendingAction(): void {
        this.context.pendingAction = undefined;
        this.updateActivity();
    }

    /**
     * Check if there's a pending action
     */
    hasPendingAction(): boolean {
        return this.context.pendingAction !== undefined;
    }

    /**
     * Update last activity timestamp
     */
    private updateActivity(): void {
        this.context.lastActivity = new Date();
    }

    /**
     * Check if session has timed out
     */
    isSessionExpired(): boolean {
        const now = Date.now();
        const lastActivity = this.context.lastActivity.getTime();
        const timeout = AI_AGENT_CONFIG.context.sessionTimeout;

        return now - lastActivity > timeout;
    }

    /**
     * Get session age in milliseconds
     */
    getSessionAge(): number {
        return Date.now() - this.context.lastActivity.getTime();
    }

    /**
     * Reset session
     */
    resetSession(): void {
        const { userRole, currentRoute, language } = this.context;
        this.context = {
            currentRoute,
            userRole,
            conversationHistory: [],
            language,
            lastActivity: new Date(),
            sessionId: generateSessionId()
        };
    }

    /**
     * Export context to JSON
     */
    exportContext(): string {
        return JSON.stringify(this.context, null, 2);
    }

    /**
     * Import context from JSON
     */
    importContext(json: string): void {
        try {
            const imported = JSON.parse(json);
            this.context = {
                ...imported,
                lastActivity: new Date(imported.lastActivity)
            };
        } catch (error) {
            console.error('Failed to import context:', error);
        }
    }

    /**
     * Save context to localStorage
     */
    saveToStorage(): void {
        if (typeof window === 'undefined') return;

        try {
            const key = `ai_agent_context_${this.context.sessionId}`;
            localStorage.setItem(key, this.exportContext());
        } catch (error) {
            console.error('Failed to save context to storage:', error);
        }
    }

    /**
     * Load context from localStorage
     */
    loadFromStorage(sessionId: string): boolean {
        if (typeof window === 'undefined') return false;

        try {
            const key = `ai_agent_context_${sessionId}`;
            const stored = localStorage.getItem(key);

            if (stored) {
                this.importContext(stored);
                return true;
            }
        } catch (error) {
            console.error('Failed to load context from storage:', error);
        }

        return false;
    }

    /**
     * Start auto-save timer
     */
    private startAutoSave(): void {
        if (typeof window === 'undefined') return;

        const interval = AI_AGENT_CONFIG.context.autoSaveInterval;
        this.autoSaveTimer = setInterval(() => {
            this.saveToStorage();
        }, interval);
    }

    /**
     * Stop auto-save timer
     */
    stopAutoSave(): void {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Cleanup - call when component unmounts
     */
    cleanup(): void {
        this.stopAutoSave();
        this.saveToStorage();
    }
}

// Singleton instance
let contextManager: ContextManager | null = null;

/**
 * Get context manager instance
 */
export function getContextManager(
    userRole?: UserRole,
    currentRoute?: string,
    language?: Language
): ContextManager {
    if (!contextManager && userRole && currentRoute) {
        contextManager = new ContextManager(userRole, currentRoute, language);
    }

    if (!contextManager) {
        throw new Error('Context manager not initialized. Provide userRole and currentRoute.');
    }

    return contextManager;
}

/**
 * Reset context manager (for testing or logout)
 */
export function resetContextManager(): void {
    if (contextManager) {
        contextManager.cleanup();
        contextManager = null;
    }
}
