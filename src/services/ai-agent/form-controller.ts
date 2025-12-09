/**
 * Form Controller
 * Handles form field identification and auto-filling
 */

import { callGemini, parseGeminiJSON } from './gemini-client';
import { getFormExtractionPrompt } from './prompts';
import { FormField, FormAction, Language } from '@/types/ai-agent';

/**
 * Scan current page for form fields
 */
export function scanFormFields(): FormField[] {
    const fields: FormField[] = [];

    // Find all input, select, and textarea elements
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach((element) => {
        const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        // Skip hidden, submit, and button inputs
        if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
            return;
        }

        // Get field metadata
        const name = input.name || input.id || '';
        const type = input.type || 'text';
        const required = input.hasAttribute('required');
        const value = input.value || '';

        // Try to find label
        let label = '';
        let labelBengali = '';

        // Check for associated label
        if (input.id) {
            const labelElement = document.querySelector(`label[for="${input.id}"]`);
            if (labelElement) {
                label = labelElement.textContent?.trim() || '';
            }
        }

        // Check for aria-label
        if (!label && input.hasAttribute('aria-label')) {
            label = input.getAttribute('aria-label') || '';
        }

        // Check for placeholder
        if (!label && input.hasAttribute('placeholder')) {
            label = input.getAttribute('placeholder') || '';
        }

        // Detect if label is in Bengali
        const bengaliRegex = /[\u0980-\u09FF]/;
        if (bengaliRegex.test(label)) {
            labelBengali = label;
            // Try to get English label from data attribute
            label = input.getAttribute('data-label-en') || label;
        }

        if (name) {
            fields.push({
                name,
                type,
                label,
                labelBengali,
                placeholder: input.getAttribute('placeholder') || undefined,
                required,
                value
            });
        }
    });

    return fields;
}

/**
 * Extract form filling instructions from user input using Gemini
 */
export async function extractFormInstructions(
    userInput: string,
    availableFields: FormField[]
): Promise<FormAction> {
    try {
        // Generate prompt
        const prompt = getFormExtractionPrompt(userInput, availableFields);

        // Call Gemini
        const response = await callGemini({
            prompt,
            context: {} as any, // Context not needed for form extraction
            temperature: 0.2, // Very low temperature for precise extraction
            maxTokens: 200
        });

        // Parse JSON response
        const result = parseGeminiJSON<{
            fields: Array<{ name: string; value: string }>;
            confidence: number;
            language: string;
        }>(response.text);

        return {
            type: 'fill_form',
            fields: result.fields || [],
            autoSubmit: false // Never auto-submit for safety
        };
    } catch (error: any) {
        console.error('Form extraction error:', error);

        // Return empty form action on error
        return {
            type: 'fill_form',
            fields: [],
            autoSubmit: false
        };
    }
}

/**
 * Fill form fields with values
 */
export function fillFormFields(formAction: FormAction): {
    success: boolean;
    filledFields: string[];
    errors: string[];
} {
    const filledFields: string[] = [];
    const errors: string[] = [];

    formAction.fields.forEach(({ name, value }) => {
        try {
            // Find input by name or id
            const input = document.querySelector(
                `input[name="${name}"], textarea[name="${name}"], select[name="${name}"], ` +
                `input[id="${name}"], textarea[id="${name}"], select[id="${name}"]`
            ) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;

            if (!input) {
                errors.push(`Field "${name}" not found`);
                return;
            }

            // Set value based on input type
            if (input.type === 'checkbox') {
                (input as HTMLInputElement).checked = value.toLowerCase() === 'true' || value === '1';
            } else if (input.type === 'radio') {
                (input as HTMLInputElement).checked = input.value === value;
            } else {
                input.value = value;
            }

            // Trigger change event for React/form validation
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);

            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);

            filledFields.push(name);
        } catch (error: any) {
            errors.push(`Error filling "${name}": ${error.message}`);
        }
    });

    return {
        success: filledFields.length > 0,
        filledFields,
        errors
    };
}

/**
 * Quick form fill for simple commands (no API call)
 */
export function quickFillForm(userInput: string, language: Language): FormAction | null {
    const input = userInput.toLowerCase().trim();

    // Pattern: "fill [field] [value]" or "লিখুন [field] [value]"
    const fillPatterns = [
        /(?:fill|enter|type|set)\s+(\w+)\s+(.+)/i,
        /(?:লিখুন|প্রবেশ করুন)\s+(\w+)\s+(.+)/i,
        /(\w+)\s+(?:is|হল|হলো)\s+(.+)/i
    ];

    for (const pattern of fillPatterns) {
        const match = input.match(pattern);
        if (match) {
            const fieldName = match[1].toLowerCase();
            const value = match[2].trim();

            return {
                type: 'fill_form',
                fields: [{ name: fieldName, value }],
                autoSubmit: false
            };
        }
    }

    return null;
}

/**
 * Validate form field value
 */
export function validateFieldValue(field: FormField, value: string): {
    valid: boolean;
    error?: string;
} {
    // Required field check
    if (field.required && !value.trim()) {
        return {
            valid: false,
            error: 'This field is required'
        };
    }

    // Type-specific validation
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                return {
                    valid: false,
                    error: 'Invalid email format'
                };
            }
            break;

        case 'tel':
        case 'phone':
            // Bangladesh phone number format
            const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
            if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                return {
                    valid: false,
                    error: 'Invalid phone number format'
                };
            }
            break;

        case 'number':
            if (value && isNaN(Number(value))) {
                return {
                    valid: false,
                    error: 'Must be a number'
                };
            }
            break;

        case 'date':
            if (value && isNaN(Date.parse(value))) {
                return {
                    valid: false,
                    error: 'Invalid date format'
                };
            }
            break;
    }

    return { valid: true };
}
