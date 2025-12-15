'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Star, Briefcase, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CaregiverProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const caregiver = {
    name: 'Rashida Begum',
    rating: 4.9,
    experience: '8 years',
    skills: ['Senior Care', 'Diabetes Management', 'Post-Op Care'],
    completedJobs: 245,
    phone: '+880 1712-345678'
  };

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
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

        <div className="finance-card p-6 mb-6 text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
            }}
          >
            <User className="w-10 h-10 text-white" />
          </div>

          <h2 className="mb-2" style={{ color: '#535353' }}>{caregiver.name}</h2>
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
            <span style={{ color: '#535353' }}>{caregiver.rating}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="finance-card p-3">
              <p className="text-2xl" style={{ color: '#535353' }}>{caregiver.completedJobs}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Jobs</p>
            </div>
            <div className="finance-card p-3">
              <p className="text-2xl" style={{ color: '#535353' }}>{caregiver.experience}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Experience</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Skills</h3>
          <div className="flex flex-wrap gap-2">
            {caregiver.skills.map((skill, idx) => (
              <span key={idx} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {}}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            onClick={() => router.push(`/agency/messages/${id}`)}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white'
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
