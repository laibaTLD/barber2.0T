'use client';

import React from 'react';
import type { Page } from '@/app/lib/types';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';

interface WhyChooseUsProps {
  whyChooseUs: unknown;
  className?: string;
}

type WhyChooseUsSectionData = NonNullable<Page['whyChooseUsSection']>;
type WhyChooseUsItem = NonNullable<WhyChooseUsSectionData['items']>[number];

function normalizeWhyChooseUsSection(data: unknown): WhyChooseUsSectionData | null {
  if (!data || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;
  if (record.enabled === false) return null;

  const rawItems = (record.reasons ?? record.items) as unknown[] | undefined;
  const items = Array.isArray(rawItems)
    ? (rawItems
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Record<string, unknown>;
          const title = row.title;
          const description = row.description;
          if (!title && !description) return null;
          return { title, description } as WhyChooseUsItem;
        })
        .filter(Boolean) as NonNullable<WhyChooseUsSectionData['items']>)
    : [];

  const title = record.title as WhyChooseUsSectionData['title'];
  const description = record.description as WhyChooseUsSectionData['description'];

  if (!title && !description && items.length === 0) return null;

  return { enabled: true, title, description, items };
}

/** Service area why choose us — same layout as site WhyChooseUsSection. */
export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ whyChooseUs, className }) => {
  const whyChooseUsSection = normalizeWhyChooseUsSection(whyChooseUs);
  if (!whyChooseUsSection) return null;

  return <WhyChooseUsSection whyChooseUsSection={whyChooseUsSection} className={className} />;
};

export default WhyChooseUs;
