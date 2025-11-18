import { PrismaClient } from '@prisma/client';

interface ChatAnalyticsEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: 'message_sent' | 'message_received' | 'session_started' | 'session_ended' | 'document_scanned' | 'form_guidance_used' | 'resolved_query';
  timestamp: number;
  data?: any;
  metadata?: Record<string, any>;
}

interface ChatSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  messageCount: number;
  documentScans: number;
  formGuidanceUses: number;
  resolvedQueries: number;
}

interface ChatMetrics {
  totalSessions: number;
  averageSessionDuration: number;
  averageMessagesPerSession: number;
  totalMessages: number;
  totalDocumentScans: number;
  totalFormGuidanceUses: number;
  resolutionRate: number;
  mostActiveHour: string;
  mostActiveDay: string;
}

class ChatAnalyticsService {
  private db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  // Track chat event
  async trackEvent(event: Omit<ChatAnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const analyticsEvent: ChatAnalyticsEvent = {
      id: this.generateId(),
      userId: event.userId,
      sessionId: event.sessionId,
      eventType: event.eventType,
      timestamp: Date.now(),
      data: event.data,
      metadata: event.metadata,
    };

    // Store in database
    await this.storeEvent(analyticsEvent);

    // Send to analytics service (optional)
    await this.sendToAnalyticsService(analyticsEvent);
  }

  // Start chat session
  async startSession(userId: string): Promise<string> {
    const sessionId = this.generateId();
    const session: ChatSession = {
      id: sessionId,
      userId,
      startTime: Date.now(),
      messageCount: 0,
      documentScans: 0,
      formGuidanceUses: 0,
      resolvedQueries: 0,
    };

    await this.storeSession(session);
    return sessionId;
  }

