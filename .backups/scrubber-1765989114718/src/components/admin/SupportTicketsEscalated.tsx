import { HelpCircle, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface SupportTicketsEscalatedProps {
  tickets: {
    id: string;
    title: string;
    category: 'technical' | 'billing' | 'account' | 'verification' | 'other';
    submitterName: string;
    submitterRole: string;
    moderatorName: string;
    moderatorNotes: string;
    escalatedDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }[];
  onResolve: (ticketId: string, response: string) => void;
  onViewThread: (ticketId: string) => void;
}

export function SupportTicketsEscalated({ tickets, onResolve, onViewThread }: SupportTicketsEscalatedProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF6B7A';
      case 'high': return '#FF8FA3';
      case 'medium': return '#FFD180';
      default: return '#5B9FFF';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'technical': 'Technical Issue',
      'billing': 'Billing/Payment',
      'account': 'Account Issue',
      'verification': 'Verification',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Escalated Support Tickets</h1>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${getPriorityColor(ticket.priority)}33` }}>
                    <HelpCircle className="w-5 h-5" style={{ color: getPriorityColor(ticket.priority) }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 style={{ color: '#535353' }}>{ticket.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs uppercase"
                        style={{
                          background: `${getPriorityColor(ticket.priority)}33`,
                          color: getPriorityColor(ticket.priority)
                        }}>
                        {ticket.priority}
                      </span>
                    </div>

                    <p className="text-sm mb-3" style={{ color: '#848484' }}>
                      {getCategoryLabel(ticket.category)} • {ticket.submitterName} ({ticket.submitterRole})
                    </p>

                    <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Moderator Notes</p>
                      <p className="text-sm" style={{ color: '#535353' }}>{ticket.moderatorNotes}</p>
                      <p className="text-xs mt-1" style={{ color: '#848484' }}>— {ticket.moderatorName} • Escalated {ticket.escalatedDate}</p>
                    </div>

                    {selectedTicket === ticket.id && (
                      <div className="mt-4">
                        <Textarea
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Enter your response..."
                          className="bg-white/50 border-white/50 mb-3"
                          style={{ color: '#535353' }}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              onResolve(ticket.id, response);
                              setSelectedTicket(null);
                              setResponse("");
                            }}
                            disabled={!response}
                            style={{
                              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                              color: 'white',
                              opacity: !response ? 0.5 : 1
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />Resolve & Send
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedTicket(null);
                              setResponse("");
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

                {selectedTicket !== ticket.id && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onViewThread(ticket.id)}
                      variant="outline"
                      className="bg-white/50 border-white/50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />View Thread
                    </Button>
                    <Button
                      onClick={() => setSelectedTicket(ticket.id)}
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                        color: 'white'
                      }}
                    >
                      Respond
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="finance-card p-12 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#7CE577' }} />
              <p style={{ color: '#848484' }}>No escalated tickets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

