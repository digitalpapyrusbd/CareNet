/**
 * Text-to-Speech Service
 * Handles voice output using Web Speech API
 */

import { AI_AGENT_CONFIG } from './config';
import { Language } from '@/types/ai-agent';

// Check if Web Speech API is supported
export function isTTSSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Text-to-Speech Manager
 */
export class TextToSpeechService {
    private synthesis: SpeechSynthesis | null = null;
    private currentLanguage: Language = 'bn';
    private rate: number = AI_AGENT_CONFIG.tts.rate;
    private pitch: number = AI_AGENT_CONFIG.tts.pitch;
    private volume: number = AI_AGENT_CONFIG.tts.volume;
    private isSpeaking: boolean = false;
    private queue: string[] = [];

    constructor() {
        if (isTTSSupported()) {
            this.synthesis = window.speechSynthesis;
        }
    }

    /**
     * Speak text
     */
    speak(text: string, language?: Language): void {
        if (!this.synthesis) {
            console.warn('Text-to-speech is not supported in this browser.');
            return;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language
        const lang = language || this.currentLanguage;
        utterance.lang = this.getLanguageCode(lang);

        // Set voice properties
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        // Try to find Bengali voice if available
        if (lang === 'bn') {
            const voices = this.synthesis.getVoices();
            const bengaliVoice = voices.find(voice =>
                voice.lang.startsWith('bn') || voice.lang.startsWith('hi')
            );
            if (bengaliVoice) {
                utterance.voice = bengaliVoice;
            }
        }

        // Event handlers
        utterance.onstart = () => {
            this.isSpeaking = true;
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.processQueue();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isSpeaking = false;
            this.processQueue();
        };

        // Speak
        this.synthesis.speak(utterance);
    }

    /**
     * Add text to queue
     */
    queueSpeak(text: string): void {
        this.queue.push(text);
        if (!this.isSpeaking) {
            this.processQueue();
        }
    }

    /**
     * Process speech queue
     */
    private processQueue(): void {
        if (this.queue.length > 0 && !this.isSpeaking) {
            const text = this.queue.shift();
            if (text) {
                this.speak(text);
            }
        }
    }

    /**
     * Stop speaking
     */
    stop(): void {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.queue = [];
            this.isSpeaking = false;
        }
    }

    /**
     * Pause speaking
     */
    pause(): void {
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.pause();
        }
    }

    /**
     * Resume speaking
     */
    resume(): void {
        if (this.synthesis) {
            this.synthesis.resume();
        }
    }

    /**
     * Set language
     */
    setLanguage(language: Language): void {
        this.currentLanguage = language;
    }

    /**
     * Get language code for TTS
     */
    private getLanguageCode(language: Language): string {
        return language === 'bn' ? 'bn-BD' : 'en-US';
    }

    /**
     * Set speech rate (0.1 to 10)
     */
    setRate(rate: number): void {
        this.rate = Math.max(0.1, Math.min(10, rate));
    }

    /**
     * Set speech pitch (0 to 2)
     */
    setPitch(pitch: number): void {
        this.pitch = Math.max(0, Math.min(2, pitch));
    }

    /**
     * Set speech volume (0 to 1)
     */
    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Get available voices
     */
    getVoices(): SpeechSynthesisVoice[] {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices();
    }

    /**
     * Get Bengali voices
     */
    getBengaliVoices(): SpeechSynthesisVoice[] {
        return this.getVoices().filter(voice =>
            voice.lang.startsWith('bn') || voice.lang.startsWith('hi')
        );
    }

    /**
     * Check if currently speaking
     */
    getIsSpeaking(): boolean {
        return this.isSpeaking;
    }

    /**
     * Get queue length
     */
    getQueueLength(): number {
        return this.queue.length;
    }
}

// Singleton instance
let ttsService: TextToSpeechService | null = null;

/**
 * Get TTS service instance
 */
export function getTextToSpeechService(): TextToSpeechService {
    if (!ttsService) {
        ttsService = new TextToSpeechService();
    }
    return ttsService;
}
