# Theme Creation Guide - Editable Website Pattern with Section Management

A concise guide for creating new themes with in-place editing capabilities and section-level management.

## 🎯 Core Pattern

Every editable theme follows this **4-component + schema pattern**:

### Required Components (Copy These)
1. **`components/ui/editable-text.tsx`** - Text editing with contentEditable
2. **`components/ui/editable-image.tsx`** - Image upload with hover overlay  
3. **`components/ui/editable-section.tsx`** - Section-level add/remove controls
4. **`lib/preview-context.tsx`** - State management for preview mode and sections

### Required Files (Create These)
5. **`lib/site-data-schema.ts`** - Define editable fields, constraints, and section config
6. **`lib/site-data.ts`** - Actual content data
7. **`app/page.tsx`** - Wrap with PreviewProvider and use EditableSection

## 📁 File Structure Template

```
your-theme/
├── components/
│   ├── ui/
│   │   ├── editable-text.tsx      # ← Copy from theme-1-sections
│   │   ├── editable-image.tsx     # ← Copy from theme-1-sections
│   │   ├── editable-section.tsx   # ← Copy from theme-1-sections
│   │   └── button.tsx             # ← Standard UI component
│   └── sections/
│       ├── hero-section.tsx       # ← One file per section
│       ├── about-section.tsx      # ← One file per section
│       └── contact-section.tsx    # ← One file per section
├── lib/
│   ├── preview-context.tsx        # ← Copy from theme-1-sections
│   ├── site-data-schema.ts        # ← Define your fields + section config
│   └── site-data.ts              # ← Your content
└── app/
    └── page.tsx                   # ← Wrap with PreviewProvider + EditableSection
```

## 🔧 Implementation Steps

### Step 1: Copy Core Components
```bash
# Copy these 4 files from theme-1-sections to your new theme
cp theme-1-sections/components/ui/editable-text.tsx your-theme/components/ui/
cp theme-1-sections/components/ui/editable-image.tsx your-theme/components/ui/
cp theme-1-sections/components/ui/editable-section.tsx your-theme/components/ui/
cp theme-1-sections/lib/preview-context.tsx your-theme/lib/
```

### Step 2: Create Schema (`lib/site-data-schema.ts`)
```typescript
export const siteDataSchema = {
  site: {
    brand: { type: 'string', maxLength: 50, editable: true },
    city: { type: 'string', maxLength: 50, editable: true }
  },
  // Section configuration for add/remove functionality
  sectionConfig: {
    hero: {
      optional: false,        // Required section (cannot be removed)
      removable: false,       // Cannot be removed
      addable: false,         // Cannot be added (already exists)
      displayName: 'Hero Section',
      description: 'Main banner with headline',
      defaultOrder: 10
    },
    about: {
      optional: true,         // Optional section
      removable: true,        // Can be removed
      addable: true,          // Can be added
      displayName: 'About Section',
      description: 'Information about your business',
      defaultOrder: 20
    }
  },
  sections: {
    hero: {
      title: { type: 'string', maxLength: 100, editable: true },
      image: { type: 'image', editable: true }
    },
    about: {
      title: { type: 'string', maxLength: 100, editable: true },
      story: { type: 'string', maxLength: 500, editable: true }
    }
  }
}
```

### Step 3: Create Data (`lib/site-data.ts`)
```typescript
export const siteData = {
  site: { brand: "Your Business", city: "Your City" },
  sections: [
    {
      id: "hero",
      type: "hero", 
      enabled: true,
      order: 10,
      data: {
        title: "Your Headline",
        image: "/your-image.png"
      }
    },
    {
      id: "about",
      type: "about",
      enabled: true,
      order: 20,
      data: {
        title: "About Us",
        story: "Your business story..."
      }
    }
  ]
}
```

