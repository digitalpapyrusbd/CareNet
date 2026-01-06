// Caregiver/src/app/caregiver/registration/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Phone, Check, AlertCircle, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { apiCallNoAuth } from "@/lib/api-client";

export default function CaregiverRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [storedOtp, setStoredOtp] = useState<string | null>(null);
  const [googleAssociation, setGoogleAssociation] = useState<{hasGoogleAccount: boolean; googleEmail?: string} | null>(null);
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:21',message:'Component initialized - state variables declared',data:{hasGoogleAssociation:!!googleAssociation,showGoogleNotice},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Check Google association when phone changes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:25',message:'useEffect triggered - checking phone',data:{phone,phoneLength:phone?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    const checkGoogleAssociation = async () => {
      if (phone && phone.length >= 10) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:29',message:'Phone valid - calling API',data:{phone},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
        // #endregion

        try {
          const response = await apiCallNoAuth('/auth/check-google-association', {
            method: 'POST',
            body: { phone },
          });
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:37',message:'API response received',data:{response,hasGoogleAccount:response?.hasGoogleAccount},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
          // #endregion

          setGoogleAssociation(response);
          setShowGoogleNotice(response.hasGoogleAccount);

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:42',message:'State updated after API call',data:{hasGoogleAccount:response?.hasGoogleAccount,showGoogleNotice:response?.hasGoogleAccount},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
        } catch (error) {
          // Silently fail - not critical
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:47',message:'API call failed',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          console.log('Could not check Google association:', error);
        }
      } else {
        setGoogleAssociation(null);
        setShowGoogleNotice(false);

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregiver/registration/page.tsx:54',message:'Phone invalid - clearing state',data:{phone,phoneLength:phone?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
      }
    };

    const debounceTimer = setTimeout(checkGoogleAssociation, 500);
    return () => clearTimeout(debounceTimer);
  }, [phone]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the API client if available, otherwise direct fetch
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const backendUrl = apiUrl || 'http://localhost:4000';
      
      console.log('[DEBUG] Calling registration API:', `${backendUrl}/api/auth/register`);
      console.log('[DEBUG] Phone:', phone);
      
      // Call registration API to get OTP
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          password: 'temp', // Will be set in later steps
          role: 'CAREGIVER',
          name: 'Temp Name', // Will be set in later steps
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[DEBUG] Registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('[DEBUG] Registration response:', JSON.stringify(data, null, 2));
      
      // In development, OTP is returned in response
      // Check multiple possible response structures
      const otp = data.otp || data.data?.otp || data.message?.otp;
      if (otp) {
        console.log('[DEBUG] ✅ OTP found in response:', otp);
        setStoredOtp(otp);
      } else {
        console.warn('[DEBUG] ⚠️ No OTP in response. Full response:', data);
        console.log('[DEBUG] Check backend console - it should log: "OTP for {phone}: XXXXXX"');
        // Still proceed - user can check backend console
      }
      
      setShowPhoneInput(false);
      setIsSubmitting(false);
      setCurrentStep(2);
    } catch (error: any) {
      console.error('[DEBUG] Registration error:', error);
      alert(`Registration error: ${error.message || 'Unknown error'}. Check console for details.`);
      setShowPhoneInput(false);
      setIsSubmitting(false);
      setCurrentStep(2); // Still proceed to OTP step for testing
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== "") && index === 5) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtpCode(newOtp);
    
    // Focus last input
    if (pastedData.length === 6) {
      otpInputRefs.current[5]?.focus();
      handleVerifyOtp(pastedData);
    } else {
      otpInputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          code: code,
        }),
      });
      
      if (response.ok) {
        setCurrentStep(3);
      } else {
        const error = await response.json();
        alert(error.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      // For testing, allow proceeding even if API fails
      setCurrentStep(3);
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      <UniversalNav userRole="caregiver" showBack={true} hideBottomNav={true} />

      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              onClick={() => handleStepChange(step)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                currentStep >= step ? "opacity-100" : "opacity-40"
              }`}
              style={{
                background:
                  currentStep >= step
                    ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)"
                    : "rgba(255, 255, 255, 0.3)",
                color: currentStep >= step ? "white" : "#848484",
              }}
            >
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Phone Verification */}
        {currentStep === 1 && (
          <div className="finance-card p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-2" style={{ color: "#535353" }}>
                Create Your Account
              </h2>
              <p style={{ color: "#848484" }}>
                Enter your phone number and sign up with Google
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#535353" }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                    style={{ color: "#535353" }}
                    required
                  />
                  <p className="text-xs mt-1" style={{ color: "#848484" }}>
                    Your phone number acts as your login ID
                  </p>
                </div>

                {/* Google Association Error - Phone already linked */}
                {showGoogleNotice && googleAssociation?.hasGoogleAccount && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">
                          Registration Blocked
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {googleAssociation.googleEmail ? (
                            <>This phone number is already associated with <strong>{googleAssociation.googleEmail}</strong>. Please use the login page to sign in with Google.</>
                          ) : (
                            <>This phone number is already linked to a Google account. Please use the login page.</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Association Success - Phone not linked, can register */}
                {phone && phone.length >= 10 && !showGoogleNotice && googleAssociation && !googleAssociation.hasGoogleAccount && (
                  <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          Phone number available
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          This phone number is not linked to any Google account. You can proceed with registration.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {showAlert && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255, 107, 122, 0.1)",
                      border: "1px solid rgba(255, 107, 122, 0.3)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="w-5 h-5 mt-0.5"
                        style={{ color: "#FF6B7A" }}
                      />
                      <div className="flex-1">
                        <p
                          className="font-medium mb-1"
                          style={{ color: "#FF6B7A" }}
                        >
                          Invalid phone number
                        </p>
                        <p className="text-sm" style={{ color: "#535353" }}>
                          Please enter a valid phone number
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Sign-In Button - Only enabled if phone is valid and not already linked */}
                <div className="mt-6">
                  <GoogleSignInButton 
                    phone={phone || undefined}
                    variant="register"
                    onError={(error) => {
                      setShowAlert(true);
                      console.error('Google sign-in error:', error);
                    }}
                  />
                  <p className="text-xs mt-2 text-center" style={{ color: "#848484" }}>
                    {phone && phone.length >= 10 
                      ? (showGoogleNotice && googleAssociation?.hasGoogleAccount
                          ? "Registration is blocked for this phone number"
                          : "Click to sign up with Google")
                      : "Please enter your phone number first"}
                  </p>
                </div>
                
                {/* Login Link */}
                <div className="mt-4 text-center">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Already have an account?{" "}
                    <button
                      onClick={() => window.location.href = "/auth/login"}
                      className="hover:underline"
                      style={{ color: "#DB869A" }}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm" style={{ color: "#848484" }}>
                By continuing, you agree to our{" "}
                <a href="#" style={{ color: "#FEB4C5" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" style={{ color: "#FEB4C5" }}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <div className="finance-card p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-2" style={{ color: "#535353" }}>
                Enter Verification Code
              </h2>
              <p style={{ color: "#848484" }}>
                We've sent a 6-digit code to your phone
              </p>
              
              {/* Show OTP in development mode */}
              {storedOtp && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-xs mb-1" style={{ color: "#848484" }}>
                    Development Mode - OTP:
                  </p>
                  <p className="text-2xl font-bold text-center" style={{ color: "#535353" }}>
                    {storedOtp}
                  </p>
                </div>
              )}
              
              {/* Debug info - show even if OTP not found */}
              {!storedOtp && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs mb-1" style={{ color: "#848484" }}>
                    Debug Info:
                  </p>
                  <p className="text-xs" style={{ color: "#535353" }}>
                    OTP not found in response. Check browser console for details.
                    <br />
                    Backend should log: "OTP for {phone}: XXXXXX"
                  </p>
                </div>
              )}
            </div>

            <div 
              className="grid grid-cols-6 gap-3 mb-6"
              onPaste={handleOtpPaste}
            >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpCode[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-full h-16 text-center text-2xl rounded-xl bg-white/60 border-white/60 outline-none focus:ring-2 focus:ring-pink-300"
                  style={{ color: "#535353" }}
                />
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setOtpCode(["", "", "", "", "", ""]);
                  setShowPhoneInput(true);
                  setCurrentStep(1);
                }}
                style={{
                  color: "#535353",
                  borderColor: "rgba(132, 132, 132, 0.2)",
                }}
              >
                Resend Code
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleVerifyOtp(otpCode.join(""))}
                disabled={otpCode.some(digit => digit === "")}
                style={{
                  background:
                    otpCode.some(digit => digit === "")
                      ? "rgba(132, 132, 132, 0.3)"
                      : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: "white",
                }}
              >
                Verify Code
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Information */}
        {currentStep === 3 && (
          <div className="finance-card p-8 max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-2" style={{ color: "#535353" }}>
                Personal Information
              </h2>
              <p style={{ color: "#848484" }}>Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#535353" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                  style={{ color: "#535353" }}
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#535353" }}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  placeholder="Select your date of birth"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                className="block text-sm mb-2"
                style={{ color: "#535353" }}
              >
                Gender
              </label>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-3"
                  style={{
                    color: "#535353",
                    borderColor: "rgba(132, 132, 132, 0.2)",
                  }}
                >
                  Male
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3"
                  style={{
                    color: "#535353",
                    borderColor: "rgba(132, 132, 132, 0.2)",
                  }}
                >
                  Female
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(4)}
              className="w-full mt-6 py-4"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 4: Address Information */}
        {currentStep === 4 && (
          <div className="finance-card p-8 max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-2" style={{ color: "#535353" }}>
                Address Information
              </h2>
              <p style={{ color: "#848484" }}>Provide your address details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#535353" }}
                >
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your street address"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                  style={{ color: "#535353" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#535353" }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                    style={{ color: "#535353" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#535353" }}
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter postal code"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                    style={{ color: "#535353" }}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(5)}
              className="w-full mt-6 py-4"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 5: Skills & Experience */}
        {currentStep === 5 && (
          <div className="finance-card p-8 max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-2" style={{ color: "#535353" }}>
                Skills & Experience
              </h2>
              <p style={{ color: "#848484" }}>
                Select your skills and experience level
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#535353" }}
                >
                  Years of Experience
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                  style={{ color: "#535353" }}
                >
                  <option value="">Select experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm mb-3"
                  style={{ color: "#535353" }}
                >
                  Skills
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "First Aid",
                    "CPR Certified",
                    "Elderly Care",
                    "Medication Admin",
                    "Meal Preparation",
                    "Personal Hygiene",
                  ].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="px-4 py-3 rounded-xl bg-white/60 border-white/60 text-sm"
                      style={{
                        color: "#535353",
                        borderColor: "rgba(132, 132, 132, 0.2)",
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(6)}
              className="w-full mt-6 py-4"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {currentStep === 6 && (
          <div className="finance-card p-8 max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="mb-2" style={{ color: "#535353" }}>
              Registration Complete!
            </h2>
            <p className="mb-6" style={{ color: "#848484" }}>
              Your registration has been submitted successfully. You can now
              proceed to verify your documents.
            </p>
            <Button
              onClick={() => (window.location.href = "/caregiver/verification")}
              className="w-full py-4"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                color: "white",
              }}
            >
              Go to Verification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
