'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

export default function PrivacyPolicyPage() {
  const { t } = useTranslationContext();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8" style={{ color: '#7CE577' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#535353' }}>{t('page.heading.privacypolicy')}</h1>
          </div>

          <div className="prose max-w-none space-y-6" style={{ color: '#535353' }}>
            <p className="text-sm" style={{ color: '#848484' }}>
              <strong>{t('page.text.lastupdated')}</strong> December 2024
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.1informationwecollec')}</h2>
              <p className="mb-2">{t('page.text.carenetcollectsthefo')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('page.text.personalinformation')}</strong> {t('page.text.namephonenumberemail')}</li>
                <li><strong>{t('page.text.healthinformation')}</strong> {t('page.text.patientmedicalcondit')}</li>
                <li><strong>{t('page.text.professionalinformat')}</strong> {t('page.text.certificationstradel')}</li>
                <li><strong>{t('page.text.locationdata')}</strong> {t('page.text.gpscoordinatesforche')}</li>
                <li><strong>{t('page.text.usagedata')}</strong> {t('page.text.carelogsmessagesrati')}</li>
                <li><strong>{t('page.text.paymentinformation')}</strong> {t('page.text.bankmobilemoneyaccou')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.2howweuseyourinforma')}</h2>
              <p className="mb-2">{t('page.text.weusecollectedinform')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.facilitateconnection')}</li>
                <li>{t('page.text.verifyidentitiesandc')}</li>
                <li>{t('page.text.processpaymentsandma')}</li>
                <li>{t('page.text.monitorqualityandsaf')}</li>
                <li>{t('page.text.resolvedisputesanden')}</li>
                <li>{t('page.text.improveplatformfeatu')}</li>
                <li>{t('page.text.complywithlegaloblig')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.3informationsharing')}</h2>
              <p className="mb-2">{t('page.text.weshareinformationon')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('page.text.withserviceproviders')}</strong> {t('page.text.caregiversandagencie')}</li>
                <li><strong>{t('page.text.withguardians')}</strong> {t('page.text.guardiansreceivecare')}</li>
                <li><strong>{t('page.text.withmoderatorsadmins')}</strong> {t('page.text.forverificationanddi')}</li>
                <li><strong>{t('page.text.withpaymentprocessor')}</strong> {t('page.text.forsecurepaymentproc')}</li>
                <li><strong>{t('page.text.legalrequirements')}</strong> {t('page.text.whenrequiredbybangla')}</li>
              </ul>
              <p className="mt-2">We never sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.4datasecurity')}</h2>
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.endtoendencryptionfo')}</li>
                <li>{t('page.text.securehttpsconnectio')}</li>
                <li>{t('page.text.regularsecurityaudit')}</li>
                <li>{t('page.text.accesscontrolsandaut')}</li>
                <li>{t('page.text.encrypteddatabasesto')}</li>
                <li>{t('page.text.regularbackupsanddis')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.5yourrights')}</h2>
              <p className="mb-2">{t('page.text.asacarenetuseryouhav')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.accessyourpersonalda')}</li>
                <li>{t('page.text.requestcorrectionofi')}</li>
                <li>{t('page.text.requestdeletionofyou')}</li>
                <li>{t('page.text.optoutofnonessential')}</li>
                <li>{t('page.text.exportyourdatainapor')}</li>
                <li>{t('page.text.filecomplaintsaboutp')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.6healthinformationpr')}</h2>
              <p>
                Patient health information is treated with the highest level of confidentiality:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.accessedonlybyauthor')}</li>
                <li>{t('page.text.encryptedatrestandin')}</li>
                <li>{t('page.text.auditlogsmaintainedf')}</li>
                <li>{t('page.text.sharedonlywithexplic')}</li>
                <li>{t('page.text.retainedaccordingtom')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.7childrensprivacy')}</h2>
              <p>
                Users must be 18+ years old to create accounts. Patient information for minors is managed by authorized guardians only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.8dataretention')}</h2>
              <p>
                We retain your data for as long as your account is active, plus:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Care logs: 7 years (medical record standards)</li>
                <li>Payment records: 5 years (tax/audit requirements)</li>
                <li>Verification documents: Duration of active status + 2 years</li>
                <li>{t('page.text.disputerecords3years')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.9cookiesandtracking')}</h2>
              <p>
                We use cookies and similar technologies to enhance user experience, analyze usage patterns, and maintain 
                secure sessions. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.10changestoprivacypo')}</h2>
              <p>
                We may update this privacy policy to reflect changes in our practices or legal requirements. 
                Users will be notified of significant changes via email or platform notification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.11contactus')}</h2>
              <p>
                For privacy-related questions or to exercise your rights, contact us at:<br />
                Email: privacy@carenet.bd<br />
                Phone: +880-XXX-XXXXXXX<br />
                Address: CareNet Bangladesh, Dhaka
              </p>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-2xl" style={{ background: 'rgba(124,229,119,0.1)' }}>
            <p className="text-sm" style={{ color: '#535353' }}>
              Your privacy and security are our top priorities. We are committed to protecting your personal information 
              and maintaining transparency in how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

