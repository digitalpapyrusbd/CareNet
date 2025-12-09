'use client';

import { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  threshold?: number;
  rootMargin?: string;
}

export function LazyImage({
  src,
  alt,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin]);

  return (
    <div ref={setRef} className="relative">
      {isInView ? (
        <>
          <Image
            src={src}
            alt={alt}
            {...props}
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${props.className || ''}`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
        </>
      ) : (
        <div
          className="bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{
            width: props.width,
            height: props.height,
          }}
        />
      )}
    </div>
  );
}
