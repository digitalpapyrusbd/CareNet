import { Building, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface AgencyApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  submittedDate: string;
  status: 'pending' | 'under_review';
  documents: {
    tradeLicense: boolean;
    tin: boolean;
  };
}

interface AgencyReviewQueueProps {
  applications: AgencyApplication[];
  onReview: (id: string) => void;
}

export function AgencyReviewQueue({ applications, onReview }: AgencyReviewQueueProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review'>('all');

  const filteredApplications = applications.filter(app => filter === 'all' || app.status === filter);

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Agency Review Queue</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'under_review'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Building className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No applications in queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div key={app.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: '#535353' }}>{app.companyName}</h3>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>{app.contactPerson}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>{app.phone}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full capitalize"
                    style={{
                      background: app.status === 'pending' ? 'rgba(255, 209, 128, 0.2)' : 'rgba(142, 197, 252, 0.2)',
                      color: app.status === 'pending' ? '#FFD180' : '#5B9FFF'
                    }}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    {app.documents.tradeLicense ? (
                      <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                    ) : (
                      <XCircle className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                    )}
                    <span style={{ color: '#535353' }}>Trade License</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {app.documents.tin ? (
                      <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                    ) : (
                      <AlertCircle className="w-4 h-4" style={{ color: '#FFD180' }} />
                    )}
                    <span style={{ color: '#535353' }}>TIN (Optional)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/50">
                  <p className="text-xs" style={{ color: '#848484' }}>Submitted: {app.submittedDate}</p>
                  <Button onClick={() => onReview(app.id)} size="sm"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                    <Eye className="w-4 h-4 mr-2" />Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

