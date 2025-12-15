# Backend Documentation 15 - Notification System

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Notifications  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Notification System handles **multi-channel notifications** via SMS (Twilio), Email (SendGrid), Push (FCM), and In-App notifications.

### **Key Features**
- SMS notifications via Twilio
- Email notifications via SendGrid
- Push notifications via Firebase Cloud Messaging
- In-app notifications
- Notification preferences management
- Template-based notifications
- Notification history
- Read/unread status tracking

**Module Path**: `/backend/src/notifications/`

---

## 📁 Module Structure

```
notifications/
├── notifications.module.ts              # Module configuration
├── notifications.service.ts             # Main service
├── notifications.controller.ts          # HTTP endpoints
├── services/
│   ├── sms.service.ts                  # Twilio SMS
│   ├── email.service.ts                # SendGrid Email
│   ├── push.service.ts                 # FCM Push
│   └── in-app.service.ts              # In-app notifications
├── templates/
│   ├── email/                          # Email templates
│   │   ├── welcome.template.ts
│   │   ├── payment-reminder.template.ts
│   │   └── job-assigned.template.ts
│   └── sms/                            # SMS templates
│       ├── otp.template.ts
│       └── payment-due.template.ts
└── dto/
    ├── send-notification.dto.ts
    └── notification-preferences.dto.ts
```

---

## 🎯 Core Features

### **1. Send SMS Notification (Twilio)**

```typescript
POST /api/notifications/sms
Authorization: Bearer {accessToken}

Request Body:
{
  "phoneNumber": "+8801712345678",
  "message": "Your OTP is: 123456. Valid for 5 minutes.",
  "type": "OTP"
}

Response:
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "messageSid": "SM1234567890abcdef",
    "status": "queued",
    "to": "+8801712345678",
    "price": "0.05",
    "currency": "USD"
  }
}

// Implementation
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient;

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSms(to: string, message: string) {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      return {
        messageSid: result.sid,
        status: result.status,
        to: result.to,
        price: result.price,
        currency: result.priceUnit
      };
    } catch (error) {
      throw new BadRequestException('Failed to send SMS');
    }
  }
}
```

---

### **2. Send Email Notification (SendGrid)**

```typescript
POST /api/notifications/email
Authorization: Bearer {accessToken}

Request Body:
{
  "to": "user@example.com",
  "subject": "Welcome to CareNet",
  "template": "WELCOME",
  "data": {
    "name": "Ahmed Hassan",
    "verificationUrl": "https://carenet.com/verify?token=..."
  }
}

Response:
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "<msg-id@sendgrid.net>",
    "status": "sent"
  }
}

// Implementation
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    data: any
  ) {
    const html = this.renderTemplate(template, data);

    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: subject,
      html: html
    };

    try {
      const [response] = await sgMail.send(msg);
      
      return {
        messageId: response.headers['x-message-id'],
        status: 'sent'
      };
    } catch (error) {
      throw new BadRequestException('Failed to send email');
    }
  }

  private renderTemplate(template: string, data: any): string {
    switch (template) {
      case 'WELCOME':
        return welcomeTemplate(data);
      case 'PAYMENT_REMINDER':
        return paymentReminderTemplate(data);
      case 'JOB_ASSIGNED':
        return jobAssignedTemplate(data);
      default:
        throw new Error('Invalid template');
    }
  }
}
```

---

### **3. Send Push Notification (FCM)**

