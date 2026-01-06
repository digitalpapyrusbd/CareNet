'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, CheckCircle, XCircle, User, MessageSquare, Calendar, Search, Filter, Download, Upload } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface Report {
  id: string;
  type: 'user' | 'message' | 'content';
  reporter: string;
  reportedUser: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  evidence?: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  reportsCount: number;
  status: 'active' | 'suspended' | 'banned';
}

export function ContentModeration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data
  const reports: Report[] = [
    {
      id: 'REP-001',
      type: 'message',
      reporter: 'Mrs. Rahman',
      reportedUser: 'Mr. Ahmed',
      reason: 'Inappropriate language',
      description: 'User used offensive language in chat',
      status: 'pending',
      severity: 'medium',
      timestamp: '2024-12-10 14:30',
      evidence: ['Screenshot 1', 'Screenshot 2']
    },
    {
      id: 'REP-002',
      type: 'user',
      reporter: 'Admin',
      reportedUser: 'Suspicious User',
      reason: 'Spam activity',
      description: 'Multiple fake accounts created',
      status: 'reviewing',
      severity: 'high',
      timestamp: '2024-12-09 10:15',
      evidence: ['IP logs', 'Activity patterns']
    },
    {
      id: 'REP-003',
      type: 'content',
      reporter: 'Guardian',
      reportedUser: 'Caregiver',
      reason: 'Misinformation',
      description: 'Shared incorrect medical advice',
      status: 'resolved',
      severity: 'low',
      timestamp: '2024-12-08 16:45',
      evidence: ['Message content']
    },
    {
      id: 'REP-004',
      type: 'message',
      reporter: 'Patient',
      reportedUser: 'Unknown',
      reason: 'Harassment',
      description: 'Received threatening messages',
      status: 'pending',
      severity: 'critical',
      timestamp: '2024-12-07 09:20',
      evidence: ['Message logs']
    }
  ];

  const users: User[] = [
    {
      id: 'U001',
      name: 'Mr. Ahmed',
      email: 'ahmed@example.com',
      role: 'Caregiver',
      joinDate: '2024-01-15',
      reportsCount: 3,
      status: 'active'
    },
    {
      id: 'U002',
      name: 'Suspicious User',
      email: 'suspicious@example.com',
      role: 'Patient',
      joinDate: '2024-12-01',
      reportsCount: 8,
      status: 'suspended'
    },
    {
      id: 'U003',
      name: 'Caregiver',
      email: 'caregiver@example.com',
      role: 'Caregiver',
      joinDate: '2023-12-10',
      reportsCount: 1,
      status: 'active'
    }
  ];

  const types = ['all', 'user', 'message', 'content'];
  const statuses = ['all', 'pending', 'reviewing', 'resolved', 'dismissed'];
  const severities = ['all', 'low', 'medium', 'high', 'critical'];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesStatus && matchesSeverity;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Report];
    let bValue: any = b[sortBy as keyof Report];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFD180';
      case 'reviewing': return '#FFB74D';
      case 'resolved': return '#7CE577';
      case 'dismissed': return '#848484';
      default: return '#848484';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#7CE577';
      case 'medium': return '#FFD180';
      case 'high': return '#FFB74D';
      case 'critical': return '#FF6B7A';
      default: return '#848484';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'content': return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Content Moderation
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Review and manage user reports
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Export Reports')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Bulk Review')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Bulk Review
          </TouchButton>
        </div>
      </div>

      {/* Filters */}
      <div className="finance-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {severities.map(severity => (
              <option key={severity} value={severity}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Reports Queue
        </h2>
        <div className="space-y-3">
          {sortedReports.map((report) => (
            <MobileCard key={report.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: getSeverityColor(report.severity) + '20',
                      color: getSeverityColor(report.severity)
                    }}
                  >
                    {getTypeIcon(report.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {report.id}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getSeverityColor(report.severity) + '20',
                          color: getSeverityColor(report.severity)
                        }}
                      >
                        {report.severity}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getStatusColor(report.status) + '20',
                          color: getStatusColor(report.status)
                        }}
                      >
                        {report.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#848484' }}>Reported:</span>
                        <span style={{ color: '#535353' }}>{report.reportedUser}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#848484' }}>Reporter:</span>
                        <span style={{ color: '#535353' }}>{report.reporter}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" style={{ color: '#FFD180' }} />
                        <span style={{ color: '#848484' }}>Reason:</span>
                        <span style={{ color: '#535353' }}>{report.reason}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                        <span style={{ color: '#848484' }}>Time:</span>
                        <span style={{ color: '#535353' }}>{report.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#848484' }}>Type:</span>
                        <span style={{ color: '#535353' }}>{report.type}</span>
                      </div>
                      {report.evidence && report.evidence.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#848484' }}>Evidence:</span>
                          <span style={{ color: '#535353' }}>{report.evidence.length} items</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-sm" style={{ color: '#535353' }}>
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Review', report.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Resolve', report.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolve
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Dismiss', report.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Dismiss
                  </TouchButton>
                </div>
              </div>
            </MobileCard>
          ))}
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
            onClick={() => console.log('User Management')}
            className="h-20"
          >
            <User className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>User Management</div>
              <div className="text-sm" style={{ color: '#848484' }}>Manage user accounts</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Policy Enforcement')}
            className="h-20"
          >
            <Shield className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Policy Enforcement</div>
              <div className="text-sm" style={{ color: '#848484' }}>Apply community rules</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Audit Logs')}
            className="h-20"
          >
            <Search className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Audit Logs</div>
              <div className="text-sm" style={{ color: '#848484' }}>Review actions</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}