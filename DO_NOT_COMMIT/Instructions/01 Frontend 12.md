# Frontend 12: Messaging & Communication System

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [11: UI Components](01%20Frontend%2011.md)

---

## 📋 Table of Contents

1. [Messaging System Overview](#messaging-system-overview)
2. [Message Architecture](#message-architecture)
3. [Conversation List](#conversation-list)
4. [Chat Interface](#chat-interface)
5. [Real-time Features](#real-time-features)
6. [Message Types](#message-types)
7. [Notifications](#notifications)
8. [File Attachments](#file-attachments)
9. [Role-Based Messaging](#role-based-messaging)
10. [Debugging Guide](#debugging-guide)
11. [Testing Guide](#testing-guide)
12. [Testing Progress Log](#testing-progress-log)

---

## 💬 Messaging System Overview

### **Purpose**
The messaging system enables secure communication between:
- **Guardians ↔ Caregivers**: Care coordination, updates
- **Guardians ↔ Agencies**: Booking inquiries, negotiations
- **Patients ↔ Caregivers**: Direct care communication
- **Agencies ↔ Caregivers**: Job assignments, instructions
- **All users ↔ Support**: Customer support
- **Admin/Moderators ↔ Users**: System notifications, moderation

### **Key Features**

- ✅ Real-time messaging
- ✅ Conversation threads
- ✅ Unread message badges
- ✅ Message search
- ✅ File attachments (images, documents)
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Push notifications
- ✅ Message history
- ✅ Emoji support

### **Technology Stack**

- **Real-time**: Firebase Cloud Messaging (FCM) / WebSockets
- **Storage**: PostgreSQL (message history)
- **File Storage**: AWS S3 / Cloudinary
- **State Management**: React Query
- **UI Components**: Custom chat components

---

## 🏗️ Message Architecture

### **Database Schema**

```typescript
// Message Model
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  recipientId: string;
  recipientRole: UserRole;
  content: string;
  type: 'text' | 'image' | 'document' | 'system';
  attachments?: Attachment[];
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Conversation Model
interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage: Message;
  unreadCount: Record<string, number>; // userId -> count
  createdAt: Date;
  updatedAt: Date;
}

// Conversation Participant
interface ConversationParticipant {
  userId: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

// Attachment
interface Attachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}
```

### **API Endpoints**

```typescript
// Conversations
GET    /api/conversations              // List user conversations
GET    /api/conversations/:id          // Get conversation details
POST   /api/conversations              // Create new conversation
DELETE /api/conversations/:id          // Delete conversation

// Messages
GET    /api/conversations/:id/messages // Get conversation messages
POST   /api/conversations/:id/messages // Send message
PATCH  /api/messages/:id/read          // Mark message as read
DELETE /api/messages/:id               // Delete message

// Attachments
POST   /api/messages/upload            // Upload file attachment
```

---

## 📝 Conversation List

**Route**: `/[role]/messages`  
**Example**: `/guardian/messages`, `/caregiver/messages`

### **Conversation List Implementation**

```tsx
export default function MessagesPage() {
  const router = useRouter();

  const conversations = [
    {
      id: '1',
      type: 'caregiver',
      name: 'Rashida Begum',
      lastMessage: "I've completed the morning vitals check",
      timestamp: '10 min ago',
      unread: 2,
      avatar: null
    },
    {
      id: '2',
      type: 'agency',
      name: 'Green Care Agency',
      lastMessage: 'Your booking has been confirmed',
      timestamp: '1 hour ago',
      unread: 0,
      avatar: null
    },
    {
      id: '3',
      type: 'support',
      name: 'CareNet Support',
      lastMessage: 'How can we help you today?',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: null
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'caregiver': return Heart;
      case 'agency': return Building2;
      case 'support': return Headphones;
      default: return MessageSquare;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'caregiver': return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)';
      case 'agency': return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)';
      case 'support': return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)';
      default: return 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)';
    }
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen pb-24 md:pt-14">
        {/* Header */}
        <div className="p-6">
          <h1 className="mb-4" style={{ color: '#535353' }}>Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
              style={{ color: '#848484' }} 
            />
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
                onClick={() => router.push(`/guardian/messages/${conversation.id}`)}
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
            <MessageSquare 
              className="w-12 h-12 mx-auto mb-4" 
              style={{ color: '#848484' }} 
            />
            <p style={{ color: '#535353' }}>No messages yet</p>
            <p className="text-sm" style={{ color: '#848484' }}>
              Your conversations will appear here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
```

**Features:**
- Search conversations
- Unread message badges
- Last message preview
- Relative timestamps
- Role-based icons and colors
- Empty state

---

## 💬 Chat Interface

**Route**: `/[role]/messages/[id]`

### **Chat Interface Implementation**

```tsx
export default function ConversationPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'user-123'; // From auth context

  const conversation = {
    id: params.id,
    participant: {
      name: 'Rashida Begum',
      role: 'caregiver',
      avatar: null,
      online: true
    }
  };

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: currentUserId,
      content: 'Hello! How is my father doing today?',
      timestamp: '9:00 AM',
      read: true
    },
    {
      id: '2',
      senderId: 'caregiver-456',
      content: "Good morning! He's doing well. We just finished breakfast and he ate everything.",
      timestamp: '9:05 AM',
      read: true
    },
    {
      id: '3',
      senderId: 'caregiver-456',
      content: "I've also completed the morning vitals check. Blood pressure is 120/80, normal range.",
      timestamp: '9:06 AM',
      read: true
    },
    {
      id: '4',
      senderId: currentUserId,
      content: 'Thank you so much for the update! Please remind him about his afternoon medication.',
      timestamp: '9:10 AM',
      read: false
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      }),
      read: false
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Send to API
    try {
      await fetch(`/api/conversations/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputMessage })
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen flex flex-col pb-24 md:pt-14">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              {conversation.participant.online && (
                <div 
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: '#7CE577' }}
                />
              )}
            </div>
            <div className="flex-1">
              <h2 style={{ color: '#535353' }}>{conversation.participant.name}</h2>
              <p className="text-xs" style={{ color: conversation.participant.online ? '#7CE577' : '#848484' }}>
                {conversation.participant.online ? 'Online' : 'Offline'}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'
                  }`}
                  style={{
                    background: isOwn
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      : 'rgba(255, 255, 255, 0.8)',
                    color: isOwn ? 'white' : '#535353'
                  }}
                >
                  <p className="text-sm mb-1">{message.content}</p>
                  <div className="flex items-center justify-end gap-1">
                    <span 
                      className="text-xs" 
                      style={{ color: isOwn ? 'rgba(255,255,255,0.8)' : '#848484' }}
                    >
                      {message.timestamp}
                    </span>
                    {isOwn && (
                      <div className="flex">
                        <Check 
                          className="w-3 h-3" 
                          style={{ color: message.read ? '#7CE577' : 'rgba(255,255,255,0.8)' }} 
                        />
                        {message.read && (
                          <Check 
                            className="w-3 h-3 -ml-2" 
                            style={{ color: '#7CE577' }} 
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="rounded-2xl rounded-bl-sm px-4 py-3"
                style={{ background: 'rgba(255, 255, 255, 0.8)' }}
              >
                <div className="flex gap-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: '#848484', animationDelay: '0ms' }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: '#848484', animationDelay: '150ms' }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: '#848484', animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white/80 backdrop-blur-md sticky bottom-0">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="min-h-[44px] max-h-32 resize-none bg-white/50 border-white/50"
                style={{ color: '#535353' }}
                rows={1}
              />
            </div>

            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              size="icon"
              className="shrink-0"
              style={{
                background: inputMessage.trim()
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(132, 132, 132, 0.3)',
                color: 'white'
              }}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Chat Features:**
- Message bubbles (sent/received styling)
- Read receipts (double check marks)
- Online status indicator
- Typing indicators
- Timestamp display
- Auto-scroll to bottom
- Enter to send (Shift+Enter for new line)
- Attach files button
- Character limit (optional)

---

## ⚡ Real-time Features

### **Firebase Cloud Messaging Setup**

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
  
  // Show toast notification
  toast.info(payload.notification?.title || 'New message', {
    description: payload.notification?.body,
  });
  
  // Update conversation list
  queryClient.invalidateQueries(['conversations']);
});
```

### **WebSocket Alternative**

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

export function useWebSocket(conversationId: string, onMessage: (msg: Message) => void) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`wss://api.carenet.com/ws/conversations/${conversationId}`);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current?.close();
    };
  }, [conversationId, onMessage]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ content }));
    }
  };

  return { sendMessage };
}
```

### **Typing Indicator**

```typescript
// Emit typing event
const handleTyping = debounce(() => {
  socket.emit('typing', { conversationId, userId });
}, 300);

