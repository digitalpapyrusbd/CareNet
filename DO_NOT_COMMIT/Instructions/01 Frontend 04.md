# Frontend 04: Moderator Portal Implementation

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [03: Admin Portal](01%20Frontend%2003.md)

---

## 📋 Table of Contents

1. [Moderator Portal Overview](#moderator-portal-overview)
2. [Dashboard & Workload](#dashboard--workload)
3. [Verification Queues (6 Types)](#verification-queues-6-types)
4. [Agency Verification Workflow](#agency-verification-workflow)
5. [Caregiver Verification Workflow](#caregiver-verification-workflow)
6. [Dispute Management](#dispute-management)
7. [Support Ticket System](#support-ticket-system)
8. [Package Template Creation](#package-template-creation)
9. [Moderator Limitations](#moderator-limitations)
10. [Debugging Guide](#debugging-guide)
11. [Testing Guide](#testing-guide)
12. [Testing Progress Log](#testing-progress-log)

---

## 👮 Moderator Portal Overview

### **Purpose**
The Moderator Portal is the **first-line operations interface**, providing:
- ✅ Review and recommend (NO final approval authority)
- ✅ Conduct verifications and assessments
- ✅ Resolve simple disputes/tickets
- ✅ Escalate complex cases to Admin
- ✅ Create package templates
- ✅ Multi-entity communication

### **Access Control**
- **Role Required**: `MODERATOR`
- **MFA**: Optional (recommended)
- **Features**: 38 pages, 52 components

### **Key Principle**
> **Moderators CANNOT make final approvals. All work must be submitted to Admin for final decision.**

### **Moderator Portal Routes**

```
/moderator/
├── login                      # Moderator authentication
├── dashboard                  # Workload overview
├── analytics                  # Personal performance metrics
├── verification/              # Verification management
│   ├── agencies               # Agency verification queue
│   ├── agencies/[id]          # Review specific agency
│   ├── caregivers             # Caregiver verification queue
│   └── caregivers/[id]/pipeline # Caregiver verification pipeline
├── queues/                    # Specialized verification queues
│   ├── legal                  # Agency legal documents
│   ├── physical               # Agency physical verification
│   ├── certificates           # Caregiver certificates
│   ├── police                 # Police clearance
│   ├── interviews             # Interview assessments
│   └── psych                  # Psychological analysis
├── disputes/                  # Dispute resolution
│   ├── page                   # Dispute queue
│   └── [id]                   # Resolve specific dispute
├── tickets                    # Support tickets
├── packages/                  # Package template creation
│   ├── agency                 # Agency package templates
│   └── caregiver              # Caregiver package templates
├── subscription/              # Subscription package creation
│   ├── agency                 # Agency subscriptions
│   └── caregiver              # Caregiver subscriptions
├── messages                   # Communications
└── billing                    # Billing oversight (read-only)
```

---

## 📊 Dashboard & Workload

### **Moderator Dashboard**

**File**: `src/app/moderator/dashboard/page.tsx`  
**Component**: `ModeratorDashboard.tsx`

**Key Metrics:**

```typescript
interface ModeratorKPIs {
  pendingVerifications: number;   // Total pending reviews
  openDisputes: number;           // Disputes assigned
  activeCaregivers: number;       // Platform caregivers
  activeAgencies: number;         // Platform agencies
}

interface QueueSummary {
  agencies: {
    pending: number;
    approved: number;
    rejected: number;
  };
  caregivers: {
    pending: number;
    inProgress: number;
    approved: number;
  };
}
```

**Dashboard Sections:**

1. **Workload KPIs (4 Cards)**
   - Pending Verifications (with "Review Now" CTA)
   - Open Disputes (with "Resolve" CTA)
   - Active Caregivers (informational)
   - Active Agencies (informational)

2. **Queue Summary**
   - Agency verification status breakdown
   - Caregiver verification status breakdown

3. **Recent Activity**
   - Last 10 actions performed
   - Timestamps
   - Entity names

4. **Quick Actions**
   - Go to Verification Queues
   - Resolve Disputes
   - Answer Support Tickets
   - Create Package Templates

**Example Dashboard Card:**

```tsx
<div className="finance-card p-4">
  <div className="flex items-center gap-3 mb-3">
    <div className="icon-container bg-gradient-orange">
      <AlertCircle className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl">{pendingVerifications}</p>
      <p className="text-sm text-muted">Pending</p>
    </div>
  </div>
  <Button 
    onClick={() => router.push('/moderator/verification/caregivers')}
    className="w-full"
  >
    Review Now
  </Button>
</div>
```

### **Performance Analytics**

**Route**: `/moderator/analytics`  
**Component**: `ModeratorPlatformAnalytics.tsx`

**Personal Metrics:**
- Verifications completed (by type)
- Average review time
- Approval rate (admin accepts your recommendations)
- Disputes resolved
- Tickets answered
- Response time

**Charts:**
- Daily activity chart
- Verification type distribution
- Approval vs rejection trend
- Performance score over time

---

## 🔍 Verification Queues (6 Types)

### **Queue Overview**

All verification queues follow the same pattern:
1. **Review** → Documents/evidence
2. **Assess** → Conduct interviews/analysis if needed
3. **Recommend** → Approve or Reject
4. **Submit** → Send to Admin for final decision
5. **Wait** → Admin makes 3-way decision
6. **Resubmit** → If Admin sends back with feedback

### **Common Queue Features**

```typescript
interface VerificationItem {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'AGENCY' | 'CAREGIVER';
  verificationType: string;
  status: 'PENDING' | 'IN_REVIEW' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  assignedTo?: string;
  submittedAt?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
```

**Queue Actions:**
- Assign to self
- View details
- Start review
- Submit recommendation
- Escalate to Admin (if complex)

---

## 🏢 Agency Verification Workflow

### **Agency Verification Queue**

**Route**: `/moderator/verification/agencies`  
**Component**: `AgencyVerificationQueueAdmin.tsx`

**Two-Step Process:**
1. Legal Documents Review
2. Physical Verification

### **Step 1: Legal Documents Review**

**Route**: `/moderator/queues/legal`  
**Component**: `AgencyLegalDocQueue.tsx`

**Documents to Review:**

```typescript
interface AgencyDocuments {
  tradeLicense: {
    file: string;
    issueDate: Date;
    expiryDate: Date;
    licenseNumber: string;
  };
  tinCertificate: {
    file: string;
    tinNumber: string;
  };
  businessRegistration: {
    file: string;
    registrationNumber: string;
  };
  ownerNID: {
    file: string;
    nidNumber: string;
  };
  bankAccount: {
    accountNumber: string;
    bankName: string;
    branchName: string;
  };
}
```

**Review Checklist:**
- [ ] Trade license is valid and not expired
- [ ] TIN certificate matches business name
- [ ] Registration documents are authentic
- [ ] Owner NID is clear and readable
- [ ] Bank account details are verifiable
- [ ] All documents match the agency name
- [ ] No red flags or inconsistencies

**Review Interface:**

```tsx
<div className="legal-review">
  <h2>Legal Documents Review</h2>
  <p className="text-sm text-muted">Agency: {agency.name}</p>
  
  {/* Document Viewer */}
  <div className="documents">
    {documents.map(doc => (
      <div key={doc.type} className="document-card">
        <h3>{doc.name}</h3>
        <img src={doc.url} alt={doc.name} />
        <div className="verification">
          <Checkbox 
            checked={doc.verified}
            onCheckedChange={(checked) => handleVerify(doc.type, checked)}
          />
          <label>Document verified</label>
        </div>
        {!doc.verified && (
          <Textarea
            placeholder="Issue with this document..."
            value={doc.issue}
            onChange={(e) => handleIssue(doc.type, e.target.value)}
          />
        )}
      </div>
    ))}
  </div>
  
  {/* Moderator Notes */}
  <div className="notes">
    <h3>Review Notes</h3>
    <Textarea
      placeholder="Additional observations..."
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
    />
  </div>
  
  {/* Recommendation */}
  <div className="recommendation">
    <h3>Your Recommendation</h3>
    <RadioGroup value={recommendation}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="APPROVE" id="approve" />
        <Label htmlFor="approve">✅ Recommend Approval</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="REJECT" id="reject" />
        <Label htmlFor="reject">❌ Recommend Rejection</Label>
      </div>
    </RadioGroup>
  </div>
  
  {/* Actions */}
  <div className="actions">
    <Button variant="outline" onClick={handleSave}>
      Save Draft
    </Button>
    <Button onClick={handleSubmit}>
      Submit to Admin
    </Button>
  </div>
</div>
```

**Submission to Admin:**

```typescript
async function submitLegalReview() {
  const submission = {
    type: 'AGENCY_LEGAL',
    agencyId: agency.id,
    moderatorId: currentUser.id,
    recommendation: 'APPROVE' | 'REJECT',
    notes: moderatorNotes,
    documents: documentChecklist,
    submittedAt: new Date(),
  };
  
  // Create submission for admin review
  await fetch('/api/moderator/submissions', {
    method: 'POST',
    body: JSON.stringify(submission),
  });
  
  // Update agency status
  await fetch(`/api/agencies/${agency.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ 
      status: 'LEGAL_SUBMITTED',
      submittedBy: currentUser.id,
    }),
  });
  
  // Notify admin
  await sendNotification({
    to: 'admin',
    type: 'NEW_SUBMISSION',
    message: `Legal document review submitted for ${agency.name}`,
  });
}
```

### **Step 2: Physical Verification**

**Route**: `/moderator/queues/physical`  
**Component**: `AgencyPhysicalVerificationQueue.tsx`

**Verification Process:**
1. Schedule site visit
2. Visit agency location
3. Take photos (exterior, interior, staff)
4. Interview staff/owner
5. Check equipment and facilities
6. Verify contact information
7. Complete checklist
8. Submit report to Admin

**Physical Verification Checklist:**

```typescript
interface PhysicalVerificationChecklist {
  locationExists: boolean;
  addressMatches: boolean;
  officeAccessible: boolean;
  staffPresent: boolean;
  equipmentAvailable: boolean;
  licensesDisplayed: boolean;
  contactVerified: boolean;
  professionalSetup: boolean;
}
```

**Photo Requirements:**
- Office exterior (building)
- Office interior (workspace)
- Staff photo (if available)
- Equipment/facilities
- Displayed licenses

**Report Submission:**

```tsx
<div className="physical-verification">
  <h2>Physical Verification Report</h2>
  
  {/* Visit Details */}
  <div className="visit-info">
    <Label>Visit Date & Time</Label>
    <Input type="datetime-local" value={visitDate} />
    
    <Label>Location Coordinates (Optional)</Label>
    <Button onClick={getCurrentLocation}>
      <MapPin className="w-4 h-4 mr-2" />
      Use Current Location
    </Button>
  </div>
  
  {/* Photo Upload */}
  <div className="photos">
    <h3>Location Photos</h3>
    <div className="photo-grid">
      <PhotoUpload label="Exterior" required />
      <PhotoUpload label="Interior" required />
      <PhotoUpload label="Staff" />
      <PhotoUpload label="Equipment" />
    </div>
  </div>
  
  {/* Checklist */}
  <div className="checklist">
    <h3>Verification Checklist</h3>
    {checklistItems.map(item => (
      <div key={item.key} className="flex items-center gap-2">
        <Checkbox 
          checked={checklist[item.key]}
          onCheckedChange={(checked) => 
            setChecklist(prev => ({ ...prev, [item.key]: checked }))
          }
        />
        <label>{item.label}</label>
      </div>
    ))}
  </div>
  
  {/* Report Notes */}
  <Textarea
    placeholder="Detailed observation notes..."
    value={reportNotes}
    onChange={(e) => setReportNotes(e.target.value)}
    rows={6}
  />
  
  {/* Recommendation */}
  <RadioGroup value={recommendation}>
    <RadioGroupItem value="APPROVE" label="✅ Location Verified" />
    <RadioGroupItem value="REJECT" label="❌ Issues Found" />
  </RadioGroup>
  
  <Button onClick={submitPhysicalVerification}>
    Submit to Admin
  </Button>
</div>
```

---

## 👨‍⚕️ Caregiver Verification Workflow

### **Caregiver Verification Pipeline**

**Route**: `/moderator/verification/caregivers/[id]/pipeline`  
**Component**: `CaregiverVerificationQueue.tsx`

**6-Step Verification Process:**

```typescript
const verificationSteps = [
  { id: 1, name: 'Professional Certificates', status: 'PENDING' },
  { id: 2, name: 'Police Clearance', status: 'PENDING' },
  { id: 3, name: 'Interview Assessment', status: 'PENDING' },
  { id: 4, name: 'Psychological Analysis', status: 'PENDING' },
  { id: 5, name: 'Document Verification', status: 'PENDING' },
  { id: 6, name: 'Final Approval', status: 'ADMIN_ONLY' },
];
```

**Pipeline View:**

```tsx
<div className="verification-pipeline">
  <h2>Caregiver Verification: {caregiver.name}</h2>
  
  <div className="steps">
    {verificationSteps.map((step, index) => (
      <div key={step.id} className="step">
        <div className={`step-indicator ${step.status}`}>
          {index + 1}
        </div>
        <div className="step-content">
          <h3>{step.name}</h3>
          <p className="text-sm text-muted">{getStatusText(step.status)}</p>
          {step.status === 'PENDING' && (
            <Button size="sm" onClick={() => startStep(step.id)}>
              Start Review
            </Button>
          )}
          {step.status === 'IN_PROGRESS' && (
            <Button size="sm" onClick={() => continueStep(step.id)}>
              Continue
            </Button>
          )}
          {step.status === 'COMPLETED' && (
            <Badge variant="success">✓ Submitted</Badge>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
```

### **Step 1: Professional Certificates**

**Route**: `/moderator/queues/certificates`  
**Component**: `CaregiverCertificateQueue.tsx`

**Certificate Types:**
- Nursing degree/diploma
- Specialized training (e.g., elder care, pediatric)
- First aid certification
- CPR certification
- Additional qualifications

**Review Process:**

```tsx
<div className="certificate-review">
  <h2>Certificate Verification</h2>
  
  {certificates.map(cert => (
    <div key={cert.id} className="certificate-card">
      {/* Certificate Image */}
      <div className="cert-image">
        <img src={cert.imageUrl} alt={cert.name} />
        <Button size="sm" onClick={() => openFullScreen(cert.imageUrl)}>
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Certificate Details */}
      <div className="cert-details">
        <h3>{cert.name}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Issued By</Label>
            <p>{cert.issuer}</p>
          </div>
          <div>
            <Label>Issue Date</Label>
            <p>{formatDate(cert.issueDate)}</p>
          </div>
          <div>
            <Label>Expiry Date</Label>
            <p>{formatDate(cert.expiryDate)}</p>
          </div>
          <div>
            <Label>Certificate No.</Label>
            <p>{cert.certificateNumber}</p>
          </div>
        </div>
      </div>
      
      {/* Verification */}
      <div className="verification">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={cert.verified}
            onCheckedChange={(checked) => verifyCertificate(cert.id, checked)}
          />
          <label>Certificate appears authentic</label>
        </div>
        
        {!cert.verified && (
          <Textarea
            placeholder="Issues found..."
            value={cert.issues}
            onChange={(e) => setCertificateIssues(cert.id, e.target.value)}
          />
        )}
      </div>
    </div>
  ))}
  
  {/* Overall Assessment */}
  <div className="overall-assessment">
    <h3>Overall Certificate Assessment</h3>
    <Textarea
      placeholder="Summary of certificate review..."
      value={assessmentNotes}
      onChange={(e) => setAssessmentNotes(e.target.value)}
    />
    
    <RadioGroup value={recommendation}>
      <RadioGroupItem value="APPROVE" label="✅ All certificates valid" />
      <RadioGroupItem value="REJECT" label="❌ Certificate issues found" />
    </RadioGroup>
  </div>
  
  <Button onClick={submitCertificateReview}>
    Submit to Admin
  </Button>
</div>
```

### **Step 2: Police Clearance**

**Route**: `/moderator/queues/police`  
**Component**: `CaregiverPoliceClearanceQueue.tsx`

**Documents:**
- Police clearance certificate
- NID verification
- Background check report

**Verification Points:**
- Certificate is recent (< 6 months)
- No criminal record
- NID matches application
- Photo matches NID

### **Step 3: Interview Assessment**

**Route**: `/moderator/queues/interviews`  
**Component**: `CaregiverInterviewQueue.tsx`

**Interview Process:**

1. **Schedule Interview**
   - Date & time selection
   - Send notification to caregiver
   - Prepare interview questions

2. **Conduct Interview**
   - Video call or in-person
   - Ask standardized questions
   - Assess responses
   - Note observations

3. **Score Assessment**

```typescript
interface InterviewScores {
  communication: number;        // 1-10
  professionalKnowledge: number; // 1-10
  careApproach: number;         // 1-10
  problemSolving: number;       // 1-10
  attitude: number;             // 1-10
  overall: number;              // 1-10
}
```

**Interview Form:**

```tsx
<div className="interview-assessment">
  <h2>Interview Assessment: {caregiver.name}</h2>
  
  {/* Interview Details */}
  <div className="interview-info">
    <Label>Interview Date</Label>
    <Input type="datetime-local" value={interviewDate} />
    
    <Label>Interview Method</Label>
    <Select value={method}>
      <SelectItem value="video">Video Call</SelectItem>
      <SelectItem value="inperson">In-Person</SelectItem>
      <SelectItem value="phone">Phone</SelectItem>
    </Select>
  </div>
  
  {/* Scoring */}
  <div className="scoring">
    <h3>Assessment Scores (1-10)</h3>
    
    {scoreCategories.map(category => (
      <div key={category.key} className="score-item">
        <Label>{category.label}</Label>
        <div className="flex items-center gap-4">
          <Slider
            min={1}
            max={10}
            value={[scores[category.key]]}
            onValueChange={([value]) => 
              setScores(prev => ({ ...prev, [category.key]: value }))
            }
          />
          <span className="text-2xl font-bold w-8">{scores[category.key]}</span>
        </div>
      </div>
    ))}
    
    <div className="total-score">
      <h4>Total Score: {totalScore}/60</h4>
      <Progress value={(totalScore / 60) * 100} />
    </div>
  </div>
  
  {/* Interview Notes */}
  <div className="notes">
    <Label>Interview Notes</Label>
    <Textarea
      placeholder="Detailed observations from the interview..."
      value={interviewNotes}
      onChange={(e) => setInterviewNotes(e.target.value)}
      rows={8}
    />
  </div>
  
  {/* Key Observations */}
  <div className="observations">
    <Label>Key Strengths</Label>
    <Textarea placeholder="What stood out positively..." />
    
    <Label>Areas of Concern</Label>
    <Textarea placeholder="Any concerns or red flags..." />
  </div>
  
  {/* Recommendation */}
  <div className="recommendation">
    <RadioGroup value={recommendation}>
      <RadioGroupItem value="EXCELLENT" label="⭐ Excellent - Highly Recommend" />
      <RadioGroupItem value="GOOD" label="✅ Good - Recommend" />
      <RadioGroupItem value="AVERAGE" label="⚠️ Average - Acceptable" />
      <RadioGroupItem value="POOR" label="❌ Poor - Not Recommend" />
    </RadioGroup>
  </div>
  
  <Button onClick={submitInterviewAssessment}>
    Submit to Admin
  </Button>
</div>
```

### **Step 4: Psychological Analysis**

**Route**: `/moderator/queues/psych`  
**Component**: `CaregiverPsychAnalysisQueue.tsx`

**Assessment Areas:**
- Emotional stability
- Stress management
- Empathy and compassion
- Patience level
- Professional boundaries
- Mental fitness for caregiving

**Psychological Rating:**

```typescript
type PsychRating = 
  | 'FIT'           // Fully suitable for caregiving
  | 'ACCEPTABLE'    // Suitable with minor concerns
  | 'NEEDS_SUPPORT' // Requires supervision/support
  | 'UNFIT';        // Not suitable for caregiving
```

**Assessment Form:**

```tsx
<div className="psych-analysis">
  <h2>Psychological Analysis: {caregiver.name}</h2>
  
  <Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      This assessment evaluates psychological fitness for caregiving roles.
      Be thorough and objective in your analysis.
    </AlertDescription>
  </Alert>
  
  {/* Assessment Categories */}
  <div className="categories">
    {psychCategories.map(category => (
      <div key={category.key} className="category">
        <h3>{category.name}</h3>
        <p className="text-sm text-muted">{category.description}</p>
        
        <RadioGroup value={ratings[category.key]}>
          <RadioGroupItem value="EXCELLENT" label="Excellent" />
          <RadioGroupItem value="GOOD" label="Good" />
          <RadioGroupItem value="FAIR" label="Fair" />
          <RadioGroupItem value="POOR" label="Poor" />
        </RadioGroup>
        
        <Textarea
          placeholder="Notes for this category..."
          value={categoryNotes[category.key]}
          onChange={(e) => 
            setCategoryNotes(prev => ({ ...prev, [category.key]: e.target.value }))
          }
        />
      </div>
    ))}
  </div>
  
  {/* Overall Analysis */}
  <div className="overall-analysis">
    <Label>Overall Psychological Assessment</Label>
    <Textarea
      placeholder="Comprehensive analysis summary..."
      rows={6}
    />
  </div>
  
  {/* Final Rating */}
  <div className="final-rating">
    <h3>Final Psychological Rating</h3>
    <RadioGroup value={finalRating}>
      <RadioGroupItem value="FIT" label="✅ FIT - Fully suitable" />
      <RadioGroupItem value="ACCEPTABLE" label="⚠️ ACCEPTABLE - Minor concerns" />
      <RadioGroupItem value="NEEDS_SUPPORT" label="⚠️ NEEDS SUPPORT - Requires supervision" />
      <RadioGroupItem value="UNFIT" label="❌ UNFIT - Not suitable" />
    </RadioGroup>
  </div>
  
  <Button onClick={submitPsychAnalysis}>
    Submit to Admin
  </Button>
</div>
```

### **Step 5: Document Verification**

Final document cross-check by moderator before admin final approval.

### **Step 6: Final Approval**

**ADMIN ONLY** - Moderator has no access to this step.

---

## ⚖️ Dispute Management

### **Dispute Queue**

**Route**: `/moderator/disputes`  
**Component**: `DisputeResolution.tsx`

**Dispute Types:**
- Payment disputes
- Service quality disputes
- Job assignment disputes
- Rating/review disputes

**Dispute Workflow:**

```
Dispute Filed
    ↓
Assigned to Moderator
    ↓
Moderator Reviews Evidence
    ↓
Decision Path:
    ├─ Simple Dispute → Resolve → Submit to Admin
    └─ Complex Dispute → Escalate to Admin Immediately
    ↓
Admin Makes Final Decision
```

**Dispute Resolution Interface:**

```tsx
<div className="dispute-resolution">
  <h2>Dispute #{dispute.id}</h2>
  
  {/* Parties Involved */}
  <div className="parties">
    <div className="party">
      <h3>Filed By</h3>
      <p>{dispute.filedBy.name} ({dispute.filedBy.role})</p>
    </div>
    <div className="party">
      <h3>Against</h3>
      <p>{dispute.against.name} ({dispute.against.role})</p>
    </div>
  </div>
  
  {/* Dispute Details */}
  <div className="details">
    <Label>Dispute Type</Label>
    <p>{dispute.type}</p>
    
    <Label>Filed Date</Label>
    <p>{formatDate(dispute.createdAt)}</p>
    
    <Label>Description</Label>
    <p>{dispute.description}</p>
  </div>
  
  {/* Evidence */}
  <div className="evidence">
    <h3>Evidence Submitted</h3>
    {dispute.evidence.map(item => (
      <div key={item.id} className="evidence-item">
        {item.type === 'image' && <img src={item.url} />}
        {item.type === 'document' && <FileText />}
        {item.type === 'text' && <p>{item.content}</p>}
      </div>
    ))}
  </div>
  
  {/* Moderator Decision */}
  <div className="decision">
    <h3>Your Decision</h3>
    
    {/* Complexity Check */}
    <div className="complexity">
      <Label>Dispute Complexity</Label>
      <RadioGroup value={complexity}>
        <RadioGroupItem value="SIMPLE" label="Simple - I can resolve" />
        <RadioGroupItem value="COMPLEX" label="Complex - Needs admin" />
      </RadioGroup>
    </div>
    
    {complexity === 'SIMPLE' && (
      <>
        <Label>Resolution</Label>
        <RadioGroup value={resolution}>
          <RadioGroupItem value="FAVOR_FILER" label="In favor of filer" />
          <RadioGroupItem value="FAVOR_DEFENDANT" label="In favor of defendant" />
          <RadioGroupItem value="COMPROMISE" label="Compromise solution" />
        </RadioGroup>
        
        <Label>Resolution Notes</Label>
        <Textarea
          placeholder="Explain your resolution..."
          value={resolutionNotes}
        />
        
        <Button onClick={submitResolution}>
          Submit to Admin for Approval
        </Button>
      </>
    )}
    
    {complexity === 'COMPLEX' && (
      <>
        <Label>Escalation Reason</Label>
        <Textarea
          placeholder="Why this needs admin attention..."
          value={escalationReason}
        />
        
        <Button onClick={escalateToAdmin}>
          Escalate to Admin
        </Button>
      </>
    )}
  </div>
</div>
```

---

## 🎫 Support Ticket System

**Route**: `/moderator/tickets`  
**Component**: `SupportTickets.tsx`

**Ticket Types:**
- Technical issues
- Account problems
- Payment questions
- General inquiries

**Ticket Resolution:**

```tsx
<div className="ticket-list">
  {tickets.map(ticket => (
    <div key={ticket.id} className="ticket-card">
      <div className="ticket-header">
        <h3>Ticket #{ticket.id}</h3>
        <Badge variant={getPriorityVariant(ticket.priority)}>
          {ticket.priority}
        </Badge>
      </div>
      
      <div className="ticket-info">
        <p><strong>From:</strong> {ticket.user.name}</p>
        <p><strong>Subject:</strong> {ticket.subject}</p>
        <p><strong>Date:</strong> {formatDate(ticket.createdAt)}</p>
      </div>
      
      <p className="ticket-message">{ticket.message}</p>
      
      <div className="ticket-actions">
        <Button 
          size="sm" 
          onClick={() => openTicket(ticket.id)}
        >
          {ticket.canResolve ? 'Resolve' : 'Escalate'}
        </Button>
      </div>
    </div>
  ))}
</div>
```

---

## 📦 Package Template Creation

### **Agency Package Templates**

**Route**: `/moderator/packages/agency`  
**Component**: `AgencyPackageTemplateCreator.tsx`

Moderators can create templates that agencies can customize.

### **Caregiver Package Templates**

**Route**: `/moderator/packages/caregiver`  
**Component**: `CaregiverPackageTemplateCreator.tsx`

Templates for independent caregivers to use.

---

## 🚫 Moderator Limitations

### **What Moderators CANNOT Do**

❌ **Make Final Approvals** - All work requires admin approval  
❌ **Deploy Other Moderators** - Only admin can add moderators  
❌ **Change Platform Settings** - No system configuration access  
❌ **Override Admin Decisions** - Admin decisions are final  
❌ **Access Financial Details** - Limited billing visibility  
❌ **Delete Entities** - No deletion permissions  
❌ **Modify Roles** - Cannot change user roles  

### **What Moderators CAN Do**

✅ **Review and Recommend** - All verifications  
✅ **Conduct Assessments** - Interviews, psych analysis  
✅ **Resolve Simple Cases** - Basic disputes/tickets  
✅ **Escalate Complex Cases** - Send to admin  
✅ **Create Templates** - Package templates  
✅ **Communicate** - With all entities  
✅ **View Analytics** - Personal performance  

---

## 🐛 Debugging Guide

### **Issue: Submission Not Reaching Admin**

**Debug:**
```typescript
// Check submission status
const submission = await db.submission.findUnique({
  where: { id: submissionId },
  include: { moderator: true, entity: true },
});

console.log('Submission:', submission);
console.log('Status:', submission.status);
console.log('Submitted at:', submission.submittedAt);
```

### **Issue: Admin Sent Back, Not Seeing Feedback**

**Check:**
```typescript
const returned = await db.submission.findMany({
  where: {
    moderatorId: currentUser.id,
    status: 'RETURNED',
  },
  include: {
    adminFeedback: true,
  },
});
```

---

## 🧪 Testing Guide

```typescript
describe('Moderator Verification Workflow', () => {
  it('submits certificate review to admin', async () => {
    const result = await submitCertificateReview({
      caregiverId: 'cg-123',
      moderatorId: 'mod-456',
      recommendation: 'APPROVE',
      notes: 'All certificates valid',
    });
    
    expect(result.status).toBe('SUBMITTED');
  });
  
  it('escalates complex dispute to admin', async () => {
    const result = await escalateDispute({
      disputeId: 'disp-789',
      moderatorId: 'mod-456',
      reason: 'Requires legal expertise',
    });
    
    expect(result.escalated).toBe(true);
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**

| Feature | Tests | Coverage |
|---------|-------|----------|
| Verification Submissions | 8 | 88% |
| Dispute Resolution | 5 | 85% |
| Interview Assessment | 4 | 90% |
| Queue Management | 6 | 87% |

### **❌ TODO**
- [ ] Full 6-step pipeline E2E test
- [ ] Admin feedback loop test
- [ ] Escalation workflow test

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
