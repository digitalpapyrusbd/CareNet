import { Users, Building2, Clock, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface VerificationQueueProps {
  onReviewItem: (id: string, type: 'caregiver' | 'agency') => void;
}

export function VerificationQueue({ onReviewItem }: VerificationQueueProps) {
  const [activeTab, setActiveTab] = useState<'caregivers' | 'agencies'>('caregivers');

  const queue = {
    caregivers: [
      {
        id: "1",
        name: "Rashida Begum",
        submittedAt: "2 hours ago",
        stage: "Certificates Review",
        priority: "high",
        daysWaiting: 1
      },
      {
        id: "2",
        name: "Fatima Khatun",
        submittedAt: "1 day ago",
        stage: "Police Clearance",
        priority: "medium",
        daysWaiting: 2
      },
    ],
    agencies: [
      {
        id: "3",
        name: "Green Care Services",
        submittedAt: "3 hours ago",
        stage: "Legal Documents",
        priority: "high",
        daysWaiting: 1
      },
    ]
  };

  const stats = {
    caregivers: {
      pending: 15,
      inReview: 8,
      approved: 142,
      rejected: 12
    },
    agencies: {
      pending: 5,
      inReview: 3,
      approved: 38,
      rejected: 4
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Verification Queue</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>
                  {stats[activeTab].pending}
                </p>
                <p className="text-sm" style={{ color: '#848484' }}>Pending</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                }}
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>
                  {stats[activeTab].inReview}
                </p>
                <p className="text-sm" style={{ color: '#848484' }}>In Review</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                }}
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>
                  {stats[activeTab].approved}
                </p>
                <p className="text-sm" style={{ color: '#848484' }}>Approved</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #848484 0%, #B0B0B0 100%)'
                }}
              >
                <X className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>
                  {stats[activeTab].rejected}
                </p>
                <p className="text-sm" style={{ color: '#848484' }}>Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('caregivers')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg flex-1"
            style={{
              background: activeTab === 'caregivers' 
                ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                : 'rgba(255, 255, 255, 0.5)',
              color: activeTab === 'caregivers' ? 'white' : '#535353'
            }}
          >
            <Users className="w-5 h-5" />
            <span>Caregivers ({stats.caregivers.pending})</span>
          </button>
          <button
            onClick={() => setActiveTab('agencies')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg flex-1"
            style={{
              background: activeTab === 'agencies' 
                ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                : 'rgba(255, 255, 255, 0.5)',
              color: activeTab === 'agencies' ? 'white' : '#535353'
            }}
          >
            <Building2 className="w-5 h-5" />
            <span>Agencies ({stats.agencies.pending})</span>
          </button>
        </div>

        {/* Queue Items */}
        <div className="space-y-3">
          {queue[activeTab].map((item) => (
            <div
              key={item.id}
              className="finance-card p-4"
              style={{
                borderLeft: item.priority === 'high' ? '4px solid #FF6B7A' : '4px solid #FFD180'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ color: '#535353' }}>{item.name}</h3>
                    {item.priority === 'high' && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#FF6B7A', color: 'white' }}
                      >
                        Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>
                    Stage: {item.stage}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#848484' }}>
                    <span>Submitted {item.submittedAt}</span>
                    <span>•</span>
                    <span>Waiting {item.daysWaiting} {item.daysWaiting === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onReviewItem(item.id, activeTab === 'caregivers' ? 'caregiver' : 'agency')}
                className="w-full"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                Start Review
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {queue[activeTab].length === 0 && (
          <div className="text-center py-12 finance-card">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#7CE577' }} />
            <p style={{ color: '#535353' }}>All caught up!</p>
            <p className="text-sm" style={{ color: '#848484' }}>
              No pending {activeTab} verifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
