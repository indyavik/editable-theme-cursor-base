// Combined site configuration with schema and data in single definition
// This file combines both schema definition and actual site data

export const siteConfig = {
  site: {
    brand: { 
      value: "Summit Books & Tax", 
      type: "string", 
      maxLength: 50, 
      editable: true,
      description: "Business name"
    },
    city: { 
      value: "Seattle, WA", 
      type: "string", 
      maxLength: 50, 
      editable: true,
      description: "Business city"
    },
    slug: { 
      value: "summit-books-tax-seattle", 
      type: "string", 
      maxLength: 30, 
      editable: false,
      description: "URL slug"
    },
    locale: { 
      value: "en", 
      type: "string", 
      maxLength: 10, 
      editable: false,
      description: "Site locale"
    },
    tone: { 
      value: "professional", 
      type: "string", 
      maxLength: 20, 
      editable: true,
      description: "Brand tone"
    }
  },
  features: {
    blogEnabled: { 
      value: true, 
      type: "boolean", 
      editable: true, 
      description: "Enable blog pages"
    }
  },
  sections: [
    {
      id: "hero-main",
      type: "hero",
      enabled: true,
      order: 10,
      fields: {
        shortHeadline: { 
          value: "Stress-Free Bookkeeping for Small Businesses", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Main headline"
        },
        subHeadline: { 
          value: "Remote, accurate, and affordable—so you can focus on growth.", 
          type: "string", 
          maxLength: 200, 
          editable: true,
          description: "Sub headline"
        },
        primaryCta: {
          label: { 
            value: "Book a Free Consultation", 
            type: "string", 
            maxLength: 30, 
            editable: true,
            description: "Primary button text"
          },
          href: { 
            value: "#contact", 
            type: "string", 
            maxLength: 100, 
            editable: false,
            description: "Primary button link"
          }
        },
        secondaryCta: {
          label: { 
            value: "See Pricing", 
            type: "string", 
            maxLength: 25, 
            editable: true,
            description: "Secondary button text"
          },
          href: { 
            value: "#pricing", 
            type: "string", 
            maxLength: 100, 
            editable: false,
            description: "Secondary button link"
          }
        },
        heroImage: { 
          value: "/accountant.png", 
          type: "image", 
          maxLength: 200, 
          editable: true,
          description: "Hero section image"
        }
      }
    },
    {
      id: "about",
      type: "about",
      enabled: true,
      order: 20,
      fields: {
        title: { 
          value: "About Summit bookkeeping", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "About section title"
        },
        story: { 
          value: "Boutique bookkeeping team with a decade of experience in retail, services, and online brands.", 
          type: "string", 
          maxLength: 1000, 
          editable: true,
          description: "About story text"
        },
        credentials: { 
          value: ["QuickBooks ProAdvisor", "Xero Certified"], 
          type: "array", 
          editable: true,
          description: "Professional credentials"
        },
        badges: { 
          value: ["BBB Accredited"], 
          type: "array", 
          editable: true,
          description: "Certification badges"
        },
        aboutImage: { 
          value: "", 
          type: "image", 
          maxLength: 200, 
          editable: true,
          description: "About section image"
        }
      }
    },
    {
      id: "services",
      type: "services",
      enabled: true,
      order: 30,
      fields: {
        title: { 
          value: "Our Services", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Services section title"
        },
        items: {
          type: "array",
          editable: true,
          description: "List of services",
          value: [
            {
              name: { 
                value: "Monthly Bookkeeping", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Service name"
              },
              description: { 
                value: "On-time closes with detailed reporting", 
                type: "string", 
                maxLength: 200, 
                editable: true,
                description: "Service description"
              },
              price: { 
                value: "$300/month", 
                type: "string", 
                maxLength: 20, 
                editable: true,
                description: "Service price"
              },
              image: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Service image"
              }
            },
            {
              name: { 
                value: "Payroll Processing", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Service name"
              },
              description: { 
                value: "Setup & onboarding for your team", 
                type: "string", 
                maxLength: 200, 
                editable: true,
                description: "Service description"
              },
              price: { 
                value: "$150/month", 
                type: "string", 
                maxLength: 20, 
                editable: true,
                description: "Service price"
              },
              image: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Service image"
              }
            },
            {
              name: { 
                value: "AP/AR Management", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Service name"
              },
              description: { 
                value: "Bill pay workflows and receivables", 
                type: "string", 
                maxLength: 200, 
                editable: true,
                description: "Service description"
              },
              price: { 
                value: "$200/month", 
                type: "string", 
                maxLength: 20, 
                editable: true,
                description: "Service price"
              },
              image: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Service image"
              }
            },
            {
              name: { 
                value: "Financial Reporting", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Service name"
              },
              description: { 
                value: "P&L, Balance Sheet, Cash Flow statements", 
                type: "string", 
                maxLength: 200, 
                editable: true,
                description: "Service description"
              },
              price: { 
                value: "$100/month", 
                type: "string", 
                maxLength: 20, 
                editable: true,
                description: "Service price"
              },
              image: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Service image"
              }
            }
          ]
        }
      }
    },
    {
      id: "contact",
      type: "contact",
      enabled: true,
      order: 80,
      fields: {
        title: { 
          value: "Get In Touch", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Contact section title"
        },
        phone: { 
          value: "(206) 555-0123", 
          type: "string", 
          maxLength: 20, 
          editable: true,
          description: "Phone number"
        },
        email: { 
          value: "hello@summitbooks.com", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Email address"
        },
        address: { 
          value: "123 Business Ave, Seattle, WA 98101", 
          type: "string", 
          maxLength: 200, 
          editable: true,
          description: "Business address"
        },
        primaryCta: {
          label: { 
            value: "Contact Us", 
            type: "string", 
            maxLength: 30, 
            editable: true,
            description: "Contact button text"
          },
          href: { 
            value: "#contact", 
            type: "string", 
            maxLength: 100, 
            editable: false,
            description: "Contact button link"
          }
        },
        form: {
          enabled: { 
            value: true, 
            type: "boolean", 
            editable: true,
            description: "Enable contact form"
          },
          fields: {
            type: "array",
            editable: true,
            description: "Form fields",
            value: [
              { name: "name", label: "Name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "message", label: "How can we help?", type: "textarea", required: true }
            ]
          }
        }
      }
    },
    {
      id: "testimonials",
      type: "testimonials",
      enabled: true,
      order: 60,
      fields: {
        title: { 
          value: "What Our Clients Say", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Testimonials section title"
        },
        items: {
          type: "array",
          editable: true,
          description: "Customer testimonials",
          value: [
            {
              quote: { 
                value: "Summit Books has transformed our financial management. Professional, reliable, and always on time.", 
                type: "string", 
                maxLength: 500, 
                editable: true,
                description: "Testimonial quote"
              },
              author: { 
                value: "Sarah Johnson", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Testimonial author"
              },
              company: { 
                value: "Johnson & Associates", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Author company"
              },
              rating: { 
                value: 5, 
                type: "number", 
                editable: true,
                description: "Rating out of 5"
              },
              authorImage: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Author profile image"
              }
            },
            {
              quote: { 
                value: "The team's expertise in QuickBooks saved us hours every month. Highly recommended!", 
                type: "string", 
                maxLength: 500, 
                editable: true,
                description: "Testimonial quote"
              },
              author: { 
                value: "Mike Chen", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Testimonial author"
              },
              company: { 
                value: "Chen Consulting", 
                type: "string", 
                maxLength: 50, 
                editable: true,
                description: "Author company"
              },
              rating: { 
                value: 5, 
                type: "number", 
                editable: true,
                description: "Rating out of 5"
              },
              authorImage: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Author profile image"
              }
            }
          ]
        }
      }
    },
    {
      id: "why-choose-us",
      type: "whyChooseUs",
      enabled: true,
      order: 70,
      fields: {
        title: { 
          value: "Why Choose Summit Books", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Why choose us section title"
        },
        bullets: {
          type: "array",
          editable: true,
          description: "Reasons to choose us",
          value: [
            { 
              value: "10+ years of bookkeeping experience", 
              type: "string", 
              maxLength: 100, 
              editable: true,
              description: "Reason bullet point"
            },
            { 
              value: "QuickBooks ProAdvisor certified", 
              type: "string", 
              maxLength: 100, 
              editable: true,
              description: "Reason bullet point"
            },
            { 
              value: "Remote and secure cloud-based systems", 
              type: "string", 
              maxLength: 100, 
              editable: true,
              description: "Reason bullet point"
            },
            { 
              value: "Monthly financial reports included", 
              type: "string", 
              maxLength: 100, 
              editable: true,
              description: "Reason bullet point"
            },
            { 
              value: "Dedicated account manager", 
              type: "string", 
              maxLength: 100, 
              editable: true,
              description: "Reason bullet point"
            }
          ]
        }
      }
    },
    {
      id: "industries-served",
      type: "industriesServed",
      enabled: true,
      order: 40,
      fields: {
        title: { 
          value: "Industries We Serve", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Industries section title"
        },
        items: {
          type: "array",
          editable: true,
          description: "Industries we serve",
          value: [
            { 
              value: "Retail & E-commerce", 
              type: "string", 
              maxLength: 50, 
              editable: true,
              description: "Industry name"
            },
            { 
              value: "Professional Services", 
              type: "string", 
              maxLength: 50, 
              editable: true,
              description: "Industry name"
            },
            { 
              value: "Healthcare Practices", 
              type: "string", 
              maxLength: 50, 
              editable: true,
              description: "Industry name"
            },
            { 
              value: "Restaurants & Food Service", 
              type: "string", 
              maxLength: 50, 
              editable: true,
              description: "Industry name"
            },
            { 
              value: "Construction & Trades", 
              type: "string", 
              maxLength: 50, 
              editable: true,
              description: "Industry name"
            },
            { 
              value: "Non-Profit Organizations", 
              type: "string", 
              maxLength: 50, 
              editable: true,
              description: "Industry name"
            }
          ]
        }
      }
    },
    {
      id: "blog-teaser",
      type: "blogTeaser",
      enabled: true,
      order: 100,
      fields: {
        title: { 
          value: "Latest Insights", 
          type: "string", 
          maxLength: 100, 
          editable: true,
          description: "Blog section title"
        },
        items: {
          type: "array",
          editable: true,
          description: "Latest blog posts",
          value: [
            {
              title: { 
                value: "5 Bookkeeping Mistakes Small Businesses Make", 
                type: "string", 
                maxLength: 100, 
                editable: true,
                description: "Blog post title"
              },
              excerpt: { 
                value: "Learn the common pitfalls that can cost your business money and how to avoid them.", 
                type: "string", 
                maxLength: 200, 
                editable: true,
                description: "Blog post excerpt"
              },
              href: { 
                value: "/blog/bookkeeping-mistakes", 
                type: "string", 
                maxLength: 100, 
                editable: false,
                description: "Blog post URL"
              },
              date: { 
                value: "2024-01-15", 
                type: "string", 
                maxLength: 20, 
                editable: true,
                description: "Blog post date"
              },
              image: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Blog post featured image"
              }
            },
            {
              title: { 
                value: "Understanding Cash Flow: A Business Owner's Guide", 
                type: "string", 
                maxLength: 100, 
                editable: true,
                description: "Blog post title"
              },
              excerpt: { 
                value: "Master the basics of cash flow management to keep your business financially healthy.", 
                type: "string", 
                maxLength: 200, 
                editable: true,
                description: "Blog post excerpt"
              },
              href: { 
                value: "/blog/cash-flow-guide", 
                type: "string", 
                maxLength: 100, 
                editable: false,
                description: "Blog post URL"
              },
              date: { 
                value: "2024-01-10", 
                type: "string", 
                maxLength: 20, 
                editable: true,
                description: "Blog post date"
              },
              image: { 
                value: "", 
                type: "image", 
                maxLength: 200, 
                editable: true,
                description: "Blog post featured image"
              }
            }
          ]
        }
      }
    }
  ]
} as const;

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
