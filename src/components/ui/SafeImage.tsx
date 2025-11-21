'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: ImageProps['src'];
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK = 'https://placehold.co/800x600?text=Image+Unavailable';

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, ...rest }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<ImageProps['src']>(src || fallbackSrc);

  return (
    <Image
      {...rest}
      src={currentSrc || fallbackSrc}
      unoptimized
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