### Step 4: Wrap Page (`app/page.tsx`)
```typescript
"use client";
import { PreviewProvider, usePreviewContext } from "@/lib/preview-context"
import { EditableSection } from "@/components/ui/editable-section"
import { siteDataSchema } from "@/lib/site-data-schema"
import { siteData } from "@/lib/site-data"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"

const sectionComponents = {
  hero: HeroSection,
  about: AboutSection,
} as const

function SiteContent() {
  const { getSections, addSection, removeSection } = usePreviewContext()
  const sections = getSections()
  const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)

  return (
    <div>
      {enabledSections.map((section, index) => {
        const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents]
        if (!SectionComponent) return null

        const canRemove = section.type !== 'hero' // Example: hero cannot be removed
        const canAddBefore = index > 0
        const canAddAfter = true

        return (
          <EditableSection
            key={section.id}
            sectionId={section.id}
            sectionType={section.type}
            path={`sections.${section.id}`}
            onRemove={canRemove ? () => removeSection(section.id) : undefined}
            onAddBefore={canAddBefore ? () => addSection('about', index) : undefined}
            onAddAfter={canAddAfter ? () => addSection('about', index + 1) : undefined}
          >
            <SectionComponent data={section.data} />
          </EditableSection>
        )
      })}
    </div>
  )
}

export default function Page() {
  return (
    <PreviewProvider 
      initialData={siteData} 
      schema={siteDataSchema} 
      siteSlug="your-theme"
    >
      <SiteContent />
    </PreviewProvider>
  )
}
```

### Step 5: Create Section Components
**One file per section** following this pattern:

```typescript
// components/sections/hero-section.tsx
import { EditableText } from "@/components/ui/editable-text"
import { EditableImage } from "@/components/ui/editable-image"

interface HeroSectionProps {
  data: {
    title: string
    image: string
  }
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section>
      <EditableText
        path="sections.hero.title"
        value={data.title}
        className="text-4xl font-bold"
      />
      <EditableImage
        path="sections.hero.image"
        src={data.image}
        alt="Hero image"
        width={500}
        height={300}
      />
    </section>
  )
}
```

## 🎨 Schema Rules

### Field Types
- **`type: 'string'`** - Text fields (use EditableText)
- **`type: 'image'`** - Image fields (use EditableImage)
- **`type: 'array'`** - Lists (wrap each item with EditableText)

### Required Properties
```typescript
fieldName: {
  type: 'string',           // Required
  maxLength: 100,          // Required for strings
  editable: true,          // Required - makes field editable
  description: 'Field description', // Optional but recommended
  example: 'Example value'  // Optional but recommended
}
```

### Section Configuration
```typescript
sectionConfig: {
  sectionName: {
    optional: true,         // Can this section be missing?
    removable: true,        // Can this section be removed?
    addable: true,          // Can this section be added?
    displayName: 'Section Name', // Display name in section picker
    description: 'Section description', // Description in section picker
    defaultOrder: 10        // Default order when added
  }
}
```

### Editable vs Non-Editable
- **`editable: true`** - Field can be edited in preview mode
- **`editable: false`** - Field is read-only (like IDs, hrefs, etc.)

## 🔄 Component Usage Patterns

### Text Fields
```typescript
<EditableText
  path="sections.sectionName.fieldName"
  value={data.fieldName}
  className="your-css-classes"
/>
```

### Image Fields
```typescript
<EditableImage
  path="sections.sectionName.imageField"
  src={data.imageField}
  alt="Description"
  width={500}
  height={300}
  className="your-css-classes"
/>
```

### Section Wrapping
```typescript
<EditableSection
  sectionId={section.id}
  sectionType={section.type}
  path={`sections.${section.id}`}
  onRemove={() => removeSection(section.id)}
  onAddBefore={() => addSection('sectionType', index)}
  onAddAfter={() => addSection('sectionType', index + 1)}
>
  <YourSectionComponent data={section.data} />
</EditableSection>
```

### Array Fields (Lists)
```typescript
{data.items.map((item, index) => (
  <EditableText
    key={index}
    path={`sections.sectionName.items.${index}`}
    value={item}
    className="list-item-class"
  />
))}
```

## 🎯 Section Management Features

### How Section Add/Remove Works

#### **Adding Sections:**
1. **Hover over any section** → See "Add Section" buttons (before/after)
2. **Click "Add Section"** → Section picker modal opens
3. **Select section type** → New section appears at that exact position
4. **Auto-populated** → New section gets default content from schema
5. **Proper ordering** → All sections maintain correct order sequence

