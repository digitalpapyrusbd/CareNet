import { Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface PatientLoginProps {
  onLogin: (phone: string, pin: string) => void;
  onForgotPin: () => void;
}

export function PatientLogin({ onLogin, onForgotPin }: PatientLoginProps) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !pin) {
      setError("Please enter both phone number and PIN");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setError("");
    onLogin(phone, pin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Patient Login</h1>
          <p style={{ color: '#848484' }}>Enter your credentials to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="finance-card p-8">
          <div className="space-y-5">
            {/* Phone Number */}
            <div>
              <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  className="pl-10 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <Label htmlFor="pin" style={{ color: '#535353' }}>4-Digit PIN</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  placeholder="••••"
                  maxLength={4}
                  className="pl-10 pr-10 bg-white/50 border-white/50 text-center text-2xl tracking-widest"
                  style={{ color: '#535353' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#848484' }}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: 'rgba(255, 107, 122, 0.1)' }}
              >
                <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#FF6B7A' }} />
                <p className="text-sm" style={{ color: '#FF6B7A' }}>{error}</p>
              </div>
            )}

            {/* Forgot PIN */}
            <button
              type="button"
              onClick={onForgotPin}
              className="text-sm hover:underline"
              style={{ color: '#5B9FFF' }}
            >
              Forgot PIN?
            </button>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              Login
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ background: 'rgba(142, 197, 252, 0.1)' }}
        >
          <p className="text-sm text-center" style={{ color: '#535353' }}>
            💡 Your guardian can help you reset your PIN if needed
          </p>
        </div>
      </div>
    </div>
  );
}
