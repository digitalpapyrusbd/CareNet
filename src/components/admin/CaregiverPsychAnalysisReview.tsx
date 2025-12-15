import { Brain, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface CaregiverPsychAnalysisReviewProps {
  submissionId: string;
  caregiverName: string;
  moderatorName: string;
  moderatorDecision: 'approve' | 'reject';
  moderatorNotes: string;
  analysis: {
    date: string;
    psychologistName: string;
    psychologistLicense: string;
    assessments: {
      mentalHealth: { score: number; notes: string };
      emotionalStability: { score: number; notes: string };
      stressManagement: { score: number; notes: string };
      interpersonalSkills: { score: number; notes: string };
    };
    overallAssessment: string;
    recommendation: 'approve' | 'conditional' | 'reject';
    reportUrl: string;
  };
  onApprove: (notes: string) => void;
  onReject: (notes: string) => void;
  onSendBackToModerator: (notes: string) => void;
}

export function CaregiverPsychAnalysisReview({
  submissionId,
  caregiverName,
  moderatorName,
  moderatorDecision,
  moderatorNotes,
  analysis,
  onApprove,
  onReject,
  onSendBackToModerator
}: CaregiverPsychAnalysisReviewProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'return' | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#7CE577';
    if (score >= 6) return '#FFD180';
    return '#FF8FA3';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Psychological Analysis Review</h1>
          <p style={{ color: '#848484' }}>Submission #{submissionId}</p>
        </div>

        {/* Moderator Decision Card */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="mb-1" style={{ color: '#535353' }}>Moderator Recommendation</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Reviewed by {moderatorName}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{
                background: moderatorDecision === 'approve' ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 179, 193, 0.2)'
              }}>
              {moderatorDecision === 'approve' ? (
                <>
                  <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                  <span style={{ color: '#7CE577' }}>Approve</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" style={{ color: '#FF8FA3' }} />
                  <span style={{ color: '#FF8FA3' }}>Reject</span>
                </>
              )}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <p className="text-sm" style={{ color: '#535353' }}>{moderatorNotes}</p>
          </div>
        </div>

        {/* Analysis Information */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Analysis Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Caregiver</p>
              <p style={{ color: '#535353' }}>{caregiverName}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Psychologist</p>
              <p style={{ color: '#535353' }}>{analysis.psychologistName}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>License Number</p>
              <p style={{ color: '#535353' }}>{analysis.psychologistLicense}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Assessment Date</p>
              <p style={{ color: '#535353' }}>{analysis.date}</p>
            </div>
          </div>

          <Button size="sm" variant="outline" className="w-full bg-white/50 border-white/50">
            <FileText className="w-4 h-4 mr-2" />View Full Report
          </Button>
        </div>

        {/* Assessment Scores */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Assessment Scores</h3>
          
          <div className="space-y-4">
            {Object.entries(analysis.assessments).map(([key, assessment]) => (
              <div key={key} className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: '#535353' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `${getScoreColor(assessment.score)}33` }}>
                      <span className="text-lg" style={{ color: getScoreColor(assessment.score) }}>
                        {assessment.score}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#848484' }}>{assessment.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Assessment */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Overall Assessment</h3>
          
          <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <p style={{ color: '#535353' }}>{analysis.overallAssessment}</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg"
            style={{
              background: analysis.recommendation === 'approve'
                ? 'rgba(124, 229, 119, 0.2)'
                : analysis.recommendation === 'conditional'
                ? 'rgba(255, 209, 128, 0.2)'
                : 'rgba(255, 179, 193, 0.2)'
            }}>
            <span style={{ color: '#535353' }}>Psychologist Recommendation:</span>
            <span className="px-3 py-1 rounded-full capitalize"
              style={{
                background: 'white',
                color: analysis.recommendation === 'approve'
                  ? '#7CE577'
                  : analysis.recommendation === 'conditional'
                  ? '#FFD180'
                  : '#FF8FA3'
              }}>
              {analysis.recommendation}
            </span>
          </div>
        </div>

        {/* Admin Decision */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Admin Decision</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setSelectedAction('approve')}
              className="p-4 rounded-lg transition-all"
              style={{
                background: selectedAction === 'approve'
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: selectedAction === 'approve' ? 'white' : '#535353'
              }}
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Approve</p>
            </button>

            <button
              onClick={() => setSelectedAction('reject')}
              className="p-4 rounded-lg transition-all"
              style={{
                background: selectedAction === 'reject'
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: selectedAction === 'reject' ? 'white' : '#535353'
              }}
            >
              <XCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Reject</p>
            </button>

            <button
              onClick={() => setSelectedAction('return')}
              className="p-4 rounded-lg transition-all"
              style={{
                background: selectedAction === 'return'
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: selectedAction === 'return' ? 'white' : '#535353'
              }}
            >
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Return</p>
            </button>
          </div>

          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add notes for your decision..."
            className="bg-white/50 border-white/50 min-h-[100px]"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {selectedAction === 'approve' && (
            <Button
              onClick={() => onApprove(adminNotes)}
              disabled={!adminNotes}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white',
                opacity: !adminNotes ? 0.5 : 1
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />Confirm Approval
            </Button>
          )}

          {selectedAction === 'reject' && (
            <Button
              onClick={() => onReject(adminNotes)}
              disabled={!adminNotes}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: !adminNotes ? 0.5 : 1
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />Confirm Rejection
            </Button>
          )}

          {selectedAction === 'return' && (
            <Button
              onClick={() => onSendBackToModerator(adminNotes)}
              disabled={!adminNotes}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                color: 'white',
                opacity: !adminNotes ? 0.5 : 1
              }}
            >
              <AlertCircle className="w-4 h-4 mr-2" />Return to Moderator
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