#### **Removing Sections:**
1. **Hover over section** → See remove button (trash icon)
2. **Click remove** → Confirmation dialog appears
3. **Confirm removal** → Section disappears
4. **Auto-reorder** → Remaining sections maintain proper order

#### **Section Constraints:**
- **Required sections** (like hero, footer) cannot be removed
- **Duplicate prevention** → Cannot add sections that already exist
- **Visual feedback** → Disabled sections show "Already added" in picker
- **Position control** → Sections added exactly where button was clicked

#### **User Experience:**
- **Intuitive hover controls** → No separate management interface needed
- **Confirmation dialogs** → Prevent accidental section removal
- **Visual feedback** → Clear indication of what can be added/removed
- **Auto-save** → All changes persisted to localStorage immediately

### Section Configuration Examples

#### **Required Section (Hero):**
```typescript
hero: {
  optional: false,        // Must exist
  removable: false,       // Cannot be removed
  addable: false,         // Cannot be added (already exists)
  displayName: 'Hero Section',
  description: 'Main banner with headline and call-to-action',
  defaultOrder: 10
}
```

#### **Optional Section (About):**
```typescript
about: {
  optional: true,         // Can be missing
  removable: true,        // Can be removed
  addable: true,          // Can be added
  displayName: 'About Section',
  description: 'Information about your business',
  defaultOrder: 20
}
```

#### **Multiple Instance Section (Testimonials):**
```typescript
testimonials: {
  optional: true,         // Can be missing
  removable: true,        // Can be removed
  addable: true,          // Can be added multiple times
  displayName: 'Testimonials Section',
  description: 'Customer reviews and testimonials',
  defaultOrder: 60
}
```

## ✅ Checklist for New Themes

- [ ] Copy 4 core components (editable-text, editable-image, editable-section, preview-context)
- [ ] Create schema with all editable fields marked `editable: true`
- [ ] Create sectionConfig for all section types
- [ ] Create site-data with actual content and proper order values
- [ ] Wrap page.tsx with PreviewProvider and use EditableSection
- [ ] Create one component file per section
- [ ] Wrap all editable content with EditableText/EditableImage
- [ ] Wrap all sections with EditableSection
- [ ] Test preview mode toggle works
- [ ] Test text editing preserves styling
- [ ] Test image upload works
- [ ] Test section adding works
- [ ] Test section removing works
- [ ] Test duplicate prevention works
- [ ] Verify character limits are enforced
- [ ] Verify section ordering is maintained

## 🚀 Quick Start Template

```bash
# 1. Create theme directory
mkdir your-theme
cd your-theme

# 2. Copy core components from theme-1-sections
cp ../theme-1-sections/components/ui/editable-*.tsx components/ui/
cp ../theme-1-sections/lib/preview-context.tsx lib/

# 3. Create your schema with sectionConfig
# 4. Create your data with proper order values
# 5. Wrap with PreviewProvider and EditableSection
# 6. Test in browser
```

---

## 🤖 LLM Prompt for Theme Creation

Use this prompt with LLMs to generate new themes following this pattern:

```
Create a new editable website theme with section management following this exact pattern:

REQUIRED COMPONENTS (copy these from theme-1-sections):
- components/ui/editable-text.tsx (text editing)
- components/ui/editable-image.tsx (image upload) 
- components/ui/editable-section.tsx (section management)
- lib/preview-context.tsx (state management + section operations)

REQUIRED FILES TO CREATE:
- lib/site-data-schema.ts (define editable fields + sectionConfig)
- lib/site-data.ts (content data with order values)
- app/page.tsx (wrap with PreviewProvider + EditableSection)
- components/sections/[section-name]-section.tsx (one file per section)

SCHEMA PATTERN:
```typescript
export const siteDataSchema = {
  site: {
    brand: { type: 'string', maxLength: 50, editable: true },
    city: { type: 'string', maxLength: 50, editable: true }
  },
  sectionConfig: {
    [sectionName]: {
      optional: true/false,
      removable: true/false,
      addable: true/false,
      displayName: 'Section Name',
      description: 'Section description',
      defaultOrder: number
    }
  },
  sections: {
    [sectionName]: {
      [fieldName]: { 
        type: 'string'|'image', 
        maxLength: number, 
        editable: true,
        description: 'Field description'
      }
    }
  }
}
```

DATA PATTERN:
```typescript
export const siteData = {
  site: { brand: "Business Name", city: "City" },
  sections: [
    {
      id: "sectionName",
      type: "sectionName",
      enabled: true,
      order: number,
      data: { fieldName: "value" }
    }
  ]
}
```

PAGE WRAPPER WITH SECTION MANAGEMENT:
```typescript
"use client";
import { PreviewProvider, usePreviewContext } from "@/lib/preview-context"
import { EditableSection } from "@/components/ui/editable-section"