```typescript
POST /api/notifications/push
Authorization: Bearer {accessToken}

Request Body:
{
  "userId": "user-uuid",
  "title": "New Job Assigned",
  "body": "You have been assigned to Job #12345",
  "data": {
    "type": "JOB_ASSIGNED",
    "jobId": "job-uuid",
    "screen": "/jobs/job-uuid"
  }
}

Response:
{
  "success": true,
  "message": "Push notification sent",
  "data": {
    "messageId": "projects/carenet/messages/1234567890",
    "success": 1,
    "failure": 0
  }
}

// Implementation
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
  }

  async sendPush(userId: string, notification: any) {
    // Get user's FCM tokens
    const tokens = await this.getUserFcmTokens(userId);

    if (tokens.length === 0) {
      throw new BadRequestException('No FCM tokens found');
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data,
      tokens: tokens
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      
      // Remove invalid tokens
      if (response.failureCount > 0) {
        await this.removeInvalidTokens(response, tokens);
      }

      return {
        messageId: response.responses[0]?.messageId,
        success: response.successCount,
        failure: response.failureCount
      };
    } catch (error) {
      throw new BadRequestException('Failed to send push notification');
    }
  }

  async registerFcmToken(userId: string, token: string) {
    // Save FCM token to database
    await this.prisma.fcmToken.upsert({
      where: {
        userId_token: { userId, token }
      },
      create: { userId, token },
      update: { updatedAt: new Date() }
    });
  }
}
```

---

### **4. In-App Notifications**

```typescript
GET /api/notifications
Authorization: Bearer {accessToken}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- isRead: boolean (optional)

Response:
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid",
      "userId": "user-uuid",
      "type": "JOB_ASSIGNED",
      "title": "New Job Assigned",
      "body": "You have been assigned to Job #12345",
      "data": {
        "jobId": "job-uuid",
        "screen": "/jobs/job-uuid"
      },
      "isRead": false,
      "createdAt": "2025-12-11T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "unreadCount": 12
  }
}
```

---

### **5. Mark Notification as Read**

```typescript
PATCH /api/notifications/:id/read
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### **6. Mark All as Read**

```typescript
PATCH /api/notifications/read-all
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "count": 12
  }
}
```

---

## 🔔 Notification Types

```typescript
enum NotificationType {
  // Authentication
  OTP_CODE = 'OTP_CODE',
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
  
  // Jobs
  JOB_ASSIGNED = 'JOB_ASSIGNED',
  JOB_STARTED = 'JOB_STARTED',
  JOB_COMPLETED = 'JOB_COMPLETED',
  JOB_CANCELLED = 'JOB_CANCELLED',
  
  // Payments
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  
  // Verification
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED = 'VERIFICATION_REJECTED',
  
  // Negotiations
  NEGOTIATION_RECEIVED = 'NEGOTIATION_RECEIVED',
  NEGOTIATION_ACCEPTED = 'NEGOTIATION_ACCEPTED',
  NEGOTIATION_REJECTED = 'NEGOTIATION_REJECTED',
  
  // Messages
  NEW_MESSAGE = 'NEW_MESSAGE',
  
  // System
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}
```

---

## 🎨 Email Templates

### **Welcome Email Template**

```typescript
export function welcomeTemplate(data: {
  name: string;
  verificationUrl: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: #4F46E5; color: white; padding: 20px; }
          .content { padding: 20px; }
          .button {
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to CareNet!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Thank you for joining CareNet. We're excited to have you on board!</p>
            <p>To get started, please verify your email address:</p>
            <p>
              <a href="${data.verificationUrl}" class="button">
                Verify Email
              </a>
            </p>
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Best regards,<br>The CareNet Team</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

---

### **Payment Reminder Email Template**

```typescript
export function paymentReminderTemplate(data: {
  name: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paymentUrl: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; }
          .warning { background: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; }
          .button {
            background: #10B981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Payment Reminder</h2>
          <p>Hello ${data.name},</p>
          <div class="warning">
            <strong>Payment Due</strong>
            <p>Your invoice #${data.invoiceNumber} is due on ${data.dueDate}</p>
            <p>Amount: ৳${data.amount}</p>
          </div>
          <p>
            <a href="${data.paymentUrl}" class="button">
              Pay Now
            </a>
          </p>
        </div>
      </body>
    </html>
  `;
}
```

---

## 📱 SMS Templates

```typescript
export function otpTemplate(otp: string): string {
  return `Your CareNet verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;
}

export function paymentDueTemplate(data: {
  amount: number;
  dueDate: string;
}): string {
  return `Payment reminder: ৳${data.amount} is due on ${data.dueDate}. Pay now to avoid late fees.`;
}

export function jobAssignedTemplate(jobId: string): string {
  return `You have been assigned to Job #${jobId}. Check the app for details.`;
}
```

---

## ⚙️ Notification Preferences

```typescript
GET /api/notifications/preferences
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "email": {
      "jobAssigned": true,
      "paymentReminder": true,
      "systemAnnouncement": false
    },
    "sms": {
      "jobAssigned": false,
      "paymentReminder": true,
      "systemAnnouncement": false
    },
    "push": {
      "jobAssigned": true,
      "paymentReminder": true,
      "newMessage": true,
      "systemAnnouncement": true
    }
  }
}

