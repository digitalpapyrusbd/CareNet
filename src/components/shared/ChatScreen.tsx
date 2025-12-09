import { ArrowLeft, Send, Paperclip, Mic, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface ChatScreenProps {
  conversationId: string;
  recipientName: string;
  recipientType: "caregiver" | "agency" | "support" | "guardian" | "patient";
  onBack: () => void;
}

export function ChatScreen({ conversationId, recipientName, recipientType, onBack }: ChatScreenProps) {
  const [message, setMessage] = useState("");

  const messages = [
    { id: "1", sender: "them", text: "Hello! I wanted to update you on the morning routine.", timestamp: "10:30 AM", delivered: true },
    { id: "2", sender: "me", text: "Thanks for the update. How is she doing?", timestamp: "10:32 AM", delivered: true },
    { id: "3", sender: "them", text: "She's doing well. Vitals are normal and she ate a good breakfast.", timestamp: "10:35 AM", delivered: true },
    { id: "4", sender: "me", text: "That's great to hear!", timestamp: "10:36 AM", delivered: true },
    { id: "5", sender: "them", text: "I've also administered her morning medications as scheduled.", timestamp: "10:40 AM", delivered: false },
  ];

  const getGradient = (type: string) => {
    switch (type) {
      case "caregiver": return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)';
      case "agency": return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)';
      case "support": return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)';
      default: return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)';
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 border-b backdrop-blur-lg p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: getGradient(recipientType) }}
          >
            <span className="text-white text-sm">{recipientName.charAt(0)}</span>
          </div>

          <div className="flex-1">
            <p style={{ color: '#535353' }}>{recipientName}</p>
            <p className="text-xs" style={{ color: '#7CE577' }}>● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'
              }`}
              style={{
                background: msg.sender === 'me'
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: msg.sender === 'me' ? 'white' : '#535353'
              }}
            >
              <p className="text-sm">{msg.text}</p>
              <p 
                className="text-xs mt-1"
                style={{ color: msg.sender === 'me' ? 'rgba(255, 255, 255, 0.8)' : '#848484' }}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div 
        className="sticky bottom-0 border-t backdrop-blur-lg p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50"
            style={{ color: '#848484' }}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50"
            style={{ color: '#848484' }}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />

          {message.trim() ? (
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50"
              style={{ color: '#848484' }}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