const sectionComponents = {
  [sectionName]: SectionComponent,
} as const

function SiteContent() {
  const { getSections, addSection, removeSection } = usePreviewContext()
  const sections = getSections()
  const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)

  return (
    <div>
      {enabledSections.map((section, index) => {
        const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents]
        if (!SectionComponent) return null

        const canRemove = section.type !== 'hero' // Define removal rules
        const canAddBefore = index > 0
        const canAddAfter = true

        return (
          <EditableSection
            key={section.id}
            sectionId={section.id}
            sectionType={section.type}
            path={`sections.${section.id}`}
            onRemove={canRemove ? () => removeSection(section.id) : undefined}
            onAddBefore={canAddBefore ? () => addSection('sectionType', index) : undefined}
            onAddAfter={canAddAfter ? () => addSection('sectionType', index + 1) : undefined}
          >
            <SectionComponent data={section.data} />
          </EditableSection>
        )
      })}
    </div>
  )
}

export default function Page() {
  return (
    <PreviewProvider 
      initialData={siteData} 
      schema={siteDataSchema} 
      siteSlug="theme-name"
    >
      <SiteContent />
    </PreviewProvider>
  )
}
```

COMPONENT PATTERN:
```typescript
import { EditableText } from "@/components/ui/editable-text"
import { EditableImage } from "@/components/ui/editable-image"

interface SectionProps {
  data: { fieldName: string }
}

export function Section({ data }: SectionProps) {
  return (
    <section>
      <EditableText
        path="sections.sectionName.fieldName"
        value={data.fieldName}
        className="styling-classes"
      />
    </section>
  )
}
```

RULES:
1. One file per section component
2. All editable fields must be wrapped with EditableText or EditableImage
3. All sections must be wrapped with EditableSection
4. Schema must define all fields with editable: true/false
5. Schema must include sectionConfig for all section types
6. Use path="sections.sectionName.fieldName" format
7. Preserve original styling with className prop
8. Include proper TypeScript interfaces
9. Follow the exact file structure shown above
10. Include section management functionality (add/remove/reorder)

Create a [THEME_TYPE] theme with [SPECIFIC_REQUIREMENTS]. Include these sections: [SECTION_LIST]. Make sure to include section management capabilities.
```

This pattern ensures consistency, maintainability, easy replication, and powerful section management across all themes.

## 🐛 Troubleshooting

### Common Issues

#### **Build Cache Errors:**
- **Problem**: `Cannot find module './498.js'` errors during development
- **Cause**: Webpack watchers confused by auto-save to localStorage
- **Solution**: Clear `.next` cache and rebuild: `rm -rf .next && npm run build`

#### **Section Not Adding:**
- **Problem**: Section picker shows but section doesn't appear
- **Cause**: Missing sectionConfig or incorrect section type
- **Solution**: Check schema has sectionConfig for the section type

#### **Section Not Removable:**
- **Problem**: Remove button doesn't appear or doesn't work
- **Cause**: `canRemove` logic or `removable: false` in schema
- **Solution**: Check sectionConfig and canRemove logic in page.tsx

#### **Duplicate Sections:**
- **Problem**: Can add the same section type multiple times
- **Cause**: Missing `canAddSection` check in preview context
- **Solution**: Ensure preview context has duplicate prevention logic

This pattern ensures consistency, maintainability, and easy replication across all themes with powerful section management capabilities.
