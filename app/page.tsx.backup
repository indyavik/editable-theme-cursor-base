import { siteData } from "@/lib/site-data"
import { siteDataSchema } from "@/lib/site-data-schema"
import { PreviewProvider, PreviewToolbar } from "@/lib/preview-context"
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

function SiteContent() {
  const enabledSections = siteData.sections.filter((section) => section.enabled).sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-background">
      <PreviewToolbar />
      
      {enabledSections.map((section) => {
        const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents]

        if (!SectionComponent) {
          console.warn(`No component found for section type: ${section.type}`)
          return null
        }

        // Use original data - EditableText components will handle the preview values
        return <SectionComponent key={section.id} data={section.data as any} />
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <PreviewProvider initialData={siteData} schema={siteDataSchema} siteSlug="theme1-demo">
      <SiteContent />
    </PreviewProvider>
  )
}
