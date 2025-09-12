"use client";
import { siteConfig, getEnabledSections } from "@/lib/site-config"
import { PreviewProvider, PreviewToolbar, usePreviewContext } from "@/lib/preview-context"
import { EditableSection } from "@/components/ui/editable-section"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ServicesSection } from "@/components/sections/services-section"
import { IndustriesSection } from "@/components/sections/industries-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section"
import { ContactSection } from "@/components/sections/contact-section"
import { BlogTeaserSection } from "@/components/sections/blog-teaser-section"
import { FooterSection } from "@/components/sections/footer-section"


const sectionComponents = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  industriesServed: IndustriesSection,
  testimonials: TestimonialsSection,
  whyChooseUs: WhyChooseUsSection,
  contact: ContactSection,
  blogTeaser: BlogTeaserSection,
  footer: FooterSection,
} as const

// Helper function to extract value from field objects
function extractValue(field: any): any {
  if (field && typeof field === 'object' && 'value' in field) {
    return field.value;
  }
  return field;
}

// Helper function to extract data from the new config structure
function extractDataFromConfig() {
  const siteData = {
    site: {
      brand: extractValue(siteConfig.site.brand),
      city: extractValue(siteConfig.site.city),
      slug: extractValue(siteConfig.site.slug),
      locale: extractValue(siteConfig.site.locale),
      tone: extractValue(siteConfig.site.tone),
    },
    features: {
      blogEnabled: extractValue(siteConfig.features.blogEnabled),
    },
    sections: siteConfig.sections.map(section => ({
      id: section.id,
      type: section.type,
      enabled: section.enabled,
      order: section.order,
      data: Object.fromEntries(
        Object.entries(section.fields).map(([key, field]) => {
          if (key === 'items' && field.type === 'array') {
            // Handle array items specially
            return [key, field.value.map((item: any) => {
              // Check if item is a simple field object (like industries, bullets)
              if (item && typeof item === 'object' && 'value' in item && !('name' in item) && !('quote' in item) && !('title' in item)) {
                return extractValue(item);
              }
              // If item is a complex object (like services, testimonials, blog), extract values from nested fields
              if (typeof item === 'object' && item !== null) {
                return Object.fromEntries(
                  Object.entries(item).map(([itemKey, itemField]) => [
                    itemKey, 
                    extractValue(itemField)
                  ])
                );
              }
              // If item is a simple value (like credentials, badges), return as is
              return item;
            })];
          } else if (key === 'bullets' && field.type === 'array') {
            // Handle bullets array specially - extract values from each bullet
            return [key, field.value.map((bullet: any) => extractValue(bullet))];
          } else if (key === 'credentials' && field.type === 'array') {
            // Handle credentials array specially - these are simple strings
            return [key, field.value];
          } else if (key === 'badges' && field.type === 'array') {
            // Handle badges array specially - these are simple strings
            return [key, field.value];
          } else if (key === 'form' && typeof field === 'object' && field !== null) {
            // Handle form object specially - form.fields.value is already an array
            return [key, {
              enabled: extractValue(field.enabled),
              fields: field.fields.value || field.fields || []
            }];
          } else if (typeof field === 'object' && field !== null) {
            // Handle nested objects like primaryCta, secondaryCta
            if ('value' in field) {
              // Field has a direct value property
              if (field.value && typeof field.value === 'object') {
                return [key, Object.fromEntries(
                  Object.entries(field.value).map(([nestedKey, nestedField]) => [
                    nestedKey,
                    extractValue(nestedField)
                  ])
                )];
              }
              return [key, extractValue(field)];
            } else {
              // Field is an object with nested field objects (like primaryCta/secondaryCta)
              return [key, Object.fromEntries(
                Object.entries(field).map(([nestedKey, nestedField]) => [
                  nestedKey,
                  extractValue(nestedField)
                ])
              )];
            }
          }
          return [key, extractValue(field)];
        })
      )
    }))
  }
  
  return siteData
}

