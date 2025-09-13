"use client";
import { useState, useEffect } from "react"
import { siteConfig, getEnabledPageSections, getServiceBySlug } from "@/lib/site-config"
import { PreviewProvider, PreviewToolbar, usePreviewContext } from "@/lib/preview-context"
import { EditableSection } from "@/components/ui/editable-section"
import { ServiceHeroSection } from "../../../components/sections/service-hero-section"
import { ServiceDescriptionSection } from "../../../components/sections/service-description-section"
import { ServicePricingSection } from "../../../components/sections/service-pricing-section"
import { ServiceContactSection } from "../../../components/sections/service-contact-section"


// Helper function to extract values from field definitions
function extractValue(field: any): any {
  return field?.value || field;
}

// Helper function to process template strings like {{service.name}} and {{service.pricing.currency}}
function processTemplate(template: string, service: any): any {
  if (!template || typeof template !== 'string' || !service) {
    return template;
  }
  
  try {
    // Handle direct template references like "{{service.features}}" or "{{service.pricing.currency}}"
    const directMatch = template.match(/^\{\{service\.([\w.]+)\}\}$/);
    if (directMatch) {
      const keyPath = directMatch[1];
      const value = getNestedValue(service, keyPath);
      return value !== undefined ? value : template;
    }
    
    // Handle template strings with text like "Contact us about {{service.name}}"
    return template.replace(/\{\{service\.([\w.]+)\}\}/g, (match, keyPath) => {
      const value = getNestedValue(service, keyPath);
      return value !== undefined ? String(value) : match;
    });
  } catch (error) {
    console.warn('Error processing template:', template, error);
    return template;
  }
}

// Helper function to get nested object values like "pricing.currency"
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key];
    }
    return undefined;
  }, obj);
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

  // Process sections with service data
  const processedSections = pageSections.map(section => {
    try {
      return {
        ...section,
        fields: Object.fromEntries(
          Object.entries(section.fields || {}).map(([key, field]) => [
            key,
            {
              ...field,
              value: typeof field?.value === 'string' && field.value.includes('{{service.') 
                ? processTemplate(field.value, service)
                : field?.value
            }
          ])
        )
      };
    } catch (error) {
      console.warn('Error processing section:', section.id, error);
      return section;
    }
  });

  // Create the data structure expected by PreviewProvider
  const previewData = {
    sections: processedSections,
    site: {
      brand: siteConfig.site.brand.value,
      city: siteConfig.site.city.value,
      slug: siteConfig.site.slug.value,
      locale: siteConfig.site.locale.value,
      tone: siteConfig.site.tone.value,
    },
    features: {
      blogEnabled: siteConfig.features.blogEnabled.value,
    }
  };

  return (
    <PreviewProvider initialData={previewData} schema={siteConfig}>
      <div className="min-h-screen bg-white">
        <PreviewToolbar />
        
        <main suppressHydrationWarning>
          {processedSections.map((section, index) => (
            <EditableSection
              key={section.id}
              sectionId={section.id}
              sectionType={section.type}
              path={`sections.${index}`}
              sectionIndex={index}
            >
              {section.type === 'serviceHero' && (
                <ServiceHeroSection
                  title={extractValue(section.fields.title)}
                  subtitle={extractValue(section.fields.subtitle)}
                  heroImage={extractValue(section.fields.heroImage)}
                />
              )}
              {section.type === 'serviceDescription' && (
                <ServiceDescriptionSection
                  description={extractValue(section.fields.description)}
                  features={extractValue(section.fields.features)}
                />
              )}
              {section.type === 'servicePricing' && (
                <ServicePricingSection
                  title={extractValue(section.fields.title)}
                  basePrice={extractValue(section.fields.basePrice)}
                  currency={extractValue(section.fields.currency)}
                  billing={extractValue(section.fields.billing)}
                  ctaText={extractValue(section.fields.ctaText)}
                />
              )}
              {section.type === 'serviceContact' && (
                <ServiceContactSection
                  title={extractValue(section.fields.title)}
                  message={extractValue(section.fields.message)}
                  ctaText={extractValue(section.fields.ctaText)}
                />
              )}
            </EditableSection>
          ))}
        </main>
      </div>
    </PreviewProvider>
  );
}
