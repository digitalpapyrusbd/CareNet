import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy components
export const DashboardCharts = dynamic(
  () => import('@/components/ui/DashboardCharts'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const DataTable = dynamic(
  () => import('@/components/ui/DataTable'),
  {
    loading: () => <TableSkeleton />,
  }
);

export const Chart = dynamic(
  () => import('@/components/ui/Chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const BkashPayment = dynamic(
  () => import('@/components/ui/BkashPayment'),
  {
    loading: () => <PaymentSkeleton />,
    ssr: false,
  }
);

export const NagadPayment = dynamic(
  () => import('@/components/ui/NagadPayment'),
  {
    loading: () => <PaymentSkeleton />,
    ssr: false,
  }
);

export const CameraCapture = dynamic(
  () => import('@/components/mobile/CameraCapture').then(mod => ({ default: mod.CameraCapture })),
  {
    loading: () => <CameraSkeleton />,
    ssr: false,
  }
);

// Loading skeletons
function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
        />
      ))}
    </div>
  );
}

function PaymentSkeleton() {
  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4" />
      <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
}

function CameraSkeleton() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white">Loading camera...</div>
    </div>
  );
}

// Utility to create lazy loaded component with custom loading
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent?: ComponentType
) {
  return dynamic(importFn, {
    loading: LoadingComponent,
    ssr: false,
  });
}
