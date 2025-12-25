'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Upload, Heart, FileText, Activity, AlertTriangle, User, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PatientDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'logs' | 'jobs'>('overview');

  const patient = {
    name: 'Mrs. Fatima Ahmed',
    age: 72,
    gender: 'Female',
    bloodGroup: 'B+',
    photo: null,
    conditions: ['Diabetes Type 2', 'Hypertension', 'Arthritis'],
    allergies: 'Penicillin, Aspirin',
    mobility: 'Needs Assistance',
    cognitive: 'Normal',
    address: 'House 45, Road 12, Dhanmondi, Dhaka',
    emergencyContact: 'Abdul Ahmed (Son)',
    emergencyPhone: '+880 1712-345678'
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'logs', label: 'Care Logs', icon: FileText },
    { id: 'jobs', label: 'Jobs', icon: Calendar },
  ];

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      {/* Header */}
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Patient Card */}
        <div className="finance-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
              }}
            >
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1" style={{ color: '#535353' }}>{patient.name}</h2>
              <p className="text-sm mb-3" style={{ color: '#848484' }}>
                {patient.age} years • {patient.gender} • {patient.bloodGroup}
              </p>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ background: 'rgba(255, 179, 193, 0.3)', color: '#535353' }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/guardian/patients/123/edit')}
            className="finance-card p-3 hover:shadow-lg transition-all"
          >
            <Edit className="w-5 h-5 mx-auto mb-2" style={{ color: '#5B9FFF' }} />
            <p className="text-xs text-center" style={{ color: '#535353' }}>Edit</p>
          </button>
          <button
            onClick={() => router.push('/guardian/prescription-upload')}
            className="finance-card p-3 hover:shadow-lg transition-all"
          >
            <Upload className="w-5 h-5 mx-auto mb-2" style={{ color: '#FFB3C1' }} />
            <p className="text-xs text-center" style={{ color: '#535353' }}>Upload Rx</p>
          </button>
          <button
            onClick={() => router.push('/guardian/packages')}
            className="finance-card p-3 hover:shadow-lg transition-all"
          >
            <Heart className="w-5 h-5 mx-auto mb-2" style={{ color: '#7CE577' }} />
            <p className="text-xs text-center" style={{ color: '#535353' }}>Book Care</p>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Medical Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Conditions:</span>
                  <span style={{ color: '#535353' }}>{patient.conditions.join(', ')}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span style={{ color: '#848484' }}>Allergies:</span>
                  <span className="text-right" style={{ color: '#FF6B7A' }}>
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    {patient.allergies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Mobility:</span>
                  <span style={{ color: '#535353' }}>{patient.mobility}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Cognitive Status:</span>
                  <span style={{ color: '#535353' }}>{patient.cognitive}</span>
                </div>
              </div>
            </div>

            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p style={{ color: '#848484' }}>Address:</p>
                  <p style={{ color: '#535353' }}>{patient.address}</p>
                </div>
                <div>
                  <p style={{ color: '#848484' }}>Emergency Contact:</p>
                  <p style={{ color: '#535353' }}>{patient.emergencyContact}</p>
                  <p style={{ color: '#5B9FFF' }}>{patient.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Health Records</h3>
              <p className="text-sm text-center py-8" style={{ color: '#848484' }}>
                No health records uploaded yet
              </p>
              <Button
                onClick={() => router.push('/guardian/patients/123/health-records')}
                variant="outline"
                className="w-full bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                View All Records
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Care Logs</h3>
              <p className="text-sm text-center py-8" style={{ color: '#848484' }}>
                No care logs available yet
              </p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Active Jobs</h3>
              <p className="text-sm text-center py-8" style={{ color: '#848484' }}>
                No active jobs for this patient
              </p>
              <Button
                onClick={() => router.push('/guardian/packages')}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
                className="w-full"
              >
                Book Care Package
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>

  );
}
