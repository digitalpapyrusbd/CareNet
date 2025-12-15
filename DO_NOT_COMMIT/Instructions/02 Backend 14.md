# Backend Documentation 14 - Messaging System

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Messages, Messages Gateway  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Messaging System provides **real-time chat** using Socket.io with conversation management, read receipts, typing indicators, and file attachments.

### **Key Features**
- Real-time chat with WebSocket
- Conversation management
- Message read receipts
- Typing indicators
- User presence tracking
- File attachments support
- Push notifications integration
- Message history and search

**Module Path**: `/backend/src/messages/`

---

## 📁 Module Structure

```
messages/
├── messages.module.ts           # Module configuration
├── messages.service.ts          # Business logic
├── messages.controller.ts       # HTTP endpoints
├── messages.gateway.ts          # WebSocket gateway
└── dto/
    ├── create-message.dto.ts   # Message validation
    └── conversation.dto.ts     # Conversation validation
```

---

## 🎯 Core Features

### **1. Create Conversation**

```typescript
POST /api/messages/conversations
Authorization: Bearer {accessToken}

Request Body:
{
  "participantIds": ["user-uuid-1", "user-uuid-2"],
  "type": "DIRECT" | "GROUP",
  "name": "Project Discussion"  // Optional for groups
}

Response:
{
  "success": true,
  "message": "Conversation created",
  "data": {
    "id": "conversation-uuid",
    "type": "DIRECT",
    "participants": [
      {
        "id": "user-uuid-1",
        "fullName": "Ahmed Hassan",
        "profilePhoto": "https://..."
      },
      {
        "id": "user-uuid-2",
        "fullName": "Fatima Rahman",
        "profilePhoto": "https://..."
      }
    ],
    "lastMessage": null,
    "unreadCount": 0,
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

---

### **2. Get All Conversations**

```typescript
GET /api/messages/conversations
Authorization: Bearer {accessToken}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- search: string

