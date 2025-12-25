import { useState } from "react";
import { Eye, EyeOff, Upload, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface GuardianRegistrationProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 1 | 2 | 3;

export function GuardianRegistration({ onComplete, onBack }: GuardianRegistrationProps) {
  const { t } = useTranslationContext();
  const [step, setStep] = useState<Step>(1);
  
  // Step 1 fields
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2 fields
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  
  // Step 3 fields
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [language, setLanguage] = useState("english");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleStep1Submit = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Step 1 complete");
    setStep(2);
    
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

  const handleStep2Submit = () => {
    console.log("OTP verified:", otp);
    setStep(3);
  };

  const handleStep3Submit = () => {
    if (!termsAccepted || !privacyAccepted) {
      alert("Please accept terms and privacy policy");
      return;
    }
    console.log("Registration complete");
    onComplete();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: step >= s 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: step >= s ? 'white' : '#848484'
                }}
              >
                {step > {t('guardianregistration.text.s')} <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div 
                  className="flex-1 h-1 mx-2"
                  style={{
                    background: step > s 
                      ? 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
                      : 'rgba(255, 255, 255, 0.5)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs" style={{ color: '#848484' }}>
          <span>{t('guardianregistration.text.account')}</span>
          <span>{t('guardianregistration.text.verify')}</span>
          <span>{t('guardianregistration.text.profile')}</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="text-center mb-6" style={{ color: '#535353' }}>
          {step === 1 && "Create Account"}
          {step === 2 && "Verify Phone"}
          {step === 3 && "Complete Profile"}
        </h2>

        {/* Step 1: Account Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('guardianregistration.placeholder.01xxxxxxxxx')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#535353' }}>Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('guardianregistration.placeholder.youremailcom')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#535353' }}>Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('guardianregistration.placeholder.enterpassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 border-white/50 placeholder:text-gray-400 pr-10"
                  style={{ color: '#535353' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#848484' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: '#535353' }}>Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('guardianregistration.placeholder.confirmpassword')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: '#535353' }}
              />
            </div>

            <Button
              onClick={handleStep1Submit}
              disabled={!phone || !password || !confirmPassword}
              className="w-full mt-6"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                color: 'white',
                border: 'none',
                opacity: (!phone || !password || !confirmPassword) ? 0.5 : 1
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
              Enter the 6-digit code sent to<br />
              <strong style={{ color: '#535353' }}>{phone}</strong>
            </p>

            <div className="space-y-2">
              <Label htmlFor="otp" style={{ color: '#535353' }}>{t('guardianregistration.text.verificationcode')}</Label>
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
              onClick={handleStep2Submit}
              disabled={otp.length !== 6}
              className="w-full mt-6"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                color: 'white',
                border: 'none',
                opacity: otp.length !== 6 ? 0.5 : 1
              }}
            >
              Verify
            </Button>
          </div>
        )}

        {/* Step 3: Complete Profile */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" style={{ color: '#535353' }}>Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder={t('guardianregistration.placeholder.enteryourfullname')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo" style={{ color: '#535353' }}>{t('guardianregistration.text.profilephoto')}</Label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="photo"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-white/30 transition-colors"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.5)' }}
                >
                  <Upload className="w-5 h-5" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#535353' }}>
                    {profilePhoto ? profilePhoto.name : "Upload Photo"}
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" style={{ color: '#535353' }}>{t('guardianregistration.text.languagepreference')}</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="english">{t('guardianregistration.text.english')}</option>
                <option value="bengali">বাংলা (Bengali)</option>
              </select>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: '#535353' }}>
                  I accept the <a href="#" className="hover:underline" style={{ color: '#FFB3C1' }}>{t('guardianregistration.text.termsconditions')}</a>
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                />
                <Label htmlFor="privacy" className="text-sm cursor-pointer" style={{ color: '#535353' }}>
                  I accept the <a href="#" className="hover:underline" style={{ color: '#FFB3C1' }}>{t('guardianregistration.text.privacypolicy')}</a>
                </Label>
              </div>
            </div>

            <Button
              onClick={handleStep3Submit}
              disabled={!fullName || !termsAccepted || !privacyAccepted}
              className="w-full mt-6"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                color: 'white',
                border: 'none',
                opacity: (!fullName || !termsAccepted || !privacyAccepted) ? 0.5 : 1
              }}
            >
              Complete Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
