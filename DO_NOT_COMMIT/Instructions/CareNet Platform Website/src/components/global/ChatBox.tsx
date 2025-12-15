import { MessageSquare, X, Plus, User, Clock, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";

interface ChatBoxProps {
  onClose: () => void;
  userRole: string;
}

const mockChats = {
  guardian: [
    {
      id: 1,
      name: "Fatima Khan",
      role: "Caregiver",
      lastMessage: "I've completed today's vitals check",
      time: "2 mins ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "ABC Care Services",
      role: "Agency",
      lastMessage: "Your payment has been received",
      time: "1 hour ago",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Support Team",
      role: "Support",
      lastMessage: "How can we help you today?",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
  ],
  caregiver: [
    {
      id: 1,
      name: "Mr. Karim",
      role: "Guardian",
      lastMessage: "Thank you for taking care of my mother",
      time: "5 mins ago",
      unread: 1,
      online: true,
    },
    {
      id: 2,
      name: "Elite Caregivers",
      role: "Agency",
      lastMessage: "New job assignment available",
      time: "2 hours ago",
      unread: 3,
      online: false,
    },
    {
      id: 3,
      name: "Support Team",
      role: "Support",
      lastMessage: "Your issue has been resolved",
      time: "2 days ago",
      unread: 0,
      online: true,
    },
  ],
};

export function ChatBox({ onClose, userRole }: ChatBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const chats = mockChats[userRole as keyof typeof mockChats] || mockChats.guardian;
  
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = chats.filter(c => c.unread > 0).length;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="container max-w-2xl mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 btn-neumorphic-primary rounded-[22px]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2>Messages</h2>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread conversation${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <button className="btn-neumorphic-primary mb-4 h-12 w-full flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Start New Conversation
        </button>

        {/* Search */}
        <Card className="modern-card p-2 border-0 mb-4">
          <div className="relative flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground ml-2" />
            <Input
              type="search"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 h-10 bg-transparent"
            />
          </div>
        </Card>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                className="btn-neumorphic p-4 cursor-pointer w-full"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                    {chat.unread > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs rounded-full bg-red-500 text-white border-2 border-background"
                      >
                        {chat.unread}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="truncate mb-1">{chat.name}</h4>
                        <Badge variant="secondary" className="text-xs border-0">
                          {chat.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="w-3 h-3" />
                        {chat.time}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-2">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
