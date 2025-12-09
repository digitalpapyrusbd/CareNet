import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "../ui/button";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.3)'
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 style={{ color: '#535353' }}>Privacy Policy</h1>
              <p className="text-sm" style={{ color: '#848484' }}>Last updated: December 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="finance-card p-8 space-y-6">
          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>1. Introduction</h2>
            <p style={{ color: '#535353' }}>
              CareNet Platform ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>2.1 Personal Information</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>Name, phone number, email address</li>
                  <li>Profile photos and identification documents</li>
                  <li>Address and location information</li>
                  <li>Date of birth and gender</li>
                  <li>Banking and payment information</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>2.2 Medical Information (Limited)</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>Medical conditions and allergies (for care coordination only)</li>
                  <li>Medication schedules and vital signs</li>
                  <li>Care logs and activity records</li>
                </ul>
                <p className="mt-2 text-sm" style={{ color: '#FF6B7A' }}>
                  ⚠️ Important: CareNet is not designed for storing highly sensitive medical records or PII. For critical medical data, please use specialized healthcare systems.
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>2.3 Usage Information</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and geolocation data</li>
                  <li>Usage patterns and interactions with the Platform</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>2.4 Communication Data</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>Messages between users, agencies, and caregivers</li>
                  <li>Support tickets and feedback</li>
                  <li>Voice recordings (with consent, for care documentation)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>3. How We Use Your Information</h2>
            <div className="space-y-2" style={{ color: '#535353' }}>
              <p>We use collected information for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Providing and improving our Platform services</li>
                <li>Facilitating connections between guardians, caregivers, and agencies</li>
                <li>Processing payments and managing transactions</li>
                <li>Conducting verification and background checks</li>
                <li>Ensuring safety and security of all users</li>
                <li>Sending notifications, updates, and service-related communications</li>
                <li>Analyzing usage patterns to improve user experience</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>4. Information Sharing and Disclosure</h2>
            <div className="space-y-3">
              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>4.1 With Other Users</h3>
                <p style={{ color: '#535353' }}>
                  Certain information (name, profile photo, ratings, reviews) is shared with other users to facilitate services. Guardians can view caregiver profiles, and caregivers can view patient care information necessary for their duties.
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>4.2 With Service Providers</h3>
                <p style={{ color: '#535353' }}>
                  We share information with third-party service providers who perform services on our behalf (payment processing, cloud hosting, analytics, customer support).
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>4.3 Legal Requirements</h3>
                <p style={{ color: '#535353' }}>
                  We may disclose information if required by law, court order, or government request, or to protect rights, safety, and security.
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>4.4 Business Transfers</h3>
                <p style={{ color: '#535353' }}>
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred to the acquiring entity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>5. Data Security</h2>
            <p style={{ color: '#535353' }}>
              We implement reasonable security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2" style={{ color: '#535353' }}>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication with two-factor authentication for sensitive roles</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by employees</li>
              <li>Secure backup and disaster recovery systems</li>
            </ul>
            <p className="mt-3" style={{ color: '#535353' }}>
              However, no system is completely secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>6. Your Rights and Choices</h2>
            <div className="space-y-2" style={{ color: '#535353' }}>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Withdraw Consent:</strong> Revoke consent for data processing where applicable</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at privacy@carenet.bd
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>7. Data Retention</h2>
            <p style={{ color: '#535353' }}>
              We retain your information for as long as necessary to provide services and fulfill the purposes outlined in this policy. After account deletion, we may retain certain information for legal compliance, dispute resolution, and safety purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>8. Children's Privacy</h2>
            <p style={{ color: '#535353' }}>
              The Platform is not intended for use by individuals under 18 years of age. We do not knowingly collect information from children under 18. Patient information is managed by guardians who are responsible for its accuracy and appropriateness.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>9. International Data Transfers</h2>
            <p style={{ color: '#535353' }}>
              Your information may be stored and processed in Bangladesh or other countries where our service providers operate. We ensure appropriate safeguards are in place for international data transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>10. Changes to This Privacy Policy</h2>
            <p style={{ color: '#535353' }}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes through the Platform or via email. Your continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>11. Contact Us</h2>
            <p style={{ color: '#535353' }}>
              For questions or concerns about this Privacy Policy or our data practices, contact us at:<br />
              <strong>Email:</strong> privacy@carenet.bd<br />
              <strong>Phone:</strong> +880 1XXX-XXXXXX<br />
              <strong>Address:</strong> [CareNet Office Address, Dhaka, Bangladesh]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
