import { useState, useRef, useEffect } from "react";
import { Shield, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface MFAVerificationProps {
  onVerify: (code: string) => void;
  onUseBackupCode: () => void;
  phoneNumber?: string;
}

export function MFAVerification({ onVerify, onUseBackupCode, phoneNumber }: MFAVerificationProps) {
  const { t } = useTranslationContext();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(digit => digit !== "") && index === 5) {
      onVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    
    if (pastedData.length === 6) {
      onVerify(pastedData);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div 
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
          boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)'
        }}
      >
        <Shield className="w-10 h-10 text-white" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="text-center mb-2" style={{ color: '#535353' }}>{t('mfaverification.heading.twofactorauthenticat')}</h2>
        <p className="text-center text-sm mb-8" style={{ color: '#848484' }}>
          Enter the 6-digit code from your authenticator app
        </p>

        {/* Code Input */}
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-lg bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          ))}
        </div>

        {/* Session Timer */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock className="w-4 h-4" style={{ color: timeLeft < 60 ? '#FF6B7A' : '#848484' }} />
          <span 
            className="text-sm"
            style={{ color: timeLeft < 60 ? '#FF6B7A' : '#848484' }}
          >
            Session expires in {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => onVerify(code.join(""))}
          disabled={code.some(digit => digit === "")}
          className="w-full mb-4"
          size="lg"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
            boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)',
            color: 'white',
            border: 'none',
            opacity: code.some(digit => digit === "") ? 0.5 : 1
          }}
        >
          Verify
        </Button>

        {/* Backup Code Link */}
        <div className="text-center">
          <button
            onClick={onUseBackupCode}
            className="text-sm hover:underline"
            style={{ color: '#5B9FFF' }}
          >
            Use backup code instead
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-sm max-w-md" style={{ color: '#848484' }}>
        <p>This additional security step helps protect your account from unauthorized access.</p>
      </div>
    </div>
  );
}
