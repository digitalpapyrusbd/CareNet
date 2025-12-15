import { HelpCircle, Send, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface TicketResponseProps {
  ticket: {
    id: string;
    title: string;
    category: string;
    submitterName: string;
    submitterRole: string;
    description: string;
    messages: {
      sender: string;
      message: string;
      timestamp: string;
    }[];
  };
  onSendResponse: (response: string) => void;
  onEscalate: (notes: string) => void;
  onResolve: () => void;
}

export function TicketResponse({ ticket, onSendResponse, onEscalate, onResolve }: TicketResponseProps) {
  const [response, setResponse] = useState("");
  const [escalationNotes, setEscalationNotes] = useState("");
  const [action, setAction] = useState<'respond' | 'escalate' | null>(null);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>{ticket.title}</h1>
          <p style={{ color: '#848484' }}>Ticket #{ticket.id}</p>
        </div>

        {/* Ticket Info */}
        <div className="finance-card p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Submitter</p>
              <p style={{ color: '#535353' }}>{ticket.submitterName}</p>
              <p className="text-xs" style={{ color: '#848484' }}>{ticket.submitterRole}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Category</p>
              <p style={{ color: '#535353' }}>{ticket.category}</p>
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <p style={{ color: '#535353' }}>{ticket.description}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Conversation</h3>
          <div className="space-y-3">
            {ticket.messages.map((msg, index) => (
              <div key={index} className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: '#535353' }}>{msg.sender}</span>
                  <span className="text-xs" style={{ color: '#848484' }}>{msg.timestamp}</span>
                </div>
                <p className="text-sm" style={{ color: '#535353' }}>{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Actions</h3>

          {!action && (
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => setAction('respond')} style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                color: 'white'
              }}>
                <Send className="w-4 h-4 mr-2" />Respond
              </Button>
              <Button onClick={onResolve} style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}>
                Mark Resolved
              </Button>
              <Button onClick={() => setAction('escalate')} style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                color: 'white'
              }}>
                <ArrowUp className="w-4 h-4 mr-2" />Escalate
              </Button>
            </div>
          )}

          {action === 'respond' && (
            <div>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response..."
                className="bg-white/50 border-white/50 mb-3"
                style={{ color: '#535353' }}
              />
              <div className="flex gap-2">
                <Button onClick={() => { onSendResponse(response); setResponse(""); setAction(null); }} disabled={!response}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                    color: 'white',
                    opacity: !response ? 0.5 : 1
                  }}>
                  Send Response
                </Button>
                <Button onClick={() => setAction(null)} variant="outline" className="bg-white/50 border-white/50">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {action === 'escalate' && (
            <div>
              <Textarea
                value={escalationNotes}
                onChange={(e) => setEscalationNotes(e.target.value)}
                placeholder="Why are you escalating this ticket?"
                className="bg-white/50 border-white/50 mb-3"
                style={{ color: '#535353' }}
              />
              <div className="flex gap-2">
                <Button onClick={() => { onEscalate(escalationNotes); setEscalationNotes(""); setAction(null); }} disabled={!escalationNotes}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                    color: 'white',
                    opacity: !escalationNotes ? 0.5 : 1
                  }}>
                  Escalate to Admin
                </Button>
                <Button onClick={() => setAction(null)} variant="outline" className="bg-white/50 border-white/50">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

