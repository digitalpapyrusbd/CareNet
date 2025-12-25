/**
 * AI Assistant Component
 * Main floating AI assistant widget
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAIAgent } from '@/hooks/use-ai-agent';
import {
    Mic,
    MicOff,
    Send,
    X,
    Minimize2,
    Maximize2,
    Bot,
    Globe,
    Settings,
    HelpCircle
} from 'lucide-react';
import { Language, UserRole, IntentType } from '@/types/ai-agent';

interface AIAssistantProps {
    userRole: UserRole;
    language?: Language;
}

export function AIAssistant({ userRole, language = 'bn' }: AIAssistantProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputText, setInputText] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

    const pathname = usePathname();
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        sendMessage,
        toggleListening,
        setLanguage,
        isListening,
        isProcessing,
        error
    } = useAIAgent({
        userRole,
        currentRoute: pathname,
        language: currentLanguage
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle navigation actions
    const handleResponse = async (response: any) => {
        if (response?.action) {
            if (response.action.type === 'navigate') {
                router.push(response.action.route);
            }
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || isProcessing) return;

        const response = await sendMessage(inputText);
        setInputText('');

        if (response) {
            await handleResponse(response);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleLanguage = () => {
        const newLang: Language = currentLanguage === 'bn' ? 'en' : 'bn';
        setCurrentLanguage(newLang);
        setLanguage(newLang);
    };

    if (!isExpanded) {
        // Minimized floating button
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Open AI Assistant"
            >
                <Bot className="w-8 h-8" />
                {isListening && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                )}
            </button>
        );
    }

    // Expanded chat interface
    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6" />
                    <div>
                        <h3 className="font-semibold">AI Assistant</h3>
                        <p className="text-xs opacity-90">
                            {currentLanguage === 'bn' ? 'সাহায্যকারী' : 'Helper'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Toggle Language"
                    >
                        <Globe className="w-5 h-5" />
                        <span className="text-xs ml-1">{currentLanguage === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                    </button>

                    <button
                        onClick={() => setIsExpanded(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Minimize"
                    >
                        <Minimize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                            {currentLanguage === 'bn'
                                ? 'আমাকে জিজ্ঞাসা করুন বা একটি কমান্ড বলুন'
                                : 'Ask me anything or say a command'}
                        </p>
                        <p className="text-xs mt-2 opacity-75">
                            {currentLanguage === 'bn'
                                ? 'উদাহরণ: "রোগী দেখাও" বা "পেমেন্ট পাতায় যান"'
                                : 'Example: "show patients" or "go to payments"'}
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-75 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}

                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {currentLanguage === 'bn' ? 'চিন্তা করছি...' : 'Thinking...'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={currentLanguage === 'bn' ? 'একটি বার্তা লিখুন...' : 'Type a message...'}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                            rows={2}
                            disabled={isProcessing}
                        />
                    </div>

                    <button
                        onClick={toggleListening}
                        className={`p-3 rounded-lg transition-all ${isListening
                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                        title={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isProcessing}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Send message"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {isListening && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                        <div className="flex gap-1">
                            <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                            <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                        <span>{currentLanguage === 'bn' ? 'শুনছি...' : 'Listening...'}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
