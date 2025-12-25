import { Send, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface ChatWithShopAdminProps {
  messages: {
    id: string;
    sender: 'manager' | 'admin';
    text: string;
    timestamp: string;
  }[];
  onSendMessage: (message: string) => void;
}

export function ChatWithShopAdmin({ messages, onSendMessage }: ChatWithShopAdminProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="mb-6" style={{ color: '#535353' }}>Chat with Shop Admin</h1>

        <div className="finance-card flex-1 flex flex-col p-6 mb-4">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'manager' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[70%] p-3 rounded-lg"
                  style={{
                    background: message.sender === 'manager'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: message.sender === 'manager' ? 'white' : '#535353'
                  }}
                >
                  <p className="mb-1">{message.text}</p>
                  <p
                    className="text-xs"
                    style={{
                      color: message.sender === 'manager' ? 'rgba(255, 255, 255, 0.8)' : '#848484'
                    }}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <Paperclip className="w-5 h-5" style={{ color: '#848484' }} />
            </button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                color: 'white',
                opacity: !newMessage.trim() ? 0.5 : 1
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

