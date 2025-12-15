'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, ArrowLeftCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function AdminDecisionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [feedback, setFeedback] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<'approve' | 'send-back' | 'override-reject' | null>(null);

  const handleDecision = (decision: 'approve' | 'send-back' | 'override-reject') => {
    setSelectedDecision(decision);
  };

  const handleSubmit = () => {
    if (!selectedDecision) return;
    if ((selectedDecision === 'send-back' || selectedDecision === 'override-reject') && !feedback.trim()) {
      alert('Feedback notes are required for this decision');
      return;
    }
    
    console.log('Admin decision:', { submissionId: id, decision: selectedDecision, feedback });
    router.back();
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Admin Decision (3-Way)</h1>
            <p style={{ color: '#848484' }}>Make final decision on submission ID: {id}</p>
          </div>

          {/* Decision Options */}
          <div className="space-y-3 mb-6">
            <div
              className={`finance-card p-4 cursor-pointer transition-all ${
                selectedDecision === 'approve' ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => handleDecision('approve')}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedDecision === 'approve'
                      ? 'bg-green-500'
                      : 'bg-white/30'
                  }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 ${
                      selectedDecision === 'approve' ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>Approve</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Finalize and activate (moderator's recommendation accepted)
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`finance-card p-4 cursor-pointer transition-all ${
                selectedDecision === 'send-back' ? 'ring-2 ring-yellow-500' : ''
              }`}
              onClick={() => handleDecision('send-back')}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedDecision === 'send-back'
                      ? 'bg-yellow-500'
                      : 'bg-white/30'
                  }`}
                >
                  <ArrowLeftCircle
                    className={`w-5 h-5 ${
                      selectedDecision === 'send-back' ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>Send Back to Moderator</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Return with feedback for moderator to review again
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`finance-card p-4 cursor-pointer transition-all ${
                selectedDecision === 'override-reject' ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => handleDecision('override-reject')}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedDecision === 'override-reject'
                      ? 'bg-red-500'
                      : 'bg-white/30'
                  }`}
                >
                  <XCircle
                    className={`w-5 h-5 ${
                      selectedDecision === 'override-reject' ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>Override & Reject</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Reject regardless of moderator's recommendation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Notes (Required for send-back and override-reject) */}
          {(selectedDecision === 'send-back' || selectedDecision === 'override-reject') && (
            <div className="finance-card p-6 mb-6">
              <Label htmlFor="feedback" style={{ color: '#535353' }}>
                Feedback Notes * <span className="text-red-500">(Required)</span>
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback for the moderator..."
                className="mt-2 bg-white/50 border-white/50 min-h-[120px]"
                style={{ color: '#535353' }}
              />
              <p className="text-sm mt-2" style={{ color: '#848484' }}>
                This feedback will be sent to the moderator for review.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!selectedDecision || ((selectedDecision === 'send-back' || selectedDecision === 'override-reject') && !feedback.trim())}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit Decision
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
