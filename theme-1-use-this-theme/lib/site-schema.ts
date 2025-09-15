// Site schema definitions - TypeScript types and validation rules
export const siteSchema = {
  site: {
    brand: { type: "string", editable: true, maxLength: 50, description: "Business name" },
    city: { type: "string", editable: true, maxLength: 50, description: "Business city" },
    slug: { type: "string", editable: false, maxLength: 30, description: "URL slug" },
    locale: { type: "string", editable: false, maxLength: 10, description: "Site locale" },
    tone: { type: "string", editable: true, maxLength: 20, description: "Brand tone" }
  },
  features: {
    blogEnabled: { type: "boolean", editable: true, description: "Enable blog pages" }
  },
  // Registry of available section types for the picker
  sectionTypes: {
    hero: {
      displayName: 'Hero Section',
      description: 'Main banner with headline and call-to-action',
      singleton: true,
      schemaId: 'hero-main',
      defaultData: {
        shortHeadline: 'Your Business Headline',
        subHeadline: 'Compelling subtitle that explains your value proposition',
        primaryCta: { label: 'Get Started', href: '#contact' },
        secondaryCta: { label: 'Learn More', href: '#about' },
        heroImage: '/placeholder.jpg'
      }
    },
    about: {
      displayName: 'About Section',
      description: 'Information about your business',
      singleton: true,
      schemaId: 'about',
      defaultData: {
        title: 'About Us',
        story: 'Tell your business story here...',
        credentials: ['Professional Certification'],
        badges: ['Trusted Partner'],
        aboutImage: ''
      }
    },
    services: {
      displayName: 'Services Section',
      description: 'List of services you offer',
      singleton: true,
      schemaId: 'services',
      defaultData: {
        title: 'Our Services',
        items: [
          { name: 'Service 1', description: 'Description of service 1', price: '$100', image: '' }
        ]
      }
    },
    contact: {
      displayName: 'Contact Section',
      description: 'Contact information and form',
      singleton: true,
      schemaId: 'contact',
      defaultData: {
        title: 'Get In Touch',
        phone: '(555) 123-4567',
        email: 'hello@example.com',
        address: '123 Main St, City, State',
        primaryCta: { label: 'Contact Us', href: '#contact' },
        form: {
          enabled: true,
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'message', label: 'How can we help?', type: 'textarea', required: true }
          ]
        }
      }
    },
    testimonials: {
      displayName: 'Testimonials Section',
      description: 'Customer reviews and testimonials',
      singleton: true,
      schemaId: 'testimonials',
      defaultData: {
        title: 'What Our Clients Say',
        items: [
          { quote: 'Great service!', author: 'John Doe', company: 'ABC Corp', rating: 5, authorImage: '' }
        ]
      }
    },
    whyChooseUs: {
      displayName: 'Why Choose Us Section',
      description: 'Reasons to choose your business',
      singleton: true,
      schemaId: 'why-choose-us',
      defaultData: {
        title: 'Why Choose Us',
        bullets: ['Reason 1', 'Reason 2', 'Reason 3']
      }
    },
    blogTeaser: {
      displayName: 'Blog Section',
      description: 'Latest blog posts or articles',
      singleton: true,
      schemaId: 'blog-teaser',
      defaultData: {
        title: 'Latest Insights',
        items: [
          { title: 'Blog Post 1', excerpt: 'Brief description...', href: '/blog/post-1', date: '2024-01-15', image: '' }
        ]
      }
    },
    industriesServed: {
      displayName: 'Industries Section',
      description: 'Industries you serve',
      singleton: true,
      schemaId: 'industries-served',
      defaultData: {
        title: 'Industries We Serve',
        items: ['Industry 1', 'Industry 2', 'Industry 3']
      }
    }
  },
  sections: {
    "hero-main": {
      shortHeadline: { type: "string", editable: true, maxLength: 100, description: "Main headline" },
      subHeadline: { type: "string", editable: true, maxLength: 200, description: "Sub headline" },
      primaryCta: {
        label: { type: "string", editable: true, maxLength: 30, description: "Primary button text" },
        href: { type: "string", editable: false, maxLength: 100, description: "Primary button link" }
      },
      secondaryCta: {
        label: { type: "string", editable: true, maxLength: 25, description: "Secondary button text" },
        href: { type: "string", editable: false, maxLength: 100, description: "Secondary button link" }
      },
      heroImage: { type: "image", editable: true, maxLength: 200, description: "Hero section image" }
    },
    about: {
      title: { type: "string", editable: true, maxLength: 100, description: "About section title" },
      story: { type: "string", editable: true, maxLength: 1000, description: "About story text" },
      credentials: { type: "array", editable: true, description: "Professional credentials" },
      badges: { type: "array", editable: true, description: "Certification badges" },
      aboutImage: { type: "image", editable: true, maxLength: 200, description: "About section image" }
    },
    services: {
      title: { type: "string", editable: true, maxLength: 100, description: "Services section title" },
      items: {
        type: "array",
        editable: true,
        description: "List of services",
        maxItems: 4,
        itemSchema: {
          name: { type: "string", editable: true, maxLength: 50, description: "Service name" },
          description: { type: "string", editable: true, maxLength: 200, description: "Service description" },
          price: { type: "string", editable: true, maxLength: 20, description: "Service price" },
          image: { type: "image", editable: true, maxLength: 200, description: "Service image" }
        }
      }
    },
    contact: {
      title: { type: "string", editable: true, maxLength: 100, description: "Contact section title" },
      phone: { type: "string", editable: true, maxLength: 20, description: "Phone number" },
      email: { type: "string", editable: true, maxLength: 100, description: "Email address" },
      address: { type: "string", editable: true, maxLength: 200, description: "Business address" },
      primaryCta: {
        label: { type: "string", editable: true, maxLength: 30, description: "Contact button text" },
        href: { type: "string", editable: false, maxLength: 100, description: "Contact button link" }
      },
      form: {
        enabled: { type: "boolean", editable: true, description: "Enable contact form" },
        fields: { type: "array", editable: true, description: "Form fields" }
      }
    },
    testimonials: {
      title: { type: "string", editable: true, maxLength: 100, description: "Testimonials section title" },
      items: {
        type: "array",
        editable: true,
        description: "Customer testimonials",
        itemSchema: {
          quote: { type: "string", editable: true, maxLength: 500, description: "Testimonial quote" },
          author: { type: "string", editable: true, maxLength: 50, description: "Testimonial author" },
          company: { type: "string", editable: true, maxLength: 50, description: "Author company" },
          rating: { type: "number", editable: true, description: "Rating out of 5" },
          authorImage: { type: "image", editable: true, maxLength: 200, description: "Author profile image" }
        }
      }
    },
    "why-choose-us": {
      title: { type: "string", editable: true, maxLength: 100, description: "Why choose us section title" },
      bullets: {
        type: "array",
        editable: true,
        description: "Reasons to choose us",
        itemSchema: { type: "string", editable: true, maxLength: 100, description: "Reason bullet point" }
      }
    },
    "industries-served": {
      title: { type: "string", editable: true, maxLength: 100, description: "Industries section title" },
      items: {
        type: "array",
        editable: true,
        description: "Industries we serve",
        maxItems: 6,
        itemSchema: { type: "string", editable: true, maxLength: 50, description: "Industry name" }
      }
    },
    "blog-teaser": {
      title: { type: "string", editable: true, maxLength: 100, description: "Blog section title" },
      items: {
        type: "array",
        editable: true,
        description: "Latest blog posts",
        itemSchema: {
          title: { type: "string", editable: true, maxLength: 100, description: "Blog post title" },
          excerpt: { type: "string", editable: true, maxLength: 200, description: "Blog post excerpt" },
          href: { type: "string", editable: false, maxLength: 100, description: "Blog post URL" },
          date: { type: "string", editable: true, maxLength: 20, description: "Blog post date" },
          image: { type: "image", editable: true, maxLength: 200, description: "Blog post featured image" }
        }
      }
    }
  },
  pages: {
    "service-detail": {
      allowedSectionTypes: ['serviceHero','serviceDescription','servicePricing','serviceContact'],
      services: {
        type: "array",
        itemSchema: {
          slug: { type: "string", editable: false, description: "Service slug" },
          name: { type: "string", editable: true, maxLength: 100, description: "Service name" },
          tagline: { type: "string", editable: true, maxLength: 200, description: "Service tagline" },
          fullDescription: { type: "string", editable: true, maxLength: 2000, description: "Full service description" },
          features: { type: "array", editable: true, description: "Service features list" },
          pricing: {
            base: { type: "number", editable: true, description: "Base service price" },
            currency: { type: "string", editable: true, maxLength: 10, description: "Currency code" },
            billing: { type: "string", editable: true, maxLength: 20, description: "Billing frequency" }
          },
          heroImage: { type: "image", editable: true, maxLength: 200, description: "Service hero image" }
        }
      },
      sections: {
        "service-hero": {
          title: { type: "string", editable: true, maxLength: 100, description: "Service title" },
          subtitle: { type: "string", editable: true, maxLength: 200, description: "Service subtitle" },
          heroImage: { type: "image", editable: true, maxLength: 200, description: "Service hero image" }
        },
        "service-description": {
          description: { type: "string", editable: true, maxLength: 2000, description: "Detailed service description" },
          features: { type: "array", editable: true, description: "Service features" }
        },
        "service-pricing": {
          title: { type: "string", editable: true, maxLength: 100, description: "Pricing section title" },
          basePrice: { type: "number", editable: true, description: "Base service price" },
          currency: { type: "string", editable: true, maxLength: 10, description: "Currency code" },
          billing: { type: "string", editable: true, maxLength: 20, description: "Billing frequency" },
          ctaText: { type: "string", editable: true, maxLength: 30, description: "Call to action text" }
        },
        "service-contact": {
          title: { type: "string", editable: true, maxLength: 100, description: "Contact section title" },
          message: { type: "string", editable: true, maxLength: 200, description: "Contact message" },
          ctaText: { type: "string", editable: true, maxLength: 30, description: "Contact button text" }
        }
      }
    }
  }
} as const;

// Type definitions for better TypeScript support
export type SiteSchema = typeof siteSchema;
export type SectionSchema = typeof siteSchema.sections[keyof typeof siteSchema.sections];
export type FieldSchema = {
  type: string;
  maxLength?: number;
  editable: boolean;
  description: string;
  itemSchema?: any;
};