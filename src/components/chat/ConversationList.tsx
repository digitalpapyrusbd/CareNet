'use client';

import React, { useState, useEffect } from 'react';
import { useMessages } from './MessageProvider';
import { useAuth } from '@/hooks/useAuth';
import { Search, MessageSquare, Users, Building2, Heart, Shield, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TouchButton } from '../layout/MobileFirstLayout';

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const { conversations, searchConversations, getUnreadCount, isLoading } = useMessages();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredConversations(searchConversations(searchQuery));
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations, searchConversations]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'guardian': return <Users className="w-4 h-4" />;
      case 'caregiver': return <Heart className="w-4 h-4" />;
      case 'agency': return <Building2 className="w-4 h-4" />;
      case 'moderator': return <Shield className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'guardian': return '#5B9FFF';
      case 'caregiver': return '#FFB3C1';
      case 'agency': return '#7CE577';
      case 'moderator': return '#FFD180';
      case 'admin': return '#B8A7FF';
      default: return '#848484';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p.id !== user?.id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="finance-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/50">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ color: '#535353' }} className="text-lg font-semibold">
            Messages
          </h2>
          <div className="flex items-center gap-2">
            <span 
              className="px-2 py-1 rounded-full text-xs"
              style={{ 
                background: 'rgba(255, 179, 193, 0.2)',
                color: '#FFB3C1'
              }}
            >
              {getUnreadCount()} unread
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ background: 'rgba(142, 197, 252, 0.2)' }}>
              <MessageSquare className="w-8 h-8 mx-auto mt-4" style={{ color: '#5B9FFF' }} />
            </div>
            <h3 style={{ color: '#535353' }} className="mb-2">No conversations yet</h3>
            <p style={{ color: '#848484' }} className="text-sm">
              Start a conversation with your caregiver, agency, or guardian
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/30">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const lastMessage = conversation.lastMessage;
              const isSelected = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-4 text-left transition-all ${
                    isSelected ? 'bg-white/30' : 'hover:bg-white/20'
                  }`}
                  style={{
                    borderLeft: isSelected ? '3px solid #FFB3C1' : '3px solid transparent'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ 
                        background: 'rgba(142, 197, 252, 0.2)',
                        color: '#5B9FFF'
                      }}
                    >
                      {getRoleIcon(otherParticipant.role)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 style={{ color: '#535353' }} className="font-medium truncate">
                            {otherParticipant.name}
                          </h3>
                          <span 
                            className="px-2 py-1 rounded-full text-xs"
                            style={{ 
                              background: 'rgba(142, 197, 252, 0.2)',
                              color: '#5B9FFF'
                            }}
                          >
                            {otherParticipant.role}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: '#848484' }}>
                          {lastMessage && formatTime(lastMessage.timestamp)}
                        </span>
                      </div>

                      {lastMessage ? (
                        <div className="flex items-center justify-between">
                          <p 
                            className="text-sm truncate"
                            style={{ color: '#848484' }}
                          >
                            {lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                              style={{ background: '#FF6B7A' }}
                            >
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: '#848484' }}>
                          No messages yet
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-white/50">
        <div className="space-y-2">
          <TouchButton
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              // Handle new message
              console.log('New message');
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              // Handle group chat
              console.log('Group chat');
            }}
          >
            <Users className="w-4 h-4 mr-2" />
            Group Chat
          </TouchButton>
        </div>
      </div>
    </div>
  );
}