/**
 * AI Agent Service
 * Main orchestration service for the AI navigation agent
 */

import { getVoiceRecognitionService } from './voice-recognition';
import { classifyIntent, quickClassifyIntent, detectLanguage } from './intent-classifier';
import { mapToNavigationAction, canNavigateToRoute, getNavigationSuggestions } from './navigation-mapper';
import { scanFormFields, extractFormInstructions, fillFormFields, quickFillForm } from './form-controller';
import { getContextManager } from './context-manager';
import { getTextToSpeechService } from './text-to-speech';
import { callGemini, parseGeminiJSON } from './gemini-client';
import { getQueryAnswerPrompt, getHelpPrompt } from './prompts';
import {
    AgentResponse,
    IntentType,
    Language,
    UserRole,
    AgentContext,
    NavigationAction,
    FormAction
} from '@/types/ai-agent';

/**
 * AI Agent Service Class
 */
export class AIAgentService {
    private voiceService = getVoiceRecognitionService();
    private ttsService = getTextToSpeechService();
    private contextManager;

    constructor(userRole: UserRole, currentRoute: string, language: Language = 'bn') {
        this.contextManager = getContextManager(userRole, currentRoute, language);
        this.setupVoiceCallbacks();
    }

    /**
     * Setup voice recognition callbacks
     */
    private setupVoiceCallbacks(): void {
        this.voiceService.onResult((result) => {
            if (result.isFinal) {
                this.processCommand(result.transcript);
            }
        });

        this.voiceService.onError((error) => {
            console.error('Voice recognition error:', error);
        });
    }

    /**
     * Process user command (voice or text)
     */
    async processCommand(input: string): Promise<AgentResponse> {
        try {
            // Add user message to history
            this.contextManager.addMessage('user', input);

            // Get context
            const context = this.contextManager.getContext();

            // Detect language if not set
            const detectedLanguage = detectLanguage(input);
            if (detectedLanguage !== context.language) {
                this.contextManager.setLanguage(detectedLanguage);
            }

            // Check for pending action (confirmation/cancel)
            if (this.contextManager.hasPendingAction()) {
                return this.handlePendingAction(input, context);
            }

            // Try quick classification first (saves API calls)
            let intentResult = quickClassifyIntent(input, context);

            // If no quick match, use Gemini
            if (!intentResult) {
                intentResult = await classifyIntent(input, context);
            }

            // Handle based on intent
            let response: AgentResponse;

            switch (intentResult.intent) {
                case IntentType.NAVIGATE:
                    response = await this.handleNavigate(intentResult, context);
                    break;

                case IntentType.FILL_FORM:
                    response = await this.handleFillForm(input, intentResult, context);
                    break;

                case IntentType.SEARCH:
                    response = await this.handleSearch(intentResult, context);
                    break;

                case IntentType.QUERY:
                    response = await this.handleQuery(input, context);
                    break;

                case IntentType.HELP:
                    response = await this.handleHelp(context);
                    break;

                case IntentType.CONFIRM:
                case IntentType.CANCEL:
                    response = this.handleConfirmCancel(intentResult.intent, context);
                    break;

                default:
                    response = this.handleUnknown(input, context);
            }

            // Add agent response to history
            this.contextManager.addMessage('agent', response.message);

            // Speak response if TTS is enabled
            if (this.ttsService) {
                const messageToSpeak = context.language === 'bn' ? response.messageBengali : response.message;
                this.ttsService.speak(messageToSpeak, context.language);
            }

            return response;
        } catch (error: any) {
            console.error('Error processing command:', error);
            return {
                message: 'Sorry, I encountered an error processing your request.',
                messageBengali: 'দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করতে একটি ত্রুটি হয়েছে।',
                intent: IntentType.UNKNOWN,
                requiresConfirmation: false,
                error: error.message
            };
        }
    }

