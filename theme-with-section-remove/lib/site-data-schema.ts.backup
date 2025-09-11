// Site data schema for theme1
// This defines the structure and validation rules for site data

export const siteDataSchema = {
  site: {
    slug: { 
      type: 'string', 
      maxLength: 30, 
      editable: false,
      description: 'URL slug for the site',
      example: 'theme1-demo'
    },
    locale: { 
      type: 'string', 
      maxLength: 10, 
      editable: false,
      description: 'Site locale',
      example: 'en-US'
    },
    brand: { 
      type: 'string', 
      maxLength: 50, 
      editable: true,
      description: 'Business name',
      example: 'Summit Bookkeeping'
    },
    city: { 
      type: 'string', 
      maxLength: 50, 
      editable: true,
      description: 'Business city',
      example: 'Seattle'
    },
    tone: { 
      type: 'string', 
      maxLength: 20, 
      editable: true,
      description: 'Brand tone',
      example: 'Professional'
    }
  },
  sections: {
    hero: {
      shortHeadline: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Main headline',
        example: 'Stress-Free Bookkeeping for Small Businesses'
      },
      subHeadline: { 
        type: 'string', 
        maxLength: 200, 
        editable: true,
        description: 'Sub headline',
        example: 'Remote, accurate, and affordable—so you can focus on growth.'
      },
      primaryCta: {
        label: { 
          type: 'string', 
          maxLength: 30, 
          editable: true,
          description: 'Primary button text',
          example: 'Book a Free Consultation'
        },
        href: { 
          type: 'string', 
          maxLength: 100, 
          editable: false,
          description: 'Primary button link',
          example: '#contact'
        }
      },
      secondaryCta: {
        label: { 
          type: 'string', 
          maxLength: 25, 
          editable: true,
          description: 'Secondary button text',
          example: 'See Pricing'
        },
        href: { 
          type: 'string', 
          maxLength: 100, 
          editable: false,
          description: 'Secondary button link',
          example: '#pricing'
        }
      },
      heroImage: {
        type: 'image',
        maxLength: 200,
        editable: true,
        description: 'Hero section image',
        example: '/accountant.png'
      }
    },
    about: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'About section title',
        example: 'About Summit Bookkeeping'
      },
      story: { 
        type: 'string', 
        maxLength: 1000, 
        editable: true,
        description: 'About story text',
        example: 'We help small businesses...'
      },
      credentials: {
        type: 'array',
        editable: true,
        description: 'Professional credentials',
        items: {
          type: 'string',
          maxLength: 100
        }
      },
      badges: {
        type: 'array',
        editable: true,
        description: 'Certification badges',
        items: {
          type: 'string',
          maxLength: 50
        }
      }
    },
    services: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Services section title',
        example: 'Our Services'
      },
      items: {
        type: 'array',
        editable: true,
        description: 'List of services',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 50 },
            description: { type: 'string', maxLength: 200 },
            icon: { type: 'string', maxLength: 50 }
          }
        }
      }
    },
    contact: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Contact section title',
        example: 'Get In Touch'
      },
      phone: { 
        type: 'string', 
        maxLength: 20, 
        editable: true,
        description: 'Phone number',
        example: '(555) 123-4567'
      },
      email: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Email address',
        example: 'hello@summitbookkeeping.com'
      },
      address: { 
        type: 'string', 
        maxLength: 200, 
        editable: true,
        description: 'Business address',
        example: '123 Main St, Seattle, WA 98101'
      },
      primaryCta: {
        label: { 
          type: 'string', 
          maxLength: 30, 
          editable: true,
          description: 'Contact button text',
          example: 'Schedule Consultation'
        },
        href: { 
          type: 'string', 
          maxLength: 100, 
          editable: false,
          description: 'Contact button link',
          example: '#contact'
        }
      }
    },
    industriesServed: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Industries section title',
        example: 'Industries We Serve'
      },
      items: {
        type: 'array',
        editable: true,
        description: 'List of industries',
        items: {
          type: 'string',
          maxLength: 50
        }
      }
    },
    testimonials: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Testimonials section title',
        example: 'What Our Clients Say'
      },
      items: {
        type: 'array',
        editable: true,
        description: 'List of testimonials',
        items: {
          type: 'object',
          properties: {
            quote: { type: 'string', maxLength: 300 },
            author: { type: 'string', maxLength: 50 },
            company: { type: 'string', maxLength: 50 }
          }
        }
      }
    },
    whyChooseUs: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Why choose us section title',
        example: 'Why Choose Summit Bookkeeping'
      },
      bullets: {
        type: 'array',
        editable: true,
        description: 'List of reasons',
        items: {
          type: 'string',
          maxLength: 200
        }
      }
    },
    blogTeaser: {
      title: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,
        description: 'Blog section title',
        example: 'Latest Insights'
      },
      items: {
        type: 'array',
        editable: true,
        description: 'List of blog posts',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 100 },
            excerpt: { type: 'string', maxLength: 200 },
            href: { type: 'string', maxLength: 100 }
          }
        }
      }
    }
  }
}

// Helper function to get field schema
export function getFieldSchema(path: string) {
  const parts = path.split('.')
  let current: any = siteDataSchema
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return null
    }
  }
  
  return current
}

// Helper function to check if a field is editable
export function isFieldEditable(path: string): boolean {
  const schema = getFieldSchema(path)
  return schema?.editable === true
}
