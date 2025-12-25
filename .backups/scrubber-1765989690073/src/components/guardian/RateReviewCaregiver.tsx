import { X, Star, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface RateReviewCaregiverProps {
  caregiverName: string;
  jobId: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function RateReviewCaregiver({ caregiverName, jobId, onClose, onSubmit }: RateReviewCaregiverProps) {
  const { t } = useTranslationContext();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);

  const qualities = [
    "Professional", "Punctual", "Caring", "Skilled", "Patient",
    "Communicative", "Trustworthy", "Attentive", "Friendly"
  ];

  const handleSubmit = () => {
    onSubmit({
      rating,
      review,
      qualities: selectedQualities,
      jobId
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl finance-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ color: '#535353' }}>{t('ratereviewcaregiver.heading.ratereview')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
            style={{ color: '#848484' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="mb-4" style={{ color: '#535353' }}>{t('ratereviewcaregiver.text.howwasyourexperience')}</p>
          <p className="text-lg" style={{ color: '#535353' }}><strong>{caregiverName}</strong></p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className="w-10 h-10"
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
            <p style={{ color: '#535353' }}>
              {rating === 5 && "Excellent! 🌟"}
              {rating === 4 && "Very Good! 👍"}
              {rating === 3 && "Good 👌"}
              {rating === 2 && "Fair 😐"}
              {rating === 1 && "Needs Improvement 👎"}
            </p>
          </div>
        )}

        {/* Qualities */}
        <div className="mb-6">
          <p className="text-sm mb-3" style={{ color: '#848484' }}>What did you like? (Optional)</p>
          <div className="flex flex-wrap gap-2">
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
                className="text-sm px-3 py-1 rounded-full transition-colors"
                style={{
                  background: selectedQualities.includes(quality)
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: selectedQualities.includes(quality) ? 'white' : '#535353'
                }}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>

        {/* Written Review */}
        <div className="mb-6">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Share more details (Optional)</p>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={t('ratereviewcaregiver.placeholder.tellusaboutyourexper')}
            className="bg-white/50 border-white/50 min-h-24"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full"
          size="lg"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white',
            opacity: rating === 0 ? 0.5 : 1
          }}
        >
          <Send className="w-5 h-5 mr-2" />
          Submit Review
        </Button>

        <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
          Your review helps others find quality caregivers
        </p>
      </div>
    </div>
  );
}
