import { cleanupExpiredSessions, getSessionStats } from '@/lib/session';
import { prisma } from '@/lib/db';

// Session management utilities for maintenance and monitoring

// Cleanup job to remove expired sessions
export async function runSessionCleanup(): Promise<{
  success: boolean;
  cleanedSessions?: number;
  error?: string;
}> {
  try {
    await cleanupExpiredSessions();
    
    // Also cleanup audit logs older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const deletedAuditLogs = await prisma.audit_logs.deleteMany({
      where: {
        timestamp: {
          lt: ninetyDaysAgo
        }
      }
    });
    
    // Cleanup old notifications (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const deletedNotifications = await prisma.notifications.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        },
        status: 'READ'
      }
    });
    
    return {
      success: true,
      cleanedSessions: deletedAuditLogs.count + deletedNotifications.count
    };
  } catch (error) {
    console.error('Session cleanup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get comprehensive session analytics
export async function getSessionAnalytics(): Promise<{
  totalSessions: number;
  activeUsers: number;
  averageSessionDuration: number;
  sessionsByRole: Record<string, number>;
  sessionsByDevice: Record<string, number>;
  sessionsByHour: Record<string, number>;
  recentlyActive: number;
}> {
  try {
    const stats = await getSessionStats();
    
    // Get additional analytics from database
    const recentSessions = await prisma.audit_logs.findMany({
      where: {
        action_type: 'LOGIN',
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        timestamp: true,
        actor_role: true,
        user_agent: true
      }
    });
    
    // Analyze sessions by hour
    const sessionsByHour: Record<string, number> = {};
    recentSessions.forEach(session => {
      const hour = session.timestamp.getHours().toString().padStart(2, '0');
      sessionsByHour[hour] = (sessionsByHour[hour] || 0) + 1;
    });
    
    // Analyze sessions by device (simplified)
    const sessionsByDevice: Record<string, number> = {};
    recentSessions.forEach(session => {
      const userAgent = session.user_agent || 'Unknown';
      let device = 'Other';
      
      if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
        device = 'Mobile';
      } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
        device = 'Tablet';
      } else if (userAgent.includes('Desktop') || userAgent.includes('Windows') || userAgent.includes('Mac')) {
        device = 'Desktop';
      }
      
      sessionsByDevice[device] = (sessionsByDevice[device] || 0) + 1;
    });
    
    // Calculate average session duration (simplified - would need more tracking)
    const averageSessionDuration = 45; // minutes (placeholder)
    
    // Count recently active users (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentlyActiveUsers = await prisma.audit_logs.findMany({
      where: {
        timestamp: {
          gte: oneHourAgo
        },
        action_type: 'LOGIN'
      },
      distinct: ['actor_id'],
      select: { actor_id: true }
    });
    const recentlyActive = recentlyActiveUsers.length;
    
    return {
      totalSessions: stats.totalActive,
      activeUsers: stats.totalUsers,
      averageSessionDuration,
      sessionsByRole: stats.sessionsByRole,
      sessionsByDevice,
      sessionsByHour,
      recentlyActive
    };
  } catch (error) {
    console.error('Session analytics error:', error);
    return {
      totalSessions: 0,
      activeUsers: 0,
      averageSessionDuration: 0,
      sessionsByRole: {},
      sessionsByDevice: {},
      sessionsByHour: {},
      recentlyActive: 0
    };
  }
}

