import { MessageSquare, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Feedback {
  id: string;
  guardianName: string;
  jobReference: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'responded';
}

interface FeedbackQueueProps {
  feedbacks: Feedback[];
  onRespond: (id: string) => void;
  onView: (id: string) => void;
}

export function FeedbackQueue({ feedbacks, onRespond, onView }: FeedbackQueueProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('all');

  const filteredFeedbacks = feedbacks.filter(f => 
    filter === 'all' || f.status === filter
  );

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Feedback Queue</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'responded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm"
              style={{
                background: filter === f 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        <div className="space-y-3">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p style={{ color: '#535353' }}>{feedback.guardianName}</p>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: feedback.status === 'pending' ? 'rgba(255, 179, 193, 0.2)' : 'rgba(124, 229, 119, 0.2)',
                        color: feedback.status === 'pending' ? '#FF8FA3' : '#7CE577'
                      }}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>Job: {feedback.jobReference}</p>
                  <p className="text-sm mb-2" style={{ color: '#535353' }}>{feedback.message}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{feedback.timestamp}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => onView(feedback.id)} variant="outline" className="bg-white/50 border-white/50">
                  View
                </Button>
                {feedback.status === 'pending' && (
                  <Button onClick={() => onRespond(feedback.id)}
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                    Respond
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredFeedbacks.length === 0 && (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>No feedback in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

