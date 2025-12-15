# Frontend 05: Agency Portal Implementation

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [13: Payments](01%20Frontend%2013.md)

---

## 📋 Table of Contents

1. [Agency Portal Overview](#agency-portal-overview)
2. [Registration Process (5 Steps)](#registration-process-5-steps)
3. [Dashboard & Analytics](#dashboard--analytics)
4. [Package Management](#package-management)
5. [Job Management System](#job-management-system)
6. [Caregiver Pool Search](#caregiver-pool-search)
7. [Caregiver Roster Management](#caregiver-roster-management)
8. [Billing & Invoicing](#billing--invoicing)
9. [Subscription Management](#subscription-management)
10. [Package Negotiation](#package-negotiation)
11. [Debugging Guide](#debugging-guide)
12. [Testing Guide](#testing-guide)
13. [Testing Progress Log](#testing-progress-log)

---

## 🏢 Agency Portal Overview

### **Purpose**
The Agency Portal enables healthcare agencies to:
- ✅ Manage caregiver workforce
- ✅ Create and customize packages
- ✅ Handle job assignments
- ✅ Search platform caregiver pool
- ✅ Process payments and billing
- ✅ Negotiate with guardians
- ✅ Track performance metrics

### **Access Control**
- **Role Required**: `COMPANY` (Agency Admin)
- **MFA**: Optional
- **Features**: 41 pages, 95 components

### **Agency Portal Routes**

```
/agency/
├── registration/              # Multi-step registration
│   ├── page                   # Start registration
│   ├── step-1                 # Basic info
│   ├── step-2                 # Legal documents
│   ├── step-3                 # Services offered
│   ├── step-4                 # Billing setup
│   └── step-5                 # Subscription selection
├── onboarding                 # Post-registration onboarding
├── pending-verification       # Waiting for approval
├── rejection                  # Rejection view
├── account-locked             # Payment lockout page
├── dashboard                  # Main dashboard
├── packages/                  # Package management
│   ├── page                   # List packages
│   ├── new                    # Create package
│   └── [id]/edit              # Edit package
├── jobs/                      # Job management
│   ├── page                   # Job inbox
│   ├── [id]                   # Job details
│   └── [id]/assign            # Assign caregiver
├── caregivers/                # Caregiver management
│   ├── page                   # Agency roster
│   ├── add                    # Add caregiver
│   ├── pool                   # Search platform pool
│   └── [id]                   # Caregiver details
├── inquiries/                 # Guardian inquiries
│   ├── page                   # Inquiry list
│   └── [id]                   # Respond to inquiry
├── billing                    # Billing & invoicing
├── subscription/              # Subscription management
│   └── active                 # Active subscription
├── messages/                  # Communications
│   ├── page                   # Message list
│   └── [id]                   # Conversation
└── analytics                  # Performance analytics
```

---

## 📝 Registration Process (5 Steps)

### **Step 1: Basic Information**

**Route**: `/agency/registration/step-1`  
**Component**: `AgencyRegistration.tsx`

**Form Fields:**

```typescript
interface AgencyBasicInfo {
  agencyName: string;           // Required
  tagline?: string;             // Optional
  phone: string;                // Required, Bangladesh format
  email: string;                // Required
  password: string;             // Required, min 8 chars
  confirmPassword: string;      // Must match
  primaryContactName: string;   // Required
  primaryContactTitle: string;  // e.g., "Director", "Manager"
  address: {
    street: string;
    area: string;
    city: string;
    division: string;
    postalCode: string;
  };
  websiteUrl?: string;          // Optional
  establishedYear: number;      // Required
}
```

**Validation:**
```typescript
const step1Schema = z.object({
  agencyName: z.string().min(3).max(200),
  phone: z.string().regex(/^(\+8801|01)[0-9]{9}$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  primaryContactName: z.string().min(2),
  address: z.object({
    street: z.string(),
    city: z.string(),
    division: z.enum(['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']),
  }),
  establishedYear: z.number().min(1900).max(new Date().getFullYear()),
});
```

### **Step 2: Legal Documents**

**Route**: `/agency/registration/step-2`

**Documents Required:**

```typescript
interface LegalDocuments {
  tradeLicense: {
    file: File;
    licenseNumber: string;
    issueDate: Date;
    expiryDate: Date;
  };
  tinCertificate: {
    file: File;
    tinNumber: string;
  };
  businessRegistration: {
    file: File;
    registrationNumber: string;
  };
  ownerNID: {
    file: File;
    nidNumber: string;
  };
  bankAccount: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    branchName: string;
    routingNumber?: string;
  };
}
```

**Upload Interface:**

```tsx
<div className="legal-documents">
  <h2>Legal Documents</h2>
  
  {documentTypes.map(docType => (
    <div key={docType.key} className="document-upload">
      <Label>{docType.label}</Label>
      <div className="upload-area">
        {!documents[docType.key] ? (
          <FileUpload
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5 * 1024 * 1024} // 5MB
            onUpload={(file) => handleUpload(docType.key, file)}
          />
        ) : (
          <div className="uploaded-file">
            <FileText className="w-8 h-8" />
            <p>{documents[docType.key].name}</p>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => removeDocument(docType.key)}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
      
      {/* Document Details */}
      {docType.requiresNumber && (
        <Input
          placeholder={`Enter ${docType.label} number`}
          value={documentNumbers[docType.key]}
          onChange={(e) => setDocumentNumber(docType.key, e.target.value)}
        />
      )}
      
      {docType.requiresDates && (
        <div className="date-inputs">
          <div>
            <Label>Issue Date</Label>
            <Input type="date" />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input type="date" />
          </div>
        </div>
      )}
    </div>
  ))}
</div>
```

### **Step 3: Services & Specializations**

**Route**: `/agency/registration/step-3`  
**Component**: `AgencyRegistrationStep3.tsx`

**Service Configuration:**

```typescript
interface AgencyServices {
  serviceTypes: string[];      // e.g., ['Elderly Care', 'Post-Surgery', 'Pediatric']
  specializations: string[];   // e.g., ['Dementia Care', 'Diabetes Management']
  caregiverCount: number;      // Current caregiver workforce
  operatingHours: {
    type: '24/7' | 'BUSINESS_HOURS' | 'FLEXIBLE';
    businessHours?: {
      weekdays: { open: string; close: string; };
      weekends: { open: string; close: string; };
    };
  };
  coverageAreas: string[];     // Districts/areas served
  languages: string[];         // Languages staff speak
  emergencySupport: boolean;   // 24/7 emergency availability
}
```

**Service Selection Interface:**

```tsx
<div className="services-selection">
  <h2>Services Offered</h2>
  
  {/* Service Types */}
  <div className="service-types">
    <Label>Primary Services (Select all that apply)</Label>
    <div className="grid grid-cols-2 gap-3">
      {serviceOptions.map(service => (
        <div key={service.id} className="flex items-center gap-2">
          <Checkbox
            checked={selectedServices.includes(service.id)}
            onCheckedChange={(checked) => 
              toggleService(service.id, checked)
            }
          />
          <label>{service.name}</label>
        </div>
      ))}
    </div>
  </div>
  
  {/* Specializations */}
  <div className="specializations">
    <Label>Specializations</Label>
    <MultiSelect
      options={specializationOptions}
      value={selectedSpecializations}
      onChange={setSelectedSpecializations}
    />
  </div>
  
  {/* Coverage Areas */}
  <div className="coverage">
    <Label>Service Coverage Areas</Label>
    <MultiSelect
      options={bangladeshDistricts}
      value={coverageAreas}
      onChange={setCoverageAreas}
    />
  </div>
  
  {/* Operating Hours */}
  <div className="operating-hours">
    <Label>Operating Hours</Label>
    <RadioGroup value={operatingType}>
      <RadioGroupItem value="24/7" label="24/7 Service" />
      <RadioGroupItem value="BUSINESS_HOURS" label="Business Hours" />
      <RadioGroupItem value="FLEXIBLE" label="Flexible Schedule" />
    </RadioGroup>
    
    {operatingType === 'BUSINESS_HOURS' && (
      <div className="hours-config">
        <div>
          <Label>Weekdays</Label>
          <div className="flex gap-2">
            <Input type="time" placeholder="Open" />
            <Input type="time" placeholder="Close" />
          </div>
        </div>
        <div>
          <Label>Weekends</Label>
          <div className="flex gap-2">
            <Input type="time" placeholder="Open" />
            <Input type="time" placeholder="Close" />
          </div>
        </div>
      </div>
    )}
  </div>
</div>
```

### **Step 4: Billing Setup**

**Route**: `/agency/registration/step-4`  
**Component**: `AgencyRegistrationStep4.tsx`

**Billing Configuration:**

```typescript
interface BillingSetup {
  paymentMethods: {
    bkash: {
      enabled: boolean;
      accountNumber?: string;
    };
    nagad: {
      enabled: boolean;
      accountNumber?: string;
    };
    bankTransfer: {
      enabled: boolean;
      accountDetails?: BankAccount;
    };
  };
  invoiceSettings: {
    prefix: string;           // e.g., "SHCA"
    startingNumber: number;   // e.g., 1001
    taxId?: string;
  };
  commissionAcceptance: boolean; // Accept platform commission terms
}
```

### **Step 5: Subscription Selection**

**Route**: `/agency/registration/step-5`  
**Component**: `AgencyRegistrationStep5.tsx`

**Subscription Plans:**

```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  transactionCommission: number; // Percentage
  caregiverLimit: number | 'unlimited';
  jobLimit: number | 'unlimited';
  supportLevel: 'BASIC' | 'PRIORITY' | 'PREMIUM';
}
```

**Plan Selection:**

```tsx
<div className="subscription-plans">
  <h2>Choose Your Plan</h2>
  
  <div className="plans-grid">
    {plans.map(plan => (
      <div 
        key={plan.id} 
        className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
        onClick={() => setSelectedPlan(plan.id)}
      >
        <h3>{plan.name}</h3>
        <div className="price">
          <span className="amount">৳{plan.price}</span>
          <span className="cycle">/{plan.billingCycle.toLowerCase()}</span>
        </div>
        
        <ul className="features">
          {plan.features.map((feature, idx) => (
            <li key={idx}>
              <CheckCircle className="w-4 h-4 text-green" />
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="commission-info">
          <AlertCircle className="w-4 h-4" />
          <p>{plan.transactionCommission}% per transaction</p>
        </div>
        
        <Button className="w-full">
          {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
        </Button>
      </div>
    ))}
  </div>
  
  <div className="payment-summary">
    <h3>Payment Summary</h3>
    <div className="summary-line">
      <span>Subscription Fee</span>
      <span>৳{selectedPlanDetails.price}</span>
    </div>
    <div className="summary-line total">
      <span>Total Due Now</span>
      <span>৳{selectedPlanDetails.price}</span>
    </div>
  </div>
  
  <Button size="lg" onClick={completeRegistration}>
    Complete Registration & Pay
  </Button>
</div>
```

**Registration Completion Flow:**

```typescript
async function completeRegistration() {
  // 1. Create agency account
  const agency = await createAgency({
    ...basicInfo,
    ...legalDocuments,
    ...services,
    ...billingSetup,
    subscriptionPlanId: selectedPlan,
  });
  
  // 2. Process initial payment
  const payment = await processSubscriptionPayment({
    agencyId: agency.id,
    planId: selectedPlan,
    amount: selectedPlanDetails.price,
  });
  
  // 3. Set status to pending verification
  await updateAgencyStatus(agency.id, 'PENDING_VERIFICATION');
  
  // 4. Notify moderators
  await notifyModerators({
    type: 'NEW_AGENCY_REGISTRATION',
    agencyId: agency.id,
  });
  
  // 5. Redirect to pending page
  router.push('/agency/pending-verification');
}
```

---

## 📊 Dashboard & Analytics

### **Agency Dashboard**

**Route**: `/agency/dashboard`  
**Component**: `AgencyAdminDashboard.tsx`

**KPIs Displayed:**

```typescript
interface AgencyKPIs {
  caregivers: number;         // Total caregivers in roster
  activeJobs: number;         // Currently active jobs
  revenue: number;            // This month's revenue
  rating: number;             // Average rating (1-5)
}

interface JobPipeline {
  new: number;                // New jobs needing assignment
  assigned: number;           // Assigned but not started
  active: number;             // Currently active
  completed: number;          // Completed this month
}
```

**Dashboard Layout:**

```tsx
<div className="agency-dashboard">
  {/* KPIs */}
  <div className="kpis grid grid-cols-2 gap-3">
    <KPICard
      icon={<Users />}
      value={kpis.caregivers}
      label="Caregivers"
      gradient="blue"
    />
    <KPICard
      icon={<Briefcase />}
      value={kpis.activeJobs}
      label="Active Jobs"
      gradient="green"
    />
    <KPICard
      icon={<DollarSign />}
      value={`৳${(kpis.revenue / 1000).toFixed(0)}K`}
      label="This Month"
      gradient="pink"
    />
    <KPICard
      icon={<Star />}
      value={kpis.rating}
      label="Rating"
      gradient="orange"
    />
  </div>
  
  {/* Job Pipeline */}
  <div className="job-pipeline">
    <h2>Job Pipeline</h2>
    <div className="pipeline-stages">
      <PipelineStage
        stage="New"
        count={jobPipeline.new}
        color="orange"
        onClick={() => router.push('/agency/jobs?filter=new')}
      />
      <PipelineStage
        stage="Assigned"
        count={jobPipeline.assigned}
        color="blue"
      />
      <PipelineStage
        stage="Active"
        count={jobPipeline.active}
        color="green"
      />
      <PipelineStage
        stage="Completed"
        count={jobPipeline.completed}
        color="gray"
      />
    </div>
  </div>
  
  {/* Recent Jobs */}
  <div className="recent-jobs">
    <h2>Recent Jobs</h2>
    {recentJobs.map(job => (
      <JobCard key={job.id} job={job} />
    ))}
  </div>
  
  {/* Quick Actions */}
  <div className="quick-actions">
    <Button onClick={() => router.push('/agency/packages/new')}>
      <Plus /> Create Package
    </Button>
    <Button onClick={() => router.push('/agency/caregivers/pool')}>
      <Users /> Search Caregivers
    </Button>
    <Button onClick={() => router.push('/agency/jobs')}>
      <Briefcase /> View All Jobs
    </Button>
  </div>
</div>
```

---

## 📦 Package Management

### **Package List**

**Route**: `/agency/packages`  
**Component**: `PackageManagement.tsx`

**Package Structure:**

```typescript
interface CarePackage {
  id: string;
  name: string;
  description: string;
  category: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  basePrice: number;
  duration: number;
  caregiverType: string[];    // e.g., ['Registered Nurse', 'Caregiver']
  features: string[];
  isActive: boolean;
  customizable: boolean;
  views: number;
  inquiries: number;
  purchases: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Create Package**

**Route**: `/agency/packages/new`

**Package Form:**

```tsx
<form onSubmit={handleCreatePackage}>
  {/* Basic Info */}
  <div className="basic-info">
    <Input
      label="Package Name"
      placeholder="e.g., 24/7 Senior Care Premium"
      required
    />
    <Textarea
      label="Description"
      placeholder="Detailed description of services..."
      rows={4}
    />
  </div>
  
  {/* Category & Duration */}
  <div className="category-duration">
    <Select label="Category" required>
      <SelectItem value="HOURLY">Hourly Service</SelectItem>
      <SelectItem value="DAILY">Daily Service</SelectItem>
      <SelectItem value="WEEKLY">Weekly Package</SelectItem>
      <SelectItem value="MONTHLY">Monthly Package</SelectItem>
    </Select>
    
    <Input
      type="number"
      label="Duration"
      suffix={getDurationSuffix(category)}
      required
    />
  </div>
  
  {/* Pricing */}
  <div className="pricing">
    <Input
      type="number"
      label="Package Price (BDT)"
      placeholder="10000"
      required
    />
    
    <Alert>
      <AlertCircle />
      <AlertDescription>
        Platform commission: {commission}%
        <br />
        Your earnings: ৳{calculateEarnings(price, commission)}
      </AlertDescription>
    </Alert>
  </div>
  
  {/* Caregiver Requirements */}
  <div className="caregiver-requirements">
    <Label>Required Caregiver Type</Label>
    <MultiSelect
      options={caregiverTypes}
      value={selectedTypes}
      onChange={setSelectedTypes}
    />
  </div>
  
  {/* Features */}
  <div className="features">
    <Label>Package Features</Label>
    {features.map((feature, idx) => (
      <div key={idx} className="feature-input">
        <Input
          value={feature}
          onChange={(e) => updateFeature(idx, e.target.value)}
          placeholder="e.g., Daily health monitoring"
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => removeFeature(idx)}
        >
          <X />
        </Button>
      </div>
    ))}
    <Button type="button" onClick={addFeature}>
      <Plus /> Add Feature
    </Button>
  </div>
  
  {/* Settings */}
  <div className="settings">
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={setIsActive}
      />
      <label>Active (visible to guardians)</label>
    </div>
    
    <div className="flex items-center gap-2">
      <Switch
        checked={customizable}
        onCheckedChange={setCustomizable}
      />
      <label>Allow customization</label>
    </div>
  </div>
  
  <Button type="submit">Create Package</Button>
</form>
```

---

## 💼 Job Management System

### **Job Inbox**

**Route**: `/agency/jobs`  
**Component**: `JobInbox.tsx`

**Job Statuses:**

```typescript
type JobStatus = 
  | 'NEW'              // Just purchased, needs assignment
  | 'ASSIGNED'         // Caregiver assigned, awaiting acceptance
  | 'ACCEPTED'         // Caregiver accepted
  | 'ACTIVE'           // Job in progress
  | 'COMPLETED'        // Job completed
  | 'CANCELLED';       // Job cancelled
```

**Job Card:**

```tsx
<div className="job-card">
  <div className="job-header">
    <h3>{job.patientName}</h3>
    <Badge variant={getStatusVariant(job.status)}>
      {job.status}
    </Badge>
  </div>
  
  <div className="job-details">
    <div className="detail">
      <Package className="w-4 h-4" />
      <span>{job.packageName}</span>
    </div>
    <div className="detail">
      <Calendar className="w-4 h-4" />
      <span>Start: {formatDate(job.startDate)}</span>
    </div>
    {job.caregiver && (
      <div className="detail">
        <User className="w-4 h-4" />
        <span>{job.caregiver.name}</span>
      </div>
    )}
  </div>
  
  {job.status === 'NEW' && (
    <Button onClick={() => router.push(`/agency/jobs/${job.id}/assign`)}>
      Assign Caregiver
    </Button>
  )}
  
  <Button variant="outline" onClick={() => router.push(`/agency/jobs/${job.id}`)}>
    View Details
  </Button>
</div>
```

### **Assign Caregiver Flow**

**Route**: `/agency/jobs/[id]/assign`  
**Component**: `AssignCaregiverFlow.tsx`

**Two Assignment Methods:**

#### **Method A: From Agency Roster**

```tsx
<div className="assign-from-roster">
  <h2>Assign from Your Roster</h2>
  
  <div className="caregiver-list">
    {rosterCaregivers.map(caregiver => (
      <div key={caregiver.id} className="caregiver-option">
        <Avatar src={caregiver.photo} />
        <div className="info">
          <h3>{caregiver.name}</h3>
          <p>{caregiver.specialization}</p>
          <div className="availability">
            <Circle 
              className={`w-2 h-2 ${getAvailabilityColor(caregiver.status)}`} 
            />
            <span>{caregiver.status}</span>
          </div>
        </div>
        <div className="actions">
          <Button 
            onClick={() => assignCaregiver(caregiver.id)}
            disabled={caregiver.status !== 'AVAILABLE'}
          >
            Assign
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### **Method B: Search Caregiver Pool**

```tsx
<div className="search-pool">
  <h2>Search Platform Caregiver Pool</h2>
  
  <Button onClick={() => router.push(`/agency/caregivers/pool?jobId=${jobId}`)}>
    <Search /> Search Caregiver Pool
  </Button>
</div>
```

**Deployment Process:**

```typescript
async function deployCaregiver(jobId: string, caregiverId: string) {
  // 1. Create deployment
  const deployment = await createDeployment({
    jobId,
    caregiverId,
    agencyId: currentUser.agencyId,
    status: 'PENDING_ACCEPTANCE',
  });
  
  // 2. Send job offer to caregiver
  await sendJobOffer({
    caregiverId,
    jobId,
    details: {
      patientInfo: job.patient,
      schedule: job.schedule,
      wage: calculateCaregiverWage(job),
      duration: job.duration,
    },
  });
  
  // 3. Update job status
  await updateJobStatus(jobId, 'ASSIGNED');
  
  // 4. Notify guardian
  await notifyGuardian({
    guardianId: job.guardianId,
    message: `Caregiver has been assigned to your job.`,
  });
  
  return deployment;
}
```

---

## 🔍 Caregiver Pool Search

**Route**: `/agency/caregivers/pool`  
**Component**: `CaregiverPoolSearch.tsx`

**Search & Filter:**

```tsx
<div className="caregiver-pool-search">
  <h2>Search Caregiver Pool</h2>
  
  {/* Search Bar */}
  <div className="search-bar">
    <Input
      type="search"
      placeholder="Search by name, skills, location..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  
  {/* Filters */}
  <div className="filters">
    <Select 
      label="Specialization"
      value={filterSpecialization}
      onChange={setFilterSpecialization}
    >
      <SelectItem value="">All</SelectItem>
      <SelectItem value="elderly">Elderly Care</SelectItem>
      <SelectItem value="pediatric">Pediatric Care</SelectItem>
      <SelectItem value="post-surgery">Post-Surgery</SelectItem>
    </Select>
    
    <Select 
      label="Experience"
      value={filterExperience}
      onChange={setFilterExperience}
    >
      <SelectItem value="">All</SelectItem>
      <SelectItem value="0-2">0-2 years</SelectItem>
      <SelectItem value="3-5">3-5 years</SelectItem>
      <SelectItem value="5+">5+ years</SelectItem>
    </Select>
    
    <Select 
      label="Availability"
      value={filterAvailability}
      onChange={setFilterAvailability}
    >
      <SelectItem value="">All</SelectItem>
      <SelectItem value="AVAILABLE">Available</SelectItem>
      <SelectItem value="BUSY">Busy</SelectItem>
    </Select>
    
    <Select 
      label="Rating"
      value={filterRating}
      onChange={setFilterRating}
    >
      <SelectItem value="">All</SelectItem>
      <SelectItem value="4+">4+ stars</SelectItem>
      <SelectItem value="4.5+">4.5+ stars</SelectItem>
    </Select>
  </div>
  
  {/* Results */}
  <div className="search-results">
    {caregivers.map(caregiver => (
      <div key={caregiver.id} className="caregiver-card">
        <Avatar src={caregiver.photo} size="lg" />
        
        <div className="info">
          <h3>{caregiver.name}</h3>
          <p className="specialization">{caregiver.specialization}</p>
          
          <div className="stats">
            <div className="stat">
              <Star className="w-4 h-4 text-yellow" />
              <span>{caregiver.rating}</span>
            </div>
            <div className="stat">
              <Briefcase className="w-4 h-4" />
              <span>{caregiver.completedJobs} jobs</span>
            </div>
            <div className="stat">
              <Clock className="w-4 h-4" />
              <span>{caregiver.experience} years</span>
            </div>
          </div>
          
          <div className="availability">
            <Circle className={`w-2 h-2 ${getStatusColor(caregiver.status)}`} />
            <span>{caregiver.status}</span>
          </div>
        </div>
        
        <div className="actions">
          <Button 
            variant="outline"
            onClick={() => viewCaregiverProfile(caregiver.id)}
          >
            View Profile
          </Button>
          <Button 
            onClick={() => sendJobOffer(caregiver.id)}
            disabled={caregiver.status !== 'AVAILABLE'}
          >
            Send Offer
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Caregiver Profile View:**

```tsx
<div className="caregiver-profile-modal">
  <Avatar src={caregiver.photo} size="xl" />
  
  <h2>{caregiver.name}</h2>
  <p>{caregiver.specialization}</p>
  
  {/* Certificates */}
  <div className="certificates">
    <h3>Certifications</h3>
    {caregiver.certificates.map(cert => (
      <Badge key={cert.id}>{cert.name}</Badge>
    ))}
  </div>
  
  {/* Experience */}
  <div className="experience">
    <h3>Experience</h3>
    <p>{caregiver.experience} years in healthcare</p>
    <p>{caregiver.completedJobs} jobs completed</p>
  </div>
  
  {/* Ratings & Reviews */}
  <div className="reviews">
    <h3>Reviews</h3>
    <div className="rating-summary">
      <Star className="w-6 h-6 text-yellow" />
      <span className="text-2xl">{caregiver.rating}</span>
      <span className="text-sm">({caregiver.reviewCount} reviews)</span>
    </div>
    
    {caregiver.recentReviews.map(review => (
      <div key={review.id} className="review">
        <p>{review.comment}</p>
        <span className="text-sm text-muted">- {review.guardianName}</span>
      </div>
    ))}
  </div>
</div>
```

---

## 👥 Caregiver Roster Management

**Route**: `/agency/caregivers`  
**Component**: `CaregiverRoster.tsx`

**Roster Actions:**
- View all agency caregivers
- Add new caregiver
- Update caregiver details
- Manage assignments
- Track performance

---

## 💰 Billing & Invoicing

**Route**: `/agency/billing`  
**Component**: `BillingHistory.tsx`

**Three-Tier Billing:**

```
CAREGIVER → AGENCY → GUARDIAN
    ↓           ↓         ↓
    Platform Commission
```

**Invoice Types:**
1. **Incoming**: From Guardians (for services)
2. **Outgoing**: To Caregivers (wages)
3. **Platform Fees**: To Platform (subscription + commission)

---

## 🔄 Subscription Management

**Route**: `/agency/subscription/active`  
**Component**: `SubscriptionActive.tsx`

**Features:**
- View current plan
- Upgrade/downgrade
- Cancel subscription
- Payment history
- Invoice downloads

---

## 🤝 Package Negotiation

**Negotiation Flow:**

```
Guardian sends counter-offer
    ↓
Agency receives inquiry
    ↓
Agency reviews and decides:
    ├─ Offer Discount
    ├─ Add Services
    └─ Decline
    ↓
Guardian accepts/counters again
    ↓
Purchase → Job Created
```

**Route**: `/agency/inquiries`  
**Component**: `PackageInquiries.tsx`

---

## 🐛 Debugging Guide

### **Issue: Job Not Appearing in Inbox**

```typescript
// Check job status
const job = await db.job.findUnique({
  where: { id: jobId },
  include: { package: true, guardian: true },
});
console.log('Job:', job);
console.log('Status:', job.status);
console.log('Agency ID:', job.agencyId);
```

---

## 🧪 Testing Guide

```typescript
describe('Agency Job Assignment', () => {
  it('assigns caregiver to job', async () => {
    const result = await assignCaregiver(jobId, caregiverId);
    expect(result.status).toBe('ASSIGNED');
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- Registration flow (5 steps): 95%
- Package management: 90%
- Job assignment: 88%
- Caregiver pool search: 85%

### **❌ TODO**
- [ ] Negotiation E2E tests
- [ ] Billing integration tests

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
