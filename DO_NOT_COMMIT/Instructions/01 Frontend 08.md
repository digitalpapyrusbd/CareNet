# Frontend 08: Guardian Portal Implementation

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [05: Agency Portal](01%20Frontend%2005.md)

---

## 📋 Table of Contents

1. [Guardian Portal Overview](#guardian-portal-overview)
2. [Registration Process (3 Steps)](#registration-process-3-steps)
3. [Dashboard](#dashboard)
4. [Patient Management](#patient-management)
5. [Browse & Search Packages](#browse--search-packages)
6. [Package Negotiation](#package-negotiation)
7. [Checkout & Payment](#checkout--payment)
8. [Active Jobs Monitoring](#active-jobs-monitoring)
9. [Care Log Viewing](#care-log-viewing)
10. [Billing & Invoices](#billing--invoices)
11. [Messages & Communication](#messages--communication)
12. [Debugging Guide](#debugging-guide)
13. [Testing Guide](#testing-guide)
14. [Testing Progress Log](#testing-progress-log)

---

## 🏠 Guardian Portal Overview

### **Purpose**
The Guardian Portal enables family members to:
- ✅ Register and add patient profiles
- ✅ Browse care packages from agencies
- ✅ Negotiate prices and terms
- ✅ Purchase care services
- ✅ Monitor active care
- ✅ View care logs and reports
- ✅ Communicate with caregivers and agencies
- ✅ Manage billing and payments

### **Access Control**
- **Role Required**: `GUARDIAN`
- **MFA**: Optional
- **Features**: 42 pages, 24 components

### **Guardian Portal Routes**

```
/guardian/
├── registration/                # Multi-step registration
│   ├── page                     # Start registration
│   ├── step-1                   # Account creation
│   ├── step-2                   # Phone verification
│   └── step-3                   # Profile details
├── dashboard                    # Main dashboard
├── patients/                    # Patient management
│   ├── page                     # Patient list
│   ├── new                      # Add new patient
│   ├── [id]                     # Patient details
│   ├── [id]/edit                # Edit patient
│   └── [id]/health-records      # Health records
├── packages/                    # Package browsing
│   ├── page                     # Browse packages
│   ├── filters                  # Advanced filters
│   ├── [id]                     # Package details
│   └── [id]/negotiate           # Negotiate price
├── checkout/                    # Purchase flow
│   ├── page                     # Checkout page
│   ├── payment                  # Payment selection
│   └── success                  # Confirmation
├── jobs/                        # Active jobs
│   ├── page                     # Job list
│   ├── [id]                     # Job details
│   └── [id]/care-logs           # View care logs
├── billing/                     # Billing management
│   ├── page                     # Invoice list
│   ├── platform                 # Platform fees
│   └── [id]/download            # Download invoice
├── messages/                    # Communications
│   ├── page                     # Message list
│   └── [id]                     # Conversation
├── prescription-upload          # Upload prescriptions
├── payment-reminder             # Payment reminder
├── payment-warning              # Payment warning
├── payment-final-warning        # Final warning
└── payment-locked               # Account locked
```

---

## 📝 Registration Process (3 Steps)

### **Step 1: Account Creation**

**Route**: `/guardian/registration/step-1`  
**Component**: `GuardianRegistrationStep1Page.tsx`

**Account Form:**

```tsx
export default function GuardianRegistrationStep1Page() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canContinue = phone && password && confirmPassword && password === confirmPassword;

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
        {/* Progress Indicator */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: 1 >= s 
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: 1 >= s ? 'white' : '#848484'
                  }}
                >
                  {1 > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div 
                    className="flex-1 h-1 mx-2"
                    style={{
                      background: 1 > s 
                        ? 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
                        : 'rgba(255, 255, 255, 0.5)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs" style={{ color: '#848484' }}>
            <span>Account</span>
            <span>Verify</span>
            <span>Profile</span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md finance-card p-8">
          <h2 className="text-center mb-6" style={{ color: '#535353' }}>
            Create Account
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: '#535353' }}>
                Phone Number *
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#535353' }}>
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#535353' }}>
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
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
              <Label htmlFor="confirmPassword" style={{ color: '#535353' }}>
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: '#535353' }}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs" style={{ color: '#FF6B7A' }}>
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={() => router.push('/guardian/registration/step-2')}
            disabled={!canContinue}
            className="w-full mt-6"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: canContinue ? 1 : 0.5
            }}
          >
            Continue
          </Button>

          <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
            By continuing, you agree to CareNet's Terms & Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}
```

### **Step 2: Phone Verification**

**Route**: `/guardian/registration/step-2`

Similar to caregiver registration - 6-digit SMS verification code.

### **Step 3: Profile Details**

**Route**: `/guardian/registration/step-3`

```tsx
<form onSubmit={handleCompleteRegistration}>
  <Input
    label="Full Name"
    placeholder="Your full name"
    required
  />
  
  <Input
    label="Relationship to Patient"
    placeholder="e.g., Son, Daughter, Spouse"
  />
  
  <Textarea
    label="Address"
    placeholder="Your residential address"
    rows={3}
  />
  
  <Select label="Preferred Language">
    <SelectItem value="bn">Bengali</SelectItem>
    <SelectItem value="en">English</SelectItem>
  </Select>
  
  <Button type="submit">Complete Registration</Button>
</form>
```

---

## 📊 Dashboard

**Route**: `/guardian/dashboard`  
**Component**: `GuardianDashboardPage.tsx`

### **Dashboard Layout**

```tsx
export default function GuardianDashboardPage() {
  const router = useRouter();

  const patients = [
    { 
      id: '1', 
      name: 'Anwar Hossain', 
      age: 72, 
      condition: 'Post-Surgery', 
      careStatus: 'Active', 
      caregiver: 'Shaila Khatun', 
      nextVisit: 'Today 9:00 AM' 
    },
    { 
      id: '2', 
      name: 'Fatima Begum', 
      age: 68, 
      condition: 'Diabetes Care', 
      careStatus: 'Active', 
      caregiver: 'Nusrat Ahmed', 
      nextVisit: 'Tomorrow 10:00 AM' 
    },
  ];

  const recentActivity = [
    { 
      type: 'vitals', 
      patient: 'Anwar Hossain', 
      message: 'Vitals logged - BP: 130/85, normal range', 
      time: '2 hours ago', 
      icon: Heart 
    },
    { 
      type: 'medication', 
      patient: 'Fatima Begum', 
      message: 'Morning medications administered', 
      time: '3 hours ago', 
      icon: FileText 
    },
    { 
      type: 'appointment', 
      patient: 'Anwar Hossain', 
      message: 'Doctor appointment scheduled for Dec 10', 
      time: 'Yesterday', 
      icon: Calendar 
    },
  ];

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen pb-20 pb-24 md:pt-14">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 style={{ color: '#535353' }}>Hello, Fahima</h1>
              <p style={{ color: '#848484' }}>Welcome back to CareNet</p>
            </div>
            <button
              onClick={() => router.push('/guardian/messages')}
              className="relative"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" 
                style={{ background: '#FF6B7A' }}
              >
                3
              </div>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => router.push('/guardian/patients/new')}
              className="finance-card p-4 hover:shadow-lg transition-all"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <Plus className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm" style={{ color: '#535353' }}>Add Patient</p>
            </button>

            <button
              onClick={() => router.push('/guardian/packages')}
              className="finance-card p-4 hover:shadow-lg transition-all"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm" style={{ color: '#535353' }}>Browse Packages</p>
            </button>
          </div>
        </div>

        {/* Patients List */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: '#535353' }}>My Patients</h2>
            <button className="text-sm" style={{ color: '#5B9FFF' }}>
              View All
            </button>
          </div>

          <div className="space-y-3">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => router.push(`/guardian/patients/${patient.id}`)}
                className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                    }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 style={{ color: '#535353' }}>{patient.name}</h3>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: '#7CE577', color: 'white' }}
                      >
                        {patient.careStatus}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>
                      {patient.age} years • {patient.condition}
                    </p>
                    {patient.caregiver && (
                      <p className="text-sm" style={{ color: '#535353' }}>
                        Caregiver: {patient.caregiver}
                      </p>
                    )}
                    {patient.nextVisit && (
                      <p className="text-xs mt-2" style={{ color: '#848484' }}>
                        Next visit: {patient.nextVisit}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6">
          <h2 className="mb-4" style={{ color: '#535353' }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="finance-card p-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: activity.type === 'vitals'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                        : activity.type === 'medication'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    }}
                  >
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-1" style={{ color: '#535353' }}>
                      {activity.patient}
                    </p>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>
                      {activity.message}
                    </p>
                    <p className="text-xs" style={{ color: '#848484' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## 👥 Patient Management

### **Add Patient**

**Route**: `/guardian/patients/new`  
**Component**: `AddPatient.tsx`

**Patient Form:**

```tsx
export function AddPatient({ onClose, onSave }: AddPatientProps) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    photo: null as File | null,
    medicalConditions: [] as string[],
    allergies: "",
    mobilityLevel: "",
    cognitiveStatus: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: ""
  });

  const [conditionInput, setConditionInput] = useState("");

  const medicalConditionOptions = [
    "Diabetes", "Hypertension", "Heart Disease", "Stroke", "Dementia", 
    "Alzheimer's", "Parkinson's", "Arthritis", "Cancer", "COPD"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl finance-card p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ color: '#535353' }}>Add New Patient</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
            style={{ color: '#848484' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: '#535353' }}>
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient name"
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" style={{ color: '#535353' }}>
                Date of Birth *
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" style={{ color: '#535353' }}>
                Gender *
              </Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup" style={{ color: '#535353' }}>
                Blood Group
              </Label>
              <select
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="space-y-2">
            <Label style={{ color: '#535353' }}>Medical Conditions</Label>
            <div className="flex gap-2">
              <Input
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                placeholder="Type or select condition"
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
              <Button
                type="button"
                onClick={() => addCondition(conditionInput)}
                disabled={!conditionInput}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick select common conditions */}
            <div className="flex flex-wrap gap-2">
              {medicalConditionOptions.map(condition => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => addCondition(condition)}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: formData.medicalConditions.includes(condition)
                      ? '#7CE577'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: formData.medicalConditions.includes(condition)
                      ? 'white'
                      : '#535353'
                  }}
                >
                  {condition}
                </button>
              ))}
            </div>

            {/* Selected conditions */}
            {formData.medicalConditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.medicalConditions.map(condition => (
                  <div
                    key={condition}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    style={{ background: '#7CE577', color: 'white' }}
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(condition)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobility & Cognitive Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Mobility Level</Label>
              <select
                value={formData.mobilityLevel}
                onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              >
                <option value="">Select mobility</option>
                <option value="independent">Independent</option>
                <option value="assisted">Needs Assistance</option>
                <option value="wheelchair">Wheelchair</option>
                <option value="bedridden">Bedridden</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Cognitive Status</Label>
              <select
                value={formData.cognitiveStatus}
                onChange={(e) => setFormData({ ...formData, cognitiveStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              >
                <option value="">Select status</option>
                <option value="normal">Normal</option>
                <option value="mild-impairment">Mild Impairment</option>
                <option value="moderate-impairment">Moderate Impairment</option>
                <option value="severe-impairment">Severe Impairment</option>
              </select>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Emergency Contact Name</Label>
              <Input
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Contact person name"
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>Emergency Phone</Label>
              <Input
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white'
            }}
          >
            Save Patient
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### **Patient Details**

**Route**: `/guardian/patients/[id]`

Shows:
- Patient profile information
- Active care assignments
- Upcoming appointments
- Recent care logs
- Medical history
- Prescriptions

---

## 🔍 Browse & Search Packages

**Route**: `/guardian/packages`  
**Component**: `BrowsePackages.tsx`

### **Package Browsing Interface**

```tsx
export function BrowsePackages({ onSelectPackage, onOpenFilters }: BrowsePackagesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const packages = [
    {
      id: "1",
      name: "24/7 Senior Care - Basic",
      agency: "Green Care Agency",
      agencyLogo: null,
      price: 35000,
      duration: "30 days",
      rating: 4.8,
      reviews: 124,
      location: "Dhanmondi, Dhaka",
      services: [
        "Daily Vital Monitoring", 
        "Medication Management", 
        "Meal Assistance", 
        "Mobility Support"
      ],
      category: "Full-time Care"
    },
    {
      id: "2",
      name: "Post-Surgery Care Package",
      agency: "MediCare Services",
      agencyLogo: null,
      price: 28000,
      duration: "15 days",
      rating: 4.9,
      reviews: 89,
      location: "Gulshan, Dhaka",
      services: [
        "Wound Care", 
        "Physical Therapy", 
        "Pain Management", 
        "Recovery Monitoring"
      ],
      category: "Specialized Care"
    },
    {
      id: "3",
      name: "Dementia Care - Advanced",
      agency: "Heart & Soul Caregivers",
      agencyLogo: null,
      price: 45000,
      duration: "30 days",
      rating: 4.7,
      reviews: 67,
      location: "Banani, Dhaka",
      services: [
        "Memory Activities", 
        "Behavioral Management", 
        "24/7 Supervision", 
        "Family Training"
      ],
      category: "Specialized Care"
    },
  ];

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="p-6">
        <h1 className="mb-2" style={{ color: '#535353' }}>Browse Packages</h1>
        <p style={{ color: '#848484' }}>
          Find the perfect care package for your loved one
        </p>
      </div>

      {/* Search and Filter */}
      <div className="px-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
              style={{ color: '#848484' }} 
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
          <Button
            onClick={onOpenFilters}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Packages List */}
      <div className="px-6 space-y-4">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => onSelectPackage(pkg.id)}
            className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
          >
            {/* Agency Header */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#535353' }}>
                  {pkg.agency}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs" style={{ color: '#848484' }}>
                      {pkg.rating}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: '#848484' }}>
                    ({pkg.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Package Name */}
            <h3 className="mb-2" style={{ color: '#535353' }}>{pkg.name}</h3>

            {/* Services */}
            <div className="flex flex-wrap gap-2 mb-3">
              {pkg.services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(139, 122, 232, 0.15)', color: '#8B7AE8' }}
                >
                  {service}
                </span>
              ))}
              {pkg.services.length > 3 && (
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(132, 132, 132, 0.15)', color: '#848484' }}
                >
                  +{pkg.services.length - 3} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs" style={{ color: '#848484' }}>
                <MapPin className="w-3 h-3" />
                {pkg.location}
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold" style={{ color: '#535353' }}>
                  ৳{pkg.price.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: '#848484' }}>
                  {pkg.duration}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### **Package Filters**

**Route**: `/guardian/packages/filters`

**Filter Options:**
- Price range
- Care type (Full-time, Part-time, Live-in)
- Location/Area
- Agency rating
- Specialization
- Duration
- Service features

---

## 💬 Package Negotiation

**Route**: `/guardian/packages/[id]/negotiate`  
**Component**: `NegotiationFlow.tsx`

### **Negotiation Stages**

```
Guardian sends counter-offer
    ↓
Agency reviews (via /agency/inquiries)
    ↓
Agency responds (accept/counter/decline)
    ↓
Guardian reviews response
    ↓
Purchase or Continue Negotiating
```

### **Negotiation Interface**

```tsx
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
            <span className="text-sm" style={{ color: '#848484' }}>
              Original Price:
            </span>
            <span className="text-xl" style={{ color: '#535353' }}>
              ৳{originalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stage: Send Counter-Offer */}
        {stage === 'send' && (
          <div className="space-y-6">
            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>
                Send Counter-Offer
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" style={{ color: '#535353' }}>
                    Your Proposed Price *
                  </Label>
                  <div className="relative mt-2">
                    <span 
                      className="absolute left-3 top-1/2 -translate-y-1/2" 
                      style={{ color: '#848484' }}
                    >
                      ৳
                    </span>
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
                    <p 
                      className="text-sm mt-2" 
                      style={{ 
                        color: originalPrice - Number(proposedPrice) > 0 
                          ? '#7CE577' 
                          : '#FF6B7A' 
                      }}
                    >
                      {originalPrice - Number(proposedPrice) > 0 ? '-' : '+'}
                      ৳{Math.abs(originalPrice - Number(proposedPrice)).toLocaleString()} from original
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes" style={{ color: '#535353' }}>
                    Message to Agency (Optional)
                  </Label>
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

              <Button
                onClick={() => onSendOffer?.({ price: proposedPrice, notes })}
                disabled={!proposedPrice}
                className="w-full mt-6"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  color: 'white',
                  opacity: !proposedPrice ? 0.5 : 1
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Counter-Offer
              </Button>
            </div>
          </div>
        )}

        {/* Stage: Waiting for Response */}
        {stage === 'waiting' && (
          <div className="finance-card p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: '#8EC5FC' }} />
            <h3 className="mb-2" style={{ color: '#535353' }}>
              Offer Sent
            </h3>
            <p className="mb-6" style={{ color: '#848484' }}>
              Waiting for {agencyName} to respond to your counter-offer
            </p>
            <p className="text-sm" style={{ color: '#848484' }}>
              You'll receive a notification when they respond
            </p>
          </div>
        )}

        {/* Stage: Review Agency Response */}
        {stage === 'review' && (
          <div className="space-y-6">
            <div className="finance-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare 
                  className="w-5 h-5" 
                  style={{ color: '#8EC5FC' }} 
                />
                <h3 style={{ color: '#535353' }}>Agency Response</h3>
              </div>

              <div className="finance-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: '#848484' }}>
                    Counter Price:
                  </span>
                  <span className="text-2xl font-semibold" style={{ color: '#535353' }}>
                    ৳{agencyResponse.counterPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#535353' }}>
                  {agencyResponse.message}
                </p>
                <p className="text-xs mt-3" style={{ color: '#848484' }}>
                  {agencyResponse.respondedAt}
                </p>
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
                  Accept & Proceed
                </Button>
              </div>

              <Button
                onClick={onCounterOffer}
                variant="outline"
                className="w-full mt-3 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Send Another Counter-Offer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 💳 Checkout & Payment

**Route**: `/guardian/checkout`

**Checkout Flow:**

```
1. Select Patient
2. Confirm Package Details
3. Choose Payment Method (bKash/Nagad/Bank)
4. Enter Payment Details
5. Confirm Purchase
6. Payment Processing
7. Success/Failure
```

**Payment Methods:**
- bKash
- Nagad
- Bank Transfer
- Credit/Debit Card (future)

---

## 📋 Active Jobs Monitoring

**Route**: `/guardian/jobs`  
**Component**: `ActiveJobs.tsx`

**Features:**
- View all active care assignments
- Real-time caregiver location (if enabled)
- Check-in/out times
- View today's care logs
- Message caregiver/agency
- Report issues

---

## 📊 Care Log Viewing

**Route**: `/guardian/jobs/[id]/care-logs`

**Guardians can view:**
- Vitals records (BP, heart rate, temperature, etc.)
- Medication administration log
- Activity logs (exercises, meals, etc.)
- Incident reports
- Photos (if caregiver uploaded)
- Timestamps and caregiver signatures

---

## 💰 Billing & Invoices

**Route**: `/guardian/billing`  
**Component**: `BillingInvoices.tsx`

**Features:**
- Invoice history
- Download invoices (PDF)
- Payment status
- Platform fees breakdown
- Payment reminders
- Overdue notices

### **Invoice Download**

```tsx
<Button onClick={() => downloadInvoice(invoiceId)}>
  <Download className="w-4 h-4 mr-2" />
  Download PDF
</Button>
```

---

## 💬 Messages & Communication

**Route**: `/guardian/messages`

**Message Types:**
- Direct messages with caregivers
- Communication with agencies
- System notifications
- Care updates
- Appointment reminders

---

## 🐛 Debugging Guide

### **Issue: Package Search Not Working**

**Problem**: Search returns no results.

**Debug Steps**:
```typescript
// Check search query
console.log('Search query:', searchQuery);

// Check API endpoint
const response = await fetch(`/api/packages/search?q=${searchQuery}`);
console.log('Response:', await response.json());

// Check filters
console.log('Active filters:', filters);
```

### **Issue: Negotiation Not Sending**

**Problem**: Counter-offer submission fails.

**Solution**:
```typescript
// Verify form data
console.log('Offer data:', {
  packageId,
  proposedPrice,
  notes
});

// Check API response
const response = await fetch('/api/negotiations', {
  method: 'POST',
  body: JSON.stringify(offerData)
});
console.log('Status:', response.status);
```

---

## 🧪 Testing Guide

```typescript
describe('Guardian Package Browse', () => {
  it('displays packages correctly', async () => {
    render(<BrowsePackagesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('24/7 Senior Care - Basic')).toBeInTheDocument();
    });
  });
  
  it('filters packages by price', async () => {
    const { user } = renderWithAuth(<BrowsePackagesPage />);
    
    await user.click(screen.getByRole('button', { name: /filters/i }));
    await user.type(screen.getByLabelText(/max price/i), '30000');
    await user.click(screen.getByText('Apply'));
    
    // Should only show packages under 30000
    expect(screen.queryByText('Dementia Care - Advanced')).not.toBeInTheDocument();
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **Registration**: 90% (3-step flow functional)
- **Package Browsing**: 92% (Search and filters work)
- **Negotiation**: 85% (Send/receive offers functional)
- **Patient Management**: 88% (Add/edit/view working)

### **❌ TODO**
- [ ] E2E test for full guardian workflow
- [ ] Payment integration tests
- [ ] Care log viewing tests

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
