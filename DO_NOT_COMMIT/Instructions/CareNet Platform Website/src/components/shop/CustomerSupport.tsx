import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface SupportTicket {
  id: string;
  customerName: string;
  orderId: string;
  subject: string;
  message: string;
  status: 'open' | 'responded' | 'resolved';
  submittedDate: string;
}

interface CustomerSupportProps {
  tickets: SupportTicket[];
  onRespond: (id: string, response: string) => void;
  onResolve: (id: string) => void;
}

export function CustomerSupport({ tickets, onRespond, onResolve }: CustomerSupportProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const handleSendResponse = (ticketId: string) => {
    if (response.trim()) {
      onRespond(ticketId, response);
      setResponse("");
      setSelectedTicket(null);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Customer Support</h1>

        {tickets.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No support tickets</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: ticket.status === 'open' 
                        ? 'rgba(255, 143, 163, 0.2)' 
                        : ticket.status === 'responded'
                        ? 'rgba(142, 197, 252, 0.2)'
                        : 'rgba(124, 229, 119, 0.2)'
                    }}>
                    <MessageSquare className="w-6 h-6" style={{ 
                      color: ticket.status === 'open' 
                        ? '#FF8FA3' 
                        : ticket.status === 'responded'
                        ? '#5B9FFF'
                        : '#7CE577'
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 style={{ color: '#535353' }}>{ticket.subject}</h3>
                        <p className="text-sm" style={{ color: '#848484' }}>{ticket.customerName}</p>
                        <p className="text-xs" style={{ color: '#848484' }}>Order #{ticket.orderId}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full capitalize"
                        style={{ 
                          background: ticket.status === 'open' 
                            ? 'rgba(255, 143, 163, 0.2)' 
                            : ticket.status === 'responded'
                            ? 'rgba(142, 197, 252, 0.2)'
                            : 'rgba(124, 229, 119, 0.2)',
                          color: ticket.status === 'open' 
                            ? '#FF8FA3' 
                            : ticket.status === 'responded'
                            ? '#5B9FFF'
                            : '#7CE577'
                        }}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-3 p-3 rounded-lg" style={{ 
                  color: '#535353',
                  background: 'rgba(255, 255, 255, 0.3)'
                }}>
                  {ticket.message}
                </p>

                {selectedTicket === ticket.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response..."
                      className="bg-white/50 border-white/50"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedTicket(null)} variant="outline"
                        className="flex-1 bg-white/50 border-white/50">
                        Cancel
                      </Button>
                      <Button onClick={() => handleSendResponse(ticket.id)} className="flex-1"
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <Send className="w-4 h-4 mr-2" />Send Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {ticket.status !== 'resolved' && (
                      <>
                        <Button onClick={() => setSelectedTicket(ticket.id)} size="sm" variant="outline"
                          className="flex-1 bg-white/50 border-white/50">
                          <MessageSquare className="w-4 h-4 mr-2" />Respond
                        </Button>
                        <Button onClick={() => onResolve(ticket.id)} size="sm"
                          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                          <CheckCircle className="w-4 h-4 mr-2" />Resolve
                        </Button>
                      </>
                    )}
                  </div>
                )}

                <p className="text-xs mt-2" style={{ color: '#848484' }}>Submitted: {ticket.submittedDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

