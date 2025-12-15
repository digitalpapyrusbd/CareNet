/**
 * Gemini API Client
 * Handles communication with Google Gemini Flash API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_AGENT_CONFIG, getGeminiApiKey } from './config';
import { GeminiRequest, GeminiResponse, RateLimitInfo } from '@/types/ai-agent';

// Rate limiting state
class RateLimiter {
    private requests: number[] = [];
    private readonly maxRequests: number;
    private readonly windowMs: number;

    constructor(maxRequests: number, windowMs: number) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    canMakeRequest(): boolean {
        this.cleanup();
        return this.requests.length < this.maxRequests;
    }

    recordRequest(): void {
        this.requests.push(Date.now());
    }

    getRateLimitInfo(): RateLimitInfo {
        this.cleanup();
        const remaining = Math.max(0, this.maxRequests - this.requests.length);
        const oldestRequest = this.requests[0] || Date.now();
        const resetAt = new Date(oldestRequest + this.windowMs);

        return {
            remaining,
            resetAt,
            isLimited: remaining === 0
        };
    }

    private cleanup(): void {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
    }
}

// Initialize rate limiter
const rateLimiter = new RateLimiter(
    AI_AGENT_CONFIG.gemini.rateLimit.requests,
    AI_AGENT_CONFIG.gemini.rateLimit.window
);

// Response cache for common queries
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = AI_AGENT_CONFIG.performance.cacheDuration;

/**
 * Initialize Gemini AI client
 */
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
    if (!genAI) {
        const apiKey = getGeminiApiKey();
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

/**
 * Generate cache key from prompt
 */
function getCacheKey(prompt: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
        const char = prompt.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
}

/**
 * Get cached response if available and not expired
 */
function getCachedResponse(prompt: string): string | null {
    if (!AI_AGENT_CONFIG.performance.cacheIntents) {
        return null;
    }

    const key = getCacheKey(prompt);
    const cached = responseCache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.response;
    }

    // Remove expired cache entry
    if (cached) {
        responseCache.delete(key);
    }

    return null;
}

/**
 * Cache response
 */
function cacheResponse(prompt: string, response: string): void {
    if (!AI_AGENT_CONFIG.performance.cacheIntents) {
        return;
    }

    const key = getCacheKey(prompt);
    responseCache.set(key, {
        response,
        timestamp: Date.now()
    });
}

/**
 * Call Gemini API with rate limiting and caching
 */
export async function callGemini(request: GeminiRequest): Promise<GeminiResponse> {
    const { prompt, temperature, maxTokens } = request;

    // Check cache first
    const cachedResponse = getCachedResponse(prompt);
    if (cachedResponse) {
        return {
            text: cachedResponse
        };
    }

    // Check rate limit
    if (!rateLimiter.canMakeRequest()) {
        const rateLimitInfo = rateLimiter.getRateLimitInfo();
        throw new Error(
            `Rate limit exceeded. Please wait until ${rateLimitInfo.resetAt.toLocaleTimeString()}`
        );
    }

    try {
        // Record request for rate limiting
        rateLimiter.recordRequest();

        // Get Gemini client
        const client = getGeminiClient();
        const model = client.getGenerativeModel({
            model: AI_AGENT_CONFIG.gemini.model
        });

        // Generate content
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: temperature ?? AI_AGENT_CONFIG.gemini.temperature,
                maxOutputTokens: maxTokens ?? AI_AGENT_CONFIG.gemini.maxTokens,
            }
        });

        const response = result.response;
        const text = response.text();

        // Cache the response
        cacheResponse(prompt, text);

        return {
            text,
            usage: {
                promptTokens: 0, // Gemini doesn't provide this in free tier
                completionTokens: 0,
                totalTokens: 0
            }
        };
    } catch (error: any) {
        console.error('Gemini API error:', error);

        // Handle specific errors
        if (error.message?.includes('quota')) {
            throw new Error('API quota exceeded. Please try again later.');
        }

        if (error.message?.includes('API key')) {
            throw new Error('Invalid API key. Please check your GEMINI_API_KEY configuration.');
        }

        throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
    }
}

/**
 * Get current rate limit info
 */
export function getRateLimitInfo(): RateLimitInfo {
    return rateLimiter.getRateLimitInfo();
}

/**
 * Clear response cache
 */
export function clearCache(): void {
    responseCache.clear();
}

/**
 * Parse JSON response from Gemini
 * Gemini sometimes wraps JSON in markdown code blocks
 */
export function parseGeminiJSON<T>(text: string): T {
    try {
        // Remove markdown code blocks if present
        let cleaned = text.trim();

        // Remove ```json and ``` markers
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.substring(3);
        }

        if (cleaned.endsWith('```')) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
        }

        cleaned = cleaned.trim();

        // Parse JSON
        return JSON.parse(cleaned) as T;
    } catch (error) {
        console.error('Failed to parse Gemini JSON response:', text);
        throw new Error('Invalid JSON response from AI');
    }
}
