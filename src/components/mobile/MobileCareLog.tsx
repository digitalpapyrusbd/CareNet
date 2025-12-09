'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface VitalsData {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  temperature: string;
  glucose: string;
  oxygenSaturation: string;
}

interface MealLog {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  percentConsumed: number;
}

export function MobileCareLog() {
  const [activeTab, setActiveTab] = useState<'vitals' | 'medication' | 'meals' | 'incident'>('vitals');
  const [vitals, setVitals] = useState<VitalsData>({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    glucose: '',
    oxygenSaturation: '',
  });
  const [meal, setMeal] = useState<MealLog>({
    mealType: 'breakfast',
    description: '',
    percentConsumed: 100,
  });
  const [incidentReport, setIncidentReport] = useState({
    type: 'fall',
    description: '',
    severity: 'low',
  });
  const [isRecording, setIsRecording] = useState(false);

  const handleVitalChange = (field: keyof VitalsData, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitVitals = async () => {
    if (navigator.vibrate) navigator.vibrate(10);
    // TODO: Submit to API
    // eslint-disable-next-line no-console
    console.log('Submitting vitals:', vitals);
  };

  const handleVoiceNote = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    interface SpeechRecognitionEvent extends Event {
      results: { [index: number]: { [index: number]: { transcript: string } } };
    }
    
    interface ISpeechRecognition extends EventTarget {
      continuous: boolean;
      interimResults: boolean;
      onstart: (() => void) | null;
      onresult: ((event: SpeechRecognitionEvent) => void) | null;
      onend: (() => void) | null;
      start: () => void;
    }
    
    const SpeechRecognition = (window as typeof window & { 
      webkitSpeechRecognition: new () => ISpeechRecognition 
    }).webkitSpeechRecognition;
    const recognition: ISpeechRecognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      if (navigator.vibrate) navigator.vibrate(10);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setIncidentReport(prev => ({
        ...prev,
        description: prev.description + ' ' + transcript,
      }));
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
    };

    recognition.start();
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { key: 'vitals', label: 'Vitals', icon: '❤️' },
          { key: 'medication', label: 'Meds', icon: '💊' },
          { key: 'meals', label: 'Meals', icon: '🍽️' },
          { key: 'incident', label: 'Incident', icon: '⚠️' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`min-h-[56px] px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">{tab.icon}</div>
            <div className="text-xs">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Record Vitals</h3>

          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-medium mb-2">Blood Pressure (mmHg)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Systolic"
                value={vitals.bloodPressureSystolic}
                onChange={(e) => handleVitalChange('bloodPressureSystolic', e.target.value)}
              />
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Diastolic"
                value={vitals.bloodPressureDiastolic}
                onChange={(e) => handleVitalChange('bloodPressureDiastolic', e.target.value)}
              />
            </div>
          </div>

          {/* Heart Rate */}
          <Input
            label="Heart Rate (bpm)"
            type="number"
            inputMode="numeric"
            placeholder="72"
            value={vitals.heartRate}
            onChange={(e) => handleVitalChange('heartRate', e.target.value)}
          />

          {/* Temperature */}
          <Input
            label="Temperature (°F)"
            type="number"
            inputMode="decimal"
            placeholder="98.6"
            step="0.1"
            value={vitals.temperature}
            onChange={(e) => handleVitalChange('temperature', e.target.value)}
          />

          {/* Glucose */}
          <Input
            label="Blood Glucose (mg/dL)"
            type="number"
            inputMode="numeric"
            placeholder="100"
            value={vitals.glucose}
            onChange={(e) => handleVitalChange('glucose', e.target.value)}
          />

          {/* Oxygen Saturation */}
          <Input
            label="Oxygen Saturation (%)"
            type="number"
            inputMode="numeric"
            placeholder="98"
            value={vitals.oxygenSaturation}
            onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
          />

          <Button onClick={handleSubmitVitals} size="lg" className="w-full">
            Save Vitals
          </Button>
        </div>
      )}

      {/* Medication Tab */}
      {activeTab === 'medication' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Medication Log</h3>

          {/* Quick Medication Checklist */}
          <div className="space-y-2">
            {['Morning Pills', 'Insulin Shot', 'Blood Thinner', 'Vitamins'].map((med) => (
              <label
                key={med}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 min-h-[56px]"
              >
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{med}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <Button size="lg" className="w-full">
            Add Custom Medication
          </Button>
        </div>
      )}

      {/* Meals Tab */}
      {activeTab === 'meals' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Meal Log</h3>

          <Select
            label="Meal Type"
            value={meal.mealType}
            options={[]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMeal(prev => ({ ...prev, mealType: e.target.value as MealLog['mealType'] }))}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </Select>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe what was served..."
              value={meal.description}
              onChange={(e) => setMeal(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount Consumed: {meal.percentConsumed}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="25"
              value={meal.percentConsumed}
              onChange={(e) => setMeal(prev => ({ ...prev, percentConsumed: Number(e.target.value) }))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>None</span>
              <span>Some</span>
              <span>Half</span>
              <span>Most</span>
              <span>All</span>
            </div>
          </div>

          <Button size="lg" className="w-full">
            Save Meal Log
          </Button>
        </div>
      )}

      {/* Incident Tab */}
      {activeTab === 'incident' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Incident Report</h3>

          <Select
            label="Incident Type"
            value={incidentReport.type}
            options={[]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIncidentReport(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="fall">Fall</option>
            <option value="medication_error">Medication Error</option>
            <option value="behavioral">Behavioral Issue</option>
            <option value="medical_emergency">Medical Emergency</option>
            <option value="other">Other</option>
          </Select>

          <Select
            label="Severity"
            value={incidentReport.severity}
            options={[]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIncidentReport(prev => ({ ...prev, severity: e.target.value }))}
          >
            <option value="low">Low - Minor issue</option>
            <option value="medium">Medium - Requires attention</option>
            <option value="high">High - Urgent</option>
            <option value="critical">Critical - Emergency</option>
          </Select>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe what happened..."
              value={incidentReport.description}
              onChange={(e) => setIncidentReport(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Voice Note Button */}
          <button
            onClick={handleVoiceNote}
            className={`w-full min-h-[56px] px-4 py-3 rounded-lg font-medium transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{isRecording ? 'Recording...' : 'Add Voice Note'}</span>
            </div>
          </button>

          <Button size="lg" variant="danger" className="w-full">
            Submit Incident Report
          </Button>
        </div>
      )}
    </div>
  );
}
