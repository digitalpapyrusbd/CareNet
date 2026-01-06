'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Search, Filter, Download, Upload, Eye, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  certifications: string[];
  lastTraining: string;
  performanceScore: number;
  assignedPatients: number;
  availability: string;
}

interface Certification {
  id: string;
  name: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'pending';
}

export function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock data
  const caregivers: Caregiver[] = [
    {
      id: '1',
      name: 'Fatima Khan',
      email: 'fatima.khan@example.com',
      phone: '+880 1712 345678',
      role: 'Senior Caregiver',
      status: 'active',
      certifications: ['CPR', 'First Aid', 'Dementia Care'],
      lastTraining: '2024-11-15',
      performanceScore: 95,
      assignedPatients: 3,
      availability: 'Full-time'
    },
    {
      id: '2',
      name: 'Rahman Ahmed',
      email: 'rahman.ahmed@example.com',
      phone: '+880 1712 345679',
      role: 'Junior Caregiver',
      status: 'active',
      certifications: ['CPR', 'First Aid'],
      lastTraining: '2024-10-20',
      performanceScore: 87,
      assignedPatients: 2,
      availability: 'Part-time'
    },
    {
      id: '3',
      name: 'Shirin Begum',
      email: 'shirin.begum@example.com',
      phone: '+880 1712 345680',
      role: 'Caregiver',
      status: 'pending',
      certifications: ['CPR'],
      lastTraining: '2024-09-10',
      performanceScore: 78,
      assignedPatients: 0,
      availability: 'Full-time'
    },
    {
      id: '4',
      name: 'Karim Islam',
      email: 'karim.islam@example.com',
      phone: '+880 1712 345681',
      role: 'Senior Caregiver',
      status: 'inactive',
      certifications: ['CPR', 'First Aid', 'Dementia Care', 'Hospice Care'],
      lastTraining: '2024-08-05',
      performanceScore: 92,
      assignedPatients: 4,
      availability: 'Full-time'
    }
  ];

  const roles = ['all', 'Senior Caregiver', 'Junior Caregiver', 'Caregiver', 'Nurse'];
  const statuses = ['all', 'active', 'inactive', 'pending'];

  const filteredCaregivers = caregivers.filter(cg => {
    const matchesSearch = cg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cg.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || cg.status === selectedStatus;
    const matchesRole = selectedRole === 'all' || cg.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedCaregivers = [...filteredCaregivers].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Caregiver];
    let bValue: any = b[sortBy as keyof Caregiver];
    
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
      case 'active': return '#7CE577';
      case 'inactive': return '#848484';
      case 'pending': return '#FFD180';
      default: return '#848484';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Senior Caregiver': return '#5B9FFF';
      case 'Junior Caregiver': return '#7CE577';
      case 'Caregiver': return '#FFD180';
      case 'Nurse': return '#FF6B7A';
      default: return '#848484';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return '#7CE577';
    if (score >= 80) return '#FFD180';
    return '#FF6B7A';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#535353' }} className="text-2xl font-bold">
            Staff Management
          </h1>
          <p style={{ color: '#848484' }} className="text-sm">
            Manage caregiver profiles and certifications
          </p>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => console.log('Export Staff')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </TouchButton>
          <TouchButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Add Staff')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff
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
              placeholder="Search caregivers..."
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
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 rounded-lg border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.5)",
              color: "#535353",
            }}
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
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
              <option value="name">Sort by Name</option>
              <option value="performanceScore">Sort by Score</option>
              <option value="assignedPatients">Sort by Patients</option>
              <option value="lastTraining">Sort by Training</option>
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

      {/* Staff List */}
      <div>
        <h2 style={{ color: '#535353' }} className="text-lg font-semibold mb-4">
          Caregiver List
        </h2>
        <div className="space-y-3">
          {sortedCaregivers.map((cg) => (
            <MobileCard key={cg.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: getRoleColor(cg.role) + '20',
                      color: getRoleColor(cg.role)
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
                        {cg.status}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: getRoleColor(cg.role) + '20',
                          color: getRoleColor(cg.role)
                        }}
                      >
                        {cg.role}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span style={{ color: '#848484' }}>Email:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{cg.email}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Phone:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{cg.phone}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Patients:</span>
                        <span style={{ color: '#535353' }} className="ml-2">{cg.assignedPatients}</span>
                      </div>
                      <div>
                        <span style={{ color: '#848484' }}>Score:</span>
                        <span 
                          style={{ 
                            color: getPerformanceColor(cg.performanceScore),
                            fontWeight: 'bold'
                          }}
                          className="ml-2"
                        >
                          {cg.performanceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#848484' }}>Certifications:</span>
                        <span style={{ color: '#535353' }}>{cg.certifications.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />
                        <span style={{ color: '#848484' }}>Last Training:</span>
                        <span style={{ color: '#535353' }}>{cg.lastTraining}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#848484' }}>Availability:</span>
                        <span style={{ color: '#535353' }}>{cg.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View', cg.name)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', cg.name)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Delete', cg.name)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
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
            onClick={() => console.log('Bulk Upload')}
            className="h-20"
          >
            <Upload className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Bulk Upload</div>
              <div className="text-sm" style={{ color: '#848484' }}>Import staff data</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Training Schedule')}
            className="h-20"
          >
            <Clock className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Training</div>
              <div className="text-sm" style={{ color: '#848484' }}>Schedule sessions</div>
            </div>
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="md"
            onClick={() => console.log('Performance Reports')}
            className="h-20"
          >
            <Download className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
            <div className="text-left">
              <div style={{ color: '#535353' }}>Reports</div>
              <div className="text-sm" style={{ color: '#848484' }}>Generate analytics</div>
            </div>
          </TouchButton>
        </div>
      </div>
    </div>
  );
}