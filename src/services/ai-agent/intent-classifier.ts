/**
 * Intent Classifier
 * Uses Gemini to classify user intent from natural language
 */

import { callGemini, parseGeminiJSON } from './gemini-client';
import { getIntentClassificationPrompt } from './prompts';
import {
    IntentType,
    IntentResult,
    AgentContext,
    Language
} from '@/types/ai-agent';

/**
 * Classify user intent using Gemini API
 */
export async function classifyIntent(
    userInput: string,
    context: AgentContext
): Promise<IntentResult> {
    try {
        // Generate prompt
        const prompt = getIntentClassificationPrompt(userInput, context);

        // Call Gemini
        const response = await callGemini({
            prompt,
            context,
            temperature: 0.3, // Lower temperature for more consistent classification
            maxTokens: 300
        });

        // Parse JSON response
        const result = parseGeminiJSON<{
            intent: string;
            confidence: number;
            entities: any;
            language: string;
            requiresConfirmation: boolean;
        }>(response.text);

        // Validate and normalize intent
        const intent = normalizeIntent(result.intent);
        const language = normalizeLanguage(result.language);

        return {
            intent,
            confidence: result.confidence || 0.5,
            entities: result.entities || {},
            language,
            requiresConfirmation: result.requiresConfirmation || false
        };
    } catch (error: any) {
        console.error('Intent classification error:', error);

        // Return unknown intent on error
        return {
            intent: IntentType.UNKNOWN,
            confidence: 0,
            entities: {},
            language: context.language,
            requiresConfirmation: false
        };
    }
}

/**
 * Normalize intent string to IntentType enum
 */
function normalizeIntent(intent: string): IntentType {
    const normalized = intent.toUpperCase();

    switch (normalized) {
        case 'NAVIGATE':
            return IntentType.NAVIGATE;
        case 'FILL_FORM':
            return IntentType.FILL_FORM;
        case 'SEARCH':
            return IntentType.SEARCH;
        case 'QUERY':
            return IntentType.QUERY;
        case 'HELP':
            return IntentType.HELP;
        case 'CONFIRM':
            return IntentType.CONFIRM;
        case 'CANCEL':
            return IntentType.CANCEL;
        default:
            return IntentType.UNKNOWN;
    }
}

/**
 * Normalize language string
 */
function normalizeLanguage(language: string): Language {
    const normalized = language.toLowerCase();
    return normalized === 'bn' || normalized === 'bengali' ? 'bn' : 'en';
}

/**
 * Detect language from text (simple heuristic)
 */
export function detectLanguage(text: string): Language {
    // Check for Bengali Unicode characters
    const bengaliRegex = /[\u0980-\u09FF]/;
    return bengaliRegex.test(text) ? 'bn' : 'en';
}

/**
 * Quick intent classification for common commands (no API call)
 */
export function quickClassifyIntent(userInput: string, context: AgentContext): IntentResult | null {
    const input = userInput.toLowerCase().trim();

    // Confirmation keywords
    const confirmKeywords = ['yes', 'হ্যাঁ', 'ok', 'ঠিক আছে', 'confirm', 'নিশ্চিত'];
    if (confirmKeywords.some(kw => input === kw)) {
        return {
            intent: IntentType.CONFIRM,
            confidence: 1.0,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // Cancel keywords
    const cancelKeywords = ['no', 'না', 'cancel', 'বাতিল', 'stop', 'থামুন'];
    if (cancelKeywords.some(kw => input === kw)) {
        return {
            intent: IntentType.CANCEL,
            confidence: 1.0,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // Help keywords
    const helpKeywords = ['help', 'সাহায্য', 'সহায়তা', 'what can you do', 'কি করতে পারো'];
    if (helpKeywords.some(kw => input.includes(kw))) {
        return {
            intent: IntentType.HELP,
            confidence: 1.0,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // Navigation keywords (common patterns)
    const navKeywords = [
        'go to', 'যাও', 'show', 'দেখাও', 'open', 'খুলুন',
        'navigate', 'যান', 'take me to', 'নিয়ে যাও'
    ];
    if (navKeywords.some(kw => input.includes(kw))) {
        return {
            intent: IntentType.NAVIGATE,
            confidence: 0.8,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // Form fill keywords
    const formKeywords = [
        'fill', 'লিখুন', 'enter', 'প্রবেশ করুন', 'type', 'টাইপ করুন',
        'set', 'সেট করুন', 'write', 'লিখুন'
    ];
    if (formKeywords.some(kw => input.includes(kw))) {
        return {
            intent: IntentType.FILL_FORM,
            confidence: 0.8,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // Search keywords
    const searchKeywords = ['search', 'খুঁজুন', 'find', 'পাও', 'look for', 'খোঁজো'];
    if (searchKeywords.some(kw => input.includes(kw))) {
        return {
            intent: IntentType.SEARCH,
            confidence: 0.8,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // Query keywords (questions)
    const queryKeywords = [
        'how many', 'কত', 'what is', 'কি', 'কী', 'show me',
        'আমাকে দেখাও', 'tell me', 'বলো', 'বলুন'
    ];
    if (queryKeywords.some(kw => input.includes(kw))) {
        return {
            intent: IntentType.QUERY,
            confidence: 0.7,
            entities: {},
            language: detectLanguage(userInput),
            requiresConfirmation: false
        };
    }

    // No quick match found
    return null;
}