// Detect suspicious session activity
export async function detectSuspiciousActivity(): Promise<{
  suspiciousSessions: Array<{
    userId: string;
    sessionId: string;
    reason: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    details: any;
  }>;
}> {
  const suspiciousSessions = [];
  
  try {
    // Check for multiple concurrent sessions from different IPs
    const recentLogins = await prisma.audit_logs.findMany({
      where: {
        action_type: 'LOGIN',
        timestamp: {
          gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
        }
      },
      select: {
        actor_id: true,
        ip_address: true,
        timestamp: true,
        user_agent: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    // Group by user
    const userSessions = new Map();
    recentLogins.forEach(login => {
      if (!userSessions.has(login.actor_id)) {
        userSessions.set(login.actor_id, []);
      }
      userSessions.get(login.actor_id).push(login);
    });
    
    // Check for suspicious patterns
    for (const [userId, sessions] of userSessions.entries()) {
      if (sessions.length > 5) {
        // Too many login attempts
        suspiciousSessions.push({
          userId,
          sessionId: sessions[0].actor_id,
          reason: 'Multiple login attempts detected',
          risk: 'MEDIUM' as const,
          details: {
            attemptCount: sessions.length,
            timeWindow: '2 hours',
            ips: [...new Set(sessions.map((s: { ip_address: unknown }) => s.ip_address))]
          }
        });
      }
      
      // Check for different IPs in short time
      const uniqueIPs = new Set(sessions.map((s: { ip_address: unknown }) => s.ip_address));
      if (uniqueIPs.size > 3) {
        suspiciousSessions.push({
          userId,
          sessionId: sessions[0].actor_id,
          reason: 'Multiple IP addresses detected',
          risk: 'HIGH' as const,
          details: {
            ipCount: uniqueIPs.size,
            ips: Array.from(uniqueIPs),
            timeWindow: '2 hours'
          }
        });
      }
    }
    
    return { suspiciousSessions };
  } catch (error) {
    console.error('Suspicious activity detection error:', error);
    return { suspiciousSessions: [] };
  }
}

// Session health check
export async function sessionHealthCheck(): Promise<{
  healthy: boolean;
  checks: Array<{
    name: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    message: string;
    details?: any;
  }>;
}> {
  const checks = [];
  
  try {
    // Check session storage connectivity
    const stats = await getSessionStats();
    checks.push({
      name: 'Session Storage',
      status: 'PASS' as const,
      message: `Successfully connected, ${stats.totalActive} active sessions`,
      details: stats
    });
    
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    checks.push({
      name: 'Database Connectivity',
      status: 'PASS' as const,
      message: 'Database connection successful'
    });
    
    // Check for expired sessions
    const recentLogins = await prisma.audit_logs.count({
      where: {
        action_type: 'LOGIN',
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });
    
    if (recentLogins > 0) {
      checks.push({
        name: 'Recent Activity',
        status: 'PASS' as const,
        message: `${recentLogins} logins in last 24 hours`
      });
    } else {
      checks.push({
        name: 'Recent Activity',
        status: 'WARN' as const,
        message: 'No login activity in last 24 hours'
      });
    }
    
    // Check for suspicious activity
    const suspicious = await detectSuspiciousActivity();
    if (suspicious.suspiciousSessions.length === 0) {
      checks.push({
        name: 'Security Check',
        status: 'PASS' as const,
        message: 'No suspicious activity detected'
      });
    } else {
      checks.push({
        name: 'Security Check',
        status: 'WARN' as const,
        message: `${suspicious.suspiciousSessions.length} suspicious activities detected`,
        details: suspicious
      });
    }
    
    const allPass = checks.every(check => check.status === 'PASS');
    
    return {
      healthy: allPass,
      checks
    };
  } catch (error) {
    checks.push({
      name: 'Health Check',
      status: 'FAIL' as const,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      healthy: false,
      checks
    };
  }
}

// Generate session report
export async function generateSessionReport(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<{
  report: {
    timeRange: string;
    generatedAt: string;
    summary: any;
    analytics: any;
    suspiciousActivity: any;
    recommendations: string[];
  };
}> {
  const now = new Date();
  let timeRangeStart: Date;
  let timeRangeText: string;
  
  switch (timeRange) {
    case '1h':
      timeRangeStart = new Date(now.getTime() - 60 * 60 * 1000);
      timeRangeText = 'Last Hour';
      break;
    case '7d':
      timeRangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeRangeText = 'Last 7 Days';
      break;
    case '30d':
      timeRangeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeRangeText = 'Last 30 Days';
      break;
    default: // 24h
      timeRangeStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      timeRangeText = 'Last 24 Hours';
  }
  
  const analytics = await getSessionAnalytics();
  const suspicious = await detectSuspiciousActivity();
  const health = await sessionHealthCheck();
  
  const recommendations = [];
  
  if (suspicious.suspiciousSessions.length > 0) {
    recommendations.push('Review suspicious session activities and consider implementing additional security measures');
  }
  
  if (analytics.totalSessions === 0) {
    recommendations.push('No active sessions detected - check system health and user activity');
  }
  
  if (!health.healthy) {
    recommendations.push('Address system health issues identified in health check');
  }
  
  return {
    report: {
      timeRange: timeRangeText,
      generatedAt: now.toISOString(),
      summary: {
        totalSessions: analytics.totalSessions,
        activeUsers: analytics.activeUsers,
        recentlyActive: analytics.recentlyActive,
        healthStatus: health.healthy ? 'Healthy' : 'Issues Detected'
      },
      analytics,
      suspiciousActivity: suspicious,
      recommendations
    }
  };
}

// Schedule cleanup job (would be called by a cron job)
export async function scheduleSessionCleanup(): Promise<void> {
  console.log('Starting scheduled session cleanup...');
  
  const result = await runSessionCleanup();
  
  if (result.success) {
    console.log(`Session cleanup completed successfully. Cleaned ${result.cleanedSessions} items.`);
  } else {
    console.error(`Session cleanup failed: ${result.error}`);
  }
  
  console.log('Session cleanup finished.');
}