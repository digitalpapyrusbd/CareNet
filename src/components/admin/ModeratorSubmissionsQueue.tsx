import { FileText, Eye, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Submission {
  id: string;
  type: 'verification' | 'dispute' | 'ticket' | 'deployment';
  submittedBy: string;
  entityName: string;
  recommendation: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'sent_back' | 'overridden';
}

interface ModeratorSubmissionsQueueProps {
  submissions: Submission[];
  onReview: (id: string) => void;
}

export function ModeratorSubmissionsQueue({ submissions, onReview }: ModeratorSubmissionsQueueProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verifications' | 'disputes' | 'tickets' | 'deployments'>('all');

  const filteredSubmissions = submissions.filter(s => 
    activeTab === 'all' || s.type === activeTab.slice(0, -1)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#7CE577';
      case 'sent_back': return '#FFD180';
      case 'overridden': return '#FF6B7A';
      default: return '#5B9FFF';
    }
  };

  const getTypeIcon = (type: string) => {
    return FileText;
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Moderator Submissions</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'verifications', 'disputes', 'tickets', 'deployments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap"
              style={{
                background: activeTab === tab 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab ? 'white' : '#535353'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => {
            const statusColor = getStatusColor(submission.status);
            const TypeIcon = getTypeIcon(submission.type);

            return (
              <div key={submission.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <TypeIcon className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{submission.entityName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {submission.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>
                      Type: {submission.type} • By: {submission.submittedBy}
                    </p>
                    <p className="text-sm mb-1" style={{ color: '#535353' }}>
                      Recommendation: {submission.recommendation}
                    </p>
                    <p className="text-xs" style={{ color: '#848484' }}>
                      Submitted: {submission.submittedDate}
                    </p>
                  </div>
                </div>

                {submission.status === 'pending' && (
                  <Button onClick={() => onReview(submission.id)} className="w-full"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                    <Eye className="w-4 h-4 mr-2" />Review & Decide
                  </Button>
                )}
              </div>
            );
          })}

          {filteredSubmissions.length === 0 && (
            <div className="finance-card p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No submissions in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