PATCH /api/notifications/preferences
Authorization: Bearer {accessToken}

Request Body:
{
  "email": {
    "jobAssigned": false
  }
}

Response:
{
  "success": true,
  "message": "Preferences updated"
}
```

---

## 📊 Database Schema

```prisma
model Notification {
  id            String      @id @default(uuid())
  userId        String
  
  type          NotificationType
  title         String
  body          String
  data          Json?
  
  isRead        Boolean     @default(false)
  readAt        DateTime?
  
  // Channels
  sentViaEmail  Boolean     @default(false)
  sentViaSms    Boolean     @default(false)
  sentViaPush   Boolean     @default(false)
  
  createdAt     DateTime    @default(now())
  
  user          User        @relation(fields: [userId], references: [id])
  
  @@index([userId, isRead])
  @@index([userId, createdAt])
}

model NotificationPreference {
  id            String      @id @default(uuid())
  userId        String      @unique
  
  emailPrefs    Json        @default("{}")
  smsPrefs      Json        @default("{}")
  pushPrefs     Json        @default("{}")
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user          User        @relation(fields: [userId], references: [id])
}

model FcmToken {
  id            String      @id @default(uuid())
  userId        String
  token         String
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user          User        @relation(fields: [userId], references: [id])
  
  @@unique([userId, token])
}
```

---

## 🚀 Complete Notification Service

```typescript
@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
    private emailService: EmailService,
    private pushService: PushService,
  ) {}

  async sendNotification(
    userId: string,
    type: NotificationType,
    data: any
  ) {
    // Get user preferences
    const prefs = await this.getPreferences(userId);
    
    // Get user contact info
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    // Create in-app notification
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title: this.getTitle(type),
        body: this.getBody(type, data),
        data
      }
    });

    // Send via enabled channels
    const promises = [];

    if (prefs.email[type]) {
      promises.push(
        this.emailService.sendEmail(
          user.email,
          this.getTitle(type),
          this.getEmailTemplate(type),
          data
        )
      );
    }

    if (prefs.sms[type] && user.phone) {
      promises.push(
        this.smsService.sendSms(
          user.phone,
          this.getSmsText(type, data)
        )
      );
    }

    if (prefs.push[type]) {
      promises.push(
        this.pushService.sendPush(userId, {
          title: this.getTitle(type),
          body: this.getBody(type, data),
          data: { type, ...data }
        })
      );
    }

    await Promise.allSettled(promises);

    return notification;
  }
}
```

---

## 🧪 Testing

```typescript
describe('NotificationsService', () => {
  it('should send SMS via Twilio');
  it('should send email via SendGrid');
  it('should send push via FCM');
  it('should create in-app notification');
  it('should respect user preferences');
  it('should handle failed deliveries');
});
```

---

## 🔧 Environment Variables

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@carenet.com
SENDGRID_FROM_NAME=CareNet

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=carenet-app
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@carenet-app.iam.gserviceaccount.com
```

---

## 📚 Related Documentation

- [02 Backend 14.md](02%20Backend%2014.md) - Messaging System
- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
