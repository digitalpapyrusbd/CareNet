import { FileText, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface SubmissionReviewPanelProps {
  submissions: {
    id: string;
    type: 'agency_legal' | 'agency_physical' | 'caregiver_cert' | 'caregiver_police' | 'caregiver_interview' | 'caregiver_psych';
    submitterName: string;
    moderatorName: string;
    moderatorDecision: 'approve' | 'reject';
    submittedDate: string;
    status: 'pending' | 'reviewed';
  }[];
  onReview: (submissionId: string) => void;
}

export function SubmissionReviewPanel({ submissions, onReview }: SubmissionReviewPanelProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'agency_legal': 'Agency Legal Docs',
      'agency_physical': 'Agency Physical Verification',
      'caregiver_cert': 'Caregiver Certificates',
      'caregiver_police': 'Police Clearance',
      'caregiver_interview': 'Interview',
      'caregiver_psych': 'Psychological Analysis'
    };
    return labels[type] || type;
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter !== 'all' && sub.status !== filter) return false;
    if (typeFilter !== 'all' && sub.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Submission Review Queue</h1>

        {/* Filters */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <h3 style={{ color: '#535353' }}>Filters</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#848484' }}>Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>

            <div>
              <label className="text-sm mb-2 block" style={{ color: '#848484' }}>Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="all">All Types</option>
                <option value="agency_legal">Agency Legal Docs</option>
                <option value="agency_physical">Agency Physical</option>
                <option value="caregiver_cert">Caregiver Certificates</option>
                <option value="caregiver_police">Police Clearance</option>
                <option value="caregiver_interview">Interview</option>
                <option value="caregiver_psych">Psychological Analysis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="finance-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5" style={{ color: '#5B9FFF' }} />
                    <h3 style={{ color: '#535353' }}>{getTypeLabel(submission.type)}</h3>
                    <span className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: submission.status === 'pending'
                          ? 'rgba(255, 209, 128, 0.2)'
                          : 'rgba(124, 229, 119, 0.2)',
                        color: submission.status === 'pending' ? '#FFD180' : '#7CE577'
                      }}>
                      {submission.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Submitter</p>
                      <p style={{ color: '#535353' }}>{submission.submitterName}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Moderator</p>
                      <p style={{ color: '#535353' }}>{submission.moderatorName}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Submitted</p>
                      <p style={{ color: '#535353' }}>{submission.submittedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: '#848484' }}>Moderator Decision:</span>
                    <div className="flex items-center gap-2">
                      {submission.moderatorDecision === 'approve' ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                          <span className="text-sm" style={{ color: '#7CE577' }}>Approve</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" style={{ color: '#FF8FA3' }} />
                          <span className="text-sm" style={{ color: '#FF8FA3' }}>Reject</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onReview(submission.id)}
                  style={{
                    background: submission.status === 'pending'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                    color: 'white'
                  }}
                >
                  {submission.status === 'pending' ? 'Review Now' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}

          {filteredSubmissions.length === 0 && (
            <div className="finance-card p-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No submissions match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