    /**
     * Handle navigation intent
     */
    private async handleNavigate(intentResult: any, context: AgentContext): Promise<AgentResponse> {
        const navAction = mapToNavigationAction(intentResult, context.userRole);

        if (!navAction) {
            // No route found, provide suggestions
            const suggestions = getNavigationSuggestions(
                intentResult.entities.target || '',
                context.userRole,
                context.language,
                3
            );

            return {
                message: `I couldn't find that page. Did you mean one of these?`,
                messageBengali: `আমি সেই পাতা খুঁজে পাইনি। আপনি কি এগুলোর একটি বোঝাতে চেয়েছেন?`,
                intent: IntentType.NAVIGATE,
                requiresConfirmation: false,
                suggestions: suggestions.map(s => s.name)
            };
        }

        // Check permissions
        const permission = canNavigateToRoute(navAction.route, context.userRole);
        if (!permission.allowed) {
            return {
                message: permission.reason || 'You cannot access this page.',
                messageBengali: 'আপনি এই পাতায় প্রবেশ করতে পারবেন না।',
                intent: IntentType.NAVIGATE,
                requiresConfirmation: false,
                error: permission.reason
            };
        }

        // Check if confirmation required
        if (navAction.requiresConfirmation) {
            this.contextManager.setPendingAction({
                type: 'navigation',
                description: `Navigate to ${navAction.routeName}`,
                descriptionBengali: `${navAction.routeNameBengali} এ যান`,
                data: navAction,
                requiresConfirmation: true
            });

            return {
                message: `Do you want to go to ${navAction.routeName}?`,
                messageBengali: `আপনি কি ${navAction.routeNameBengali} এ যেতে চান?`,
                intent: IntentType.NAVIGATE,
                requiresConfirmation: true
            };
        }

        return {
            message: `Navigating to ${navAction.routeName}`,
            messageBengali: `${navAction.routeNameBengali} এ যাচ্ছি`,
            intent: IntentType.NAVIGATE,
            action: navAction,
            requiresConfirmation: false
        };
    }

    /**
     * Handle form filling intent
     */
    private async handleFillForm(input: string, intentResult: any, context: AgentContext): Promise<AgentResponse> {
        // Scan form fields on current page
        const fields = scanFormFields();

        if (fields.length === 0) {
            return {
                message: 'No form found on this page.',
                messageBengali: 'এই পাতায় কোনো ফর্ম পাওয়া যায়নি।',
                intent: IntentType.FILL_FORM,
                requiresConfirmation: false
            };
        }

        // Try quick fill first
        let formAction = quickFillForm(input, context.language);

        // If no quick match, use Gemini
        if (!formAction || formAction.fields.length === 0) {
            formAction = await extractFormInstructions(input, fields);
        }

        if (formAction.fields.length === 0) {
            return {
                message: 'I couldn\'t understand which fields to fill.',
                messageBengali: 'আমি বুঝতে পারিনি কোন ফিল্ড পূরণ করতে হবে।',
                intent: IntentType.FILL_FORM,
                requiresConfirmation: false
            };
        }

        // Fill the fields
        const result = fillFormFields(formAction);

        if (result.success) {
            return {
                message: `Filled ${result.filledFields.length} field(s): ${result.filledFields.join(', ')}`,
                messageBengali: `${result.filledFields.length} টি ফিল্ড পূরণ করা হয়েছে: ${result.filledFields.join(', ')}`,
                intent: IntentType.FILL_FORM,
                action: formAction,
                requiresConfirmation: false
            };
        } else {
            return {
                message: 'Failed to fill form fields.',
                messageBengali: 'ফর্ম ফিল্ড পূরণ করতে ব্যর্থ হয়েছে।',
                intent: IntentType.FILL_FORM,
                requiresConfirmation: false,
                error: result.errors.join(', ')
            };
        }
    }

    /**
     * Handle search intent
     */
    private async handleSearch(intentResult: any, context: AgentContext): Promise<AgentResponse> {
        const searchTerm = intentResult.entities.searchTerm || intentResult.entities.query;

        if (!searchTerm) {
            return {
                message: 'What would you like to search for?',
                messageBengali: 'আপনি কি খুঁজতে চান?',
                intent: IntentType.SEARCH,
                requiresConfirmation: false
            };
        }

        return {
            message: `Searching for "${searchTerm}"`,
            messageBengali: `"${searchTerm}" খুঁজছি`,
            intent: IntentType.SEARCH,
            action: {
                type: 'search',
                query: searchTerm
            },
            requiresConfirmation: false
        };
    }

    /**
     * Handle query intent
     */
    private async handleQuery(query: string, context: AgentContext): Promise<AgentResponse> {
        try {
            const prompt = getQueryAnswerPrompt(query, context);
            const response = await callGemini({ prompt, context });
            const result = parseGeminiJSON<{
                answer: string;
                confidence: number;
                requiresNavigation: boolean;
                suggestedRoute?: string;
            }>(response.text);

            return {
                message: result.answer,
                messageBengali: result.answer,
                intent: IntentType.QUERY,
                requiresConfirmation: false
            };
        } catch (error) {
            return {
                message: 'I couldn\'t answer that question.',
                messageBengali: 'আমি সেই প্রশ্নের উত্তর দিতে পারিনি।',
                intent: IntentType.QUERY,
                requiresConfirmation: false
            };
        }
    }

