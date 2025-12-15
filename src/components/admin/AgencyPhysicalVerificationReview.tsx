import { MapPin, CheckCircle, XCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface AgencyPhysicalVerificationReviewProps {
  submissionId: string;
  agencyName: string;
  address: string;
  moderatorName: string;
  moderatorDecision: 'approve' | 'reject';
  moderatorNotes: string;
  photos: string[];
  onApprove: (notes: string) => void;
  onReject: (notes: string) => void;
  onSendBackToModerator: (notes: string) => void;
}

export function AgencyPhysicalVerificationReview({
  submissionId,
  agencyName,
  address,
  moderatorName,
  moderatorDecision,
  moderatorNotes,
  photos,
  onApprove,
  onReject,
  onSendBackToModerator
}: AgencyPhysicalVerificationReviewProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'return' | null>(null);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Physical Verification Review</h1>
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

        {/* Location Information */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Location Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="mb-1" style={{ color: '#535353' }}>{agencyName}</p>
                <p className="text-sm" style={{ color: '#848484' }}>{address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Photos */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Verification Photos</h3>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8" style={{ color: '#848484' }} />
                </div>
              </div>
            ))}
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

