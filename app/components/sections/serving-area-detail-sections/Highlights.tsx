'use client';

import React from 'react';
import type { Page } from '@/app/lib/types';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';

interface HighlightsProps {
  highlights: unknown;
  className?: string;
}

type WhyChooseUsSectionData = NonNullable<Page['whyChooseUsSection']>;
type WhyChooseUsItem = NonNullable<WhyChooseUsSectionData['items']>[number];

function normalizeHighlightsSection(highlights: unknown): WhyChooseUsSectionData | null {
  if (!highlights || typeof highlights !== 'object') return null;

  const data = highlights as Record<string, unknown>;
  if (data.enabled === false) return null;

  const rawItems = (data.items ?? data.highlights) as unknown[] | undefined;
  const items = Array.isArray(rawItems)
    ? (rawItems
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Record<string, unknown>;
          const title = row.title;
          const stat = row.price ?? row.counter;
          const description = stat ?? row.description;
          if (!title && !description) return null;
          return { title, description } as WhyChooseUsItem;
        })
        .filter(Boolean) as NonNullable<WhyChooseUsSectionData['items']>)
    : [];

  const title = data.title as WhyChooseUsSectionData['title'];
  const description = data.description as WhyChooseUsSectionData['description'];

  if (!title && !description && items.length === 0) return null;

  return { enabled: true, title, description, items };
}

/** Service area highlights — stat cards via home WhyChooseUsSection. */
export const Highlights: React.FC<HighlightsProps> = ({ highlights, className }) => {
  const whyChooseUsSection = normalizeHighlightsSection(highlights);
  if (!whyChooseUsSection) return null;

  return <WhyChooseUsSection whyChooseUsSection={whyChooseUsSection} className={className} />;
};

export default Highlights;
