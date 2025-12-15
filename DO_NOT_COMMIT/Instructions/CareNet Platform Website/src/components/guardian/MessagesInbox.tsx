import { Search, MessageSquare, Heart, Building2, Headphones } from "lucide-react";
import { Input } from "../ui/input";

interface MessagesInboxProps {
  onSelectConversation: (conversationId: string) => void;
}

export function MessagesInbox({ onSelectConversation }: MessagesInboxProps) {
  const conversations = [
    {
      id: "1",
      type: "caregiver",
      name: "Rashida Begum",
      lastMessage: "I've completed the morning vitals check",
      timestamp: "10 min ago",
      unread: 2,
      avatar: null
    },
    {
      id: "2",
      type: "agency",
      name: "Green Care Agency",
      lastMessage: "Your booking has been confirmed",
      timestamp: "1 hour ago",
      unread: 0,
      avatar: null
    },
    {
      id: "3",
      type: "caregiver",
      name: "Nasrin Akter",
      lastMessage: "The medication schedule has been updated",
      timestamp: "2 hours ago",
      unread: 1,
      avatar: null
    },
    {
      id: "4",
      type: "support",
      name: "CareNet Support",
      lastMessage: "How can we help you today?",
      timestamp: "Yesterday",
      unread: 0,
      avatar: null
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "caregiver": return Heart;
      case "agency": return Building2;
      case "support": return Headphones;
      default: return MessageSquare;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case "caregiver": return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)';
      case "agency": return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)';
      case "support": return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)';
      default: return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-6">
        <h1 className="mb-4" style={{ color: '#535353' }}>Messages</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-6 space-y-3">
        {conversations.map((conversation) => {
          const Icon = getIcon(conversation.type);
          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: getGradient(conversation.type) }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {conversation.unread > 0 && (
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                      style={{ background: '#FF6B7A' }}
                    >
                      {conversation.unread}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold truncate" style={{ color: '#535353' }}>
                      {conversation.name}
                    </p>
                    <span className="text-xs shrink-0 ml-2" style={{ color: '#848484' }}>
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p 
                    className="text-sm truncate"
                    style={{ 
                      color: conversation.unread > 0 ? '#535353' : '#848484',
                      fontWeight: conversation.unread > 0 ? 600 : 400
                    }}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="px-6 py-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
          <p style={{ color: '#535353' }}>No messages yet</p>
          <p className="text-sm" style={{ color: '#848484' }}>
            Your conversations will appear here
          </p>
        </div>
      )}
    </div>
  );
}