  // End chat session
  async endSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    session.endTime = Date.now();
    await this.updateSession(session);
  }

  // Get session by ID
  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.db.chatSession.findUnique({
      where: { id: sessionId },
    });
  }

  // Store session in database
  private async storeSession(session: ChatSession): Promise<void> {
    await this.db.chatSession.create({
      data: session,
    });
  }

  // Update session
  private async updateSession(session: ChatSession): Promise<void> {
    await this.db.chatSession.update({
      where: { id: session.id },
      data: session,
    });
  }

  // Track message sent
  async trackMessageSent(userId: string, sessionId: string, messageData: any): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'message_sent',
      data: messageData,
      metadata: {
        messageType: messageData.type,
        hasAttachments: messageData.attachments ? messageData.attachments.length > 0 : false,
      },
    });

    // Update session message count
    await this.incrementSessionMessageCount(sessionId);
  }

  // Track message received
  async trackMessageReceived(userId: string, sessionId: string, messageData: any): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'message_received',
      data: messageData,
      metadata: {
        messageType: messageData.type,
        isFromBot: messageData.isFromBot || false,
      },
    });

    // Update session message count
    await this.incrementSessionMessageCount(sessionId);
  }

  // Track document scan
  async trackDocumentScan(userId: string, sessionId: string, documentData: any): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'document_scanned',
      data: documentData,
      metadata: {
        documentType: documentData.type,
        scanQuality: documentData.scanQuality,
        processingTime: documentData.processingTime,
      },
    });

    // Update session document scan count
    await this.incrementSessionDocumentScanCount(sessionId);
  }

  // Track form guidance usage
  async trackFormGuidanceUsed(userId: string, sessionId: string, guidanceData: any): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'form_guidance_used',
      data: guidanceData,
      metadata: {
        formType: guidanceData.formType,
        fieldCount: guidanceData.fieldCount,
        completionTime: guidanceData.completionTime,
      },
    });

    // Update session form guidance count
    await this.incrementSessionFormGuidanceCount(sessionId);
  }

  // Track resolved query
  async trackResolvedQuery(userId: string, sessionId: string, queryData: any): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'resolved_query',
      data: queryData,
      metadata: {
        queryType: queryData.type,
        resolutionTime: queryData.resolutionTime,
        userSatisfaction: queryData.userSatisfaction,
      },
    });

    // Update session resolved query count
    await this.incrementSessionResolvedQueryCount(sessionId);
  }

  // Get chat metrics
  async getChatMetrics(userId?: string, dateRange?: { start?: Date; end?: Date }): Promise<ChatMetrics> {
    const whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (dateRange) {
      if (dateRange.start) {
        whereClause.startTime = {
          gte: dateRange.start,
        };
      }
      if (dateRange.end) {
        whereClause.endTime = {
          lte: dateRange.end,
        };
      }
    }

    const sessions = await this.db.chatSession.findMany({
      where: whereClause,
      orderBy: { startTime: 'desc' },
    });

    if (sessions.length === 0) {
      return this.getEmptyMetrics();
    }

    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum: number, session: any) => {
      const duration = session.endTime ? session.endTime - session.startTime : 0;
      return sum + duration;
    }, 0);

    const totalMessages = sessions.reduce((sum: number, session: any) => sum + session.messageCount, 0);
    const totalDocumentScans = sessions.reduce((sum: number, session: any) => sum + session.documentScans, 0);
    const totalFormGuidanceUses = sessions.reduce((sum: number, session: any) => sum + session.formGuidanceUses, 0);
    const totalResolvedQueries = sessions.reduce((sum: number, session: any) => sum + session.resolvedQueries, 0);

    // Calculate resolution rate
    const resolutionRate = totalMessages > 0 ? (totalResolvedQueries / totalMessages) * 100 : 0;

    // Find most active hour and day
    const hourCounts = this.calculateHourlyActivity(sessions);
    const dayCounts = this.calculateDailyActivity(sessions);

    return {
      totalSessions,
      averageSessionDuration: totalDuration / totalSessions,
      averageMessagesPerSession: totalMessages / totalSessions,
      totalMessages,
      totalDocumentScans,
      totalFormGuidanceUses,
      resolutionRate,
      mostActiveHour: this.getMostActiveHour(hourCounts),
      mostActiveDay: this.getMostActiveDay(dayCounts),
    };
  }

  // Store event in database
  private async storeEvent(event: ChatAnalyticsEvent): Promise<void> {
    await this.db.chatAnalyticsEvent.create({
      data: event,
    });
  }

  // Increment session message count
  private async incrementSessionMessageCount(sessionId: string): Promise<void> {
    await this.db.chatSession.update({
      where: { id: sessionId },
      data: {
        messageCount: {
          increment: 1,
        },
      },
    });
  }

  // Increment session document scan count
  private async incrementSessionDocumentScanCount(sessionId: string): Promise<void> {
    await this.db.chatSession.update({
      where: { id: sessionId },
      data: {
        documentScans: {
          increment: 1,
        },
      },
    });
  }

  // Increment session form guidance count
  private async incrementSessionFormGuidanceCount(sessionId: string): Promise<void> {
    await this.db.chatSession.update({
      where: { id: sessionId },
      data: {
        formGuidanceUses: {
          increment: 1,
        },
      },
    });
  }

  // Increment session resolved query count
  private async incrementSessionResolvedQueryCount(sessionId: string): Promise<void> {
    await this.db.chatSession.update({
      where: { id: sessionId },
      data: {
        resolvedQueries: {
          increment: 1,
        },
      },
    });
  }

  // Get empty metrics
  private getEmptyMetrics(): ChatMetrics {
    return {
      totalSessions: 0,
      averageSessionDuration: 0,
      averageMessagesPerSession: 0,
      totalMessages: 0,
      totalDocumentScans: 0,
      totalFormGuidanceUses: 0,
      resolutionRate: 0,
      mostActiveHour: '00:00',
      mostActiveDay: 'Sunday',
    };
  }

  // Calculate hourly activity
  private calculateHourlyActivity(sessions: ChatSession[]): Record<string, number> {
    const hourCounts: Record<string, number> = {};
    
    for (const session of sessions) {
      if (!session.endTime) continue;
      
      const hour = new Date(session.startTime).getHours().toString().padStart(2, '0');
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    return hourCounts;
  }

  // Calculate daily activity
  private calculateDailyActivity(sessions: ChatSession[]): Record<string, number> {
    const dayCounts: Record<string, number> = {};
    
    for (const session of sessions) {
      if (!session.endTime) continue;
      
      const day = new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }

    return dayCounts;
  }

  // Get most active hour
  private getMostActiveHour(hourCounts: Record<string, number>): string {
    let mostActiveHour = '00:00';
    let maxCount = 0;
    
    for (const [hour, count] of Object.entries(hourCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostActiveHour = hour;
      }
    }

    return mostActiveHour;
  }

  // Get most active day
  private getMostActiveDay(dayCounts: Record<string, number>): string {
    let mostActiveDay = 'Sunday';
    let maxCount = 0;
    
    for (const [day, count] of Object.entries(dayCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDay = day;
      }
    }

    return mostActiveDay;
  }
// Add missing method
public async getUserSessions(userId: string): Promise<ChatSession[]> {
  return this.db.chatSession.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' },
  });
}

// Generate unique ID
private generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Send to external analytics service (placeholder)
private async sendToAnalyticsService(event: ChatAnalyticsEvent): Promise<void> {
  // This would integrate with services like Google Analytics, Mixpanel, etc.
  // For now, we'll just log to console
  console.log('Chat Analytics Event:', {
    eventType: event.eventType,
    userId: event.userId,
    sessionId: event.sessionId,
    timestamp: event.timestamp,
  });
}
}

// Create singleton instance
export const chatAnalyticsService = new ChatAnalyticsService();