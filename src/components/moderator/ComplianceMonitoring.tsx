'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Calendar, BarChart3, LineChart } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';

interface ComplianceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'compliant' | 'warning' | 'critical';
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  details: string;
}

interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'expired';
  lastUpdated: string;
  violations: number;
}

export function ComplianceMonitoring() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedPolicy, setSelectedPolicy] = useState('all');

  // Mock data
  const complianceMetrics: ComplianceMetric[] = [
    {
      id: '1',
      name: 'Data Privacy Compliance',
      value: 98,
      target: 95,
      trend: 'up',
      status: 'compliant'
    },
    {
      id: '2',
      name: 'User Verification Rate',
      value: 92,
      target: 90,
      trend: 'stable',
      status: 'compliant'
    },
    {
      id: '3',
      name: 'Content Moderation Response',
      value: 85,
      target: 90,
      trend: 'down',
      status: 'warning'
    },
    {
      id: '4',
      name: 'Security Incidents',
      value: 2,
      target: 0,
      trend: 'up',
      status: 'critical'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-001',
      action: 'User suspended',
      user: 'Moderator',
      timestamp: '2024-12-10 14:30',
      ip: '192.168.1.100',
      details: 'User violated community guidelines'
    },
    {
      id: 'LOG-002',
      action: 'Policy updated',
      user: 'Admin',
      timestamp: '2024-12-09 10:15',
      ip: '192.168.1.101',
      details: 'Updated data privacy policy'
    },
    {
      id: 'LOG-003',
      action: 'Report resolved',
      user: 'Moderator',
      timestamp: '2024-12-08 16:45',
      ip: '192.168.1.102',
      details: 'Harassment report closed'
    },
    {
      id: 'LOG-004',
      action: 'Security alert',
      user: 'System',
      timestamp: '2024-12-07 09:20',
      ip: '192.168.1.1',
      details: 'Suspicious login attempt blocked'
    }
  ];

  const policies: Policy[] = [
    {
      id: 'POL-001',
      name: 'Data Privacy Policy',
      description: 'User data protection and privacy guidelines',
      status: 'active',
      lastUpdated: '2024-11-15',
      violations: 3
    },
    {
      id: 'POL-002',
      name: 'Community Guidelines',
      description: 'User behavior and content standards',
      status: 'active',
      lastUpdated: '2024-10-20',
      violations: 15
    },
    {
      id: 'POL-003',
      name: 'Security Policy',
      description: 'System security and access controls',
      status: 'pending',
      lastUpdated: '2024-09-10',
      violations: 2
    }
  ];

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'compliant': return '#7CE577';
      case 'warning': return '#FFD180';
      case 'critical': return '#FF6B7A';
      default: return '#848484';
    }
  };

  const getPolicyColor = (status: string) => {
    switch (status) {
      case 'active': return '#7CE577';
      case 'pending': return '#FFD180';
      case 'expired': return '#FF6B7A';
      default: return '#848484';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Compliance Monitoring
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Monitor system compliance and security
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Generate Report')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Report
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Audit System')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Audit
          </TouchButton>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'quarter'].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeframe === timeframe
                ? 'bg-gradient-to-r from-[#FFB3C1] to-[#FF8FA3] text-white'
                : 'bg-white/50 text-[#535353] hover:bg-white/70'
            }`}
          >
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </button>
        ))}
      </div>

      {/* Compliance Metrics */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Compliance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceMetrics.map((metric) => (
            <MobileCard key={metric.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: getMetricColor(metric.status) + '20' }}
                  >
                    {metric.status === 'compliant' ? (
                      <CheckCircle className="w-5 h-5" style={{ color: getMetricColor(metric.status) }} />
                    ) : metric.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5" style={{ color: getMetricColor(metric.status) }} />
                    ) : (
                      <AlertTriangle className="w-5 h-5" style={{ color: getMetricColor(metric.status) }} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ color: '#535353' }} className="font-medium">
                      {metric.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      Target: {metric.target}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: getMetricColor(metric.status) }}>
                    {metric.value}%
                  </div>
                  <div className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.trend}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    background: getMetricColor(metric.status)
                  }}
                ></div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Policies Section */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Policy Management
        </h2>
        <div className="space-y-3">
          {policies.map((policy) => (
            <MobileCard key={policy.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: getPolicyColor(policy.status) + '20',
                      color: getPolicyColor(policy.status)
                    }}
                  >
                    <Shield className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {policy.name}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getPolicyColor(policy.status) + '20',
                          color: getPolicyColor(policy.status)
                        }}
                      >
                        {policy.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span style={{ color: '#848484' }}>Description:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{policy.description}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Last Updated:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{policy.lastUpdated}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Violations:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{policy.violations}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View', policy.name)}
                  >
                    View
                  </TouchButton>
                  <TouchButton
                    variant="secondary"
                    size="sm"
                    onClick={() => console.log('Update', policy.name)}
                  >
                    Update
                  </TouchButton>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div>
          <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
            Recent Audit Logs
          </h3>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <MobileCard key={log.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        background: 'rgba(142, 197, 252, 0.2)',
                        color: '#5B9FFF'
                      }}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 style={{ color: '#535353' }} className="font-medium">
                          {log.action}
                        </h4>
                        <span style={{ color: '#848484' }}>{log.user}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span style={{ color: '#848484' }}>{log.timestamp}</span>
                        <span style={{ color: '#535353' }}>IP: {log.ip}</span>
                      </div>
                      <p className="text-sm mt-1" style={{ color: '#535353' }}>
                        {log.details}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <TouchButton
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Details', log.id)}
                    >
                      Details
                    </TouchButton>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </div>

        {/* Compliance Summary */}
        <div>
          <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
            Compliance Summary
          </h3>
          <div className="space-y-3">
            <MobileCard>
              <div className="flex items-center justify-between">
                <div>
                  <h4 style={{ color: '#535353' }} className="font-medium">
                    Overall Compliance
                  </h4>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    System-wide compliance score
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: '#7CE577' }}>
                    94%
                  </div>
                  <div className="text-xs" style={{ color: '#848484' }}>
                    3/4 metrics compliant
                  </div>
                </div>
              </div>
            </MobileCard>

            <MobileCard>
              <div className="flex items-center justify-between">
                <div>
                  <h4 style={{ color: '#535353' }} className="font-medium">
                    Active Violations
                  </h4>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Current policy violations
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: '#FF6B7A' }}>
                    20
                  </div>
                  <div className="text-xs" style={{ color: '#848484' }}>
                    2 critical issues
                  </div>
                </div>
              </div>
            </MobileCard>

            <MobileCard>
              <div className="flex items-center justify-between">
                <div>
                  <h4 style={{ color: '#535353' }} className="font-medium">
                    Audit Actions
                  </h4>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Actions this month
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: '#5B9FFF' }}>
                    156
                  </div>
                  <div className="text-xs" style={{ color: '#848484' }}>
                    12 suspensions
                  </div>
                </div>
              </div>
            </MobileCard>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Security Scan')}
            className="h-20"
          >
            <Shield className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Security Scan</div>
              <div className="text-sm" style={{ color: '#848484' }}>System vulnerability check</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Policy Review')}
            className="h-20"
          >
            <FileText className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Policy Review</div>
              <div className="text-sm" style={{ color: '#848484' }}>Review policy compliance</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Compliance Report')}
            className="h-20"
          >
            <BarChart3 className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Compliance Report</div>
              <div className="text-sm" style={{ color: '#848484' }}>Generate compliance report</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}