"use client";
import { useState, useEffect } from "react"
import { siteData, siteSchema, getEnabledPageSections, getServiceBySlug } from "@/lib/site-config"
import { PreviewProvider, PreviewToolbar } from "@/lib/preview-context"
import { EditableSection } from "@/components/ui/editable-section"
import { ServiceHeroSection } from "../../../components/sections/service-hero-section"
import { ServiceDescriptionSection } from "../../../components/sections/service-description-section"
import { ServicePricingSection } from "../../../components/sections/service-pricing-section"
import { ServiceContactSection } from "../../../components/sections/service-contact-section"

function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as any)[key];
    }
    return undefined;
  }, obj);
}

// Process a single value: if it's a template string, replace from service; otherwise return as-is
function processTemplateValue(value: any, service: any): any {
  if (typeof value !== 'string') return value;

  // Direct reference like "{{service.features}}" → can be array/object/primitive
  const directMatch = value.match(/^\{\{service\.([\w.]+)\}\}$/);
  if (directMatch) {
    const keyPath = directMatch[1];
    const resolved = getNestedValue(service, keyPath);
    return resolved !== undefined ? resolved : value;
  }

  // Interpolated string like "Contact us about {{service.name}}"
  return value.replace(/\{\{service\.([\w.]+)\}\}/g, (_m, keyPath) => {
    const resolved = getNestedValue(service, keyPath);
    return resolved !== undefined ? String(resolved) : _m;
  });
}

// Recursively process any object/array, replacing template strings with service values
function processDataNode(node: any, service: any): any {
  if (Array.isArray(node)) {
    return node.map((item) => processDataNode(item, service));
  }
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, processDataNode(v, service)])
    );
  }
  return processTemplateValue(node, service);
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [mounted, setMounted] = useState(false);
  const service = getServiceBySlug('service-detail', params.slug);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-96"></div>
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The service you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Get the page sections for service-detail
  const pageSections = getEnabledPageSections('service-detail');

  // Process section.data recursively with service substitutions
  const processedSections = pageSections.map((section: any) => {
    const processedData = processDataNode(section.data || {}, service);
    return { ...section, data: processedData };
  });

  // Create the data structure expected by PreviewProvider
  const previewData = {
    sections: processedSections,
    site: siteData.site,
    features: siteData.features
  } as any;

  return (
    <PreviewProvider initialData={previewData} schema={siteSchema} pageType="service-detail">
      <div className="min-h-screen bg-white">
        <PreviewToolbar />
        
        <main suppressHydrationWarning>
          {processedSections.map((section: any, index: number) => (
            <EditableSection
              key={section.id}
              sectionId={section.id}
              sectionType={section.type}
              path={`sections.${section.id}`}
              sectionIndex={index}
            >
              {section.type === 'serviceHero' && (
                <ServiceHeroSection
                  title={section.data.title}
                  subtitle={section.data.subtitle}
                  heroImage={section.data.heroImage}
                />
              )}
              {section.type === 'serviceDescription' && (
                <ServiceDescriptionSection
                  description={section.data.description}
                  features={section.data.features}
                />
              )}
              {section.type === 'servicePricing' && (
                <ServicePricingSection
                  title={section.data.title}
                  basePrice={typeof section.data.basePrice === 'number' ? section.data.basePrice : Number(section.data.basePrice)}
                  currency={section.data.currency}
                  billing={section.data.billing}
                  ctaText={section.data.ctaText}
                />
              )}
              {section.type === 'serviceContact' && (
                <ServiceContactSection
                  title={section.data.title}
                  message={section.data.message}
                  ctaText={section.data.ctaText}
                />
              )}
            </EditableSection>
          ))}
        </main>
      </div>
    </PreviewProvider>
  );
}
