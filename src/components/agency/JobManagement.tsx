'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Search, Filter, Calendar, User, MapPin, Clock, DollarSign, CheckCircle, XCircle, Eye, Users } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface Job {
  id: string;
  title: string;
  patientName: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  caregiverAssigned?: string;
  requiredSkills: string[];
  priority: 'low' | 'medium' | 'high';
  description: string;
}

interface Patient {
  id: string;
  name: string;
  address: string;
  contact: string;
  medicalConditions: string[];
}

export function JobManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock data
  const jobs: Job[] = [
    {
      id: 'JOB-001',
      title: 'Daily Care Assistance',
      patientName: 'Mrs. Rahman',
      location: 'Dhanmondi, Dhaka',
      startDate: '2024-12-15',
      endDate: '2024-12-31',
      startTime: '08:00',
      endTime: '16:00',
      hourlyRate: 250,
      status: 'assigned',
      caregiverAssigned: 'Fatima Khan',
      requiredSkills: ['Personal Care', 'Medication Management'],
      priority: 'high',
      description: 'Assist with daily activities and medication management'
    },
    {
      id: 'JOB-002',
      title: 'Night Care Support',
      patientName: 'Mr. Ahmed',
      location: 'Gulshan, Dhaka',
      startDate: '2024-12-10',
      endDate: '2025-01-10',
      startTime: '20:00',
      endTime: '08:00',
      hourlyRate: 300,
      status: 'open',
      requiredSkills: ['Night Care', 'Emergency Response'],
      priority: 'medium',
      description: 'Overnight care and monitoring'
    },
    {
      id: 'JOB-003',
      title: 'Rehabilitation Support',
      patientName: 'Mrs. Begum',
      location: 'Banani, Dhaka',
      startDate: '2024-12-20',
      endDate: '2025-02-20',
      startTime: '10:00',
      endTime: '14:00',
      hourlyRate: 280,
      status: 'in-progress',
      caregiverAssigned: 'Rahman Ahmed',
      requiredSkills: ['Physical Therapy', 'Mobility Assistance'],
      priority: 'high',
      description: 'Post-surgery rehabilitation and mobility support'
    },
    {
      id: 'JOB-004',
      title: 'Companionship Care',
      patientName: 'Mr. Karim',
      location: 'Mohammadpur, Dhaka',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      startTime: '09:00',
      endTime: '17:00',
      hourlyRate: 200,
      status: 'completed',
      caregiverAssigned: 'Shirin Begum',
      requiredSkills: ['Companionship', 'Light Housekeeping'],
      priority: 'low',
      description: 'Companionship and light household tasks'
    }
  ];

  const statuses = ['all', 'open', 'assigned', 'in-progress', 'completed', 'cancelled'];
  const priorities = ['all', 'low', 'medium', 'high'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || job.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Job];
    let bValue: any = b[sortBy as keyof Job];
    
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
      case 'open': return '#7CE577';
      case 'assigned': return '#FFD180';
      case 'in-progress': return '#5B9FFF';
      case 'completed': return '#7CE577';
      case 'cancelled': return '#FF6B7A';
      default: return '#848484';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B7A';
      case 'medium': return '#FFD180';
      case 'low': return '#7CE577';
      default: return '#848484';
    }
  };

  const getJobDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDailyEarnings = (hourlyRate: number, startTime: string, endTime: string) => {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hourlyRate * hours;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Job Management
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Manage caregiving assignments and schedules
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Export Jobs')}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Export
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Create Job')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Job
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
              placeholder="Search jobs..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
          
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
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-lg border flex-1"
              style={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.5)",
                color: "#535353",
              }}
            >
              <option value="startDate">Sort by Date</option>
              <option value="hourlyRate">Sort by Rate</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg border"
              style={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.5)",
                color: "#535353",
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Job Assignments
        </h2>
        <div className="space-y-3">
          {sortedJobs.map((job) => (
            <MobileCard key={job.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: getStatusColor(job.status) + '20',
                      color: getStatusColor(job.status)
                    }}
                  >
                    <Briefcase className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 style={{ color: '#535353' }} className="font-medium">
                        {job.title}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getStatusColor(job.status) + '20',
                          color: getStatusColor(job.status)
                        }}
                      >
                        {job.status}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getPriorityColor(job.priority) + '20',
                          color: getPriorityColor(job.priority)
                        }}
                      >
                        {job.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#848484' }}>Patient:</span>
                        <span style={{ color: '#535353' }}>{job.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#FFD180' }} />
                        <span style={{ color: '#848484' }}>Location:</span>
                        <span style={{ color: '#535353' }}>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#848484' }}>Duration:</span>
                        <span style={{ color: '#535353' }}>
                          {getJobDuration(job.startDate, job.endDate)} days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                        <span style={{ color: '#848484' }}>Rate:</span>
                        <span style={{ color: '#535353' }}>৳{job.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#848484' }}>Time:</span>
                        <span style={{ color: '#535353' }}>{job.startTime} - {job.endTime}</span>
                      </div>
                      {job.caregiverAssigned && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" style={{ color: '#7CE577' }} />
                          <span style={{ color: '#848484' }}>Assigned:</span>
                          <span style={{ color: '#535353' }}>{job.caregiverAssigned}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#848484' }}>Skills:</span>
                        <span style={{ color: '#535353' }}>{job.requiredSkills.join(', ')}</span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm" style={{ color: '#535353' }}>
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View', job.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', job.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </TouchButton>
                  {job.status === 'open' && (
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={() => console.log('Assign', job.id)}
                    >
                      Assign
                    </TouchButton>
                  )}
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
            onClick={() => console.log('Bulk Assign')}
            className="h-20"
          >
            <Users className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Bulk Assign</div>
              <div className="text-sm" style={{ color: '#848484' }}>Assign multiple jobs</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Schedule Optimization')}
            className="h-20"
          >
            <Calendar className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Schedule Optimize</div>
              <div className="text-sm" style={{ color: '#848484' }}>Optimize assignments</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Job Analytics')}
            className="h-20"
          >
            <DollarSign className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Analytics</div>
              <div className="text-sm" style={{ color: '#848484' }}>Job performance</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}