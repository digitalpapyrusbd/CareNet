import { AlertTriangle, User, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface DisputeCenterEscalatedProps {
  disputes: {
    id: string;
    title: string;
    type: 'payment' | 'service' | 'behavior' | 'contract' | 'other';
    parties: {
      complainant: { name: string; role: string };
      respondent: { name: string; role: string };
    };
    moderatorName: string;
    moderatorNotes: string;
    escalatedDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }[];
  onResolve: (disputeId: string, resolution: string) => void;
  onViewDetails: (disputeId: string) => void;
}

export function DisputeCenterEscalated({ disputes, onResolve, onViewDetails }: DisputeCenterEscalatedProps) {
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF6B7A';
      case 'high': return '#FF8FA3';
      case 'medium': return '#FFD180';
      default: return '#5B9FFF';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'payment': 'Payment Dispute',
      'service': 'Service Quality',
      'behavior': 'Behavior/Conduct',
      'contract': 'Contract Violation',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Escalated Disputes</h1>

        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${getPriorityColor(dispute.priority)}33` }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: getPriorityColor(dispute.priority) }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 style={{ color: '#535353' }}>{dispute.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs uppercase"
                        style={{
                          background: `${getPriorityColor(dispute.priority)}33`,
                          color: getPriorityColor(dispute.priority)
                        }}>
                        {dispute.priority}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#848484' }}>{getTypeLabel(dispute.type)}</p>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        <p className="text-xs mb-1" style={{ color: '#848484' }}>Complainant</p>
                        <p className="text-sm" style={{ color: '#535353' }}>{dispute.parties.complainant.name}</p>
                        <p className="text-xs" style={{ color: '#848484' }}>{dispute.parties.complainant.role}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        <p className="text-xs mb-1" style={{ color: '#848484' }}>Respondent</p>
                        <p className="text-sm" style={{ color: '#535353' }}>{dispute.parties.respondent.name}</p>
                        <p className="text-xs" style={{ color: '#848484' }}>{dispute.parties.respondent.role}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Moderator Notes</p>
                      <p className="text-sm" style={{ color: '#535353' }}>{dispute.moderatorNotes}</p>
                      <p className="text-xs mt-1" style={{ color: '#848484' }}>— {dispute.moderatorName}</p>
                    </div>

                    {selectedDispute === dispute.id && (
                      <div className="mt-4">
                        <Textarea
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          placeholder="Enter your resolution decision and notes..."
                          className="bg-white/50 border-white/50 mb-3"
                          style={{ color: '#535353' }}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              onResolve(dispute.id, resolution);
                              setSelectedDispute(null);
                              setResolution("");
                            }}
                            disabled={!resolution}
                            style={{
                              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                              color: 'white',
                              opacity: !resolution ? 0.5 : 1
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />Submit Resolution
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedDispute(null);
                              setResolution("");
                            }}
                            variant="outline"
                            className="bg-white/50 border-white/50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDispute !== dispute.id && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onViewDetails(dispute.id)}
                      variant="outline"
                      className="bg-white/50 border-white/50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />View Thread
                    </Button>
                    <Button
                      onClick={() => setSelectedDispute(dispute.id)}
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                        color: 'white'
                      }}
                    >
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {disputes.length === 0 && (
            <div className="finance-card p-12 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#7CE577' }} />
              <p style={{ color: '#848484' }}>No escalated disputes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

