import { Star, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface RateGuardianProps {
  guardianName: string;
  jobId: string;
  onSubmit: (data: any) => void;
  onSkip: () => void;
}

export function RateGuardian({ guardianName, jobId, onSubmit, onSkip }: RateGuardianProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="mb-4 text-center" style={{ color: '#535353' }}>Rate Guardian</h2>
        <p className="mb-6 text-center" style={{ color: '#848484' }}>{guardianName}</p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <Star className="w-10 h-10" style={{
                color: star <= rating ? '#FFD54F' : '#E0E0E0',
                fill: star <= rating ? '#FFD54F' : 'none'
              }} />
            </button>
          ))}
        </div>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Comments (optional)..."
          className="mb-6 bg-white/50 border-white/50"
          style={{ color: '#535353' }}
        />

        <div className="flex gap-3">
          <Button onClick={onSkip} variant="outline" className="flex-1 bg-white/50 border-white/50">Skip</Button>
          <Button onClick={() => onSubmit({ rating, feedback })} disabled={!rating} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Send className="w-4 h-4 mr-2" />Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

