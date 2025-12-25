import { Shield, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface CaregiverPoliceClearanceReviewProps {
  submissionId: string;
  caregiverName: string;
  moderatorName: string;
  moderatorDecision: 'approve' | 'reject';
  moderatorNotes: string;
  clearance: {
    certificateNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
    documentUrl: string;
  };
  onApprove: (notes: string) => void;
  onReject: (notes: string) => void;
  onSendBackToModerator: (notes: string) => void;
}

export function CaregiverPoliceClearanceReview({
  submissionId,
  caregiverName,
  moderatorName,
  moderatorDecision,
  moderatorNotes,
  clearance,
  onApprove,
  onReject,
  onSendBackToModerator
}: CaregiverPoliceClearanceReviewProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'return' | null>(null);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Police Clearance Review</h1>
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

        {/* Caregiver Information */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Caregiver Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Caregiver Name:</span>
              <span style={{ color: '#535353' }}>{caregiverName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Submission ID:</span>
              <span style={{ color: '#535353' }}>#{submissionId}</span>
            </div>
          </div>
        </div>

        {/* Police Clearance Details */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Police Clearance Certificate</h3>
          
          <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" style={{ color: '#5B9FFF' }} />
                <h4 style={{ color: '#535353' }}>Certificate Details</h4>
              </div>
              <Button size="sm" variant="outline" className="bg-white/50 border-white/50">
                <FileText className="w-4 h-4 mr-2" />View Document
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>Certificate Number</p>
                <p style={{ color: '#535353' }}>{clearance.certificateNumber}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>Issuing Authority</p>
                <p style={{ color: '#535353' }}>{clearance.issuingAuthority}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>Issue Date</p>
                <p style={{ color: '#535353' }}>{clearance.issueDate}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>Expiry Date</p>
                <p style={{ color: '#535353' }}>{clearance.expiryDate}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ background: 'rgba(91, 159, 255, 0.1)' }}>
            <p className="text-xs" style={{ color: '#5B9FFF' }}>
              ℹ️ Verify certificate authenticity with issuing authority if needed
            </p>
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

