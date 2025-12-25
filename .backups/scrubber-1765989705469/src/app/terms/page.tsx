'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

export default function TermsPage() {
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
            <FileText className="w-8 h-8" style={{ color: '#8B7AE8' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#535353' }}>{t('page.heading.termsconditions')}</h1>
          </div>

          <div className="prose max-w-none space-y-6" style={{ color: '#535353' }}>
            <p className="text-sm" style={{ color: '#848484' }}>
              <strong>{t('page.text.lastupdated1')}</strong> December 2024
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.1introduction')}</h2>
              <p>
                Welcome to CareNet Bangladesh. By accessing or using our platform, you agree to be bound by these Terms and Conditions. 
                CareNet provides a platform connecting guardians, caregivers, agencies, and healthcare service providers across Bangladesh.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.2useraccounts')}</h2>
              <p className="mb-2">{t('page.text.whenyoucreateanaccou')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.provideaccurateandco')}</li>
                <li>{t('page.text.maintainthesecurityo')}</li>
                <li>{t('page.text.acceptresponsibility')}</li>
                <li>{t('page.text.notifyusimmediatelyo')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.3verificationprocess')}</h2>
              <p>
                All caregivers and agencies must undergo our 6-step verification process, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.certificateverificat')}</li>
                <li>{t('page.text.policeclearancecheck')}</li>
                <li>{t('page.text.inpersoninterview')}</li>
                <li>{t('page.text.psychologicalassessm2')}</li>
                <li>{t('page.text.documentverification')}</li>
                <li>{t('page.text.finalapproval')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.4paymentterms')}</h2>
              <p>
                CareNet facilitates payments between guardians, agencies, and caregivers. All payments are subject to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.platformcommissionfe')}</li>
                <li>Payment enforcement policy (7-day grace period)</li>
                <li>{t('page.text.escrowprotectionduri')}</li>
                <li>{t('page.text.securepaymentprocess')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.5userconduct')}</h2>
              <p className="mb-2">{t('page.text.usersagreenotto')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.violateanylawsorregu')}</li>
                <li>{t('page.text.providefalseormislea')}</li>
                <li>{t('page.text.harassabuseorharmoth')}</li>
                <li>{t('page.text.attempttocircumventp')}</li>
                <li>{t('page.text.engageinfraudulentac')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.6disputeresolution')}</h2>
              <p>
                All disputes are subject to our Two-Tier Authority System:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('page.text.initialreviewbyplatf')}</li>
                <li>{t('page.text.finaldecisionbyplatf')}</li>
                <li>{t('page.text.48hourescrowperiodfo')}</li>
                <li>{t('page.text.evidencebasedresolut')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.7liability')}</h2>
              <p>
                CareNet acts as a platform facilitator and is not directly responsible for the quality of care provided. 
                However, we maintain quality assurance measures and dispute resolution mechanisms to protect all parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.8termination')}</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities. 
                Users may also terminate their accounts at any time, subject to completion of active commitments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.9changestoterms')}</h2>
              <p>
                We may update these terms from time to time. Users will be notified of significant changes and continued use 
                of the platform constitutes acceptance of updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('page.heading.10contactinformation')}</h2>
              <p>
                For questions about these terms, please contact us at:<br />
                Email: legal@carenet.bd<br />
                Phone: +880-XXX-XXXXXXX
              </p>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-2xl" style={{ background: 'rgba(139,122,232,0.1)' }}>
            <p className="text-sm" style={{ color: '#535353' }}>
              By using CareNet, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

