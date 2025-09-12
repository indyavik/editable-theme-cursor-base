"use client";
import { siteData } from "@/lib/site-data"
import { siteDataSchema } from "@/lib/site-data-schema"
import { PreviewProvider, PreviewToolbar, SectionPicker, usePreviewContext } from "@/lib/preview-context"
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
import { useState } from "react"

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

function SiteContent() {
  const { getSections, addSection, removeSection } = usePreviewContext()
  const [showSectionPicker, setShowSectionPicker] = useState(false)
  const [pendingSectionPosition, setPendingSectionPosition] = useState<number | null>(null)

  const sections = getSections()
  const enabledSections = sections.filter((section) => section.enabled).sort((a, b) => a.order - b.order)

  const handleAddSection = (position?: number) => {
    setPendingSectionPosition(position)
    setShowSectionPicker(true)
  }

  const handleSelectSection = (sectionType: string) => {
    if (pendingSectionPosition !== null) {
      addSection(sectionType, pendingSectionPosition)
    } else {
      addSection(sectionType)
    }
    setPendingSectionPosition(null)
  }

  const handleRemoveSection = (sectionId: string) => {
    removeSection(sectionId)
  }

  return (
    <div className="min-h-screen bg-background">
      <PreviewToolbar />
      <SectionPicker 
        isOpen={showSectionPicker}
        onClose={() => {
          setShowSectionPicker(false)
          setPendingSectionPosition(null)
        }}
        onSelect={handleSelectSection}
      />
      
      {enabledSections.map((section, index) => {
        const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents]

        if (!SectionComponent) {
          console.warn(`No component found for section type: ${section.type}`)
          return null
        }

        // Determine if section can be removed based on schema
        const canRemove = section.type !== 'hero' && section.type !== 'footer'
        const canAddBefore = index > 0 // Can add before any section except the first
        const canAddAfter = true // Can add after any section

        return (
          <EditableSection
            key={section.id}
            sectionId={section.id}
            sectionType={section.type}
            path={`sections.${section.id}`}
            onRemove={canRemove ? () => handleRemoveSection(section.id) : undefined}
            onAddBefore={canAddBefore ? () => handleAddSection(index) : undefined}
            onAddAfter={canAddAfter ? () => handleAddSection(index + 1) : undefined}
          >
            <SectionComponent data={section.data as any} />
          </EditableSection>
        )
      })}

      {/* Add section button at the end */}
      <div className="flex justify-center py-8">
        <button
          onClick={() => handleAddSection()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Section
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <PreviewProvider initialData={siteData} schema={siteDataSchema} siteSlug="theme-1-sections-demo">
      <SiteContent />
    </PreviewProvider>
  )
}
