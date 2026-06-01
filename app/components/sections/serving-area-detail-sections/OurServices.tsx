'use client';

import React from 'react';
import type { Page } from '@/app/lib/types';
import { ServicesSection } from '@/app/components/sections/ServicesSection';

interface OurServicesProps {
  services: unknown;
  className?: string;
}

type ServicesSectionData = NonNullable<Page['servicesSection']>;

function normalizeServicesSection(services: unknown): ServicesSectionData | null {
  if (!services || typeof services !== 'object') return null;

  const data = services as Record<string, unknown>;
  if (data.enabled === false) return null;

  const serviceIds = Array.isArray(data.serviceIds)
    ? (data.serviceIds as string[]).filter(Boolean)
    : Array.isArray(data.items)
      ? (data.items as Array<{ _id?: string; id?: string }>)
          .map((item) => item._id || item.id)
          .filter((id): id is string => Boolean(id))
      : [];

  const title = data.title as ServicesSectionData['title'];
  const description = (data.description ?? data.subtitle) as ServicesSectionData['description'];

  if (!title && !description && serviceIds.length === 0) return null;

  return { enabled: true, title, description, serviceIds };
}

/** Service area services — same layout as site ServicesSection. */
export const OurServices: React.FC<OurServicesProps> = ({ services, className }) => {
  const servicesSection = normalizeServicesSection(services);
  if (!servicesSection) return null;

  return <ServicesSection servicesSection={servicesSection} className={className} />;
};

export default OurServices;
