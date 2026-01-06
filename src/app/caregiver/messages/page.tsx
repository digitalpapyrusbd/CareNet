"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface Message {
  id: string;
  name: string;
  role: "guardian" | "agency" | "patient";
  message: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

interface MessagesProps {
  messages?: Message[];
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const MESSAGES: Message[] = [
  {
    id: "1",
    name: "Mr. Karim",
    role: "guardian",
    message: "Thank you for excellent care provided to my mother today.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    name: "LifeCare Agency",
    role: "agency",
    message: "New job assignment available for tomorrow 9 AM - 5 PM.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: "3",
    name: "Mrs. Begum",
    role: "patient",
    message: "Please bring my reading glasses when you come tomorrow.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "4",
    name: "CareNet Support",
    role: "agency",
    message: "Your monthly subscription payment is due in 3 days.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "5",
    name: "Mr. Hossain",
    role: "patient",
    message: "I need help with physiotherapy exercises today.",
    time: "2 days ago",
    unread: false,
  },
];

export default function CaregiverMessagesPage({
  onNavigate,
  onBack,
}: MessagesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "guardian" | "agency" | "patient"
  >("all");

  const getRoleColor = (role: string) => {
    switch (role) {
      case "guardian":
        return "#5B9FFF";
      case "agency":
        return "#FFB547";
      case "patient":
        return "#FF6B9D";
      default:
        return "#848484";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "guardian":
        return "Guardian";
      case "agency":
        return "Agency";
      case "patient":
        return "Patient";
      default:
        return "";
    }
  };

  const filteredMessages = MESSAGES.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || msg.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleMessageClick = (messageId: string) => {
    onNavigate?.(`/caregiver/messages/${messageId}`);
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => onBack?.()}
            className="hover:bg-white/30"
            style={{ color: "#535353" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 style={{ color: "#535353" }}>Messages</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-4">
        <div className="finance-card p-4 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "#848484" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none"
            style={{ color: "#535353" }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-6">
        <div className="finance-card p-2 flex gap-2">
          {(["all", "guardian", "agency", "patient"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                activeFilter === filter ? "finance-card" : ""
              }`}
              style={{
                color: activeFilter === filter ? "#FEB4C5" : "#848484",
                background: activeFilter === filter ? "white" : "transparent",
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="px-6 pb-6">
        {filteredMessages.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <MessageCircle
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#848484" }}
            />
            <p style={{ color: "#848484" }}>No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message.id)}
                className="finance-card p-4 block cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: message.unread
                        ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)"
                        : "rgba(142, 197, 252, 0.2)",
                    }}
                  >
                    <span
                      className="text-white font-medium"
                      style={{ fontSize: "18px" }}
                    >
                      {message.name.charAt(0)}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#535353" }}
                      >
                        {message.name}
                      </p>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: `${getRoleColor(message.role)}20`,
                          color: getRoleColor(message.role),
                        }}
                      >
                        {getRoleBadge(message.role)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: "#848484" }} />
                      <span className="text-xs" style={{ color: "#848484" }}>
                        {message.time}
                      </span>
                    </div>

                    <MoreHorizontal
                      className="w-4 h-4"
                      style={{ color: "#848484" }}
                    />
                  </div>

                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "#848484" }}
                  >
                    {message.message}
                  </p>
                </div>

                {/* Unread indicator */}
                {message.unread && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0 mt-1"
                    style={{ background: "#FEB4C5" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
