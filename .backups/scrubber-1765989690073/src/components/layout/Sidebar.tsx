import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { UserRole } from '@/lib/auth';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslationContext();

  const getNavigationForRole = (role: UserRole | undefined) => {
    if (!role) return [];

    const baseNavigation = [
      {
        nameKey: 'navigation.dashboard',
        href: '/dashboard',
        icon: '🏠',
        descriptionKey: 'navigation.dashboardDesc'
      },
    ];

    const roleNavigation = {
      GUARDIAN: [
        ...baseNavigation,
        {
          nameKey: 'navigation.patients',
          href: '/patients',
          icon: '👥',
          descriptionKey: 'navigation.patientsDesc'
        },
        {
          nameKey: 'navigation.jobs',
          href: '/jobs',
          icon: '💼',
          descriptionKey: 'navigation.jobsDesc'
        },
        {
          nameKey: 'navigation.careLogs',
          href: '/care-logs',
          icon: '📋',
          descriptionKey: 'navigation.careLogsDesc'
        },
        {
          nameKey: 'navigation.payments',
          href: '/payments',
          icon: '💳',
          descriptionKey: 'navigation.paymentsDesc'
        },
        {
          nameKey: 'navigation.feedback',
          href: '/feedback',
          icon: '⭐',
          descriptionKey: 'navigation.feedbackDesc'
        },
      ],
      PATIENT: [
        ...baseNavigation,
        {
          nameKey: 'navigation.healthRecords',
          href: '/health-records',
          icon: '🏥',
          descriptionKey: 'navigation.healthRecordsDesc'
        },
        {
          nameKey: 'navigation.careLogs',
          href: '/care-logs',
          icon: '📋',
          descriptionKey: 'navigation.careLogsDesc'
        },
        {
          nameKey: 'navigation.feedback',
          href: '/feedback',
          icon: '⭐',
          descriptionKey: 'navigation.feedbackDesc'
        },
      ],
      CAREGIVER: [
        ...baseNavigation,
        {
          nameKey: 'navigation.jobs',
          href: '/jobs',
          icon: '💼',
          descriptionKey: 'navigation.jobsDesc'
        },
        {
          nameKey: 'navigation.careLogs',
          href: '/care-logs',
          icon: '📋',
          descriptionKey: 'navigation.careLogsDesc'
        },
        {
          nameKey: 'navigation.earnings',
          href: '/earnings',
          icon: '💰',
          descriptionKey: 'navigation.earningsDesc'
        },
        {
          nameKey: 'navigation.marketplace',
          href: '/marketplace',
          icon: '🛍️',
          descriptionKey: 'navigation.marketplaceDesc'
        },
        {
          nameKey: 'navigation.files',
          href: '/files',
          icon: '📁',
          descriptionKey: 'navigation.filesDesc'
        },
      ],
      COMPANY: [
        ...baseNavigation,
        {
          nameKey: 'navigation.caregivers',
          href: '/caregivers',
          icon: '👩‍⚕️',
          descriptionKey: 'navigation.caregiversDesc'
        },
        {
          nameKey: 'navigation.patients',
          href: '/patients',
          icon: '👥',
          descriptionKey: 'navigation.patientsDesc'
        },
        {
          nameKey: 'navigation.jobs',
          href: '/jobs',
          icon: '💼',
          descriptionKey: 'navigation.jobsDesc'
        },
        {
          nameKey: 'navigation.packages',
          href: '/packages',
          icon: '📦',
          descriptionKey: 'navigation.packagesDesc'
        },
        {
          nameKey: 'navigation.analytics',
          href: '/analytics',
          icon: '📊',
          descriptionKey: 'navigation.analyticsDesc'
        },
        {
          nameKey: 'navigation.payments',
          href: '/payments',
          icon: '💳',
          descriptionKey: 'navigation.paymentsDesc'
        },
      ],
      MODERATOR: [
        ...baseNavigation,
        {
          nameKey: 'navigation.verification',
          href: '/verification',
          icon: '✅',
          descriptionKey: 'navigation.verificationDesc'
        },
        {
          nameKey: 'navigation.companies',
          href: '/companies',
          icon: '🏢',
          descriptionKey: 'navigation.companiesDesc'
        },
        {
          nameKey: 'navigation.caregivers',
          href: '/caregivers',
          icon: '👩‍⚕️',
          descriptionKey: 'navigation.caregiversDesc'
        },
        {
          nameKey: 'navigation.disputes',
          href: '/disputes',
          icon: '⚖️',
          descriptionKey: 'navigation.disputesDesc'
        },
        {
          nameKey: 'navigation.analytics',
          href: '/analytics',
          icon: '📊',
          descriptionKey: 'navigation.analyticsDesc'
        },
        {
          nameKey: 'navigation.users',
          href: '/users',
          icon: '👤',
          descriptionKey: 'navigation.usersDesc'
        },
      ],
      SUPER_ADMIN: [
        ...baseNavigation,
        {
          nameKey: 'navigation.dashboard',
          href: '/admin/dashboard',
          icon: '🎛️',
          descriptionKey: 'navigation.adminDashboardDesc'
        },
        {
          nameKey: 'navigation.companies',
          href: '/admin/companies',
          icon: '🏢',
          descriptionKey: 'navigation.companiesDesc'
        },
        {
          nameKey: 'navigation.caregivers',
          href: '/admin/caregivers',
          icon: '👩‍⚕️',
          descriptionKey: 'navigation.caregiversDesc'
        },
        {
          nameKey: 'navigation.users',
          href: '/admin/users',
          icon: '👤',
          descriptionKey: 'navigation.usersDesc'
        },
        {
          nameKey: 'navigation.analytics',
          href: '/admin/analytics',
          icon: '📊',
          descriptionKey: 'navigation.analyticsDesc'
        },
        {
          nameKey: 'navigation.settings',
          href: '/admin/settings',
          icon: '⚙️',
          descriptionKey: 'navigation.settingsDesc'
        },
      ],
    };

    return roleNavigation[role] || baseNavigation;
  };

  const navigation = getNavigationForRole(user?.role);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      GUARDIAN: t('roles.guardian'),
      PATIENT: t('roles.patient'),
      CAREGIVER: t('roles.caregiver'),
      COMPANY: t('roles.company'),
      MODERATOR: t('roles.moderator'),
      SUPER_ADMIN: t('roles.superAdmin'),
    };
    return roleNames[role] || role;
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      GUARDIAN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      PATIENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      CAREGIVER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      COMPANY: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      MODERATOR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      SUPER_ADMIN: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('navigation.mainMenu')}
              </h3>
            </div>
            
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }
                `}
                onClick={onClose}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{t(item.nameKey)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t(item.descriptionKey)}
                  </p>
                </div>
                {isActive(item.href) && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            ))}

            <div className="mt-8 mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('navigation.quickActions')}
              </h3>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link
                href="/notifications"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="mr-3 text-lg">🔔</span>
                <span className="flex-1">{t('navigation.notifications')}</span>
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
              </Link>

              <Link
                href="/profile"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="mr-3 text-lg">👤</span>
                <span className="flex-1">{t('navigation.profile')}</span>
              </Link>

              <Link
                href="/settings"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="mr-3 text-lg">⚙️</span>
                <span className="flex-1">{t('navigation.settings')}</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{t('common.version')}</span>
                <span>v1.0.0</span>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  // Handle logout
                  window.location.href = '/auth/logout';
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="mr-2">🚪</span>
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;