import { useState } from "react";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PasswordResetProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'phone' | 'otp' | 'newPassword' | 'success';

export function PasswordReset({ onBack, onComplete }: PasswordResetProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(60);

  const handleSendCode = () => {
    // Validate phone
    console.log("Sending reset code to:", phone);
    setStep('otp');
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = () => {
    // Verify OTP
    console.log("Verifying OTP:", otp);
    setStep('newPassword');
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Resetting password");
    setStep('success');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div 
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
          boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
        }}
      >
        <Lock className="w-10 h-10 text-white" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        {/* Back Button */}
        {step === 'phone' && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        )}

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <>
            <h2 className="text-center mb-2" style={{ color: '#535353' }}>Reset Password</h2>
            <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
              Enter your phone number to receive a reset code
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/50 border-white/50 placeholder:text-gray-400"
                  style={{ color: '#535353' }}
                />
              </div>

              <Button
                onClick={handleSendCode}
                className="w-full"
                size="lg"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Send Reset Code
              </Button>
            </div>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <>
            <h2 className="text-center mb-2" style={{ color: '#535353' }}>Verify Code</h2>
            <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
              Enter the 6-digit code sent to {phone}
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" style={{ color: '#535353' }}>Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-white/50 border-white/50 placeholder:text-gray-400 text-center text-lg tracking-widest"
                  style={{ color: '#535353' }}
                />
                <p className="text-xs text-center" style={{ color: '#848484' }}>
                  {countdown > 0 ? (
                    `Resend code in ${countdown}s`
                  ) : (
                    <button className="hover:underline" style={{ color: '#FFB3C1' }}>
                      Resend Code
                    </button>
                  )}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6}
                className="w-full"
                size="lg"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                  color: 'white',
                  border: 'none',
                  opacity: otp.length !== 6 ? 0.5 : 1
                }}
              >
                Verify Code
              </Button>
            </div>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'newPassword' && (
          <>
            <h2 className="text-center mb-2" style={{ color: '#535353' }}>Create New Password</h2>
            <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
              Choose a strong password for your account
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" style={{ color: '#535353' }}>New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/50 border-white/50 placeholder:text-gray-400"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: '#535353' }}>Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/50 border-white/50 placeholder:text-gray-400"
                  style={{ color: '#535353' }}
                />
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={!newPassword || !confirmPassword}
                className="w-full"
                size="lg"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                  color: 'white',
                  border: 'none',
                  opacity: (!newPassword || !confirmPassword) ? 0.5 : 1
                }}
              >
                Reset Password
              </Button>
            </div>
          </>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)'
              }}
            >
              <Check className="w-10 h-10 text-white" />
            </div>

            <h2 className="mb-2" style={{ color: '#535353' }}>Password Reset Successful</h2>
            <p className="text-sm" style={{ color: '#848484' }}>
              Redirecting you to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
