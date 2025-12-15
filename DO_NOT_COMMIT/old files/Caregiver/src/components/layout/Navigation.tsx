import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { LanguageSwitcher, ThemeSwitcher } from '@/components/ui';
import { UserRole } from '@/lib/auth';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslationContext();

  const navigation = [
    { 
      nameKey: 'navigation.dashboard', 
      href: '/dashboard', 
      icon: '🏠', 
      roles: ['GUARDIAN', 'COMPANY', 'CAREGIVER', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.patients', 
      href: '/patients', 
      icon: '👥', 
      roles: ['GUARDIAN', 'PATIENT', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.jobs', 
      href: '/jobs', 
      icon: '💼', 
      roles: ['GUARDIAN', 'COMPANY', 'CAREGIVER', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.careLogs', 
      href: '/care-logs', 
      icon: '📋', 
      roles: ['CAREGIVER', 'GUARDIAN', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.payments', 
      href: '/payments', 
      icon: '💳', 
      roles: ['GUARDIAN', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.files', 
      href: '/files', 
      icon: '📁', 
      roles: ['GUARDIAN', 'COMPANY', 'CAREGIVER', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.feedback', 
      href: '/feedback', 
      icon: '⭐', 
      roles: ['GUARDIAN', 'COMPANY', 'CAREGIVER', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.healthRecords', 
      href: '/health-records', 
      icon: '🏥', 
      roles: ['GUARDIAN', 'PATIENT', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.marketplace', 
      href: '/marketplace', 
      icon: '🛍️', 
      roles: ['CAREGIVER'] 
    },
    { 
      nameKey: 'navigation.companies', 
      href: '/companies', 
      icon: '🏢', 
      roles: ['MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.caregivers', 
      href: '/caregivers', 
      icon: '👩‍⚕️', 
      roles: ['COMPANY', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.users', 
      href: '/users', 
      icon: '👤', 
      roles: ['MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.analytics', 
      href: '/analytics', 
      icon: '📊', 
      roles: ['COMPANY', 'MODERATOR', 'SUPER_ADMIN'] 
    },
    { 
      nameKey: 'navigation.settings', 
      href: '/settings', 
      icon: '⚙️', 
      roles: ['GUARDIAN', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN'] 
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    !isAuthenticated || (user && item.roles.includes(user.role))
  );

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav 
      className={`bg-white shadow-lg border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}
      role="navigation"
      aria-label={t('common.navigation')}
    >
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-end p-4">
        <button
          type="button"
          onClick={() => {
            const sidebar = document.getElementById('mobile-sidebar');
            sidebar?.classList.toggle('hidden');
          }}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label={t('common.mobileMenu')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  CaregiverBD
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-blue-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {t(item.nameKey)}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
              
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('common.welcome')}, {user.name}
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {t('auth.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-sidebar" 
        className="hidden md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              CaregiverBD
            </Link>
            <button
              type="button"
              onClick={() => {
                const sidebar = document.getElementById('mobile-sidebar');
                sidebar?.classList.add('hidden');
              }}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
                onClick={() => {
                  const sidebar = document.getElementById('mobile-sidebar');
                  sidebar?.classList.add('hidden');
                }}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {t(item.nameKey)}
              </Link>
            ))}
          </nav>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div 
        id="mobile-overlay"
        className="hidden md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
        onClick={() => {
          const sidebar = document.getElementById('mobile-sidebar');
          const overlay = document.getElementById('mobile-overlay');
          sidebar?.classList.add('hidden');
          overlay?.classList.add('hidden');
        }}
      />
    </nav>
  );
};

export default Navigation;