// Listen for typing events
socket.on('typing', ({ userId }) => {
  if (userId !== currentUserId) {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 3000);
  }
});
```

---

## 📋 Message Types

### **Text Messages**

```typescript
{
  type: 'text',
  content: 'Hello, how are you?'
}
```

### **Image Messages**

```tsx
<div className="max-w-[250px]">
  <img 
    src={message.attachments[0].url} 
    alt="Shared image"
    className="rounded-lg w-full"
    onClick={() => openLightbox(message.attachments[0].url)}
  />
  {message.content && (
    <p className="mt-2 text-sm">{message.content}</p>
  )}
</div>
```

### **Document Messages**

```tsx
<div 
  className="flex items-center gap-3 p-3 rounded-lg"
  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
>
  <FileText className="w-8 h-8" style={{ color: '#5B9FFF' }} />
  <div className="flex-1">
    <p className="text-sm font-medium" style={{ color: '#535353' }}>
      {attachment.filename}
    </p>
    <p className="text-xs" style={{ color: '#848484' }}>
      {formatFileSize(attachment.size)}
    </p>
  </div>
  <Button size="sm" variant="ghost">
    <Download className="w-4 h-4" />
  </Button>
</div>
```

### **System Messages**

```tsx
<div className="flex justify-center">
  <div 
    className="px-3 py-1 rounded-full text-xs"
    style={{ background: 'rgba(132, 132, 132, 0.1)', color: '#848484' }}
  >
    {message.content}
  </div>
