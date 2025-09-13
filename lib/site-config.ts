// Site configuration with data imported from JSON
// This file imports the site data from JSON and provides TypeScript utilities

import siteConfigData from './site-config.json';

// Type assertion to maintain the structure while importing from JSON
export const siteConfig = siteConfigData as {
  site: {
    brand: { value: string; type: string; maxLength: number; editable: boolean; description: string };
    city: { value: string; type: string; maxLength: number; editable: boolean; description: string };
    slug: { value: string; type: string; maxLength: number; editable: boolean; description: string };
    locale: { value: string; type: string; maxLength: number; editable: boolean; description: string };
    tone: { value: string; type: string; maxLength: number; editable: boolean; description: string };
  };
  features: {
    blogEnabled: { value: boolean; type: string; editable: boolean; description: string };
  };
  sections: Array<{
    id: string;
    type: string;
    enabled: boolean;
    order: number;
    fields: Record<string, any>;
  }>;
  pages?: {
    [pageType: string]: {
      services?: Array<{
        slug: string;
        name: string;
        tagline: string;
        fullDescription: string;
        features: string[];
        pricing: {
          base: number;
          currency: string;
          billing: string;
        };
        heroImage: string;
      }>;
      sections: Array<{
        id: string;
        type: string;
        enabled: boolean;
        order: number;
        fields: Record<string, any>;
      }>;
    };
  };
};

// Helper functions for working with the combined config
export function getFieldValue(sectionId: string, fieldPath: string): any {
  const section = siteConfig.sections.find(s => s.id === sectionId);
  if (!section) return undefined;
  
  const field = section.fields[fieldPath as keyof typeof section.fields];
  return field?.value;
}

export function setFieldValue(sectionId: string, fieldPath: string, value: any): void {
  const section = siteConfig.sections.find(s => s.id === sectionId);
  if (!section) return;
  
  const field = section.fields[fieldPath as keyof typeof section.fields];
  if (field) {
    (field as any).value = value;
  }
}

export function getSection(sectionId: string) {
  return siteConfig.sections.find(s => s.id === sectionId);
}

export function getEnabledSections() {
  return siteConfig.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
}

// Helper functions for working with page-specific sections
export function getPageSections(pageType: string) {
  if (!siteConfig.pages || !siteConfig.pages[pageType]) {
    return [];
  }
  return siteConfig.pages[pageType].sections;
}

export function getEnabledPageSections(pageType: string) {
  const sections = getPageSections(pageType);
  return sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
}

export function getPageFieldValue(pageType: string, sectionId: string, fieldPath: string): any {
  const sections = getPageSections(pageType);
  const section = sections.find(s => s.id === sectionId);
  if (!section) return undefined;
  
  const field = section.fields[fieldPath as keyof typeof section.fields];
  return field?.value;
}

// Helper functions for working with page-specific services
export function getPageServices(pageType: string) {
  if (!siteConfig.pages || !siteConfig.pages[pageType] || !siteConfig.pages[pageType].services) {
    return [];
  }
  return siteConfig.pages[pageType].services!;
}

export function getServiceBySlug(pageType: string, slug: string) {
  const services = getPageServices(pageType);
  return services.find(service => service.slug === slug);
}

// Type definitions for better TypeScript support
export type SiteConfig = typeof siteConfig;
export type Section = typeof siteConfig.sections[0];
export type FieldDefinition = {
  value: any;
  type: string;
  maxLength?: number;
  editable: boolean;
  description: string;
};
