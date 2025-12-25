import { useState } from "react";
import { Eye, EyeOff, Upload, Check, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface CaregiverRegistrationProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export function CaregiverRegistration({ onComplete, onBack }: CaregiverRegistrationProps) {
  const { t } = useTranslationContext();
  const [step, setStep] = useState<Step>(1);
  
  // Step 1-2: Phone verification (similar to Guardian)
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Step 3: Personal Info
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  
  // Step 4: NID
  const [nidNumber, setNidNumber] = useState("");
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);
  
  // Step 5: Skills & Experience
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");
  
  // Step 6: Availability
  const [availability, setAvailability] = useState<{[key: string]: {available: boolean, start: string, end: string}}>({
    monday: { available: false, start: "09:00", end: "17:00" },
    tuesday: { available: false, start: "09:00", end: "17:00" },
    wednesday: { available: false, start: "09:00", end: "17:00" },
    thursday: { available: false, start: "09:00", end: "17:00" },
    friday: { available: false, start: "09:00", end: "17:00" },
    saturday: { available: false, start: "09:00", end: "17:00" },
    sunday: { available: false, start: "09:00", end: "17:00" },
  });

  const skillOptions = [
    "Vital Signs Monitoring", "Medication Management", "Wound Care", "Mobility Assistance",
    "Dementia Care", "Diabetes Care", "Stroke Rehabilitation", "Personal Care",
    "Meal Preparation", "Physical Therapy Support", "Catheter Care", "Oxygen Administration"
  ];

  const languageOptions = ["Bengali", "English", "Hindi", "Urdu"];

  const renderProgressBar = () => (
    <div className="w-full max-w-md mb-8 mx-auto">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{
                background: step >= s 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: step >= s ? 'white' : '#848484'
              }}
            >
              {step > {t('caregiverregistration.text.s')} <Check className="w-4 h-4" /> : s}
            </div>
            {s < 6 && (
              <div 
                className="flex-1 h-1 mx-1"
                style={{
                  background: step > s 
                    ? 'linear-gradient(to right, #FFB3C1, #FF8FA3)'
                    : 'rgba(255, 255, 255, 0.5)'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {renderProgressBar()}

      <div className="w-full max-w-md finance-card p-8">
        <h2 className="text-center mb-6" style={{ color: '#535353' }}>
          {step === 1 && "Create Account"}
          {step === 2 && "Verify Phone"}
          {step === 3 && "Personal Information"}
          {step === 4 && "NID Verification"}
          {step === 5 && "Skills & Experience"}
          {step === 6 && "Availability"}
        </h2>

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('caregiverregistration.placeholder.01xxxxxxxxx')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#535353' }}>Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 border-white/50 pr-10"
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

            <Button
              onClick={() => setStep(2)}
              disabled={!phone || !password}
              className="w-full mt-6"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: (!phone || !password) ? 0.5 : 1
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
              Enter the 6-digit code sent to<br />
              <strong style={{ color: '#535353' }}>{phone}</strong>
            </p>

            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-white/50 border-white/50 text-center text-lg tracking-widest"
              style={{ color: '#535353' }}
            />

            <Button
              onClick={() => setStep(3)}
              disabled={otp.length !== 6}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: otp.length !== 6 ? 0.5 : 1
              }}
            >
              Verify
            </Button>
          </div>
        )}

        {/* Step 3: Personal Info */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Full Name *</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label style={{ color: '#535353' }}>Date of Birth *</Label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#535353' }}>Gender *</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    color: '#535353'
                  }}
                >
                  <option value="">{t('caregiverregistration.text.select')}</option>
                  <option value="male">{t('caregiverregistration.text.male')}</option>
                  <option value="female">{t('caregiverregistration.text.female')}</option>
                  <option value="other">{t('caregiverregistration.text.other')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Address *</Label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Profile Photo *</Label>
              <label className="flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-white/30"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.5)' }}
              >
                <Upload className="w-5 h-5" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>
                  {profilePhoto ? profilePhoto.name : "Upload Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              onClick={() => setStep(4)}
              disabled={!fullName || !dob || !gender || !address || !profilePhoto}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: (!fullName || !dob || !gender || !address || !profilePhoto) ? 0.5 : 1
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 4: NID */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>NID Number *</Label>
              <Input
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                placeholder={t('caregiverregistration.placeholder.enternidnumber')}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>NID Front Photo *</Label>
              <label className="flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-white/30"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.5)' }}
              >
                <Upload className="w-5 h-5" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>
                  {nidFront ? nidFront.name : "Upload Front"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNidFront(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>NID Back Photo *</Label>
              <label className="flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-white/30"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.5)' }}
              >
                <Upload className="w-5 h-5" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>
                  {nidBack ? nidBack.name : "Upload Back"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNidBack(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              onClick={() => setStep(5)}
              disabled={!nidNumber || !nidFront || !nidBack}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: (!nidNumber || !nidFront || !nidBack) ? 0.5 : 1
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 5: Skills */}
        {step === 5 && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Skills (Select at least 1) *</Label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setSkills(prev => 
                        prev.includes(skill) 
                          ? prev.filter(s => s !== skill)
                          : [...prev, skill]
                      );
                    }}
                    className="text-xs px-3 py-1 rounded-full transition-colors"
                    style={{
                      background: skills.includes(skill)
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: skills.includes(skill) ? 'white' : '#535353'
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Years of Experience *</Label>
              <Input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder={t('caregiverregistration.placeholder.eg5')}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>{t('caregiverregistration.text.languages')}</Label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguages(prev => 
                        prev.includes(lang) 
                          ? prev.filter(l => l !== lang)
                          : [...prev, lang]
                      );
                    }}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: languages.includes(lang)
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: languages.includes(lang) ? 'white' : '#535353'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(6)}
              disabled={skills.length === 0 || !experience}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: (skills.length === 0 || !experience) ? 0.5 : 1
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 6: Availability */}
        {step === 6 && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm mb-4" style={{ color: '#848484' }}>
              Set your weekly availability schedule
            </p>

            {Object.keys(availability).map((day) => (
              <div key={day} className="finance-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={availability[day].available}
                    onCheckedChange={(checked) => {
                      setAvailability({
                        ...availability,
                        [day]: { ...availability[day], available: checked as boolean }
                      });
                    }}
                  />
                  <Label className="capitalize" style={{ color: '#535353' }}>{day}</Label>
                </div>
                {availability[day].available && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="time"
                      value={availability[day].start}
                      onChange={(e) => {
                        setAvailability({
                          ...availability,
                          [day]: { ...availability[day], start: e.target.value }
                        });
                      }}
                      className="bg-white/50 border-white/50 text-sm"
                      style={{ color: '#535353' }}
                    />
                    <Input
                      type="time"
                      value={availability[day].end}
                      onChange={(e) => {
                        setAvailability({
                          ...availability,
                          [day]: { ...availability[day], end: e.target.value }
                        });
                      }}
                      className="bg-white/50 border-white/50 text-sm"
                      style={{ color: '#535353' }}
                    />
                  </div>
                )}
              </div>
            ))}

            <Button
              onClick={onComplete}
              disabled={Object.values(availability).every(day => !day.available)}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: Object.values(availability).every(day => !day.available) ? 0.5 : 1
              }}
            >
              Submit for Verification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
