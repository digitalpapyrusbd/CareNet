import { FileText, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";

interface LegalDoc {
  id: string;
  agencyName: string;
  documentType: 'trade_license' | 'tin_certificate' | 'company_registration';
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
}

interface AgencyLegalDocQueueProps {
  documents: LegalDoc[];
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function AgencyLegalDocQueue({ documents, onReview, onApprove, onReject }: AgencyLegalDocQueueProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'under_review': return Clock;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#7CE577';
      case 'rejected': return '#FF6B7A';
      case 'under_review': return '#5B9FFF';
      default: return '#FFD180';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'trade_license': return 'Trade License';
      case 'tin_certificate': return 'TIN Certificate';
      case 'company_registration': return 'Company Registration';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Legal Document Queue</h1>

        <div className="space-y-3">
          {documents.map((doc) => {
            const StatusIcon = getStatusIcon(doc.status);
            const statusColor = getStatusColor(doc.status);

            return (
              <div key={doc.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <StatusIcon className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{doc.agencyName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>
                      {getDocumentTypeLabel(doc.documentType)}
                    </p>
                    <p className="text-xs" style={{ color: '#848484' }}>
                      Submitted: {doc.submittedDate}
                    </p>
                    {doc.reviewedBy && (
                      <p className="text-xs mt-1" style={{ color: '#848484' }}>
                        Reviewed by: {doc.reviewedBy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => onReview(doc.id)} variant="outline" className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  {doc.status === 'pending' && (
                    <>
                      <Button onClick={() => onApprove(doc.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-1" />Approve
                      </Button>
                      <Button onClick={() => onReject(doc.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <XCircle className="w-4 h-4 mr-1" />Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {documents.length === 0 && (
            <div className="finance-card p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No documents in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

