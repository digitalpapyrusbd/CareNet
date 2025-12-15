import { AlertTriangle, Send, CheckCircle, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface DisputeDetailProps {
  dispute: {
    id: string;
    title: string;
    type: string;
    parties: {
      complainant: { name: string; role: string };
      respondent: { name: string; role: string };
    };
    description: string;
    messages: {
      sender: string;
      message: string;
      timestamp: string;
    }[];
  };
  onResolve: (resolution: string) => void;
  onEscalate: (notes: string) => void;
  onSendMessage: (message: string) => void;
}

export function DisputeDetail({ dispute, onResolve, onEscalate, onSendMessage }: DisputeDetailProps) {
  const [message, setMessage] = useState("");
  const [resolution, setResolution] = useState("");
  const [escalationNotes, setEscalationNotes] = useState("");
  const [action, setAction] = useState<'message' | 'resolve' | 'escalate' | null>(null);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>{dispute.title}</h1>
          <p style={{ color: '#848484' }}>Dispute #{dispute.id}</p>
        </div>

        {/* Parties */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Parties Involved</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Complainant</p>
              <p style={{ color: '#535353' }}>{dispute.parties.complainant.name}</p>
              <p className="text-sm" style={{ color: '#848484' }}>{dispute.parties.complainant.role}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Respondent</p>
              <p style={{ color: '#535353' }}>{dispute.parties.respondent.name}</p>
              <p className="text-sm" style={{ color: '#848484' }}>{dispute.parties.respondent.role}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Description</h3>
          <p style={{ color: '#535353' }}>{dispute.description}</p>
        </div>

        {/* Messages */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Communication Thread</h3>
          <div className="space-y-3 mb-4">
            {dispute.messages.map((msg, index) => (
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
              <Button onClick={() => setAction('message')} variant="outline" className="bg-white/50 border-white/50">
                <Send className="w-4 h-4 mr-2" />Send Message
              </Button>
              <Button onClick={() => setAction('resolve')} style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}>
                <CheckCircle className="w-4 h-4 mr-2" />Resolve
              </Button>
              <Button onClick={() => setAction('escalate')} style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                color: 'white'
              }}>
                <ArrowUp className="w-4 h-4 mr-2" />Escalate
              </Button>
            </div>
          )}

          {action === 'message' && (
            <div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-white/50 border-white/50 mb-3"
                style={{ color: '#535353' }}
              />
              <div className="flex gap-2">
                <Button onClick={() => { onSendMessage(message); setMessage(""); setAction(null); }} disabled={!message}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                    color: 'white',
                    opacity: !message ? 0.5 : 1
                  }}>
                  Send
                </Button>
                <Button onClick={() => setAction(null)} variant="outline" className="bg-white/50 border-white/50">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {action === 'resolve' && (
            <div>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter resolution details..."
                className="bg-white/50 border-white/50 mb-3"
                style={{ color: '#535353' }}
              />
              <div className="flex gap-2">
                <Button onClick={() => { onResolve(resolution); setResolution(""); setAction(null); }} disabled={!resolution}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                    color: 'white',
                    opacity: !resolution ? 0.5 : 1
                  }}>
                  Confirm Resolution
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
                placeholder="Why are you escalating this dispute to admin?"
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

