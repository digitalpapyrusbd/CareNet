import { AlertTriangle, Eye, Clock, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Dispute {
  id: string;
  type: 'payment' | 'service' | 'conduct' | 'other';
  reportedBy: string;
  reportedAgainst: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'investigating' | 'resolved';
  description: string;
}

interface DisputeResolutionProps {
  disputes: Dispute[];
  onReview: (id: string) => void;
}

export function DisputeResolution({ disputes, onReview }: DisputeResolutionProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'investigating' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high'>('all');

  const filteredDisputes = disputes.filter(d => {
    const statusMatch = filter === 'all' || d.status === filter;
    const priorityMatch = priorityFilter === 'all' || d.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'high': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      case 'medium': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      default: return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />;
    if (status === 'investigating') return <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />;
    return <AlertTriangle className="w-4 h-4" style={{ color: '#FF6B7A' }} />;
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Dispute Resolution</h1>

        <div className="flex gap-2 mb-3 overflow-x-auto">
          {['all', 'new', 'investigating', 'resolved'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'urgent', 'high'].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p as any)}
              className="px-3 py-1 rounded-lg capitalize text-xs whitespace-nowrap" style={{
                background: priorityFilter === p ? 'rgba(255, 107, 122, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                color: priorityFilter === p ? '#FF6B7A' : '#535353'
              }}>
              {p} priority
            </button>
          ))}
        </div>

        {filteredDisputes.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No disputes found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDisputes.map((dispute) => {
              const priorityStyle = getPriorityColor(dispute.priority);
              return (
                <div key={dispute.id} className="finance-card p-4"
                  style={{ borderLeft: `4px solid ${priorityStyle.text}` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: priorityStyle.bg }}>
                      <AlertTriangle className="w-6 h-6" style={{ color: priorityStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 style={{ color: '#535353' }}>Dispute #{dispute.id}</h3>
                        <span className="text-xs px-2 py-1 rounded-full capitalize"
                          style={{ background: priorityStyle.bg, color: priorityStyle.text }}>
                          {dispute.priority}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#848484' }}>{dispute.description}</p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#848484' }}>
                        <span>By: {dispute.reportedBy}</span>
                        <span>•</span>
                        <span>Against: {dispute.reportedAgainst}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/50">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dispute.status)}
                      <span className="text-xs capitalize" style={{ color: '#535353' }}>{dispute.status}</span>
                    </div>
                    <Button onClick={() => onReview(dispute.id)} size="sm"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                      <Eye className="w-4 h-4 mr-2" />Review
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

