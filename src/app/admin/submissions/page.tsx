'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const submissions = [
    { id: 'SUB-001', moderator: 'Afsana Rahman', type: 'Caregiver Verification', applicant: 'Rashida Begum', status: 'pending', date: '1 hour ago' },
    { id: 'SUB-002', moderator: 'Karim Ahmed', type: 'Agency Verification', applicant: 'SafeHands Agency', status: 'pending', date: '3 hours ago' },
    { id: 'SUB-003', moderator: 'Nasrin Begum', type: 'Dispute Resolution', applicant: 'Case #D-1045', status: 'approved', date: '1 day ago' },
  ];

  const filtered = submissions.filter(s => filter === 'all' || s.status === filter);

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Moderator Submissions</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button key={f} onClick={() => setFilter(f as 'all' | 'pending' | 'approved' | 'rejected')}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((sub) => (
            <div key={sub.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: sub.status === 'pending'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                      : sub.status === 'approved'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                  }}
                >
                  {sub.status === 'approved' ? <CheckCircle className="w-6 h-6 text-white" /> : 
                   sub.status === 'rejected' ? <XCircle className="w-6 h-6 text-white" /> :
                   <FileText className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{sub.id}</h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{
                        background: sub.status === 'pending' ? 'rgba(255, 209, 128, 0.2)' : sub.status === 'approved' ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                        color: sub.status === 'pending' ? '#FFD180' : sub.status === 'approved' ? '#7CE577' : '#FF6B7A'
                      }}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{sub.type}</p>
                  <p className="text-xs mb-2" style={{ color: '#848484' }}>Applicant: {sub.applicant}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>By {sub.moderator} • {sub.date}</p>
                </div>
              </div>

              <Button onClick={() => router.push(`/admin/submissions/${sub.id}`)} size="sm" variant="outline"
                className="w-full bg-white/50 border-white/50">
                <Eye className="w-4 h-4 mr-2" />Review Submission
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}
