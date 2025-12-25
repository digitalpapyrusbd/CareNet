import { FileText, CheckCircle, XCircle, Download, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface CertificateReviewProps {
  submission: {
    caregiverId: string;
    caregiverName: string;
    submittedDate: string;
    certificates: Array<{
      id: string;
      type: string;
      fileName: string;
      fileUrl: string;
    }>;
  };
  onApprove: () => void;
  onReject: (reason: string) => void;
  onSendBack: (feedback: string) => void;
}

export function CertificateReview({ submission, onApprove, onReject, onSendBack }: CertificateReviewProps) {
  const [action, setAction] = useState<'approve' | 'reject' | 'sendback' | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove();
    } else if (action === 'reject') {
      onReject(feedback);
    } else if (action === 'sendback') {
      onSendBack(feedback);
    }
    setAction(null);
    setFeedback("");
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-2" style={{ color: '#535353' }}>Certificate Review</h1>
        <p className="mb-6" style={{ color: '#848484' }}>{submission.caregiverName}</p>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Submitted Certificates</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Submitted on {submission.submittedDate}</p>
            </div>
          </div>

          <div className="space-y-3">
            {submission.certificates.map((cert) => (
              <div key={cert.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(142, 197, 252, 0.2)' }}>
                    <FileText className="w-5 h-5" style={{ color: '#5B9FFF' }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ color: '#535353' }}>{cert.type}</h4>
                    <p className="text-xs" style={{ color: '#848484' }}>{cert.fileName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-white/50 border-white/50"
                    onClick={() => window.open(cert.fileUrl, '_blank')}>
                    <Eye className="w-4 h-4 mr-2" />View
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/50 border-white/50">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {action ? (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>
              {action === 'approve' && 'Confirm Approval'}
              {action === 'reject' && 'Rejection Reason'}
              {action === 'sendback' && 'Feedback for Caregiver'}
            </h3>
            {action !== 'approve' && (
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={action === 'reject' ? 'Explain why certificates are rejected...' : 'Provide feedback for improvement...'}
                className="mb-4 bg-white/50 border-white/50"
                rows={4}
              />
            )}
            <div className="flex gap-3">
              <Button onClick={() => setAction(null)} variant="outline" className="flex-1 bg-white/50 border-white/50">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={action !== 'approve' && !feedback.trim()} className="flex-1"
                style={{ 
                  background: action === 'approve' 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                    : action === 'reject'
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                    : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)',
                  color: 'white'
                }}>
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Review Decision</h3>
            <div className="space-y-3">
              <Button onClick={() => setAction('approve')} className="w-full"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                <CheckCircle className="w-4 h-4 mr-2" />Approve Certificates
              </Button>
              <Button onClick={() => setAction('sendback')} variant="outline" className="w-full bg-white/50 border-white/50">
                Send Back for Revision
              </Button>
              <Button onClick={() => setAction('reject')} variant="outline" className="w-full bg-white/50 border-white/50">
                <XCircle className="w-4 h-4 mr-2" />Reject Certificates
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

