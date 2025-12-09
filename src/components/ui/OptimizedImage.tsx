import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/cdn-service';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  placeholder = 'blur',
  className,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  // Get optimized image URL from CDN
  const optimizedSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality,
    format: 'auto', // Let CDN decide best format
  });

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder={placeholder}
      className={cn(
        'transition-all duration-300',
        className
      )}
      style={style}
      onLoad={onLoad}
      onError={onError}
      sizes={
        width
          ? `${width}px`
          : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw'
      }
    />
  );
}

// Export a default version for backward compatibility
export default OptimizedImage;