    /**
     * Handle help intent
     */
    private async handleHelp(context: AgentContext): Promise<AgentResponse> {
        try {
            const availableRoutes = ['patients', 'jobs', 'payments', 'profile'];
            const prompt = getHelpPrompt(context, availableRoutes);
            const response = await callGemini({ prompt, context });
            const result = parseGeminiJSON<{
                message: string;
                suggestions: string[];
            }>(response.text);

            return {
                message: result.message,
                messageBengali: result.message,
                intent: IntentType.HELP,
                suggestions: result.suggestions,
                requiresConfirmation: false
            };
        } catch (error) {
            const defaultMessage = context.language === 'bn'
                ? 'আমি আপনাকে এই প্ল্যাটফর্মে নেভিগেট করতে এবং ফর্ম পূরণ করতে সাহায্য করতে পারি। চেষ্টা করুন: "রোগী দেখাও" বা "পেমেন্ট পাতায় যান"'
                : 'I can help you navigate this platform and fill forms. Try: "show patients" or "go to payments"';

            return {
                message: defaultMessage,
                messageBengali: defaultMessage,
                intent: IntentType.HELP,
                requiresConfirmation: false
            };
        }
    }

    /**
     * Handle confirm/cancel
     */
    private handleConfirmCancel(intent: IntentType, context: AgentContext): AgentResponse {
        const pendingAction = this.contextManager.getPendingAction();

        if (!pendingAction) {
            return {
                message: 'There is nothing to confirm or cancel.',
                messageBengali: 'নিশ্চিত বা বাতিল করার কিছু নেই।',
                intent,
                requiresConfirmation: false
            };
        }

        if (intent === IntentType.CONFIRM) {
            this.contextManager.clearPendingAction();
            return {
                message: context.language === 'bn' ? pendingAction.descriptionBengali : pendingAction.description,
                messageBengali: pendingAction.descriptionBengali,
                intent: IntentType.CONFIRM,
                action: pendingAction.data,
                requiresConfirmation: false
            };
        } else {
            this.contextManager.clearPendingAction();
            return {
                message: 'Action cancelled.',
                messageBengali: 'কাজ বাতিল করা হয়েছে।',
                intent: IntentType.CANCEL,
                requiresConfirmation: false
            };
        }
    }

    /**
     * Handle pending action
     */
    private async handlePendingAction(input: string, context: AgentContext): Promise<AgentResponse> {
        const intentResult = quickClassifyIntent(input, context);

        if (intentResult && (intentResult.intent === IntentType.CONFIRM || intentResult.intent === IntentType.CANCEL)) {
            return this.handleConfirmCancel(intentResult.intent, context);
        }

        return {
            message: 'Please confirm or cancel the pending action first.',
            messageBengali: 'অনুগ্রহ করে প্রথমে মুলতুবি কাজটি নিশ্চিত বা বাতিল করুন।',
            intent: IntentType.UNKNOWN,
            requiresConfirmation: false
        };
    }

    /**
     * Handle unknown intent
     */
    private handleUnknown(input: string, context: AgentContext): AgentResponse {
        return {
            message: 'I didn\'t understand that. Try saying "help" for assistance.',
            messageBengali: 'আমি বুঝতে পারিনি। সাহায্যের জন্য "সাহায্য" বলুন।',
            intent: IntentType.UNKNOWN,
            requiresConfirmation: false,
            suggestions: ['Help', 'Show patients', 'Go to dashboard']
        };
    }

    /**
     * Start voice recognition
     */
    startListening(): void {
        this.voiceService.start();
    }

    /**
     * Stop voice recognition
     */
    stopListening(): void {
        this.voiceService.stop();
    }

    /**
     * Set language
     */
    setLanguage(language: Language): void {
        this.contextManager.setLanguage(language);
        this.voiceService.setLanguage(language);
        this.ttsService.setLanguage(language);
    }

    /**
     * Get context
     */
    getContext(): AgentContext {
        return this.contextManager.getContext();
    }

    /**
     * Reset agent
     */
    reset(): void {
        this.contextManager.resetSession();
        this.voiceService.stop();
        this.ttsService.stop();
    }
}
