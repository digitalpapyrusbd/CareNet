import { TrendingUp, Users, Building, CheckCircle } from "lucide-react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface ModeratorPlatformAnalyticsProps {
  stats: {
    totalVerifications: number;
    pendingVerifications: number;
    approvedToday: number;
    rejectedToday: number;
    averageReviewTime: string;
  };
}

export function ModeratorPlatformAnalytics({ stats }: ModeratorPlatformAnalyticsProps) {
  const { t } = useTranslationContext();
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>{t('moderatorplatformanalytics.heading.platformanalytics')}</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="finance-card p-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>{t('moderatorplatformanalytics.text.totalverifications')}</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalVerifications}</p>
          </div>

          <div className="finance-card p-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>{t('moderatorplatformanalytics.text.pending')}</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.pendingVerifications}</p>
          </div>

          <div className="finance-card p-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>{t('moderatorplatformanalytics.text.approvedtoday')}</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.approvedToday}</p>
          </div>

          <div className="finance-card p-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <Building className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>{t('moderatorplatformanalytics.text.rejectedtoday')}</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.rejectedToday}</p>
          </div>

          <div className="finance-card p-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>{t('moderatorplatformanalytics.text.avgreviewtime')}</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.averageReviewTime}</p>
          </div>
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('moderatorplatformanalytics.heading.performancemetrics')}</h3>
          <p style={{ color: '#848484' }}>Detailed analytics coming soon...</p>
        </div>
      </div>
    </div>
  );
}

