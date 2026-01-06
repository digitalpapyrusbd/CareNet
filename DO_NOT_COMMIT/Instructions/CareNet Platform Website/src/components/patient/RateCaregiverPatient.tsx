import { Star, MessageSquare, X, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface RateCaregiverPatientProps {
  caregiverName?: string;
  onSubmit?: (rating: number, review: string) => void;
  onSkip?: () => void;
  onNavigate?: (page: string) => void;
}

export function RateCaregiverPatient({ caregiverName = "Rashida Begum", onSubmit, onSkip, onNavigate }: RateCaregiverPatientProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);

  const qualities = [
    "Kind", "Patient", "Helpful", "Friendly", "Professional", "Caring"
  ];

  const handleSubmit = () => {
    onSubmit?.(rating, feedback);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
            }}
          >
            <X className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Rate Your Caregiver</h1>
          <p style={{ color: '#848484' }}>How was {caregiverName}?</p>
        </div>

        <div className="finance-card p-8">
          {/* Star Rating */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="w-12 h-12"
                  style={{
                    color: star <= (hoveredRating || rating) ? '#FFD54F' : '#E0E0E0',
                    fill: star <= (hoveredRating || rating) ? '#FFD54F' : 'none'
                  }}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="text-center mb-6">
              <p className="text-xl" style={{ color: '#535353' }}>
                {rating === 5 && "Excellent! 🌟"}
                {rating === 4 && "Very Good! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Okay 😐"}
                {rating === 1 && "Not Good 👎"}
              </p>
            </div>
          )}

          {/* Qualities */}
          <div className="mb-6">
            <p className="text-sm mb-3 text-center" style={{ color: '#848484' }}>
              What did you like?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {qualities.map((quality) => (
                <button
                  key={quality}
                  onClick={() => {
                    if (selectedQualities.includes(quality)) {
                      setSelectedQualities(selectedQualities.filter(q => q !== quality));
                    } else {
                      setSelectedQualities([...selectedQualities, quality]);
                    }
                  }}
                  className="text-sm px-4 py-2 rounded-full transition-colors"
                  style={{
                    background: selectedQualities.includes(quality)
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: selectedQualities.includes(quality) ? 'white' : '#535353'
                  }}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <p className="text-sm mb-2" style={{ color: '#848484' }}>
              Any comments? (Optional)
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more..."
              className="bg-white/50 border-white/50 min-h-20"
              style={{ color: '#535353' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: rating === 0 ? 0.5 : 1
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}