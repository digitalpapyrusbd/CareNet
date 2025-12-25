import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface TermsAndConditionsProps {
  onBack: () => void;
  onAccept?: (accepted: boolean) => void;
  requireAcceptance?: boolean;
}

export function TermsAndConditions({ onBack, onAccept, requireAcceptance = false }: TermsAndConditionsProps) {
  const { t } = useTranslationContext();
  const [accepted, setAccepted] = useState(false);

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
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)'
              }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 style={{ color: '#535353' }}>{t('termsandconditions.heading.termsconditions')}</h1>
              <p className="text-sm" style={{ color: '#848484' }}>{t('termsandconditions.text.lastupdateddecember2')}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="finance-card p-8 space-y-6">
          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.1introduction')}</h2>
            <p style={{ color: '#535353' }}>
              Welcome to CareNet Platform ("CareNet", "we", "us", or "our"). These Terms and Conditions ("Terms") govern your access to and use of the CareNet platform, including our website, mobile applications, and services (collectively, the "Platform").
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.2acceptanceofterms')}</h2>
            <p style={{ color: '#535353' }}>
              By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.3userrolesandrespons')}</h2>
            <div className="space-y-3" style={{ color: '#535353' }}>
              <div>
                <h3 className="mb-2">{t('termsandconditions.heading.31guardiansfamilymem')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>{t('termsandconditions.text.mustprovideaccuratei')}</li>
                  <li>{t('termsandconditions.text.responsibleforpaymen')}</li>
                  <li>{t('termsandconditions.text.mustmaintainrespectf')}</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2">{t('termsandconditions.heading.32caregivers')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>{t('termsandconditions.text.mustundergoverificat')}</li>
                  <li>{t('termsandconditions.text.requiredtomaintainpr')}</li>
                  <li>{t('termsandconditions.text.mustaccuratelylogcar')}</li>
                  <li>{t('termsandconditions.text.responsiblefortimely')}</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2">{t('termsandconditions.heading.33agencies')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>{t('termsandconditions.text.mustmaintainvalidbus')}</li>
                  <li>{t('termsandconditions.text.responsibleforcaregi')}</li>
                  <li>{t('termsandconditions.text.mustrespondtobooking')}</li>
                  <li>{t('termsandconditions.text.requiredtomaintainac')}</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.4verificationandback')}</h2>
            <p style={{ color: '#535353' }}>
              All caregivers and agencies must complete our verification process, which includes but is not limited to document verification, background checks, and professional assessments. CareNet reserves the right to reject or remove any user who fails to meet our verification standards.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.5paymentterms')}</h2>
            <div className="space-y-2" style={{ color: '#535353' }}>
              <p>5.1 All payments must be made through the Platform's designated payment methods.</p>
              <p>5.2 Payment is due within 7 days of invoice generation unless otherwise agreed.</p>
              <p>5.3 Late payments may result in account restrictions or suspension.</p>
              <p>5.4 CareNet uses an escrow system to protect both parties in transactions.</p>
              <p>5.5 Disputes must be filed within 48 hours of service completion.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.6disputeresolution')}</h2>
            <p style={{ color: '#535353' }}>
              Any disputes arising from services provided through the Platform will be handled through our internal dispute resolution process. Users agree to first attempt resolution through our Platform Moderators before seeking external legal remedies.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.7dataprivacyandsecur')}</h2>
            <p style={{ color: '#535353' }}>
              We take user privacy seriously. All personal and medical information is handled in accordance with our Privacy Policy and applicable Bangladesh data protection laws. CareNet is not intended for collecting highly sensitive PII or securing critical medical data.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.8liabilityanddisclai')}</h2>
            <div className="space-y-2" style={{ color: '#535353' }}>
              <p>8.1 CareNet acts as a platform connecting users and does not directly provide caregiving services.</p>
              <p>8.2 We are not liable for the quality, safety, or legality of services provided by caregivers or agencies.</p>
              <p>8.3 Users engage with caregivers and agencies at their own risk.</p>
              <p>8.4 CareNet's total liability shall not exceed the fees paid for the specific transaction in question.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.9termination')}</h2>
            <p style={{ color: '#535353' }}>
              CareNet reserves the right to suspend or terminate any user account for violation of these Terms, fraudulent activity, or any conduct deemed harmful to the Platform or other users.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.10changestoterms')}</h2>
            <p style={{ color: '#535353' }}>
              We may update these Terms from time to time. Users will be notified of significant changes and continued use of the Platform constitutes acceptance of updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('termsandconditions.heading.11contactinformation')}</h2>
            <p style={{ color: '#535353' }}>
              For questions about these Terms, please contact us at:<br />
              Email: legal@carenet.bd<br />
              Phone: +880 1XXX-XXXXXX
            </p>
          </section>
        </div>

        {/* Acceptance Section */}
        {requireAcceptance && (
          <div className="mt-6 finance-card p-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
              />
              <label htmlFor="accept-terms" className="cursor-pointer" style={{ color: '#535353' }}>
                I have read and agree to the Terms & Conditions
              </label>
            </div>
            <Button
              onClick={() => onAccept?.(accepted)}
              disabled={!accepted}
              className="w-full mt-4"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)',
                color: 'white',
                border: 'none',
                opacity: !accepted ? 0.5 : 1
              }}
            >
              Accept & Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
