import { MessageSquare, Send, Paperclip, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface AdminMessagesProps {
  conversations: {
    id: string;
    participantName: string;
    participantRole: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
  }[];
  onSelectConversation: (conversationId: string) => void;
}

export function AdminMessages({ conversations, onSelectConversation }: AdminMessagesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Messages</h1>

        {/* Search */}
        <div className="finance-card p-6 mb-6">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className="finance-card p-6 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{conversation.participantName}</h3>
                    <span className="text-xs" style={{ color: '#848484' }}>{conversation.lastMessageTime}</span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>{conversation.participantRole}</p>
                  <p className="text-sm truncate" style={{ color: '#535353' }}>{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: '#FF8FA3' }}>
                    <span className="text-xs text-white">{conversation.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="finance-card p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No conversations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

