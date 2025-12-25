'use client';

import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import LanguageSwitcher from '@/components/ui/language-switcher';

interface CareNetHeaderProps {
  rightContent?: ReactNode;
  showLanguageSelector?: boolean;
}

export function CareNetHeader({ rightContent, showLanguageSelector = true }: CareNetHeaderProps) {
  const router = useRouter();
  const { t } = useTranslationContext();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
          aria-label={t('common.home')}
        >
          <Heart className="w-6 h-6" style={{ color: '#FF8FA3' }} />
          <h2 className="text-xl font-semibold" style={{ color: '#535353' }}>{t('home.title')}</h2>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {showLanguageSelector && <LanguageSwitcher className="hidden sm:block" />}
          {rightContent}
        </div>
      </div>
    </nav>
  );
}
