import { useState } from 'react';
import { ArrowLeft, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

interface CaregiverRegistrationProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function CaregiverRegistration({ onNavigate, onBack }: CaregiverRegistrationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = () => {
    // Auto-proceed to Step 2 (OTP Verification)
    onNavigate?.('caregiver-registration-2');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onBack?.()}
          className="mb-6 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
              boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
            }}
          >
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Caregiver Registration</h1>
          <p style={{ color: '#848484' }}>Step 1 of 6: Account Setup</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(132, 132, 132, 0.1)' }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: '16.67%',
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)'
            }}
          />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4">
        {/* Phone Number */}
        <div>
          <label className="block mb-2 text-sm" style={{ color: '#535353' }}>
            Phone Number *
          </label>
          <div className="flex gap-2">
            <div className="finance-card px-4 py-3 flex items-center" style={{ width: '80px' }}>
              <span style={{ color: '#535353' }}>+880</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1712345678"
              className="flex-1 finance-card px-4 py-3"
              style={{ color: '#535353', outline: 'none' }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#848484' }}>
            Enter your Bangladesh mobile number
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm" style={{ color: '#535353' }}>
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              className="w-full finance-card px-4 py-3 pr-12"
              style={{ color: '#535353', outline: 'none' }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: '#848484' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: '#848484' }}>
            Minimum 8 characters, include uppercase, lowercase & number
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-2 text-sm" style={{ color: '#535353' }}>
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full finance-card px-4 py-3 pr-12"
              style={{ color: '#535353', outline: 'none' }}
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: '#848484' }}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="finance-card p-4" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <p className="text-sm" style={{ color: '#848484' }}>
            💡 <strong>Why become a verified caregiver?</strong>
          </p>
          <ul className="text-xs mt-2 space-y-1" style={{ color: '#848484' }}>
            <li>✓ Access to 1000+ verified families</li>
            <li>✓ Secure payment through platform</li>
            <li>✓ Training & certification support</li>
            <li>✓ Flexible work schedule</li>
          </ul>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        className="w-full py-6 mt-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
          color: 'white',
          boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
        }}
      >
        Continue to Verification
      </Button>
    </div>
  );
}
