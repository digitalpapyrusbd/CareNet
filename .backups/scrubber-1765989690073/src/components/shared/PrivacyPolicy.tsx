import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const { t } = useTranslationContext();
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
              <h1 style={{ color: '#535353' }}>{t('privacypolicy.heading.privacypolicy')}</h1>
              <p className="text-sm" style={{ color: '#848484' }}>{t('privacypolicy.text.lastupdateddecember2')}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="finance-card p-8 space-y-6">
          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.1introduction')}</h2>
            <p style={{ color: '#535353' }}>
              CareNet Platform ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.2informationwecollec')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.21personalinformatio')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>{t('privacypolicy.text.namephonenumberemail')}</li>
                  <li>{t('privacypolicy.text.profilephotosandiden')}</li>
                  <li>{t('privacypolicy.text.addressandlocationin')}</li>
                  <li>{t('privacypolicy.text.dateofbirthandgender')}</li>
                  <li>{t('privacypolicy.text.bankingandpaymentinf')}</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.22medicalinformation')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>Medical conditions and allergies (for care coordination only)</li>
                  <li>{t('privacypolicy.text.medicationschedulesa')}</li>
                  <li>{t('privacypolicy.text.carelogsandactivityr')}</li>
                </ul>
                <p className="mt-2 text-sm" style={{ color: '#FF6B7A' }}>
                  ⚠️ Important: CareNet is not designed for storing highly sensitive medical records or PII. For critical medical data, please use specialized healthcare systems.
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.23usageinformation')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>Device information (type, operating system, browser)</li>
                  <li>{t('privacypolicy.text.ipaddressandgeolocat')}</li>
                  <li>{t('privacypolicy.text.usagepatternsandinte')}</li>
                  <li>{t('privacypolicy.text.cookiesandsimilartra')}</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.24communicationdata')}</h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: '#535353' }}>
                  <li>{t('privacypolicy.text.messagesbetweenusers')}</li>
                  <li>{t('privacypolicy.text.supportticketsandfee')}</li>
                  <li>Voice recordings (with consent, for care documentation)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.3howweuseyourinforma')}</h2>
            <div className="space-y-2" style={{ color: '#535353' }}>
              <p>{t('privacypolicy.text.weusecollectedinform')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('privacypolicy.text.providingandimprovin')}</li>
                <li>{t('privacypolicy.text.facilitatingconnecti')}</li>
                <li>{t('privacypolicy.text.processingpaymentsan')}</li>
                <li>{t('privacypolicy.text.conductingverificati')}</li>
                <li>{t('privacypolicy.text.ensuringsafetyandsec')}</li>
                <li>{t('privacypolicy.text.sendingnotifications')}</li>
                <li>{t('privacypolicy.text.analyzingusagepatter')}</li>
                <li>{t('privacypolicy.text.complyingwithlegalob')}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.4informationsharinga')}</h2>
            <div className="space-y-3">
              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.41withotherusers')}</h3>
                <p style={{ color: '#535353' }}>
                  Certain information (name, profile photo, ratings, reviews) is shared with other users to facilitate services. Guardians can view caregiver profiles, and caregivers can view patient care information necessary for their duties.
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.42withserviceprovide')}</h3>
                <p style={{ color: '#535353' }}>
                  We share information with third-party service providers who perform services on our behalf (payment processing, cloud hosting, analytics, customer support).
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.43legalrequirements')}</h3>
                <p style={{ color: '#535353' }}>
                  We may disclose information if required by law, court order, or government request, or to protect rights, safety, and security.
                </p>
              </div>

              <div>
                <h3 className="mb-2" style={{ color: '#535353' }}>{t('privacypolicy.heading.44businesstransfers')}</h3>
                <p style={{ color: '#535353' }}>
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred to the acquiring entity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.5datasecurity')}</h2>
            <p style={{ color: '#535353' }}>
              We implement reasonable security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2" style={{ color: '#535353' }}>
              <li>{t('privacypolicy.text.encryptionofdataintr')}</li>
              <li>{t('privacypolicy.text.secureauthentication')}</li>
              <li>{t('privacypolicy.text.regularsecurityaudit')}</li>
              <li>{t('privacypolicy.text.limitedaccesstoperso')}</li>
              <li>{t('privacypolicy.text.securebackupanddisas')}</li>
            </ul>
            <p className="mt-3" style={{ color: '#535353' }}>
              However, no system is completely secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.6yourrightsandchoice')}</h2>
            <div className="space-y-2" style={{ color: '#535353' }}>
              <p>{t('privacypolicy.text.youhavetherightto')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>{t('privacypolicy.text.access')}</strong> {t('privacypolicy.text.requestacopyofyourpe')}</li>
                <li><strong>{t('privacypolicy.text.correction')}</strong> {t('privacypolicy.text.updateorcorrectinacc')}</li>
                <li><strong>{t('privacypolicy.text.deletion')}</strong> {t('privacypolicy.text.requestdeletionofyou')}</li>
                <li><strong>{t('privacypolicy.text.optout')}</strong> {t('privacypolicy.text.unsubscribefrommarke')}</li>
                <li><strong>{t('privacypolicy.text.dataportability')}</strong> {t('privacypolicy.text.receiveyourdatainapo')}</li>
                <li><strong>{t('privacypolicy.text.withdrawconsent')}</strong> {t('privacypolicy.text.revokeconsentfordata')}</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at privacy@carenet.bd
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.7dataretention')}</h2>
            <p style={{ color: '#535353' }}>
              We retain your information for as long as necessary to provide services and fulfill the purposes outlined in this policy. After account deletion, we may retain certain information for legal compliance, dispute resolution, and safety purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.8childrensprivacy')}</h2>
            <p style={{ color: '#535353' }}>
              The Platform is not intended for use by individuals under 18 years of age. We do not knowingly collect information from children under 18. Patient information is managed by guardians who are responsible for its accuracy and appropriateness.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.9internationaldatatr')}</h2>
            <p style={{ color: '#535353' }}>
              Your information may be stored and processed in Bangladesh or other countries where our service providers operate. We ensure appropriate safeguards are in place for international data transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.10changestothispriva')}</h2>
            <p style={{ color: '#535353' }}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes through the Platform or via email. Your continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3" style={{ color: '#535353' }}>{t('privacypolicy.heading.11contactus')}</h2>
            <p style={{ color: '#535353' }}>
              For questions or concerns about this Privacy Policy or our data practices, contact us at:<br />
              <strong>{t('privacypolicy.text.email')}</strong> {t('privacypolicy.text.privacycarenetbd')}<br />
              <strong>{t('privacypolicy.text.phone')}</strong> {t('privacypolicy.text.8801xxxxxxxxx')}<br />
              <strong>{t('privacypolicy.text.address')}</strong> [CareNet Office Address, Dhaka, Bangladesh]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
