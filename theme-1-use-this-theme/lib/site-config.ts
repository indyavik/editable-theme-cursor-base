// Site configuration - simplified exports for better developer experience
// This file provides clean imports and helper functions

import siteData from './site-data.json';
import { siteSchema } from './site-schema';

// Re-export the clean data and schema
export { siteData, siteSchema };

// Helper functions for working with the clean data structure
export function getSection(sectionId: string) {
  return siteData.sections.find(s => s.id === sectionId);
}

export function getEnabledSections() {
  return siteData.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
}

// Helper functions for working with page-specific sections
export function getPageSections(pageType: string) {
  if (!siteData.pages || !(siteData.pages as any)[pageType]) {
    return [];
  }
  return (siteData.pages as any)[pageType].sections;
}

export function getEnabledPageSections(pageType: string) {
  const sections = getPageSections(pageType);
  return sections.filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order);
}

// Helper functions for working with page-specific services
export function getPageServices(pageType: string) {
  if (!siteData.pages || !(siteData.pages as any)[pageType] || !(siteData.pages as any)[pageType].services) {
    return [];
  }
  return (siteData.pages as any)[pageType].services!;
}

export function getServiceBySlug(pageType: string, slug: string) {
  const services = getPageServices(pageType);
  return services.find((service: any) => service.slug === slug);
}

// Type definitions for better TypeScript support
export type SiteData = typeof siteData;
export type Section = typeof siteData.sections[0];
export type FieldSchema = {
  type: string;
  maxLength?: number;
  editable: boolean;
  description: string;
  itemSchema?: any;
};
