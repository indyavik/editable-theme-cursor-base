"use client";
import { siteData, siteSchema } from "@/lib/site-config"
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
  return {
    site: siteData.site,
    features: siteData.features,
    sections: siteData.sections
  }
}

function SiteContent() {
  const { getSections } = usePreviewContext()

  const sections = getSections()
  const enabledSections = sections
    .filter((section) => section.enabled)
    .filter((section) => siteData.features.blogEnabled || section.type !== "blogTeaser")
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
  // Pass the imported siteSchema directly (no transformation)
  
  return (
    <PreviewProvider initialData={siteData} schema={siteSchema} siteSlug="theme-1-sections-demo">
      <SiteContent />
    </PreviewProvider>
  )
}
