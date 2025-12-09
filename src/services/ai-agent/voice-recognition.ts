/**
 * Voice Recognition Service
 * Handles voice input using Web Speech API with Bengali support
 */

import { AI_AGENT_CONFIG } from './config';
import { VoiceRecognitionResult, Language } from '@/types/ai-agent';

// Check if Web Speech API is supported
export function isVoiceSupported(): boolean {
    return typeof window !== 'undefined' &&
        ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

// Get SpeechRecognition constructor
function getSpeechRecognition(): any {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

/**
 * Voice Recognition Manager
 */
export class VoiceRecognitionService {
    private recognition: any = null;
    private isListening: boolean = false;
    private currentLanguage: Language = 'bn';

    // Callbacks
    private onResultCallback?: (result: VoiceRecognitionResult) => void;
    private onErrorCallback?: (error: string) => void;
    private onStartCallback?: () => void;
    private onEndCallback?: () => void;

    constructor() {
        if (isVoiceSupported()) {
            this.initializeRecognition();
        }
    }

    /**
     * Initialize Web Speech API
     */
    private initializeRecognition(): void {
        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();

        // Configure recognition
        this.recognition.continuous = AI_AGENT_CONFIG.voice.continuous;
        this.recognition.interimResults = AI_AGENT_CONFIG.voice.interimResults;
        this.recognition.maxAlternatives = AI_AGENT_CONFIG.voice.maxAlternatives;
        this.recognition.lang = this.getLanguageCode(this.currentLanguage);

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.onStartCallback?.();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onEndCallback?.();
        };

        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const result = event.results[last];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            const isFinal = result.isFinal;

            const voiceResult: VoiceRecognitionResult = {
                transcript: transcript.trim(),
                confidence,
                isFinal,
                language: this.currentLanguage
            };

            this.onResultCallback?.(voiceResult);
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);

            let errorMessage = 'Voice recognition error';

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found or not accessible.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'aborted':
                    errorMessage = 'Speech recognition aborted.';
                    break;
                default:
                    errorMessage = `Speech recognition error: ${event.error}`;
            }

            this.onErrorCallback?.(errorMessage);
        };
    }

    /**
     * Get language code for Web Speech API
     */
    private getLanguageCode(language: Language): string {
        return language === 'bn'
            ? AI_AGENT_CONFIG.voice.language
            : AI_AGENT_CONFIG.voice.languageAlternate;
    }

    /**
     * Start listening
     */
    start(): void {
        if (!this.recognition) {
            this.onErrorCallback?.('Voice recognition is not supported in this browser.');
            return;
        }

        if (this.isListening) {
            return;
        }

        try {
            this.recognition.start();
        } catch (error: any) {
            console.error('Failed to start voice recognition:', error);
            this.onErrorCallback?.(error.message || 'Failed to start voice recognition');
        }
    }

    /**
     * Stop listening
     */
    stop(): void {
        if (!this.recognition || !this.isListening) {
            return;
        }

        try {
            this.recognition.stop();
        } catch (error: any) {
            console.error('Failed to stop voice recognition:', error);
        }
    }

    /**
     * Abort listening
     */
    abort(): void {
        if (!this.recognition) {
            return;
        }

        try {
            this.recognition.abort();
        } catch (error: any) {
            console.error('Failed to abort voice recognition:', error);
        }
    }

    /**
     * Set language
     */
    setLanguage(language: Language): void {
        this.currentLanguage = language;

        if (this.recognition) {
            this.recognition.lang = this.getLanguageCode(language);
        }
    }

    /**
     * Get current language
     */
    getLanguage(): Language {
        return this.currentLanguage;
    }

    /**
     * Check if currently listening
     */
    getIsListening(): boolean {
        return this.isListening;
    }

    /**
     * Set callback for results
     */
    onResult(callback: (result: VoiceRecognitionResult) => void): void {
        this.onResultCallback = callback;
    }

    /**
     * Set callback for errors
     */
    onError(callback: (error: string) => void): void {
        this.onErrorCallback = callback;
    }

    /**
     * Set callback for start event
     */
    onStart(callback: () => void): void {
        this.onStartCallback = callback;
    }

    /**
     * Set callback for end event
     */
    onEnd(callback: () => void): void {
        this.onEndCallback = callback;
    }

    /**
     * Request microphone permission
     */
    async requestPermission(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately, we just wanted to request permission
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }

    /**
     * Check if microphone permission is granted
     */
    async checkPermission(): Promise<boolean> {
        try {
            if (!navigator.permissions) {
                // Permissions API not supported, assume granted
                return true;
            }

            const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            return result.state === 'granted';
        } catch (error) {
            // If query fails, try to request permission
            return this.requestPermission();
        }
    }
}

// Singleton instance
let voiceService: VoiceRecognitionService | null = null;

/**
 * Get voice recognition service instance
 */
export function getVoiceRecognitionService(): VoiceRecognitionService {
    if (!voiceService) {
        voiceService = new VoiceRecognitionService();
    }
    return voiceService;
}
