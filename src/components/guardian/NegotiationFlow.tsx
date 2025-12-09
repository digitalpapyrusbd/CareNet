import { ArrowLeft, Send, Clock, Check, X, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface NegotiationFlowProps {
  stage: 'send' | 'waiting' | 'review';
  packageId: string;
  packageName: string;
  originalPrice: number;
  agencyName: string;
  onBack: () => void;
  onSendOffer?: (data: any) => void;
  onAcceptOffer?: () => void;
  onRejectOffer?: () => void;
  onCounterOffer?: () => void;
}

export function NegotiationFlow({
  stage,
  packageId,
  packageName,
  originalPrice,
  agencyName,
  onBack,
  onSendOffer,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer
}: NegotiationFlowProps) {
  const [proposedPrice, setProposedPrice] = useState("");
  const [notes, setNotes] = useState("");

  const agencyResponse = {
    counterPrice: 32000,
    message: "We appreciate your interest. We can offer this package at ৳32,000, which includes all premium services. This is our best offer considering the quality of care provided.",
    respondedAt: "2 hours ago"
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Package Header */}
        <div className="finance-card p-6 mb-6">
          <h2 className="mb-2" style={{ color: '#535353' }}>{packageName}</h2>
          <p className="text-sm mb-3" style={{ color: '#848484' }}>{agencyName}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#848484' }}>Original Price:</span>
            <span className="text-xl" style={{ color: '#535353' }}>৳{originalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Stage: Send Counter-Offer */}
        {stage === 'send' && (
          <div className="space-y-6">
            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>Send Counter-Offer</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" style={{ color: '#535353' }}>Your Proposed Price *</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#848484' }}>৳</span>
                    <Input
                      id="price"
                      type="number"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      placeholder="30000"
                      className="pl-8 bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                  </div>
                  {proposedPrice && (
                    <p className="text-sm mt-2" style={{ color: originalPrice - Number(proposedPrice) > 0 ? '#7CE577' : '#FF6B7A' }}>
                      {originalPrice - Number(proposedPrice) > 0 ? '-' : '+'}৳{Math.abs(originalPrice - Number(proposedPrice)).toLocaleString()} from original
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes" style={{ color: '#535353' }}>Message to Agency (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Explain your offer or any special requirements..."
                    className="mt-2 bg-white/50 border-white/50 min-h-24"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ background: 'rgba(142, 197, 252, 0.1)' }}
            >
              <p className="text-sm" style={{ color: '#535353' }}>
                💡 <strong>Negotiation Tips:</strong> Agencies typically respond within 24-48 hours. Be reasonable with your offer to increase chances of acceptance.
              </p>
            </div>

            <Button
              onClick={() => onSendOffer?.({ proposedPrice: Number(proposedPrice), notes })}
              disabled={!proposedPrice}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: !proposedPrice ? 0.5 : 1
              }}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Counter-Offer
            </Button>
          </div>
        )}

        {/* Stage: Waiting for Response */}
        {stage === 'waiting' && (
          <div className="space-y-6">
            <div className="text-center py-12 finance-card">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                }}
              >
                <Clock className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="mb-2" style={{ color: '#535353' }}>Waiting for Agency Response</h2>
              <p style={{ color: '#848484' }}>
                Your counter-offer has been sent to {agencyName}
              </p>
            </div>

            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>Your Offer</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Original Price:</span>
                  <span style={{ color: '#535353' }}>৳{originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Your Offer:</span>
                  <span style={{ color: '#FFB3C1' }}>৳{proposedPrice || '30,000'}</span>
                </div>
                <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                  <span style={{ color: '#848484' }}>Potential Savings:</span>
                  <span style={{ color: '#7CE577' }}>৳{(originalPrice - Number(proposedPrice || 30000)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ background: 'rgba(255, 211, 128, 0.1)' }}
            >
              <p className="text-sm" style={{ color: '#535353' }}>
                ⏱️ Agencies typically respond within 24-48 hours. You'll receive a notification when they respond.
              </p>
            </div>
          </div>
        )}

        {/* Stage: Review Agency Response */}
        {stage === 'review' && (
          <div className="space-y-6">
            <div className="finance-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" style={{ color: '#5B9FFF' }} />
                <h3 style={{ color: '#535353' }}>Agency Response</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#848484' }}>
                Received {agencyResponse.respondedAt}
              </p>
              <p className="mb-4" style={{ color: '#535353' }}>
                {agencyResponse.message}
              </p>
            </div>

            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>Price Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Original Price:</span>
                  <span style={{ color: '#535353' }}>৳{originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Your Offer:</span>
                  <span style={{ color: '#848484' }}>৳{proposedPrice || '30,000'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Agency Counter:</span>
                  <span style={{ color: '#FFB3C1' }}>৳{agencyResponse.counterPrice.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                  <span style={{ color: '#848484' }}>Your Savings:</span>
                  <span style={{ color: '#7CE577' }}>৳{(originalPrice - agencyResponse.counterPrice).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onRejectOffer}
                variant="outline"
                className="bg-white/50 border-white/50"
                style={{ color: '#FF6B7A' }}
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={onAcceptOffer}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                  color: 'white'
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Offer
              </Button>
            </div>

            <Button
              onClick={onCounterOffer}
              variant="outline"
              className="w-full bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Send Another Counter-Offer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
