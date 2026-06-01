'use client';

import React, { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { resolveSectionImageFromRecord } from '@/app/lib/siteContent';

interface AboutProps {
  about: unknown;
  className?: string;
}

type AboutSectionData = NonNullable<Page['aboutSection']>;

function normalizeAboutSection(
  about: unknown,
  fallbackImage?: AboutSectionData['image']
): AboutSectionData | null {
  if (!about || typeof about !== 'object') return null;

  const data = about as Record<string, unknown>;
  if (data.enabled === false) return null;

  const features = Array.isArray(data.features)
    ? (data.features as AboutSectionData['features']).filter((f) => f?.label?.trim())
    : [];

  const image = resolveSectionImageFromRecord(data) ?? fallbackImage;
  const title = data.title as AboutSectionData['title'];
  const description = data.description as AboutSectionData['description'];

  if (!title && !description && !image && features.length === 0) return null;

  return {
    enabled: true,
    title,
    description,
    features,
    image,
  };
}

/** Service area about — same layout as site AboutSection. */
export const About: React.FC<AboutProps> = ({ about, className }) => {
  const { pages } = useWebBuilder();

  const fallbackImage = useMemo(() => {
    const home = pages.find((p) => p.pageType === 'home');
    return home?.aboutSection?.image;
  }, [pages]);

  const aboutSection = normalizeAboutSection(about, fallbackImage);
  if (!aboutSection) return null;

  return <AboutSection aboutSection={aboutSection} className={className} />;
};

export default About;
