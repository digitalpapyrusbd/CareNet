'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from './MessageProvider';
import { useAuth } from '@/hooks/useAuth';
import { Send, Paperclip, Mic, Smile, Image, FileText, X, MoreVertical } from 'lucide-react';
import { TouchButton } from '../layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatThreadProps {
  conversationId: string;
  onBack: () => void;
}

export function ChatThread({ conversationId, onBack }: ChatThreadProps) {
  const { selectedConversation, messages, sendMessage, markAsRead, isLoading } = useMessages();
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, markAsRead]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    await sendMessage(messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = () => {
    if (!selectedConversation || !user) return null;
    return selectedConversation.participants.find(p => p.id !== user.id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>;
      case 'sent': return <Send className="w-3 h-3 text-gray-400 rotate-180" />;
      case 'delivered': return <Send className="w-3 h-3 text-gray-400 rotate-180" />;
      case 'read': return <Send className="w-3 h-3 text-[#FFB3C1] rotate-180" />;
      default: return null;
    }
  };

  const otherParticipant = getOtherParticipant();

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ background: 'rgba(142, 197, 252, 0.2)' }}>
            <Send className="w-8 h-8 mx-auto mt-4" style={{ color: '#5B9FFF' }} />
          </div>
          <h3 style={{ color: '#535353' }} className="mb-2">Select a conversation</h3>
          <p style={{ color: '#848484' }} className="text-sm">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50"
              style={{ color: '#848484' }}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(142, 197, 252, 0.2)',
                color: '#5B9FFF'
              }}
            >
              <Send className="w-6 h-6" />
            </div>

            <div>
              <h3 style={{ color: '#535353' }} className="font-semibold">
                {otherParticipant?.name}
              </h3>
              <p className="text-sm" style={{ color: '#848484' }}>
                {otherParticipant?.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50"
              style={{ color: '#848484' }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            const isSystemMessage = message.type === 'system';

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwnMessage && !isSystemMessage && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ 
                      background: 'rgba(142, 197, 252, 0.2)',
                      color: '#5B9FFF'
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : ''}`}>
                  {!isSystemMessage ? (
                    <>
                      {/* Message Bubble */}
                      <div
                        className={`p-3 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-[#FFB3C1] to-[#FF8FA3] text-white'
                            : 'bg-white/60 text-[#535353]'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {/* Message Info */}
                      <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs" style={{ color: '#848484' }}>
                          {formatTime(message.timestamp)}
                        </span>
                        {isOwnMessage && getStatusIcon(message.status)}
                      </div>
                    </>
                  ) : (
                    /* System Message */
                    <div className="text-center">
                      <span 
                        className="inline-block px-4 py-2 rounded-full text-xs"
                        style={{ 
                          background: 'rgba(142, 197, 252, 0.2)',
                          color: '#5B9FFF'
                        }}
                      >
                        {message.content}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ 
                background: 'rgba(142, 197, 252, 0.2)',
                color: '#5B9FFF'
              }}
            >
              <Send className="w-5 h-5" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/50">
        <div className="flex items-end gap-3">
          {/* Attachment Menu */}
          {showAttachmentMenu && (
            <div className="absolute bottom-24 left-4 right-4 finance-card p-4 rounded-2xl shadow-lg">
              <div className="grid grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/50">
                  <Image className="w-6 h-6" style={{ color: '#FFB3C1' }} />
                  <span className="text-xs" style={{ color: '#535353' }}>Photo</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/50">
                  <FileText className="w-6 h-6" style={{ color: '#5B9FFF' }} />
                  <span className="text-xs" style={{ color: '#535353' }}>Document</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/50">
                  <Mic className="w-6 h-6" style={{ color: '#7CE577' }} />
                  <span className="text-xs" style={{ color: '#535353' }}>Voice</span>
                </button>
                <button 
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/50"
                  onClick={() => setShowAttachmentMenu(false)}
                >
                  <X className="w-6 h-6" style={{ color: '#848484' }} />
                  <span className="text-xs" style={{ color: '#535353' }}>Close</span>
                </button>
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="flex-1 relative">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-24 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
            
            {/* Emoji Button */}
            <button className="absolute right-16 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
              style={{ color: '#848484' }}
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Attachment Button */}
            <button 
              className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
              style={{ color: '#848484' }}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          {/* Send Button */}
          <TouchButton
            variant="primary"
            size="md"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="min-w-[44px] h-[44px]"
          >
            <Send className="w-5 h-5" />
          </TouchButton>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-2 mt-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => setMessageInput(messageInput + ' 😊')}
          >
            😊 Quick reply
          </TouchButton>
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => setMessageInput(messageInput + ' 👍')}
          >
            👍 Got it
          </TouchButton>
        </div>
      </div>
    </div>
  );
}