Response:
{
  "success": true,
  "data": [
    {
      "id": "conversation-uuid",
      "type": "DIRECT",
      "participants": [
        {
          "id": "user-uuid-2",
          "fullName": "Fatima Rahman",
          "profilePhoto": "https://...",
          "isOnline": true,
          "lastSeen": "2025-12-11T10:30:00Z"
        }
      ],
      "lastMessage": {
        "content": "Hello! How are you?",
        "senderId": "user-uuid-2",
        "createdAt": "2025-12-11T10:30:00Z"
      },
      "unreadCount": 3,
      "updatedAt": "2025-12-11T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### **3. Get Conversation Messages**

```typescript
GET /api/messages/conversations/:conversationId/messages
Authorization: Bearer {accessToken}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 50)
- before: timestamp (for pagination)

Response:
{
  "success": true,
  "data": [
    {
      "id": "message-uuid",
      "conversationId": "conversation-uuid",
      "sender": {
        "id": "user-uuid-1",
        "fullName": "Ahmed Hassan",
        "profilePhoto": "https://..."
      },
      "content": "Hello! How are you?",
      "type": "TEXT",
      "attachments": [],
      "readBy": ["user-uuid-1", "user-uuid-2"],
      "createdAt": "2025-12-11T10:30:00Z"
    },
    {
      "id": "message-uuid-2",
      "conversationId": "conversation-uuid",
      "sender": {
        "id": "user-uuid-2",
        "fullName": "Fatima Rahman",
        "profilePhoto": "https://..."
      },
      "content": "I'm good, thanks!",
      "type": "TEXT",
      "attachments": [],
      "readBy": ["user-uuid-2"],
      "createdAt": "2025-12-11T10:31:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 125,
    "hasMore": true
  }
}
```

---

## 💬 WebSocket Events

### **Connect to WebSocket**

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: {
    token: 'jwt-access-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to messaging server');
});
```

---

### **Send Message**

```typescript
// Client emits
socket.emit('sendMessage', {
  conversationId: 'conversation-uuid',
  content: 'Hello! How are you?',
  type: 'TEXT',
  attachments: []
});

// All participants receive
socket.on('newMessage', (message) => {
  console.log('New message:', message);
  // {
  //   id: 'message-uuid',
  //   conversationId: 'conversation-uuid',
  //   sender: {
  //     id: 'user-uuid',
  //     fullName: 'Ahmed Hassan'
  //   },
  //   content: 'Hello! How are you?',
  //   type: 'TEXT',
  //   createdAt: '2025-12-11T10:30:00Z'
  // }
});
```

---

### **Typing Indicator**

```typescript
// User starts typing
socket.emit('typing', {
  conversationId: 'conversation-uuid'
});

// Other participants receive
socket.on('userTyping', (data) => {
  console.log(`${data.userName} is typing...`);
  // Show typing indicator in UI
});

// User stops typing
socket.emit('stopTyping', {
  conversationId: 'conversation-uuid'
});

socket.on('userStoppedTyping', (data) => {
  console.log(`${data.userName} stopped typing`);
  // Hide typing indicator
});
```

---

### **Read Receipt**

```typescript
// Mark message as read
socket.emit('markAsRead', {
  conversationId: 'conversation-uuid',
  messageId: 'message-uuid'
});

// Sender receives
socket.on('messageRead', (data) => {
  console.log(`Message ${data.messageId} read by ${data.userName}`);
  // Update UI to show read receipt
});
```

---

### **User Presence**

```typescript
// User comes online
socket.on('userOnline', (data) => {
  console.log(`${data.userName} is now online`);
  // Update user status in UI
});

// User goes offline
socket.on('userOffline', (data) => {
  console.log(`${data.userName} went offline`);
  // Update user status in UI
});

// Get online users
socket.emit('getOnlineUsers');

socket.on('onlineUsers', (users) => {
  console.log('Online users:', users);
  // ['user-uuid-1', 'user-uuid-2']
});
```

---

## 📎 File Attachments

### **Send Message with Attachment**

```typescript
POST /api/messages/conversations/:conversationId/messages
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Form Data:
- content: "Check out this document"
- type: "FILE"
- file: [file upload]

Response:
{
  "success": true,
  "data": {
    "id": "message-uuid",
    "conversationId": "conversation-uuid",
    "senderId": "user-uuid",
    "content": "Check out this document",
    "type": "FILE",
    "attachments": [
      {
        "id": "attachment-uuid",
        "fileName": "report.pdf",
        "fileSize": 245678,
        "fileType": "application/pdf",
        "url": "https://r2.com/attachments/report.pdf"
      }
    ],
    "createdAt": "2025-12-11T10:35:00Z"
  }
}
```

---

## 🔍 Search Messages

```typescript
GET /api/messages/search
Authorization: Bearer {accessToken}

Query Parameters:
- query: string (required)
- conversationId: string (optional)
- page: number
- limit: number

Response:
{
  "success": true,
  "data": [
    {
      "id": "message-uuid",
      "conversationId": "conversation-uuid",
      "sender": {
        "fullName": "Ahmed Hassan"
      },
      "content": "Hello! How are you?",
      "createdAt": "2025-12-11T10:30:00Z",
      "conversation": {
        "type": "DIRECT",
        "participants": [...]
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

## 📊 Database Schema

```prisma
model Conversation {
  id            String      @id @default(uuid())
  type          ConversationType @default(DIRECT)
  name          String?     // For group chats
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  messages      Message[]
  participants  ConversationParticipant[]
}

model ConversationParticipant {
  id                String      @id @default(uuid())
  conversationId    String
  userId            String
  
  unreadCount       Int         @default(0)
  lastReadAt        DateTime?
  
  joinedAt          DateTime    @default(now())
  leftAt            DateTime?
  
  conversation      Conversation @relation(fields: [conversationId], references: [id])
  user              User        @relation(fields: [userId], references: [id])
  
  @@unique([conversationId, userId])
}

model Message {
  id                String      @id @default(uuid())
  conversationId    String
  senderId          String
  
  content           String
  type              MessageType @default(TEXT)
  
  attachments       Json[]      @default([])
  readBy            String[]    @default([])
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  deletedAt         DateTime?
  
  conversation      Conversation @relation(fields: [conversationId], references: [id])
  sender            User        @relation(fields: [senderId], references: [id])
}

enum ConversationType {
  DIRECT
  GROUP
}

enum MessageType {
  TEXT
  FILE
  IMAGE
  VIDEO
  AUDIO
  SYSTEM
}
```

---

## 🔔 Push Notifications

```typescript
// When message is sent
async function onMessageSent(message: Message) {
  const conversation = await getConversation(message.conversationId);
  
  // Send push notification to offline participants
  for (const participant of conversation.participants) {
    if (participant.userId === message.senderId) continue;
    
    const isOnline = await checkUserOnline(participant.userId);
    
    if (!isOnline) {
      await sendPushNotification({
        userId: participant.userId,
        title: message.sender.fullName,
        body: message.content,
        data: {
          type: 'NEW_MESSAGE',
          conversationId: message.conversationId,
          messageId: message.id
        }
      });
    }
  }
}
```

---

## 🧪 Testing

### **Unit Tests**

```typescript
describe('MessagesService', () => {
  it('should create conversation');
  it('should send message');
  it('should mark message as read');
  it('should get unread count');
  it('should search messages');
  it('should handle file attachments');
});
```

### **WebSocket Tests**

```typescript
describe('Messages Gateway', () => {
  it('should connect to WebSocket');
  it('should send and receive messages');
  it('should emit typing indicators');
  it('should track user presence');
  it('should handle read receipts');
  it('should disconnect gracefully');
});
```

---

## 🔧 Environment Variables

```env
# No specific environment variables
# Uses shared JWT, Database, and File Upload configs
```

---

## 🚀 Complete Chat Implementation

```typescript
// Client-side implementation
import { io } from 'socket.io-client';

class ChatService {
  private socket;
  
  constructor(token: string) {
    this.socket = io('http://localhost:4000', {
      auth: { token }
    });
    
    this.setupListeners();
  }
  
  setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected');
    });
    
    this.socket.on('newMessage', (message) => {
      // Update UI with new message
      this.onNewMessage(message);
    });
    
    this.socket.on('userTyping', (data) => {
      // Show typing indicator
      this.showTypingIndicator(data.conversationId, data.userName);
    });
    
    this.socket.on('messageRead', (data) => {
      // Update read receipt
      this.updateReadReceipt(data.messageId, data.userId);
    });
  }
  
  sendMessage(conversationId: string, content: string) {
    this.socket.emit('sendMessage', {
      conversationId,
      content,
      type: 'TEXT'
    });
  }
  
  startTyping(conversationId: string) {
    this.socket.emit('typing', { conversationId });
  }
  
  stopTyping(conversationId: string) {
    this.socket.emit('stopTyping', { conversationId });
  }
  
  markAsRead(conversationId: string, messageId: string) {
    this.socket.emit('markAsRead', {
      conversationId,
      messageId
    });
  }
}
```

---

## 📚 Related Documentation

- [02 Backend 15.md](02%20Backend%2015.md) - Notification System
- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
