'use client';

import React, { useState, useEffect } from 'react';
import { Pill, Clock, Calendar, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Bell, X } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  times: string[];
  startDate: string;
  endDate: string;
  notes: string;
  isActive: boolean;
  reminders: boolean;
}

interface MedicationManagerProps {
  patientName?: string;
  onAddMedication?: (medication: Omit<Medication, 'id'>) => void;
  onEditMedication?: (medication: Medication) => void;
  onDeleteMedication?: (medicationId: string) => void;
}

export function MedicationManager({ 
  patientName = "Anwar Hossain",
  onAddMedication,
  onEditMedication,
  onDeleteMedication
}: MedicationManagerProps) {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'daily',
      times: ['9:00 AM', '9:00 PM'],
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      notes: 'Take with food',
      isActive: true,
      reminders: true
    },
    {
      id: '2',
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'daily',
      times: ['8:00 AM'],
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      notes: 'Once daily',
      isActive: true,
      reminders: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as const,
    times: ['9:00 AM'],
    startDate: '',
    endDate: '',
    notes: '',
    isActive: true,
    reminders: true
  });

  const [todaySchedule, setTodaySchedule] = useState<Medication[]>([]);

  useEffect(() => {
    // Filter medications for today's schedule
    const today = new Date().toISOString().split('T')[0];
    const todayMeds = medications.filter(med => 
      med.isActive && 
      med.startDate <= today && 
      med.endDate >= today
    );
    setTodaySchedule(todayMeds);
  }, [medications]);

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication: Medication = {
        ...newMedication,
        id: Date.now().toString()
      };
      setMedications([...medications, medication]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'daily',
        times: ['9:00 AM'],
        startDate: '',
        endDate: '',
        notes: '',
        isActive: true,
        reminders: true
      });
      setShowAddForm(false);
      onAddMedication?.(medication);
    }
  };

  const handleEditMedication = () => {
    if (selectedMedication) {
      setMedications(medications.map(med => 
        med.id === selectedMedication.id ? selectedMedication : med
      ));
      setShowEditForm(false);
      onEditMedication?.(selectedMedication);
    }
  };

  const handleDeleteMedication = (medId: string) => {
    setMedications(medications.filter(med => med.id !== medId));
    onDeleteMedication?.(medId);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'as-needed': return 'As Needed';
      default: return frequency;
    }
  };

  const formatTime = (time: string) => {
    // Convert 24hr to 12hr format
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${period}`;
  };

  const getMedicationStatus = (med: Medication) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Check if any scheduled time is within 30 minutes
    for (const time of med.times) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledTime = hours * 60 + minutes;
      const currentTime = currentHour * 60 + currentMinutes;
      const diff = Math.abs(scheduledTime - currentTime);
      
      if (diff <= 30) {
        return 'due';
      }
    }
    return 'scheduled';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: '#535353' }} className="text-xl font-semibold">
            Medication Management
          </h2>
          <p style={{ color: '#848484' }} className="text-sm">
            {patientName}
          </p>
        </div>
        <TouchButton
          variant="primary"
          size="sm"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </TouchButton>
      </div>

      {/* Today's Schedule */}
      <MobileCard>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: '#535353' }} className="font-semibold">
            Today's Schedule
          </h3>
          <span className="text-sm" style={{ color: '#848484' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        {todaySchedule.length === 0 ? (
          <div className="text-center py-4">
            <Pill className="w-12 h-12 mx-auto mb-2" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No medications scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map((med) => {
              const status = getMedicationStatus(med);
              return (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ 
                    background: status === 'due' ? 'rgba(255, 179, 193, 0.1)' : 'rgba(255, 255, 255, 0.5)' 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        background: 'rgba(142, 197, 252, 0.2)',
                        color: '#5B9FFF'
                      }}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 style={{ color: '#535353' }} className="font-medium">
                          {med.name}
                        </h4>
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            background: status === 'due' ? '#FF6B7A' : '#7CE577',
                            color: 'white'
                          }}
                        >
                          {status === 'due' ? 'Due Now' : 'Scheduled'}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#848484' }}>
                        {med.dosage} • {med.times.map(formatTime).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  {status === 'due' && (
                    <button
                      className="px-4 py-2 rounded-lg"
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                        color: 'white'
                      }}
                    >
                      Take Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </MobileCard>

      {/* All Medications */}
      <div>
        <h3 style={{ color: '#535353' }} className="mb-4 font-semibold">
          All Medications
        </h3>
        
        <div className="space-y-3">
          {medications.map((med) => (
            <MobileCard key={med.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: 'rgba(142, 197, 252, 0.2)',
                      color: '#5B9FFF'
                    }}
                  >
                    <Pill className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 style={{ color: '#535353' }} className="font-medium">
                        {med.name}
                      </h4>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: med.isActive ? '#7CE577' : '#FF6B7A',
                          color: 'white'
                        }}
                      >
                        {med.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#848484' }} />
                        <span style={{ color: '#848484' }}>
                          {med.times.map(formatTime).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
                        <span style={{ color: '#848484' }}>
                          {getFrequencyLabel(med.frequency)}
                        </span>
                      </div>
                    </div>
                    
                    {med.notes && (
                      <p className="text-sm mt-2" style={{ color: '#848484' }}>
                        {med.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedMedication(med);
                      setShowEditForm(true);
                    }}
                    className="p-2 rounded-lg hover:bg-white/50"
                    style={{ color: '#848484' }}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMedication(med.id)}
                    className="p-2 rounded-lg hover:bg-white/50"
                    style={{ color: '#848484' }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md finance-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#535353' }} className="text-lg font-semibold">
                Add Medication
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
                style={{ color: '#848484' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Medication Name
                </label>
                <Input
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="e.g., Metformin"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Dosage
                </label>
                <Input
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g., 500mg"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Frequency
                </label>
                <select
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value as any})}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.5)",
                    color: "#535353",
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>

              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Times
                </label>
                <Input
                  value={newMedication.times.join(', ')}
                  onChange={(e) => setNewMedication({...newMedication, times: e.target.value.split(',').map(t => t.trim())})}
                  placeholder="e.g., 9:00 AM, 9:00 PM"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                    className="bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={newMedication.endDate}
                    onChange={(e) => setNewMedication({...newMedication, endDate: e.target.value})}
                    className="bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Notes
                </label>
                <Textarea
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                  placeholder="e.g., Take with food"
                  className="bg-white/50 border-white/50 min-h-20"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="flex gap-3">
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </TouchButton>
                <TouchButton
                  variant="primary"
                  size="sm"
                  onClick={handleAddMedication}
                  className="flex-1"
                >
                  Add Medication
                </TouchButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {showEditForm && selectedMedication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md finance-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#535353' }} className="text-lg font-semibold">
                Edit Medication
              </h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
                style={{ color: '#848484' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Medication Name
                </label>
                <Input
                  value={selectedMedication.name}
                  onChange={(e) => setSelectedMedication({...selectedMedication, name: e.target.value})}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Dosage
                </label>
                <Input
                  value={selectedMedication.dosage}
                  onChange={(e) => setSelectedMedication({...selectedMedication, dosage: e.target.value})}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <label className="text-sm mb-1 block" style={{ color: '#848484' }}>
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMedication.isActive}
                      onChange={(e) => setSelectedMedication({...selectedMedication, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span style={{ color: '#535353' }}>Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMedication.reminders}
                      onChange={(e) => setSelectedMedication({...selectedMedication, reminders: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span style={{ color: '#535353' }}>Reminders</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1"
                >
                  Cancel
                </TouchButton>
                <TouchButton
                  variant="primary"
                  size="sm"
                  onClick={handleEditMedication}
                  className="flex-1"
                >
                  Save Changes
                </TouchButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}