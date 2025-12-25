'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, Shield, Clock, Users, Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import LanguageSwitcher from '@/components/ui/language-switcher';

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslationContext();

  // Hide the global header from layout on landing page
  useEffect(() => {
    const globalHeader = document.querySelector('nav.fixed.top-0');
    if (globalHeader) {
      (globalHeader as HTMLElement).style.display = 'none';
    }
    return () => {
      // Restore on unmount
      const globalHeader = document.querySelector('nav.fixed.top-0');
      if (globalHeader) {
        (globalHeader as HTMLElement).style.display = '';
      }
    };
  }, []);

  const features = [
    { icon: Shield, titleKey: 'home.features.verifiedCaregivers.title', descriptionKey: 'home.features.verifiedCaregivers.description' },
    { icon: Clock, titleKey: 'home.features.support24x7.title', descriptionKey: 'home.features.support24x7.description' },
    { icon: Heart, titleKey: 'home.features.qualityCare.title', descriptionKey: 'home.features.qualityCare.description' },
    { icon: Users, titleKey: 'home.features.trustedAgencies.title', descriptionKey: 'home.features.trustedAgencies.description' },
  ];

  const testimonials = [
    { name: 'Mrs. Fatima Ahmed', role: 'Guardian', rating: 5, text: 'CareNet helped me find the perfect caregiver for my mother. The platform is easy to use and the caregivers are highly professional.' },
    { name: 'Rashid Khan', role: 'Caregiver', rating: 5, text: 'As a caregiver, CareNet connects me with families who truly appreciate my work. The payment system is transparent and reliable.' },
    { name: 'Green Care Agency', role: 'Agency', rating: 5, text: 'Managing our caregivers and clients has never been easier. CareNet\'s platform streamlines everything.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFF0F3 50%, #FFE4E8 100%)' }}>
      {/* CareNet Header with Login/Register Buttons - override global header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
            aria-label={t('page.label.gotohome')}
          >
            <Heart className="w-6 h-6" style={{ color: '#FF8FA3' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#535353' }}>{t('home.title')}</h2>
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher className="hidden sm:block" />
            <Link href="/auth/login">
              <Button
                onClick={(e) => {
                  console.log('Top nav login button clicked', { hasRouter: !!router, routerType: typeof router });
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:35',message:'Top nav login button clicked',data:{hasRouter:!!router,routerType:typeof router},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((err)=>console.error('Log fetch error:',err));
                  // #endregion
                }}
                size="sm"
                className="h-7 px-2.5 text-xs whitespace-nowrap"
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none'
                }}
                type="button"
              >
                {t('common.login')}
              </Button>
            </Link>
            <Button
              onClick={() => router.push('/auth/role-selection')}
              size="sm"
              className="h-7 px-2.5 text-xs whitespace-nowrap"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                border: 'none'
              }}
            >
              {t('common.register')}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 pt-24 pb-12">
        <div className="flex items-center justify-center mb-8">
          <div 
            className="flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="mb-4" style={{ color: '#535353' }}>{t('home.title')}</h1>
          <p className="text-lg mb-6" style={{ color: '#848484' }}>
            {t('home.tagline')}
          </p>
          <p className="mb-8" style={{ color: '#535353' }}>
            {t('home.description')}
          </p>

          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <Button
              onClick={() => router.push('/auth/role-selection')}
              size="lg"
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                color: 'white',
                border: 'none'
              }}
            >
              {t('common.register')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12">
        <h2 className="text-center mb-8" style={{ color: '#535353' }}>Why Choose {t('home.title')}?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="finance-card p-6">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)'
                }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2" style={{ color: '#535353' }}>{t(feature.titleKey)}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-6 py-12">
        <h2 className="text-center mb-8" style={{ color: '#535353' }}>{t('home.testimonials.title')}</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="finance-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  <span className="text-white">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#535353' }}>{testimonial.name}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>{testimonial.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                  ))}
                </div>
              </div>
              <p className="text-sm" style={{ color: '#535353' }}>{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-12">
        <div className="finance-card p-8 text-center max-w-2xl mx-auto">
          <h2 className="mb-4" style={{ color: '#535353' }}>{t('home.cta.title')}</h2>
          <p className="mb-6" style={{ color: '#848484' }}>
            {t('home.cta.description')}
          </p>
          <Button
            onClick={() => router.push('/guardian/packages')}
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            {t('home.cta.browseAgencies')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-3" style={{ color: '#535353' }}>{t('home.title')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>
                {t('home.footer.about')}
              </p>
            </div>
            <div>
              <h4 className="mb-3" style={{ color: '#535353' }}>{t('home.footer.quickLinks')}</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#848484' }}>
                <li><a href="/about" className="hover:underline">{t('home.footer.aboutUs')}</a></li>
                <li><a href="#how-it-works" className="hover:underline">{t('home.footer.howItWorks')}</a></li>
                <li><a href="/terms" className="hover:underline">{t('home.footer.terms')}</a></li>
                <li><a href="/privacy" className="hover:underline">{t('home.footer.privacy')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3" style={{ color: '#535353' }}>{t('home.footer.contact')}</h4>
              <div className="space-y-2 text-sm" style={{ color: '#848484' }}>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+880 1XXX-XXXXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@carenet.bd</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/30 text-center text-sm" style={{ color: '#848484' }}>
            <p>{t('home.footer.copyright')}</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <UniversalNav showBack={true} />
    </div>
  );
}
