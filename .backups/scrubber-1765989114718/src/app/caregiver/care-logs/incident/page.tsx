'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';

export default function CaregiverIncidentLogPage() {
  const [form, setForm] = useState({
    incidentType: 'Fall risk',
    severity: 'Low',
    description: '',
    action: '',
  });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-amber-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
              <span className="text-xl"></span>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Care Log</p>
              <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Incident Report</h1>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Incident Type *</label>
              <select
                value={form.incidentType}
                onChange={(e) => update('incidentType', e.target.value)}
                className="w-full rounded-2xl border bg-white/70 px-4 py-3"
                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}
              >
                {['Fall risk', 'Medication error', 'Behavioral issue', 'Equipment issue', 'Other'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Severity *</label>
              <select
                value={form.severity}
                onChange={(e) => update('severity', e.target.value)}
                className="w-full rounded-2xl border bg-white/70 px-4 py-3"
                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Description *</label>
              <Textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="bg-white/70 border-white/60 min-h-[140px]"
                placeholder="Detail what happened, when, and who was present."
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Action Taken *</label>
              <Textarea
                value={form.action}
                onChange={(e) => update('action', e.target.value)}
                className="bg-white/70 border-white/60 min-h-[120px]"
                placeholder="Describe how you responded and who was notified."
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" style={{ color: '#535353' }}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!form.description.trim() || !form.action.trim()}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                color: 'white',
                opacity: form.description.trim() && form.action.trim() ? 1 : 0.5,
              }}
            >
              Submit Incident Report
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