// Helper function to create schema from config - FIXED to match data structure
function createSchemaFromConfig() {
  const schema = {
    site: Object.fromEntries(
      Object.entries(siteConfig.site).map(([key, field]) => [key, {
        type: field.type,
        maxLength: field.maxLength,
        editable: field.editable,
        description: field.description
      }])
    ),
    features: Object.fromEntries(
      Object.entries(siteConfig.features).map(([key, field]) => [key, {
        type: field.type,
        editable: field.editable,
        description: field.description
      }])
    ),
    sections: siteConfig.sections.map(section => ({
      id: section.id,
      type: section.type,
      enabled: section.enabled,
      order: section.order,
      data: Object.fromEntries(
        Object.entries(section.fields).map(([key, field]) => {
          if (key === 'items' && field.type === 'array') {
            // Handle array items schema
            return [key, {
              type: field.type,
              editable: field.editable,
              description: field.description,
              items: field.value.map((item: any) => {
                // If item is a simple field object, return its schema
                if (item && typeof item === 'object' && 'value' in item && !('name' in item) && !('quote' in item) && !('title' in item)) {
                  return {
                    type: item.type,
                    maxLength: item.maxLength,
                    editable: item.editable,
                    description: item.description
                  };
                }
                // If item is a complex object, return nested schema
                if (typeof item === 'object' && item !== null) {
                  return Object.fromEntries(
                    Object.entries(item).map(([itemKey, itemField]) => [
                      itemKey,
                      {
                        type: (itemField as any).type,
                        maxLength: (itemField as any).maxLength,
                        editable: (itemField as any).editable,
                        description: (itemField as any).description
                      }
                    ])
                  );
                }
                return {
                  type: 'string',
                  editable: true,
                  description: 'Array item'
                };
              })
            }];
          } else if (key === 'bullets' && field.type === 'array') {
            // Handle bullets array schema
            return [key, {
              type: field.type,
              editable: field.editable,
              description: field.description,
              items: field.value.map(() => ({
                type: 'string',
                editable: true,
                description: 'Bullet point'
              }))
            }];
          } else if (key === 'credentials' && field.type === 'array') {
            // Handle credentials array schema - simple strings
            return [key, {
              type: field.type,
              editable: field.editable,
              description: field.description
            }];
          } else if (key === 'badges' && field.type === 'array') {
            // Handle badges array schema - simple strings
            return [key, {
              type: field.type,
              editable: field.editable,
              description: field.description
            }];
          } else if (key === 'form' && typeof field === 'object' && field !== null) {
            // Handle form object schema
            return [key, {
              enabled: {
                type: field.enabled.type,
                editable: field.enabled.editable,
                description: field.enabled.description
              },
              fields: {
                type: field.fields.type,
                editable: field.fields.editable,
                description: field.fields.description
              }
            }];
          } else if (typeof field === 'object' && field !== null) {
            // Handle nested objects like primaryCta, secondaryCta
            if ('value' in field) {
              // Field has a direct value property
              if (field.value && typeof field.value === 'object') {
                return [key, Object.fromEntries(
                  Object.entries(field.value).map(([nestedKey, nestedField]) => [
                    nestedKey,
                    {
                      type: (nestedField as any).type,
                      maxLength: (nestedField as any).maxLength,
                      editable: (nestedField as any).editable,
                      description: (nestedField as any).description
                    }
                  ])
                )];
              }
              return [key, {
                type: (field as any).type,
                maxLength: (field as any).maxLength,
                editable: (field as any).editable,
                description: (field as any).description
              }];
            } else {
              // Field is an object with nested field objects (like primaryCta/secondaryCta)
              return [key, Object.fromEntries(
                Object.entries(field).map(([nestedKey, nestedField]) => [
                  nestedKey,
                  {
                    type: (nestedField as any).type,
                    maxLength: (nestedField as any).maxLength,
                    editable: (nestedField as any).editable,
                    description: (nestedField as any).description
                  }
                ])
              )];
            }
          }
          return [key, {
            type: field.type,
            maxLength: field.maxLength,
            editable: field.editable,
            description: field.description
          }];
        })
      )
    }))
  }
  
  return schema
}

function SiteContent() {
  const { getSections } = usePreviewContext()

  const sections = getSections()
  const enabledSections = sections
    .filter((section) => section.enabled)
    .filter((section) => siteConfig.features.blogEnabled.value || section.type !== "blogTeaser")
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-background">
      <PreviewToolbar />
      
      {enabledSections.map((section, index) => {
        const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents]

        if (!SectionComponent) {
          console.warn(`No component found for section type: ${section.type}`)
          return null
        }

        // Determine section capabilities based on type and position
        const canRemove = section.type !== 'hero' && section.type !== 'footer'
        const canAddBefore = index > 0 // Can add before any section except the first
        const canAddAfter = true // Can add after any section

        return (
          <EditableSection
            key={section.id}
            sectionId={section.id}
            sectionType={section.type}
            path={`sections.${section.id}`}
            sectionIndex={index}
            canRemove={canRemove}
            canAddBefore={canAddBefore}
            canAddAfter={canAddAfter}
          >
            <SectionComponent data={section.data as any} />
          </EditableSection>
        )
      })}
    </div>
  );
}

export default function HomePage() {
  const siteData = extractDataFromConfig()
  const siteSchema = createSchemaFromConfig()
  
  return (
    <PreviewProvider initialData={siteData} schema={siteSchema} siteSlug="theme-1-sections-demo">
      <SiteContent />
    </PreviewProvider>
  )
}
