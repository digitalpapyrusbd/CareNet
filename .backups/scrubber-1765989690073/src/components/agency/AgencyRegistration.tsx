import { Building2, FileText, MapPin, Phone, Mail, CheckCircle, Upload, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AgencyRegistrationProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export function AgencyRegistration({ onComplete, onBack }: AgencyRegistrationProps) {
  const { t } = useTranslationContext();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Basic Info
  const [agencyName, setAgencyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");

  // Step 2: Contact Info
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  // Step 3: Legal Documents
  const [tradeLicense, setTradeLicense] = useState<File | null>(null);
  const [tinCertificate, setTinCertificate] = useState<File | null>(null);
  const [incorporationCert, setIncorporationCert] = useState<File | null>(null);

  // Step 4: Physical Verification
  const [officeAddress, setOfficeAddress] = useState("");
  const [officePhotos, setOfficePhotos] = useState<File[]>([]);

  // Step 5: Admin Account
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminNID, setAdminNID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const data = {
      basic: { agencyName, registrationNumber, yearEstablished },
      contact: { phone, email, website, address },
      legal: { tradeLicense, tinCertificate, incorporationCert },
      physical: { officeAddress, officePhotos },
      admin: { adminName, adminPhone, adminEmail, adminNID, password }
    };
    onComplete(data);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return agencyName && registrationNumber && yearEstablished;
      case 2:
        return phone && email && address;
      case 3:
        return tradeLicense && tinCertificate && incorporationCert;
      case 4:
        return officeAddress && officePhotos.length >= 2;
      case 5:
        return adminName && adminPhone && adminEmail && adminNID && password && password === confirmPassword;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="mb-2" style={{ color: '#535353' }}>{t('agencyregistration.heading.agencyregistration')}</h1>
            <p style={{ color: '#848484' }}>Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(currentStep / totalSteps) * 100}%`,
                  background: 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
                }}
              />
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="finance-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 style={{ color: '#535353' }}>{t('agencyregistration.heading.basicinformation')}</h2>
                  <p className="text-sm" style={{ color: '#848484' }}>{t('agencyregistration.text.tellusaboutyouragenc')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="agencyName">Agency Name *</Label>
                  <Input
                    id="agencyName"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.greencareservicesltd')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="regNumber">Registration Number *</Label>
                  <Input
                    id="regNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.rjsc123456')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year Established *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={yearEstablished}
                    onChange={(e) => setYearEstablished(e.target.value)}
                    placeholder="2018"
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="finance-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 style={{ color: '#535353' }}>{t('agencyregistration.heading.contactinformation')}</h2>
                  <p className="text-sm" style={{ color: '#848484' }}>How can we reach you?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.8801xxxxxxxxx')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.infogreencarecom')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.greencare.com"
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Office Address *</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.house45road12dhanmon')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Legal Documents */}
          {currentStep === 3 && (
            <div className="finance-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 style={{ color: '#535353' }}>{t('agencyregistration.heading.legaldocuments')}</h2>
                  <p className="text-sm" style={{ color: '#848484' }}>{t('agencyregistration.text.uploadrequiredcertif')}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Trade License", file: tradeLicense, setter: setTradeLicense },
                  { label: "TIN Certificate", file: tinCertificate, setter: setTinCertificate },
                  { label: "Incorporation Certificate", file: incorporationCert, setter: setIncorporationCert }
                ].map((doc, index) => (
                  <div key={index}>
                    <Label>{doc.label} *</Label>
                    <label
                      className="mt-2 flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-colors"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {doc.file ? (
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#7CE577' }} />
                          <p className="text-sm" style={{ color: '#535353' }}>{doc.file.name}</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8" style={{ color: '#848484' }} />
                          <span className="text-sm" style={{ color: '#848484' }}>{t('agencyregistration.text.clicktouploadpdforim')}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => e.target.files && doc.setter(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Physical Verification */}
          {currentStep === 4 && (
            <div className="finance-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                  }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 style={{ color: '#535353' }}>{t('agencyregistration.heading.physicalverification')}</h2>
                  <p className="text-sm" style={{ color: '#848484' }}>{t('agencyregistration.text.officelocationandpho')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="officeAddress">Physical Office Address *</Label>
                  <Textarea
                    id="officeAddress"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.completeaddresswithl')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label>Office Photos (Minimum 2) *</Label>
                  <p className="text-xs mb-2" style={{ color: '#848484' }}>
                    Upload photos of office exterior, reception, and workspace
                  </p>
                  <label
                    className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-colors"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <Upload className="w-8 h-8" style={{ color: '#848484' }} />
                    <span className="text-sm" style={{ color: '#535353' }}>
                      {officePhotos.length > 0 ? `${officePhotos.length} photos uploaded` : 'Click to upload photos'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && setOfficePhotos(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Admin Account */}
          {currentStep === 5 && (
            <div className="finance-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 style={{ color: '#535353' }}>{t('agencyregistration.heading.adminaccount')}</h2>
                  <p className="text-sm" style={{ color: '#848484' }}>{t('agencyregistration.text.createagencyadminist')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.johndoe')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="adminPhone">Phone Number *</Label>
                  <Input
                    id="adminPhone"
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.8801xxxxxxxxx1')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="adminEmail">Email Address *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder={t('agencyregistration.placeholder.admingreencarecom')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="adminNID">NID Number *</Label>
                  <Input
                    id="adminNID"
                    value={adminNID}
                    onChange={(e) => setAdminNID(e.target.value)}
                    placeholder="123456789012"
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs mt-1" style={{ color: '#FF6B7A' }}>{t('agencyregistration.text.passwordsdonotmatch')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: !canProceed() ? 0.5 : 1
              }}
            >
              {currentStep === totalSteps ? 'Submit for Verification' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
