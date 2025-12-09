/**
 * AI Agent Types
 * TypeScript type definitions for the AI navigation agent
 */

// Intent types that the agent can classify
export enum IntentType {
    NAVIGATE = 'navigate',
    FILL_FORM = 'fill_form',
    SEARCH = 'search',
    QUERY = 'query',
    HELP = 'help',
    CONFIRM = 'confirm',
    CANCEL = 'cancel',
    UNKNOWN = 'unknown'
}

// Language options
export type Language = 'bn' | 'en';

// User roles (matching your existing system)
export type UserRole = 'GUARDIAN' | 'CAREGIVER' | 'COMPANY' | 'MODERATOR' | 'SUPER_ADMIN';

// Message in conversation history
export interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
    language: Language;
}

// Pending action awaiting confirmation
export interface PendingAction {
    type: 'navigation' | 'form_submit' | 'delete' | 'payment';
    description: string;
    descriptionBengali: string;
    data: any;
    requiresConfirmation: boolean;
}

// Agent context - tracks current state
export interface AgentContext {
    currentRoute: string;
    userRole: UserRole;
    conversationHistory: Message[];
    pendingAction?: PendingAction;
    language: Language;
    lastActivity: Date;
    sessionId: string;
}

// Extracted entities from user input
export interface ExtractedEntities {
    target?: string;
    action?: string;
    field?: string;
    value?: string;
    searchTerm?: string;
    [key: string]: any;
}

// Intent classification result
export interface IntentResult {
    intent: IntentType;
    confidence: number;
    entities: ExtractedEntities;
    language: Language;
    requiresConfirmation: boolean;
}

// Navigation action
export interface NavigationAction {
    type: 'navigate';
    route: string;
    routeName: string;
    routeNameBengali: string;
    requiresConfirmation: boolean;
}

// Form filling action
export interface FormAction {
    type: 'fill_form';
    fields: Array<{
        name: string;
        value: string;
        label?: string;
    }>;
    autoSubmit: boolean;
}

// Search action
export interface SearchAction {
    type: 'search';
    query: string;
    scope?: string;
}

// Agent response to user
export interface AgentResponse {
    message: string;
    messageBengali: string;
    intent: IntentType;
    action?: NavigationAction | FormAction | SearchAction;
    requiresConfirmation: boolean;
    suggestions?: string[];
    error?: string;
}

// Agent state
export interface AgentState {
    isActive: boolean;
    isListening: boolean;
    isProcessing: boolean;
    isSpeaking: boolean;
    language: Language;
    error?: string;
}

// Voice recognition result
export interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
    language: Language;
}

// Route definition
export interface RouteDefinition {
    path: string;
    name: string;
    nameBengali: string;
    keywords: string[];
    description: string;
    descriptionBengali: string;
    roles: UserRole[];
    requiresConfirmation?: boolean;
}

// Form field metadata
export interface FormField {
    name: string;
    type: string;
    label?: string;
    labelBengali?: string;
    placeholder?: string;
    required: boolean;
    value?: string;
}

// Gemini API request
export interface GeminiRequest {
    prompt: string;
    context: AgentContext;
    temperature?: number;
    maxTokens?: number;
}

// Gemini API response
export interface GeminiResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

// Rate limit info
export interface RateLimitInfo {
    remaining: number;
    resetAt: Date;
    isLimited: boolean;
}
