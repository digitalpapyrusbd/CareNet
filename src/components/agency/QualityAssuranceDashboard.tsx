'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Users, CheckCircle, Clock, BarChart3, LineChart, Star, Shield, MessageSquare } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface QualityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface CaregiverQuality {
  id: string;
  name: string;
  rating: number;
  checkInRate: number;
  careLogCompletion: number;
  incidents: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  lastReview: string;
}

interface FeedbackItem {
  id: string;
  patientName: string;
  caregiverName: string;
  rating: number;
  comment: string;
  type: 'positive' | 'negative' | 'neutral';
  date: string;
  resolved: boolean;
}

interface IncidentReport {
  id: string;
  caregiverName: string;
  patientName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved';
}

export function QualityAssuranceDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data
  const qualityMetrics: QualityMetric[] = [
    { id: '1', name: 'Average Rating', value: 4.8, target: 4.5, trend: 'up', color: '#7CE577' },
    { id: '2', name: 'On-time Check-in Rate', value: 94, target: 90, trend: 'stable', color: '#5B9FFF' },
    { id: '3', name: 'Care Log Completion', value: 98, target: 95, trend: 'up', color: '#7CE577' },
    { id: '4', name: 'Incident Rate', value: 2, target: 5, trend: 'down', color: '#FF6B7A' },
  ];

  const caregivers: CaregiverQuality[] = [
    {
      id: '1',
      name: 'Fatima Khan',
      rating: 4.9,
      checkInRate: 98,
      careLogCompletion: 100,
      incidents: 0,
      status: 'excellent',
      lastReview: '2024-12-01'
    },
    {
      id: '2',
      name: 'Rahman Ahmed',
      rating: 4.6,
      checkInRate: 92,
      careLogCompletion: 95,
      incidents: 1,
      status: 'good',
      lastReview: '2024-11-28'
    },
    {
      id: '3',
      name: 'Shirin Begum',
      rating: 4.2,
      checkInRate: 85,
      careLogCompletion: 88,
      incidents: 3,
      status: 'needs-improvement',
      lastReview: '2024-11-25'
    },
    {
      id: '4',
      name: 'Karim Islam',
      rating: 3.8,
      checkInRate: 75,
      careLogCompletion: 70,
      incidents: 5,
      status: 'critical',
      lastReview: '2024-11-20'
    }
  ];

  const feedback: FeedbackItem[] = [
    {
      id: '1',
      patientName: 'Mrs. Rahman',
      caregiverName: 'Fatima Khan',
      rating: 5,
      comment: 'Excellent care and attention to detail',
      type: 'positive',
      date: '2024-12-10',
      resolved: true
    },
    {
      id: '2',
      patientName: 'Mr. Karim',
      caregiverName: 'Rahman Ahmed',
      rating: 4,
      comment: 'Good service, could be more punctual',
      type: 'neutral',
      date: '2024-12-08',
      resolved: false
    },
    {
      id: '3',
      patientName: 'Mrs. Begum',
      caregiverName: 'Shirin Begum',
      rating: 2,
      comment: 'Late arrivals and incomplete care logs',
      type: 'negative',
      date: '2024-12-05',
      resolved: false
    }
  ];

  const incidents: IncidentReport[] = [
    {
      id: '1',
      caregiverName: 'Shirin Begum',
      patientName: 'Mrs. Rahman',
      severity: 'medium',
      description: 'Missed morning check-in without notification',
      date: '2024-12-08',
      status: 'investigating'
    },
    {
      id: '2',
      caregiverName: 'Karim Islam',
      patientName: 'Mr. Ahmed',
      severity: 'high',
      description: 'Medication error - wrong dosage administered',
      date: '2024-12-05',
      status: 'open'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#7CE577';
      case 'good': return '#5B9FFF';
      case 'needs-improvement': return '#FFD180';
      case 'critical': return '#FF6B7A';
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

  const filteredCaregivers = caregivers.filter(cg => {
    const matchesSearch = cg.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || cg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Quality Assurance Dashboard
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Monitor caregiver performance and quality metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Generate Report')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Report
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Export Data')}
          >
            Export
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

      {/* Quality Metrics */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Quality Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {qualityMetrics.map((metric) => (
            <MobileCard key={metric.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${metric.color}20` }}
                  >
                    <TrendingUp className="w-5 h-5" style={{ color: metric.color }} />
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
                  <div className="text-2xl font-bold" style={{ color: metric.color }}>
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
                    background: metric.color
                  }}
                ></div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Caregiver Performance */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#535353' }} className="text-lg font-semibold">
            Caregiver Performance
          </h2>
          
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search caregivers..."
              className="bg-white/50 border-white/50 w-64"
              style={{ color: '#535353' }}
            />
            
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
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="needs-improvement">Needs Improvement</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCaregivers.map((cg) => (
            <MobileCard key={cg.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: `${getStatusColor(cg.status)}20`,
                      color: getStatusColor(cg.status)
                    }}
                  >
                    <Users className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {cg.name}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getStatusColor(cg.status) + '20',
                          color: getStatusColor(cg.status)
                        }}
                      >
                        {cg.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" style={{ color: '#FFD180' }} />
                        <span style={{ color: '#535353' }}>{cg.rating}★</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#535353' }}>{cg.checkInRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#535353' }}>{cg.careLogCompletion}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                        <span style={{ color: '#535353' }}>{cg.incidents} incidents</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Review', cg.name)}
                  >
                    Review
                  </TouchButton>
                  <TouchButton
                    variant="secondary"
                    size="sm"
                    onClick={() => console.log('Details', cg.name)}
                  >
                    Details
                  </TouchButton>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Feedback & Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback */}
        <div>
          <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
            Recent Feedback
          </h3>
          <div className="space-y-3">
            {feedback.map((item) => (
              <MobileCard key={item.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: item.type === 'positive' ? '#7CE57720' : 
                                     item.type === 'negative' ? '#FF6B7A20' : '#5B9FFF20',
                          color: item.type === 'positive' ? '#7CE577' : 
                                 item.type === 'negative' ? '#FF6B7A' : '#5B9FFF'
                        }}
                      >
                        {item.type}
                      </span>
                      <span className="text-sm" style={{ color: '#848484' }}>
                        {item.date}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: '#535353' }}>{item.patientName}</span>
                      <span style={{ color: '#848484' }}>→</span>
                      <span style={{ color: '#535353' }}>{item.caregiverName}</span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ background: '#FFD18020', color: '#FFD180' }}
                      >
                        {item.rating}★
                      </span>
                    </div>
                    
                    <p style={{ color: '#535353' }}>{item.comment}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {!item.resolved && (
                      <TouchButton
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Resolve', item.id)}
                      >
                        Resolve
                      </TouchButton>
                    )}
                    <TouchButton
                      variant="secondary"
                      size="sm"
                      onClick={() => console.log('Details', item.id)}
                    >
                      Details
                    </TouchButton>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div>
          <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
            Incident Reports
          </h3>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <MobileCard key={incident.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getSeverityColor(incident.severity) + '20',
                          color: getSeverityColor(incident.severity)
                        }}
                      >
                        {incident.severity}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: incident.status === 'open' ? '#FF6B7A20' : 
                                     incident.status === 'investigating' ? '#FFD18020' : '#7CE57720',
                          color: incident.status === 'open' ? '#FF6B7A' : 
                                 incident.status === 'investigating' ? '#FFD180' : '#7CE577'
                        }}
                      >
                        {incident.status}
                      </span>
                      <span className="text-sm" style={{ color: '#848484' }}>
                        {incident.date}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: '#535353' }}>{incident.caregiverName}</span>
                      <span style={{ color: '#848484' }}>→</span>
                      <span style={{ color: '#535353' }}>{incident.patientName}</span>
                    </div>
                    
                    <p style={{ color: '#535353' }}>{incident.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <TouchButton
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Investigate', incident.id)}
                    >
                      Investigate
                    </TouchButton>
                    <TouchButton
                      variant="secondary"
                      size="sm"
                      onClick={() => console.log('Details', incident.id)}
                    >
                      Details
                    </TouchButton>
                  </div>
                </div>
              </MobileCard>
            ))}
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
            onClick={() => console.log('Schedule Reviews')}
            className="h-20"
          >
            <Shield className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Schedule Reviews</div>
              <div className="text-sm" style={{ color: '#848484' }}>Performance evaluations</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Generate Reports')}
            className="h-20"
          >
            <LineChart className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Generate Reports</div>
              <div className="text-sm" style={{ color: '#848484' }}>Quality metrics</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Training Programs')}
            className="h-20"
          >
            <MessageSquare className="w-6 h-6 mr-3" style={{ color: '#FFB74D' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Training Programs</div>
              <div className="text-sm" style={{ color: '#848484' }}>Skill development</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}