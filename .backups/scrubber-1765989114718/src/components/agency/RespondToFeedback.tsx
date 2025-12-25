import { MessageSquare, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface RespondToFeedbackProps {
  feedback: {
    id: string;
    guardianName: string;
    jobReference: string;
    message: string;
    timestamp: string;
  };
  onSubmit: (response: string) => void;
  onCancel: () => void;
}

export function RespondToFeedback({ feedback, onSubmit, onCancel }: RespondToFeedbackProps) {
  const [response, setResponse] = useState("");

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Respond to Feedback</h1>

        {/* Original Feedback */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Original Feedback</h3>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="mb-1" style={{ color: '#535353' }}>{feedback.guardianName}</p>
              <p className="text-sm mb-2" style={{ color: '#848484' }}>Job: {feedback.jobReference}</p>
              <p className="text-sm mb-2" style={{ color: '#535353' }}>{feedback.message}</p>
              <p className="text-xs" style={{ color: '#848484' }}>{feedback.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Response Form */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Your Response</h3>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here..."
            className="bg-white/50 border-white/50 min-h-[150px]"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button 
            onClick={() => onSubmit(response)}
            disabled={!response.trim()}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: !response.trim() ? 0.5 : 1
            }}
          >
            <Send className="w-4 h-4 mr-2" />Send Response
          </Button>
        </div>
      </div>
    </div>
  );
}

