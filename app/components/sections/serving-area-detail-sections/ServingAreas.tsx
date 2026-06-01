'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import type { Page } from '@/app/lib/types';
import { ServingAreasSection } from '@/app/components/sections/ServingAreasSection';
import { tiptapToText } from '@/app/lib/seo';
import { resolveServiceSlug } from '@/app/lib/serviceAreaSlugs';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ServingAreasProps {
  /** `servingAreas` block from the service area page API */
  service?: unknown;
  /** Populated `serviceId` from the same page (current service in builder) */
  serviceId?: unknown;
  className?: string;
}

type ServingAreasSectionData = NonNullable<Page['servingAreasSection']> & {
  areas?: unknown[];
  serviceIds?: string[];
  serviceSlug?: string;
};

function getServiceRecord(serviceId: unknown, services: { _id: string; serviceAreas?: unknown[]; slug?: string; name?: string }[]) {
  if (!serviceId) return undefined;
  const id =
    typeof serviceId === 'string'
      ? serviceId
      : typeof serviceId === 'object' && serviceId !== null && '_id' in serviceId
        ? String((serviceId as { _id: string })._id)
        : '';
  if (!id) return undefined;
  return services.find((s) => s._id === id);
}

function builderAreasFromSection(data: Record<string, unknown>): unknown[] {
  if (Array.isArray(data.areas) && data.areas.length > 0) {
    return data.areas.filter(Boolean);
  }
  if (Array.isArray(data.serviceAreas) && data.serviceAreas.length > 0) {
    return data.serviceAreas.filter(Boolean);
  }
  return [];
}

function normalizeServingAreasSection(
  service: unknown,
  serviceId: unknown,
  serviceSlugFromUrl: string,
  services: { _id: string; serviceAreas?: unknown[]; slug?: string; name?: string }[],
  siteServiceAreas?: string[]
): ServingAreasSectionData | null {
  if (!service || typeof service !== 'object') return null;
  const data = service as Record<string, unknown>;
  if (data.enabled === false) return null;

  const currentService = getServiceRecord(serviceId, services);
  const areas = builderAreasFromSection(data);
  const serviceIds: string[] = [];

  if (areas.length === 0 && currentService?.serviceAreas?.length) {
    areas.push(...currentService.serviceAreas.filter(Boolean));
  }

  if (areas.length === 0 && siteServiceAreas?.length) {
    areas.push(...siteServiceAreas.filter(Boolean));
  }

  if (currentService?._id) {
    serviceIds.push(currentService._id);
  }

  const serviceSlug =
    serviceSlugFromUrl ||
    (typeof data.serviceSlug === 'string' ? data.serviceSlug : undefined) ||
    (currentService ? resolveServiceSlug(currentService) : undefined);

  const hasCopy =
    Boolean(data.title) || Boolean(tiptapToText(data.description as ServingAreasSectionData['description']));

  if (areas.length === 0 && !hasCopy) {
    return null;
  }

  return {
    enabled: true,
    title: data.title as ServingAreasSectionData['title'],
    description: data.description as ServingAreasSectionData['description'],
    areas,
    serviceIds: serviceIds.length > 0 ? serviceIds : undefined,
    serviceSlug,
  };
}

/** Service area serving areas — only areas configured in the builder for this page/service. */
export const ServingAreas: React.FC<ServingAreasProps> = ({ service, serviceId, className }) => {
  const params = useParams();
  const { services, site } = useWebBuilder();

  const serviceSlugFromUrl =
    typeof params?.serviceSlug === 'string' ? params.serviceSlug : '';

  const servingAreasSection = useMemo(
    () =>
      normalizeServingAreasSection(
        service,
        serviceId,
        serviceSlugFromUrl,
        services,
        site?.serviceAreas
      ),
    [service, serviceId, serviceSlugFromUrl, services, site?.serviceAreas]
  );

  if (!servingAreasSection) return null;

  return (
    <ServingAreasSection servingAreasSection={servingAreasSection} className={className} />
  );
};

export default ServingAreas;
