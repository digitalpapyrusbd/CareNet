'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Play, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TrainingResourcesPage() {
  const router = useRouter();

  const modules = [
    { id: '1', title: 'Patient Safety Basics', duration: '30 min', completed: true, progress: 100 },
    { id: '2', title: 'Medication Administration', duration: '45 min', completed: true, progress: 100 },
    { id: '3', title: 'Emergency Procedures', duration: '1 hour', completed: false, progress: 60 },
    { id: '4', title: 'Communication Skills', duration: '40 min', completed: false, progress: 0 },
    { id: '5', title: 'Documentation Best Practices', duration: '35 min', completed: false, progress: 0 },
  ];

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Training Resources</h1>
          <p style={{ color: '#848484' }}>Improve your skills with our training modules</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Overall Progress</p>
              <p className="text-2xl" style={{ color: '#7CE577' }}>52%</p>
            </div>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: module.completed
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  {module.completed ? <CheckCircle className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="mb-1" style={{ color: '#535353' }}>{module.title}</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#848484' }}>
                    <Clock className="w-3 h-3" />
                    <span>{module.duration}</span>
                  </div>
                </div>
              </div>

              {module.progress > 0 && (
                <div className="mb-3">
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                    <div 
                      className="h-full rounded-full"
                      style={{
                        width: `${module.progress}%`,
                        background: module.completed
                          ? 'radial-gradient(to right, #7CE577, #A8E063)'
                          : 'radial-gradient(to right, #5B9FFF, #8EC5FC)'
                      }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={() => {}}
                className="w-full"
                style={{
                  background: module.completed
                    ? 'rgba(168, 224, 99, 0.2)'
                    : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  color: module.completed ? '#7CE577' : 'white'
                }}
              >
                {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}

