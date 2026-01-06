'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  type: 'text' | 'image' | 'document';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  readBy: string[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MessageContextType {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, type?: 'text' | 'image' | 'document') => Promise<void>;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantIds: string[]) => Promise<Conversation>;
  searchConversations: (query: string) => Conversation[];
  getUnreadCount: () => number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockConversations: Conversation[] = [
    {
      id: 'conv-1',
      participants: [
        { id: 'user-1', name: 'Fatima Khan', role: 'caregiver', avatar: '/avatars/caregiver-1.jpg' },
        { id: 'user-2', name: 'Mr. Karim', role: 'guardian', avatar: '/avatars/guardian-1.jpg' }
      ],
      lastMessage: {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        senderName: 'Fatima Khan',
        senderRole: 'caregiver',
        content: 'I have completed today\'s vitals check for Mrs. Rahman.',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
        readBy: ['user-2']
      },
      unreadCount: 0,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'conv-2',
      participants: [
        { id: 'user-3', name: 'Green Care Agency', role: 'agency', avatar: '/avatars/agency-1.jpg' },
        { id: 'user-2', name: 'Mr. Karim', role: 'guardian', avatar: '/avatars/guardian-1.jpg' }
      ],
      lastMessage: {
        id: 'msg-2',
        conversationId: 'conv-2',
        senderId: 'user-3',
        senderName: 'Green Care Agency',
        senderRole: 'agency',
        content: 'Your new package is ready for review.',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'delivered',
        readBy: []
      },
      unreadCount: 1,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  useEffect(() => {
    // Load conversations from localStorage or API
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      // In real implementation, fetch from API
      setConversations(mockConversations);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      // Load messages for this conversation
      loadMessages(conversationId);
      markAsRead(conversationId);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          conversationId,
          senderId: 'user-1',
          senderName: 'Fatima Khan',
          senderRole: 'caregiver',
          content: 'Good morning! How is Mrs. Rahman feeling today?',
          type: 'text',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'read',
          readBy: ['user-2']
        },
        {
          id: 'msg-2',
          conversationId,
          senderId: 'user-2',
          senderName: 'Mr. Karim',
          senderRole: 'guardian',
          content: 'She is doing well, thank you. Her vitals are stable.',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'read',
          readBy: ['user-1']
        }
      ];
      setMessages(mockMessages);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'image' | 'document' = 'text') => {
    if (!selectedConversation || !user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content,
      type,
      timestamp: new Date().toISOString(),
      status: 'sending',
      readBy: []
    };

    // Add to local state immediately
    setMessages(prev => [...prev, newMessage]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : conv
      ));

    } catch (err) {
      setError('Failed to send message');
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
  };

  const markAsRead = (conversationId: string) => {
    if (!user) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          lastMessage: conv.lastMessage ? {
            ...conv.lastMessage,
            readBy: [...conv.lastMessage.readBy, user.id]
          } : conv.lastMessage
        };
      }
      return conv;
    }));

    // Update selected conversation
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => prev ? {
        ...prev,
        unreadCount: 0
      } : null);
    }
  };

  const createConversation = async (participantIds: string[]): Promise<Conversation> => {
    // Implementation for creating new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [], // Would fetch from API
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  };

  const searchConversations = (query: string): Conversation[] => {
    if (!query.trim()) return conversations;
    
    return conversations.filter(conv => 
      conv.participants.some(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const getUnreadCount = (): number => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  const value: MessageContextType = {
    conversations,
    selectedConversation,
    messages,
    isLoading,
    error,
    selectConversation,
    sendMessage,
    markAsRead,
    createConversation,
    searchConversations,
    getUnreadCount
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}