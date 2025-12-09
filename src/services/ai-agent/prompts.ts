/**
 * AI Agent Prompts
 * System prompts for Gemini API to classify intents and extract entities
 */

import { AgentContext, UserRole } from '@/types/ai-agent';

/**
 * Intent classification prompt
 */
export function getIntentClassificationPrompt(
    userInput: string,
    context: AgentContext
): string {
    return `You are an AI assistant for a caregiver platform in Bangladesh called "CaregiverBD".
Your role is to help users navigate the platform and fill forms using voice or text commands.

SUPPORTED LANGUAGES: Bengali (বাংলা) and English
USER ROLE: ${context.userRole}
CURRENT PAGE: ${context.currentRoute}
PREFERRED LANGUAGE: ${context.language === 'bn' ? 'Bengali' : 'English'}

USER COMMAND: "${userInput}"

TASK: Classify the user's intent and extract relevant entities.

INTENT TYPES:
1. NAVIGATE - User wants to go to a different page
   Examples: "রোগী দেখাও", "show patients", "go to payments", "পেমেন্ট পাতায় যান"
   
2. FILL_FORM - User wants to fill a form field
   Examples: "নাম লিখুন জন ডো", "fill name John Doe", "age 65", "বয়স ৬৫"
   
3. SEARCH - User wants to search for something
   Examples: "জন খুঁজুন", "search for John", "find patient Sarah"
   
4. QUERY - User is asking a question about their data
   Examples: "আমার কত রোগী?", "how many patients do I have?", "what's my balance?"
   
5. HELP - User needs help or guidance
   Examples: "সাহায্য", "help", "what can you do?", "কীভাবে ব্যবহার করবো?"
   
6. CONFIRM - User is confirming an action
   Examples: "হ্যাঁ", "yes", "confirm", "নিশ্চিত করুন", "ok"
   
7. CANCEL - User is canceling an action
   Examples: "না", "no", "cancel", "বাতিল করুন", "stop"

RESPONSE FORMAT (JSON only, no markdown):
{
  "intent": "NAVIGATE|FILL_FORM|SEARCH|QUERY|HELP|CONFIRM|CANCEL|UNKNOWN",
  "confidence": 0.0-1.0,
  "entities": {
    "target": "route or page name",
    "action": "specific action",
    "field": "form field name",
    "value": "field value",
    "searchTerm": "search query"
  },
  "language": "bn|en",
  "requiresConfirmation": true|false
}

IMPORTANT:
- Respond ONLY with valid JSON, no additional text
- Set confidence based on how clear the command is
- Extract all relevant entities
- Detect language from the input
- Set requiresConfirmation to true for sensitive actions (payments, deletions)
- If intent is unclear, use "UNKNOWN"

RESPOND NOW:`;
}

/**
 * Form field extraction prompt
 */
export function getFormExtractionPrompt(
    userInput: string,
    availableFields: Array<{ name: string; label?: string; type: string }>
): string {
    const fieldsList = availableFields
        .map(f => `- ${f.name} (${f.type})${f.label ? ` - Label: "${f.label}"` : ''}`)
        .join('\n');

    return `You are helping a user fill a form on a caregiver platform.

AVAILABLE FORM FIELDS:
${fieldsList}

USER COMMAND: "${userInput}"

TASK: Extract which fields the user wants to fill and with what values.

RESPONSE FORMAT (JSON only):
{
  "fields": [
    {
      "name": "field_name",
      "value": "field_value"
    }
  ],
  "confidence": 0.0-1.0,
  "language": "bn|en"
}

EXAMPLES:
Input: "নাম লিখুন জন ডো"
Output: {"fields": [{"name": "name", "value": "জন ডো"}], "confidence": 0.95, "language": "bn"}

Input: "fill phone 01712345678 and age 65"
Output: {"fields": [{"name": "phone", "value": "01712345678"}, {"name": "age", "value": "65"}], "confidence": 0.9, "language": "en"}

IMPORTANT:
- Respond ONLY with valid JSON
- Match field names from the available fields list
- Preserve Bengali text in values if provided
- Set confidence based on clarity

RESPOND NOW:`;
}

/**
 * Query answering prompt
 */
export function getQueryAnswerPrompt(
    userQuery: string,
    context: AgentContext,
    userData?: any
): string {
    return `You are an AI assistant for CaregiverBD platform.

USER ROLE: ${context.userRole}
CURRENT PAGE: ${context.currentRoute}
LANGUAGE: ${context.language === 'bn' ? 'Bengali' : 'English'}

USER DATA: ${userData ? JSON.stringify(userData) : 'Not available'}

USER QUESTION: "${userQuery}"

TASK: Answer the user's question based on the available data.

RESPONSE FORMAT (JSON only):
{
  "answer": "Your answer in ${context.language === 'bn' ? 'Bengali' : 'English'}",
  "confidence": 0.0-1.0,
  "requiresNavigation": true|false,
  "suggestedRoute": "route if navigation needed"
}

IMPORTANT:
- Answer in ${context.language === 'bn' ? 'Bengali (বাংলা)' : 'English'}
- Be concise and helpful
- If you don't have the data, suggest where to find it
- Respond ONLY with valid JSON

RESPOND NOW:`;
}

/**
 * Help message prompt
 */
export function getHelpPrompt(
    context: AgentContext,
    availableRoutes: string[]
): string {
    return `You are an AI assistant for CaregiverBD platform.

USER ROLE: ${context.userRole}
LANGUAGE: ${context.language === 'bn' ? 'Bengali' : 'English'}

AVAILABLE PAGES: ${availableRoutes.join(', ')}

TASK: Generate a helpful message explaining what you can do.

RESPONSE FORMAT (JSON only):
{
  "message": "Help message in ${context.language === 'bn' ? 'Bengali' : 'English'}",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

INCLUDE:
- Brief introduction of your capabilities
- Examples of voice commands
- 3 relevant suggestions based on user's role

IMPORTANT:
- Write in ${context.language === 'bn' ? 'Bengali (বাংলা)' : 'English'}
- Be friendly and encouraging
- Keep it concise
- Respond ONLY with valid JSON

RESPOND NOW:`;
}

/**
 * Navigation suggestion prompt
 */
export function getNavigationSuggestionPrompt(
    userInput: string,
    availableRoutes: Array<{ name: string; nameBengali: string; path: string }>,
    language: 'bn' | 'en'
): string {
    const routesList = availableRoutes
        .map(r => `- ${language === 'bn' ? r.nameBengali : r.name} (${r.path})`)
        .join('\n');

    return `The user said: "${userInput}"

This doesn't match any known command clearly.

AVAILABLE ROUTES:
${routesList}

TASK: Suggest the most likely route they meant to navigate to.

RESPONSE FORMAT (JSON only):
{
  "suggestedRoute": "route_path",
  "confidence": 0.0-1.0,
  "message": "Clarification question in ${language === 'bn' ? 'Bengali' : 'English'}"
}

IMPORTANT:
- Respond in ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}
- Ask for clarification politely
- Suggest the most likely match
- Respond ONLY with valid JSON

RESPOND NOW:`;
}
