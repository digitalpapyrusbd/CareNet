/**
 * AI Agent Configuration
 * Central configuration for the AI navigation agent
 */

export const AI_AGENT_CONFIG = {
    // Google Gemini configuration
    gemini: {
        model: 'gemini-2.0-flash-exp',
        apiKey: process.env.GEMINI_API_KEY || '',
        temperature: 0.3, // Lower for more deterministic responses
        maxTokens: 500,
        rateLimit: {
            requests: 15, // Free tier: 15 requests per minute
            window: 60000 // 1 minute in milliseconds
        }
    },

    // Web Speech API configuration
    voice: {
        language: 'bn-BD', // Bengali (Bangladesh)
        languageAlternate: 'en-US', // English fallback
        continuous: true,
        interimResults: true,
        maxAlternatives: 1
    },

    // Text-to-speech configuration
    tts: {
        language: 'bn-BD',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
    },

    // Route configuration
    routes: {
        // Routes that are allowed for navigation
        whitelist: [
            '/dashboard',
            '/dashboard/guardian',
            '/dashboard/caregiver',
            '/dashboard/company',
            '/dashboard/moderator',
            '/dashboard/super-admin',
            '/patients',
            '/patients/new',
            '/jobs',
            '/jobs/new',
            '/payments',
            '/payments/create',
            '/care-logs',
            '/care-logs/new',
            '/profile',
            '/notifications',
            '/notifications/settings',
            '/packages',
            '/files',
            '/feedback',
            '/job-assignment',
            '/patient-management',
            '/verification',
            '/escrow'
        ],

        // Routes that should never be navigated to by agent
        blacklist: [
            '/api',
            '/auth/logout'
        ],

        // Routes that require explicit confirmation
        requireConfirmation: [
            '/payments/create',
            '/patients/delete',
            '/jobs/delete',
            '/auth/logout'
        ]
    },

    // Context management
    context: {
        maxHistory: 10, // Keep last 10 messages
        sessionTimeout: 1800000, // 30 minutes in milliseconds
        autoSaveInterval: 30000 // Auto-save context every 30 seconds
    },

    // UI configuration
    ui: {
        position: 'bottom-right', // Position of floating button
        theme: 'auto', // 'light' | 'dark' | 'auto'
        showWelcomeMessage: true,
        enableSuggestions: true,
        maxSuggestions: 3
    },

    // Feature flags
    features: {
        voiceInput: true,
        textInput: true,
        formFilling: true,
        search: true,
        tts: true,
        offlineMode: false // Future feature
    },

    // Security settings
    security: {
        requireAuthForSensitiveActions: true,
        logCommands: true, // Log all commands for audit
        preventExternalNavigation: true,
        validateRoutePermissions: true
    },

    // Performance settings
    performance: {
        debounceDelay: 300, // Debounce voice input
        cacheIntents: true,
        cacheDuration: 300000, // 5 minutes
        preloadCommonRoutes: true
    }
} as const;

// Helper function to check if route is allowed
export function isRouteAllowed(route: string): boolean {
    // Check if route is blacklisted
    if (AI_AGENT_CONFIG.routes.blacklist.some(bl => route.startsWith(bl))) {
        return false;
    }

    // Check if route is whitelisted
    return AI_AGENT_CONFIG.routes.whitelist.some(wl =>
        route === wl || route.startsWith(wl + '/')
    );
}

// Helper function to check if route requires confirmation
export function requiresConfirmation(route: string): boolean {
    return AI_AGENT_CONFIG.routes.requireConfirmation.some(rc =>
        route === rc || route.startsWith(rc)
    );
}

// Helper to get API key
export function getGeminiApiKey(): string {
    const apiKey = AI_AGENT_CONFIG.gemini.apiKey;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
    }
    return apiKey;
}
