'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Page } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { resolvePrimaryCta } from '@/app/components/ui/made';
import {
  getHeroEyebrowText,
  getHeroTitleText,
  getPrimaryHeroImageFromHero,
} from '@/app/lib/siteContent';
import { CMS_IMAGE_QUALITY } from '@/app/lib/image';
import { cn } from '@/app/lib/utils';

interface HeroSectionProps {
  hero?: Page['hero'];
  page?: Page | null;
  className?: string;
}

export function HeroSection({ hero, page, className }: HeroSectionProps) {
  const { site, pages } = useWebBuilder();
  const { colors, fonts, styles: themeStyles } = useSectionTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [skullSrc, setSkullSrc] = useState<string>('/skull.png');

  const title = useMemo(() => getHeroTitleText(hero, site), [hero, site]);
  const eyebrow = useMemo(() => getHeroEyebrowText(hero, site), [hero, site]);
  const backgroundImage = useMemo(() => getPrimaryHeroImageFromHero(hero), [hero]);
  const ctaButton = useMemo(
    () =>
      resolvePrimaryCta(page ?? null, site, pages) ?? {
        href: '#contact',
        label: 'SCHEDULE AN APPOINTMENT',
      },
    [page, site, pages]
  );

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.3,
  });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!hero || hero.enabled === false) return null;
  if (!title && !backgroundImage && !ctaButton.label) return null;

  const ctaIsExternal =
    ctaButton.href.startsWith('http') ||
    ctaButton.href.startsWith('mailto:') ||
    ctaButton.href.startsWith('tel:');

  const heroOverlay = {
    backgroundColor: 'color-mix(in srgb, var(--wb-section-bg-dark) 55%, transparent)',
  } as React.CSSProperties;

  const heroFallbackBg = {
    background: `linear-gradient(
      135deg,
      color-mix(in srgb, var(--wb-primary) 12%, var(--wb-page-bg)),
      color-mix(in srgb, var(--wb-primary-hover) 12%, var(--wb-page-bg))
    )`,
  } as React.CSSProperties;

  const lineStyle = { backgroundColor: colors.darkPrimaryText } as React.CSSProperties;

  const ctaStyle = {
    ...themeStyles.ctaOnCard,
    fontFamily: fonts.body,
  } as React.CSSProperties;

  const ctaClassName =
    'inline-flex items-center justify-center px-6 py-3 rounded shadow-md uppercase tracking-[0.25em] text-sm transition-opacity hover:opacity-90';

  return (
    <section className={cn('relative overflow-hidden min-h-screen', className)}>
      <div
        className={`absolute inset-0 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      >
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={title || 'Hero background'}
            fill
            priority
            quality={CMS_IMAGE_QUALITY}
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full" style={heroFallbackBg} />
        )}
        <div className="absolute inset-0" style={heroOverlay} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 wb-text-on-dark">
        <div className="w-full max-w-5xl mx-auto text-center">
          <div className="mx-auto max-w-3xl">
            <div className="h-px w-full mt-6 mb-10" style={lineStyle} aria-hidden />

            <h1
              ref={titleRef}
              className={`mb-2 wb-text-on-dark transition-all duration-700 ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                fontFamily: fonts.heading,
                fontWeight: 400,
                fontSize: 'clamp(3rem,10vw,7rem)',
                lineHeight: 1,
              }}
            >
              {title}
            </h1>

            <div
              className="wb-text-on-dark-secondary tracking-[0.5em] uppercase"
              style={{ fontFamily: fonts.body }}
            >
              {eyebrow || 'BARBERS'}
            </div>

            <div className="h-px w-full mt-10 mb-6" style={lineStyle} aria-hidden />
            <div
              ref={ctaRef}
              className={cn(
                'inline-block -mt-4 mb-4 transition-all duration-700',
                ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              )}
            >
              {ctaIsExternal ? (
                <a href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                  {ctaButton.label}
                </a>
              ) : (
                <Link href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                  {ctaButton.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;