'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientHealthRecordsPage() {
  const router = useRouter();

  const records = [
    { id: '1', name: 'Blood Test Results', date: 'Nov 20, 2024', type: 'Lab Report' },
    { id: '2', name: 'Prescription - Dr. Rahman', date: 'Dec 1, 2024', type: 'Prescription' },
    { id: '3', name: 'ECG Report', date: 'Nov 10, 2024', type: 'Medical Test' },
  ];

  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
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

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>My Health Records</h1>
          <p style={{ color: '#848484' }}>View your medical documents</p>
        </div>

        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="finance-card p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="mb-1" style={{ color: '#535353' }}>{record.name}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    {record.type} • {record.date}
                  </p>
                </div>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(142, 197, 252, 0.2)' }}
                >
                  <Download className="w-5 h-5" style={{ color: '#5B9FFF' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}

