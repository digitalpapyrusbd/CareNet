'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, ArrowLeft, Plus, Search } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatThread } from '@/components/chat/ChatThread';
import { MessageProvider } from '@/components/chat/MessageProvider';
import { UniversalNav } from '@/components/layout/UniversalNav';

export default function MessagesPage() {
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleBack = () => {
    if (selectedConversationId) {
      setSelectedConversationId(null);
    } else {
      router.back();
    }
  };

  return (
    <MessageProvider>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
                Messages
              </h1>
              <span 
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  background: 'rgba(255, 179, 193, 0.2)',
                  color: '#FFB3C1'
                }}
              >
                3 unread
              </span>
            </div>
            
            <div className="flex gap-2">
              <TouchButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  // Handle search
                  console.log('Search messages');
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </TouchButton>
              
              <TouchButton
                variant="primary"
                size="sm"
                onClick={() => {
                  // Handle new message
                  console.log('New message');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </TouchButton>
            </div>
          </div>

          {/* Messages Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="lg:col-span-1">
              <ConversationList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversationId}
              />
            </div>

            {/* Chat Thread */}
            <div className="lg:col-span-2">
              <ChatThread
                conversationId={selectedConversationId || ''}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      </div>
    </MessageProvider>
  );
}