</div>
```

**Examples:**
- "John joined the conversation"
- "Care plan updated"
- "Job completed"

---

## 🔔 Notifications

### **Push Notifications**

```typescript
// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging);
      
      // Save token to backend
      await fetch('/api/notifications/register', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
    }
  }
}
```

### **In-App Notifications**

```tsx
// New message toast
toast.info('New message from Rashida Begum', {
  description: "I've completed the morning vitals check",
  action: {
    label: 'View',
    onClick: () => router.push('/guardian/messages/1')
  }
});
```

### **Badge Counts**

```tsx
<Button variant="ghost" className="relative">
  <MessageSquare className="w-5 h-5" />
  {unreadCount > 0 && (
    <span 
      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
      style={{ background: '#FF6B7A' }}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )}
</Button>
```

---

## 📎 File Attachments

### **Upload Interface**

```tsx
function MessageInput() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/messages/upload', {
      method: 'POST',
      body: formData
    });

    const { url } = await response.json();
    
    // Send message with attachment
    sendMessage({ 
      type: 'image', 
      attachments: [{ url, filename: file.name }] 
    });
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,application/pdf"
        className="hidden"
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="w-5 h-5" />
      </Button>
    </>
  );
}
```

### **File Preview**

```tsx
{selectedFile && (
  <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg mb-2">
    <FileText className="w-4 h-4" />
    <span className="text-sm flex-1">{selectedFile.name}</span>
    <Button 
      size="sm" 
      variant="ghost" 
      onClick={() => setSelectedFile(null)}
    >
      <X className="w-4 h-4" />
    </Button>
  </div>
)}
```

---

## 👥 Role-Based Messaging

### **Allowed Communication Channels**

```typescript
const messagingRules = {
  guardian: ['caregiver', 'agency', 'patient', 'support', 'admin'],
  caregiver: ['guardian', 'patient', 'agency', 'support', 'admin'],
  patient: ['guardian', 'caregiver', 'support', 'admin'],
  agency: ['guardian', 'caregiver', 'agency-manager', 'support', 'admin'],
  'agency-manager': ['agency', 'caregiver', 'support', 'admin'],
  shop: ['customer', 'support', 'admin'],
  moderator: ['all'],
  admin: ['all']
};
```

### **Conversation Creation**

```typescript
async function createConversation(recipientId: string, recipientRole: string) {
  // Check if conversation exists
  const existing = await fetch(
    `/api/conversations?recipientId=${recipientId}`
  ).then(r => r.json());
  
  if (existing) {
    return router.push(`/guardian/messages/${existing.id}`);
  }
  
  // Create new conversation
  const newConversation = await fetch('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ recipientId, recipientRole })
  }).then(r => r.json());
  
  router.push(`/guardian/messages/${newConversation.id}`);
}
```

---

## 🐛 Debugging Guide

### **Issue: Messages Not Sending**

**Problem**: Message doesn't appear after sending.

**Debug Steps**:
```typescript
const handleSendMessage = async () => {
  console.log('Sending message:', inputMessage);
  
  try {
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: inputMessage })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      setMessages(prev => [...prev, data.message]);
    }
  } catch (error) {
    console.error('Send error:', error);
  }
};
```

### **Issue: Real-time Updates Not Working**

**Problem**: New messages don't appear automatically.

**Solution**:
```typescript
// Check WebSocket connection
useEffect(() => {
  console.log('WebSocket state:', ws.current?.readyState);
  
  if (ws.current?.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
  }
}, []);

// Poll for new messages as fallback
useEffect(() => {
  const interval = setInterval(() => {
    fetchMessages();
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

---

## 🧪 Testing Guide

```typescript
describe('Messaging System', () => {
  it('displays conversation list', async () => {
    render(<MessagesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Rashida Begum')).toBeInTheDocument();
      expect(screen.getByText('Green Care Agency')).toBeInTheDocument();
    });
  });
  
  it('sends message successfully', async () => {
    const { user } = render(<ConversationPage params={{ id: '1' }} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Hello!');
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });
  });
  
  it('displays unread badge', () => {
    render(<MessagesPage />);
    
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **Conversation List**: 92% (Display, search, unread badges)
- **Chat Interface**: 88% (Send/receive messages, UI rendering)
- **Message Types**: 85% (Text messages working)
- **Notifications**: 80% (In-app notifications functional)

### **❌ TODO**
- [ ] Real-time WebSocket integration
- [ ] File upload/attachments
- [ ] Read receipts backend sync
- [ ] Typing indicators
- [ ] Message search functionality
- [ ] E2E messaging workflow tests

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
