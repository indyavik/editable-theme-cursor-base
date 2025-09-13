export const siteData = {
  site: {
    brand: "Summit Books & Tax",
    city: "Seattle, WA",
    slug: "summit-books-tax-seattle",
    locale: "en",
    tone: "professional",
  },
  sections: [
    {
      id: "hero-main",
      type: "hero",
      enabled: true,
      order: 10,
      data: {
        shortHeadline: "Stress-Free Bookkeeping for Small Businesses",
        subHeadline: "Remote, accurate, and affordable—so you can focus on growth.",
        primaryCta: { label: "Book a Free Consultation", href: "#contact" },
        secondaryCta: { label: "See Pricing", href: "#pricing" },
        heroImage: "/accountant.png",
      },
    },
    {
      id: "about",
      type: "about",
      enabled: true,
      order: 20,
      data: {
        title: "About Summit bookkeeping",
        story: "Boutique bookkeeping team with a decade of experience in retail, services, and online brands.",
        credentials: ["QuickBooks ProAdvisor", "Xero Certified"],
        badges: ["BBB Accredited"],
      },
    },
    {
      id: "services",
      type: "services",
      enabled: false,
      order: 30,
      data: {
        items: [
          {
            name: "Monthly Bookkeeping",
            summary: "On-time closes.",
            bullets: ["Bank/card recs", "Categorization rules", "Monthly close"],
          },
          { name: "Payroll", bullets: ["Setup & onboarding", "Monthly filings", "W-2/1099 support"] },
          { name: "AP/AR", bullets: ["Bill pay workflows", "Invoice tracking", "Light collections"] },
          { name: "Financial Reporting", bullets: ["P&L, BS, CF", "Custom dashboards", "Quarterly reviews"] },
        ],
      },
    },
    {
      id: "industries",
      type: "industriesServed",
      enabled: true,
      order: 40,
      data: { items: ["Freelancers", "Consultants", "Local Retailers", "Contractors", "Nonprofits"] },
    },
    {
      id: "pricing",
      type: "pricing",
      enabled: false,
      order: 50,
      data: {
        note: "Transparent, fixed monthly fees. Custom plans available.",
        plans: [
          {
            name: "Starter",
            priceDisplay: "$299/mo",
            ctaLabel: "Get Started",
            ctaHref: "#contact",
            includes: ["Up to 2 accounts", "Monthly close", "Email support"],
          },
          {
            name: "Growth",
            priceDisplay: "$499/mo",
            ctaLabel: "Book a Call",
            ctaHref: "#contact",
            includes: ["Up to 5 accounts", "AP/AR light", "Monthly review call"],
          },
        ],
      },
    },
    {
      id: "proof",
      type: "testimonials",
      enabled: true,
      order: 60,
      data: {
        items: [
          { quote: "They cleaned up a year of books fast.", author: "J. Patel", company: "Greenline Remodels" },
          { quote: "Accurate, proactive, and easy to reach.", author: "M. Flores" },
        ],
      },
    },
    {
      id: "why-us",
      type: "whyChooseUs",
      enabled: true,
      order: 70,
      data: {
        bullets: [
          "Personal attention—not a call center",
          "Remote and responsive",
          "Fixed fees—no surprises",
          "Tech-forward workflows",
        ],
      },
    },
    {
      id: "contact",
      type: "contact",
      enabled: true,
      order: 80,
      data: {
        phone: "(206) 555-0101",
        email: "hello@summitbooks.tax",
        address: "123 Pike St, Seattle, WA",
        calendarUrl: "https://calendly.com/summit-books/intro",
        primaryCta: { label: "Book a Free Consultation", href: "https://calendly.com/summit-books/intro" },
        form: {
          enabled: true,
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "message", label: "How can we help?", type: "textarea", required: true },
          ],
        },
      },
    },
    {
      id: "faq",
      type: "faq",
      enabled: false,
      order: 90,
      data: {
        items: [
          { q: "Do you work remotely?", a: "Yes—fully remote and secure." },
          { q: "Do I need QuickBooks?", a: "We support QBO and Xero; we'll migrate you if needed." },
        ],
      },
    },
    {
      id: "blog",
      type: "blogTeaser",
      enabled: true,
      order: 100,
      data: {
        items: [
          {
            title: "Cash vs Accrual for Contractors",
            href: "/blog/cash-vs-accrual-contractors",
            excerpt: "Which method fits your jobs pipeline?",
          },
          { title: "QBO Bank Rules That Save Hours", href: "/blog/qbo-rules" },
        ],
      },
    },
    {
      id: "footer",
      type: "footer",
      enabled: true,
      order: 110,
      data: {
        brand: "Summit Books & Tax",
        email: "hello@summitbooks.tax",
        phone: "(206) 555-0101",
        address: "123 Pike St, Seattle, WA",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Blog", href: "/blog" },
        ],
      },
    },
  ],
} as const

export type SiteData = typeof siteData
export type Section = SiteData["sections"][number]
