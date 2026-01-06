'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { UniversalNav } from './UniversalNav';

interface MobileFirstLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  showBack?: boolean;
  title?: string;
  className?: string;
}

export function MobileFirstLayout({ 
  children, 
  userRole, 
  showBack = true, 
  title,
  className = '' 
}: MobileFirstLayoutProps) {
  const pathname = usePathname();

  // Mobile-first responsive classes
  const getContainerClasses = () => {
    // Default mobile classes
    let classes = 'min-h-screen pb-24'; // pb-24 for bottom nav
    
    // Tablet and desktop enhancements
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 768) {
        // Tablet: add padding-top for header
        classes += ' md:pt-14';
      }
      if (width >= 1024) {
        // Desktop: add side padding
        classes += ' lg:px-8';
      }
    }
    
    return classes + ' ' + className;
  };

  // Enhanced header for mobile
  const renderHeader = () => {
    if (!title) return null;
    
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-white/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 style={{ color: '#535353' }} className="text-xl font-semibold">
            {title}
          </h1>
          {userRole && (
            <span 
              className="px-3 py-1 rounded-full text-xs"
              style={{ 
                background: 'rgba(142, 197, 252, 0.2)',
                color: '#5B9FFF'
              }}
            >
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={getContainerClasses()}>
      {/* Universal Navigation */}
      <UniversalNav userRole={userRole} showBack={showBack} />
      
      {/* Header */}
      {renderHeader()}
      
      {/* Main Content */}
      <main className="px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}

// Enhanced mobile card component
export function MobileCard({ 
  children, 
  className = '',
  padding = 'p-4',
  rounded = 'rounded-2xl',
  elevation = 'shadow-sm'
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  rounded?: string;
  elevation?: string;
}) {
  return (
    <div 
      className={`finance-card ${padding} ${rounded} ${elevation} transition-all hover:shadow-md ${className}`}
      style={{ 
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {children}
    </div>
  );
}

// Mobile-first grid system
export function MobileGrid({ 
  children, 
  cols = 1,
  gap = 'gap-4',
  className = ''
}: {
  children: React.ReactNode;
  cols?: number;
  gap?: string;
  className?: string;
}) {
  const getGridClasses = () => {
    switch (cols) {
      case 1: return 'grid grid-cols-1';
      case 2: return 'grid grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid grid-cols-1';
    }
  };

  return (
    <div className={`${getGridClasses()} ${gap} ${className}`}>
      {children}
    </div>
  );
}

// Touch-optimized button component
export function TouchButton({ 
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const getButtonClasses = () => {
    let baseClasses = 'transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // Size classes
    let sizeClasses = '';
    switch (size) {
      case 'sm': sizeClasses = 'px-3 py-2 text-sm'; break;
      case 'md': sizeClasses = 'px-4 py-3 text-base'; break;
      case 'lg': sizeClasses = 'px-6 py-4 text-lg'; break;
    }
    
    // Variant classes
    let variantClasses = '';
    switch (variant) {
      case 'primary':
        variantClasses = 'bg-gradient-to-r from-[#FFB3C1] to-[#FF8FA3] text-white shadow-lg hover:shadow-xl';
        break;
      case 'secondary':
        variantClasses = 'bg-gradient-to-r from-[#8EC5FC] to-[#5B9FFF] text-white shadow-lg hover:shadow-xl';
        break;
      case 'ghost':
        variantClasses = 'bg-white/50 text-[#535353] border border-white/50 hover:bg-white/70';
        break;
    }

    // Touch target minimum
    const touchTargetClasses = 'min-h-[44px] min-w-[44px]';
    
    return `${baseClasses} ${sizeClasses} ${variantClasses} ${touchTargetClasses} ${className}`;
  };

  return (
    <button 
      className={getButtonClasses()}
      {...props}
    >
      {children}
    </button>
  );
}

// Swipe gesture handler for mobile
export function useSwipeGesture(callbacks: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}) {
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && callbacks.onSwipeLeft) {
      callbacks.onSwipeLeft();
    } else if (isRightSwipe && callbacks.onSwipeRight) {
      callbacks.onSwipeRight();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

// Pull-to-refresh component
export function PullToRefresh({ 
  onRefresh, 
  children 
}: { 
  onRefresh: () => void;
  children: React.ReactNode;
}) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      // User is at top of page, enable pull to refresh
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && e.touches[0].clientY > 0) {
      const distance = e.touches[0].clientY;
      setPullDistance(Math.min(distance / 3, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      onRefresh().finally(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      });
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateY(${pullDistance}px)` }}
    >
      {children}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 flex justify-center py-2 bg-white/90">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFB3C1]"></div>
        </div>
      )}
    </div>
  );
}