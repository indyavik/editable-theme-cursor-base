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
5. **`lib/site-config.ts`** - Combined schema definition and site data
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
│   └── site-config.ts              # ← Combined schema + data
└── app/
    └── page.tsx                   # ← Wrap with PreviewProvider + EditableSection
```



---

## 📁 Combined Configuration Approach

### **Why Use `site-config.ts` Instead of Separate Files?**

Instead of maintaining separate `site-data-schema.ts` and `site-data.ts` files, we use a single `lib/site-config.ts` file that contains both schema definitions and actual data.

#### **Benefits:**
1. **Single source of truth** - Schema and data are always in sync
2. **Easier maintenance** - No need to keep two files synchronized
3. **Better type safety** - Types are automatically derived from the schema
4. **Simpler imports** - One file to import instead of two
5. **Reduced complexity** - Less files to manage and understand

#### **File Structure:**
```
your-theme/
├── lib/
│   └── site-config.ts          # ← Combined schema + data (NEW)
├── components/
│   └── ui/
│       ├── editable-text.tsx   # ← Copy from theme-1-sections
│       ├── editable-image.tsx  # ← Copy from theme-1-sections
│       └── editable-section.tsx # ← Copy from theme-1-sections
└── app/
    └── page.tsx                # ← Wrap with PreviewProvider
```

#### **Combined Config Structure:**
```typescript
// lib/site-config.ts
export const siteSchema = {
  site: {
    brand: { type: 'string', maxLength: 50, editable: true },
    city: { type: 'string', maxLength: 50, editable: true }
  },
  sectionConfig: {
    hero: {
      optional: false,
      removable: false,
      addable: false,
      displayName: 'Hero Section',
      description: 'Main banner with headline',
      defaultOrder: 10
    }
  },
  sections: {
    hero: {
      title: { type: 'string', maxLength: 100, editable: true },
      image: { type: 'image', editable: true }
    }
  }
} as const;

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
    }
  ]
} as const;

// Type definitions
export type SiteData = typeof siteData;
export type Section = SiteData["sections"][number];

// Helper functions
export function getFieldSchema(path: string) { /* ... */ }
export function isFieldEditable(path: string): boolean { /* ... */ }
export function isSectionOptional(sectionType: string): boolean { /* ... */ }
```

#### **Usage in Components:**
```typescript
// app/page.tsx
import { siteSchema, siteData } from "@/lib/site-config"

export default function Page() {
  return (
    <PreviewProvider 
      initialData={siteData} 
      schema={siteSchema} 
      siteSlug="your-theme"
    >
      <SiteContent />
    </PreviewProvider>
  )
}
```

#### **Migration from Separate Files:**
If you have existing themes with separate files, you can combine them:

1. **Copy schema from `site-data-schema.ts`** to `siteSchema` in `site-config.ts`
2. **Copy data from `site-data.ts`** to `siteData` in `site-config.ts`
3. **Update imports** throughout your theme
4. **Remove old files** once everything is working

This approach simplifies theme development and reduces the chance of schema/data mismatches.

## 🔧 Implementation Steps

### Step 1: Copy Core Components
```bash
# Copy these 4 files from theme-1-sections to your new theme
cp theme-1-sections/components/ui/editable-text.tsx your-theme/components/ui/
cp theme-1-sections/components/ui/editable-image.tsx your-theme/components/ui/
cp theme-1-sections/components/ui/editable-section.tsx your-theme/components/ui/
cp theme-1-sections/lib/preview-context.tsx your-theme/lib/
```

### Step 2: Create Combined Config (`lib/site-config.ts`)
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

### Step 3: Add Site Data (in `lib/site-config.ts`)
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
import { siteSchema, siteData } from "@/lib/site-config"
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
      schema={siteSchema} 
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
- lib/site-config.ts (combined schema + data)
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
      schema={siteSchema} 
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

---

## 🔍 How It Works Under the Hood

### The Technical Magic Behind In-Place Editing

Understanding the technical implementation helps developers debug issues and extend the system.

## 🎯 Core Architecture

### **The Three-Layer System**

#### **Layer 1: Content (What Users See)**
```typescript
// Regular HTML content
<h1>Your Business Name</h1>
<p>Your business description...</p>
```

#### **Layer 2: Editable Wrappers (How It Becomes Editable)**
```typescript
// Wrapped with EditableText
<EditableText 
  path="site.brand" 
  value="Your Business Name"
  className="text-4xl font-bold"
>
  Your Business Name
</EditableText>
```

#### **Layer 3: State Management (How Changes Are Tracked)**
```typescript
// PreviewContext manages all editing state
const { updateField, getValue, isPreviewMode } = usePreviewContext()
```

## 🔧 The EditableText Component Magic

### **Conditional Rendering Logic**
```typescript
// If not in preview mode or not editable, render normally
if (!isPreviewMode || !isEditable) {
  return children || <span className={className}>{currentValue}</span>;
}

// Preview mode with contentEditable
return (
  <div
    contentEditable                    // ← Always true when in preview mode
    suppressContentEditableWarning
    className={`${className} hover:outline-blue-300 focus:outline-blue-500 cursor-text`}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
  >
    {currentValue}
  </div>
);
```

### **What Makes It Work Without Changing UI Elements**

#### **The Secret: CSS Class Preservation**
```typescript
<EditableText
  path="sections.hero.title"
  value="Your Business Name"
  className="text-4xl font-bold text-blue-600"  // ← Original styling preserved
/>
```

#### **Normal Mode (Not Editable):**
```typescript
// Renders as:
<span className="text-4xl font-bold text-blue-600">
  Your Business Name
</span>
```

#### **Preview Mode (Editable):**
```typescript
// Renders as:
<div 
  contentEditable
  className="text-4xl font-bold text-blue-600 hover:outline-blue-300 focus:outline-blue-500 cursor-text"
>
  Your Business Name
</div>
```

### **Key Technical Insights**

#### **1. CSS Class Inheritance**
```typescript
// Your original classes are passed through
className={`${className} hover:outline-blue-300 focus:outline-blue-500 cursor-text`}
//           ↑ Your classes    ↑ Added editing effects
```

#### **2. Element Type Flexibility**
- **`<span>`** and **`<div>`** can both use the same CSS classes
- **Tailwind CSS** works the same way on both elements
- **Layout differences** are minimal (inline vs block)

#### **3. State Continuity**
```typescript
// The value stays the same
const currentValue = getValue(path) || value;
// ↑ Gets current value (edited or original)
```

## 🎨 The Data Flow

### **1. Initial Load**
```
site-config.ts → PreviewContext → Components → User sees content
```

### **2. User Edits**
```
User types → EditableText → updateField() → State update → Re-render
```

### **3. Persistence**
```
State change → localStorage → Page refresh → Restore from localStorage
```

## 🧠 The PreviewContext State Management

### **Core State Variables**
```typescript
const [isPreviewMode, setIsPreviewMode] = useState(true);
const [editedData, setEditedData] = useState<Record<string, any>>({});
const [sections, setSections] = useState(initialData.sections || []);
```

### **The updateField Function**
```typescript
const updateField = (path: string, value: any) => {
  setEditedData(prev => {
    const newData = { ...prev };
    set(newData, path, value);  // Deep object path setting
    return newData;
  });
  
  // Auto-save to localStorage for persistence
  if (typeof window !== 'undefined') {
    const storageKey = `preview-${siteSlug || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify({ ...editedData, [path]: value }));
  }
};
```

### **The getValue Function**
```typescript
const getValue = (path: string): any => {
  const editedValue = get(editedData, path);
  if (editedValue !== undefined) {
    return editedValue;  // Return edited value if exists
  }
  return get(initialData, path);  // Return original value
};
```

## 🎪 The User Experience Flow

### **1. User Enables Preview Mode**
- Clicks toggle in toolbar: "Editing OFF" → "Editing ON"
- All editable elements show hover states (blue outlines)
- Cursor changes to text cursor on hover

### **2. User Clicks to Edit**
- Clicks on any editable text
- Element becomes `contentEditable`
- User can type directly
- Original styling is preserved

### **3. Changes Are Captured**
- On blur (click away) or Enter key
- `updateField(path, newValue)` is called
- Change is stored in React state
- Change is auto-saved to localStorage

### **4. Real-Time Updates**
- All instances of that field update immediately
- Changes persist across page refreshes
- User can continue editing other fields

## 🔧 Section Management Under the Hood

### **Section State Management**
```typescript
const [sections, setSections] = useState(initialData.sections || []);

const addSection = (sectionType: string, position?: number) => {
  const sectionConfig = AVAILABLE_SECTIONS[sectionType];
  if (!sectionConfig) return;

  const newSection = {
    id: `${sectionType}-${Date.now()}`,
    type: sectionType,
    enabled: true,
    order: position !== undefined ? position * 10 : (sections.length + 1) * 10,
    data: sectionConfig.defaultData
  };

  setSections(prev => {
    const newSections = [...prev];
    if (position !== undefined) {
      newSections.splice(position, 0, newSection);
      // Reorder all sections to maintain proper order
      newSections.forEach((section, index) => {
        section.order = (index + 1) * 10;
      });
    } else {
      newSections.push(newSection);
    }
    return newSections;
  });
};
```

### **Duplicate Prevention**
```typescript
const canAddSection = (sectionType: string): boolean => {
  // Check if section type already exists
  return !sections.some(section => section.type === sectionType);
};
```

## 🎯 Why This Architecture Works

### **1. Progressive Enhancement**
- Works without JavaScript (falls back to normal text)
- Enhances with editing capabilities when available
- No breaking changes to the design

### **2. CSS Class Preservation**
- Original styling is never lost
- Visual appearance remains consistent
- No layout shifts or style changes

### **3. State Management**
- Centralized state in PreviewContext
- Path-based updates for precise control
- Auto-save for persistence

### **4. Type Safety**
- TypeScript interfaces ensure data integrity
- Schema-driven validation
- Compile-time error checking

## 🐛 Common Technical Issues

### **Build Cache Errors**
- **Problem**: `Cannot find module './498.js'` errors during development
- **Cause**: Webpack watchers confused by auto-save to localStorage
- **Solution**: Clear `.next` cache and rebuild: `rm -rf .next && npm run build`

### **State Not Updating**
- **Problem**: Changes not appearing after editing
- **Cause**: Incorrect path in EditableText component
- **Solution**: Verify path matches schema structure

### **Styling Issues**
- **Problem**: Text styling changes when editing
- **Cause**: Missing className prop or CSS class conflicts
- **Solution**: Ensure original className is passed through

### **localStorage Issues**
- **Problem**: Changes not persisting across refreshes
- **Cause**: localStorage quota exceeded or disabled
- **Solution**: Check browser storage settings and data size

## 🔍 Debugging Tips

### **1. Check Preview Mode State**
```typescript
console.log('Preview mode:', isPreviewMode);
console.log('Edited data:', editedData);
```

### **2. Verify Path Structure**
```typescript
console.log('Field path:', path);
console.log('Current value:', getValue(path));
```

### **3. Inspect localStorage**
```javascript
// In browser console
console.log(localStorage.getItem('preview-your-site-slug'));
```

### **4. Check Schema Validation**
```typescript
console.log('Field editable:', isFieldEditable(path));
console.log('Field schema:', getFieldSchema(path));
```

This technical understanding helps developers extend the system, debug issues, and create more sophisticated editing experiences while maintaining the core simplicity and user experience.

---

## 📝 Blog Support Integration

Adding blog functionality to your theme requires both backend API endpoints and frontend components. This section provides a complete guide for theme authors.

### 🎯 Overview

Blog support includes:
- **Backend API endpoints** for blog listing and detail pages
- **Frontend components** for displaying blog content
- **Theme-agnostic blog module** that can be shipped with any theme
- **Toggle functionality** to enable/disable blog features
- **Consistent styling** that matches your theme

### 📁 Required File Structure

```
your-theme/
├── lib/
│   ├── theme-config.ts           # ← API base URL configuration
│   ├── blog-api.types.ts         # ← TypeScript interfaces for blog data
│   └── site-data-schema.ts       # ← Add features.blogEnabled flag
├── components/
│   └── blog/
│       └── BlogModule.tsx        # ← Generic blog component (list + detail)
├── app/
│   └── blog/
│       ├── page.tsx              # ← Blog list page
│       └── [slug]/
│           └── page.tsx          # ← Individual blog post page
└── styles/
    └── blog.css                  # ← Optional: blog-specific styles
```

### 🔧 Backend Requirements

#### **FastAPI Endpoints** (in `backend/main.py`)

```python
# Blog listing endpoint
@app.get("/api/sites/{siteSlug}/blogs")
def list_blogs(siteSlug: str, status: str = "published", page: int = 1, pageSize: int = 10):
    db = get_db()
    query = {"siteSlug": siteSlug, "status": status}
    
    total = db.blogs.count_documents(query)
    if total == 0:
        # Return placeholders when no data
        placeholders = _placeholder_posts(siteSlug, count=3)
        return {"items": placeholders, "total": 3, "page": 1, "pageSize": 3}
    
    cursor = db.blogs.find(query).sort("publishedAt", -1).skip((page - 1) * pageSize).limit(pageSize)
    items = list(cursor)
    return {"items": items, "total": total, "page": page, "pageSize": pageSize}

# Blog detail endpoint
@app.get("/api/sites/{siteSlug}/blogs/{slug}")
def get_blog(siteSlug: str, slug: str):
    db = get_db()
    doc = db.blogs.find_one({"siteSlug": siteSlug, "slug": slug, "status": "published"})
    if doc:
        return doc
    # Return placeholder if not found
    return _placeholder_article(siteSlug, slug)

# Development seeding endpoint
@app.post("/api/dev/seed/blogs")
def seed_blogs(siteSlug: str, count: int = 3):
    # Only allow in development
    if getattr(config, "ENV", "development") not in ("dev", "development", "local"):
        raise HTTPException(status_code=403, detail="Seeding only allowed in development")
    # Seed database with sample blog posts
    # ... implementation details
```

#### **MongoDB Indexes** (in `backend/db.py`)

```python
# Create indexes for blog collection
db.blogs.create_index([("siteSlug", 1), ("status", 1), ("publishedAt", -1)])
db.blogs.create_index([("siteSlug", 1), ("slug", 1)], unique=True)
```

### 🎨 Frontend Implementation

#### **Step 1: Create Theme Config** (`lib/theme-config.ts`)

```typescript
export const API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_API_BASE) ||
  'http://localhost:8000';

export function getApiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
```

#### **Step 2: Create Blog Types** (`lib/blog-api.types.ts`)

```typescript
export type BlogListItem = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  tags?: string[];
};

export type BlogArticle = BlogListItem & {
  content: string; // HTML or Markdown rendered HTML
  author?: { name?: string; avatarUrl?: string };
};
```

#### **Step 3: Create Blog Module** (`components/blog/BlogModule.tsx`)

```typescript
"use client";
import React from "react";
import Link from "next/link";
import { siteData } from "@/lib/site-data";
import { getApiUrl } from "@/lib/theme-config";
import { BlogListItem, BlogArticle } from "@/lib/blog-api.types";

type ClassNames = {
  root?: string;
  list?: string;
  card?: string;
  detail?: string;
};

type Props = {
  mode: "list" | "detail";
  slug?: string;
  page?: number;
  pageSize?: number;
  className?: ClassNames;
};

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : getApiUrl(path);
  const res = await fetch(url, { ...(init || {}), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export default async function BlogModule({ mode, slug, page = 1, pageSize = 10, className }: Props) {
  const siteSlug = siteData.site.slug;

  if (mode === "list") {
    const data = await fetchJSON<{ items: BlogListItem[]; total: number }>(
      `/api/sites/${siteSlug}/blogs?status=published&page=${page}&pageSize=${pageSize}`
    );

    if (!data.items?.length) {
      return (
        <div className={className?.root}>
          <div className="text-sm text-muted-foreground">No articles yet.</div>
        </div>
      );
    }

    return (
      <div className={className?.root}>
        <div className={className?.list || "space-y-8"}>
          {data.items.map((post) => (
            <article key={post.slug} className={className?.card || "p-0"}>
              {post.coverImageUrl && (
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-44 object-cover rounded mb-3" />
              )}
              <h3 className="text-2xl font-bold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              {post.publishedAt && (
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
              {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    );
  }

  // Detail mode
  if (!slug) {
    return <div className="text-sm text-red-500">Missing article slug.</div>;
  }

  const article = await fetchJSON<BlogArticle>(`/api/sites/${siteSlug}/blogs/${slug}`);

  return (
    <article className={className?.detail || "prose max-w-none"}>
      {article.coverImageUrl && (
        <img src={article.coverImageUrl} alt={article.title} className="w-full h-56 object-cover rounded mb-6" />
      )}
      <h1 className="mb-2 text-3xl font-bold">{article.title}</h1>
      {article.publishedAt && (
        <div className="text-sm text-muted-foreground mb-6">
          {new Date(article.publishedAt).toLocaleDateString()}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
```

#### **Step 4: Create Blog List Page** (`app/blog/page.tsx`)

```typescript
import { siteData } from "@/lib/site-data";
import BlogModule from "@/components/blog/BlogModule";
import { notFound } from "next/navigation";

export default function BlogPage() {
  // Gate the page based on blogEnabled flag
  if (siteData.features && siteData.features.blogEnabled === false) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header matching your theme style */}
      <div className="bg-gradient-to-br from-secondary via-background to-card py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {siteData.site.brand}
            </h1>
            <p className="text-3xl lg:text-4xl font-bold text-foreground">
              Latest Articles & Insights
            </p>
          </div>
        </div>
      </div>

      {/* Blog content */}
      <div className="container mx-auto px-4 max-w-3xl py-12">
        <BlogModule
          mode="list"
          className={{
            root: "space-y-10",
            list: "space-y-8",
            card: "p-0"
          }}
        />
      </div>
    </div>
  );
}
```

#### **Step 5: Create Blog Detail Page** (`app/blog/[slug]/page.tsx`)

```typescript
import { siteData } from "@/lib/site-data";
import BlogModule from "@/components/blog/BlogModule";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${siteData.site.brand}`,
    description: `Read the latest article from ${siteData.site.brand}`,
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  // Gate the page based on blogEnabled flag
  if (siteData.features && siteData.features.blogEnabled === false) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header matching your theme style */}
      <div className="bg-gradient-to-br from-secondary via-background to-card py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {siteData.site.brand}
            </h1>
            <p className="text-xl text-muted-foreground">
              Professional Insights & Articles
            </p>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <BlogModule 
          mode="detail" 
          slug={params.slug}
          className={{
            detail: "prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
          }}
        />
      </div>
    </div>
  );
}
```

### 🎛️ Blog Toggle Configuration

#### **Step 6: Add Blog Toggle to Config** (`lib/site-config.ts`)

```typescript
export const siteDataSchema = {
  site: {
    // ... existing site fields
  },
  features: {
    blogEnabled: { 
      type: 'boolean', 
      editable: true, 
      default: true, 
      description: 'Enable blog pages and functionality' 
    }
  },
  // ... rest of schema
}
```

#### **Step 7: Add Default in Site Config** (`lib/site-config.ts`)

```typescript
export const siteData = {
  site: {
    // ... existing site data
  },
  features: {
    blogEnabled: true,  // Set to false to disable blog
  },
  sections: [
    // ... existing sections
  ]
}
```

#### **Step 8: Hide BlogTeaserSection When Disabled** (`app/page.tsx`)

```typescript
// In your SiteContent component, filter out blogTeaser when disabled
const enabledSections = sections
  .filter((section) => section.enabled)
  .filter((section) => (siteData as any).features?.blogEnabled || section.type !== "blogTeaser")
  .sort((a, b) => a.order - b.order);
```

### 🎨 Styling Considerations

#### **Theme-Agnostic Design**
- **BlogModule** accepts `className` props for customization
- **No hardcoded styles** - all styling comes from your theme
- **Responsive design** built-in with Tailwind classes

#### **Custom Blog Styles** (`styles/blog.css` - Optional)

```css
/* Custom blog-specific styles if needed */
.blog-article {
  /* Your custom styles */
}

.blog-list-item {
  /* Your custom styles */
}

/* Override prose styles if needed */
.prose.blog-content {
  /* Custom prose styling */
}
```

#### **Styling Examples**

**List Page Styling:**
```typescript
<BlogModule
  mode="list"
  className={{
    root: "space-y-10",
    list: "space-y-8",
    card: "p-0"
  }}
/>
```

**Detail Page Styling:**
```typescript
<BlogModule
  mode="detail"
  slug={params.slug}
  className={{
    detail: "prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground"
  }}
/>
```

### 🔧 Configuration Options

#### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

#### **Alternative: Next.js Rewrites** (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
```

### ✅ Blog Integration Checklist

#### **Backend Setup:**
- [ ] Add blog endpoints to `backend/main.py`
- [ ] Create MongoDB indexes in `backend/db.py`
- [ ] Test endpoints return placeholder data when empty
- [ ] Verify development seeding endpoint works

#### **Frontend Setup:**
- [ ] Create `lib/theme-config.ts` with API base URL
- [ ] Create `lib/blog-api.types.ts` with TypeScript interfaces
- [ ] Create `components/blog/BlogModule.tsx` (generic component)
- [ ] Create `app/blog/page.tsx` (list page)
- [ ] Create `app/blog/[slug]/page.tsx` (detail page)
- [ ] Add `features.blogEnabled` to schema and defaults
- [ ] Gate blog pages with `notFound()` when disabled
- [ ] Hide `BlogTeaserSection` on home when disabled

#### **Testing:**
- [ ] Blog list page loads and displays articles
- [ ] Blog detail page loads individual articles
- [ ] Blog toggle works (enables/disables blog pages)
- [ ] Styling matches your theme
- [ ] Responsive design works on all screen sizes
- [ ] SEO metadata is generated correctly

#### **Optional Enhancements:**
- [ ] Add pagination to blog list
- [ ] Add search functionality
- [ ] Add category/tag filtering
- [ ] Add social sharing buttons
- [ ] Add related articles
- [ ] Add comment system
- [ ] Add RSS feed

### �� Quick Start for Blog Support

```bash
# 1. Copy blog components from theme-1-sections
cp -r theme-1-sections/components/blog your-theme/components/
cp theme-1-sections/lib/theme-config.ts your-theme/lib/
cp theme-1-sections/lib/blog-api.types.ts your-theme/lib/

# 2. Create blog pages
mkdir -p your-theme/app/blog/[slug]
cp theme-1-sections/app/blog/page.tsx your-theme/app/blog/
cp theme-1-sections/app/blog/[slug]/page.tsx your-theme/app/blog/[slug]/

# 3. Update your schema and data
# Add features.blogEnabled to your schema and defaults

# 4. Test the integration
npm run dev
# Visit /blog to see the list
# Visit /blog/[any-slug] to see detail page
```

### 🎯 Key Benefits

1. **Theme-Agnostic**: Blog module works with any theme
2. **Toggleable**: Easy to enable/disable blog functionality
3. **Consistent Styling**: Matches your theme's design system
4. **SEO-Friendly**: Proper metadata and URL structure
5. **Responsive**: Works on all device sizes
6. **Placeholder Data**: Shows content even when database is empty
7. **Type-Safe**: Full TypeScript support

This blog integration provides a complete, production-ready blog system that seamlessly integrates with your theme while maintaining flexibility and ease of use.


---

## ✏️ Preview Mode and Publish

### Where preview lives
- File: `lib/preview-context.tsx`
- Exposes: `isPreviewMode`, `editedData`, `updateField(path, value)`, `getValue(path)`, `publishChanges()`, `discardChanges()`, section ops
- Toolbar UI: `PreviewToolbar` (same file) — includes the “Publish Changes” button

### What Publish does today
- Handler: `publishChanges` in `lib/preview-context.tsx`
- Current behavior:
  - Logs the pending changes to console: `console.log('Publishing changes:', editedData)`
  - Clears in-memory edits: `setEditedData({})`
  - Clears autosave: `localStorage.removeItem(\`preview-${siteSlug || 'default'}\`)`
- No API call is made yet; this is a safe no-op reset

### How autosave works
- On each `updateField`, a shallow snapshot is stored in `localStorage`
- Key format: `preview-<siteSlug>` (falls back to `preview-default`)
- Restoring on refresh can be implemented by reading this key at provider init if desired

### How to wire Publish to your backend
1. Define an API to accept partial edits (example):
   - `POST /api/sites/:siteSlug/draft` → save draft edits
   - `POST /api/sites/:siteSlug/publish` → apply edits and version site
2. Implement the call inside `publishChanges`:
```ts
import { getApiUrl } from "@/lib/theme-config";

const publishChanges = async () => {
  try {
    // 1) Save draft (optional) or publish directly
    const res = await fetch(getApiUrl(`/api/sites/${siteSlug}/publish`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edits: editedData }),
    });
    if (!res.ok) throw new Error(await res.text());

    // 2) Clear local edit state upon success
    setEditedData({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`preview-${siteSlug || 'default'}`);
    }
  } catch (err) {
    console.error('Error publishing changes:', err);
    // Optionally show a toast/UI error here
  }
};
```
3. Backend should validate and merge edits with canonical `site-data`, generate a new version id, and persist

### Tips
- Use `NEXT_PUBLIC_API_BASE` (or theme `lib/theme-config.ts`) to keep publish endpoints consistent
- Keep `siteSlug` source-of-truth in `lib/site-config.ts` at `site.site.slug`
- Consider optimistic UI (disable button while publishing, show success/error toast)
- For large edits, consider chunking or a `PUT /api/sites/:siteSlug/site-data` replacing the entire document


---

## ⚡ Performance & API Call Best Practices

### 🚨 Common Issues That Cause Hundreds of API Calls

During development, you might encounter endless API calls or continuous re-rendering. Here are the root causes and solutions:

#### **1. Server/Client Component Mismatch**

**❌ Problem:** Server components making API calls in client component context
```typescript
// Don't do this - server component with async fetch
export default async function BlogModule({ slug }: { slug: string }) {
  const data = await fetch(`/api/blogs/${slug}`); // Runs on every render
  return <div>{data.title}</div>;
}

// Used inside client component with preview mode
"use client";
export default function Page() {
  return <BlogModule slug="my-post" />; // Causes server/client mismatch
}
```

**✅ Solution:** Use client components with useEffect for API calls
```typescript
"use client";
export default function BlogModule({ slug }: { slug: string }) {
  const [data, setData] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return; // Prevent multiple fetches
    
    const fetchData = async () => {
      const response = await fetch(`/api/blogs/${slug}`);
      setData(await response.json());
      setHasFetched(true);
    };
    
    fetchData();
  }, []); // Empty dependency array

  return <div>{data?.title}</div>;
}
```

#### **2. Cache Bypass Forcing Fresh Calls**

**❌ Problem:** Forcing no-cache on every request
```typescript
// Don't do this - forces fresh API call every time
const res = await fetch(url, { cache: "no-store" });
```

**✅ Solution:** Allow normal caching or use controlled caching
```typescript
// Good - uses Next.js default caching
const res = await fetch(url);

// Or use controlled caching
const res = await fetch(url, { next: { revalidate: 3600 } }); // 1 hour cache
```

#### **3. Dynamic Environment Variables Causing Re-renders**

**❌ Problem:** Re-evaluating environment variables on every render
```typescript
// Don't do this - causes instability
export const API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_API_BASE) ||
  'http://localhost:8000';

// This function returns different values on different renders
export function getApiUrl(path: string) {
  return `${API_BASE}${path}`; // API_BASE changes between renders
}
```

**✅ Solution:** Use static constants
```typescript
// Good - stable, static value
export const API_BASE = 'http://localhost:8000';

export function getApiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
```

#### **4. Site Data Import Causing Re-renders**

**❌ Problem:** Importing siteData directly in components
```typescript
// Don't do this - siteData import causes dependency issues
import { siteData } from "@/lib/site-data";

export default function BlogModule() {
  const siteSlug = siteData.site.slug; // Unstable reference
  
  useEffect(() => {
    fetchData(siteSlug);
  }, [siteSlug]); // siteSlug reference changes on every render
}
```

**✅ Solution:** Pass data as props
```typescript
// Good - stable props
export default function BlogModule({ siteSlug }: { siteSlug: string }) {
  useEffect(() => {
    fetchData(siteSlug);
  }, [siteSlug]); // Stable prop value
}

// In parent component
<BlogModule siteSlug="your-site-slug" />
```

#### **5. Unstable useEffect Dependencies**

**❌ Problem:** useEffect with changing object references
```typescript
// Don't do this - object references change on every render
useEffect(() => {
  fetchData();
}, [siteData.site.slug, config.apiBase]); // These references change
```

**✅ Solution:** Use stable dependencies and fetch-once logic
```typescript
// Good - controlled execution
const [hasFetched, setHasFetched] = useState(false);
const siteSlug = useMemo(() => siteData.site.slug, []); // Memoized value

useEffect(() => {
  if (hasFetched) return; // Prevent multiple fetches
  
  fetchData();
  setHasFetched(true);
}, []); // Empty dependency array for one-time fetch

// Or use stable dependencies
useEffect(() => {
  fetchData();
}, [siteSlug]); // Only re-run if siteSlug actually changes
```

### ��️ Best Practices for Theme Developers

#### **API Calls in Components**

1. **Always use client components** for API calls:
```typescript
"use client";
export default function YourComponent() {
  useEffect(() => {
    // API calls here
  }, []);
}
```

2. **Implement fetch-once logic**:
```typescript
const [hasFetched, setHasFetched] = useState(false);

useEffect(() => {
  if (hasFetched) return;
  
  fetchData();
  setHasFetched(true);
}, []);
```

3. **Use proper cleanup**:
```typescript
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    const data = await fetch('/api/data');
    if (isMounted) setData(data);
  };
  
  fetchData();
  
  return () => {
    isMounted = false; // Cleanup
  };
}, []);
```

#### **Configuration Management**

1. **Use static constants** instead of dynamic evaluation:
```typescript
// Good
export const API_BASE = 'http://localhost:8000';

// Bad
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'fallback';
```

2. **Pass configuration as props**:
```typescript
// Good
<BlogModule apiBase="http://localhost:8000" siteSlug="my-site" />

// Bad
import { config } from './config'; // Dynamic import in component
```

#### **Component Structure**

1. **Isolate API-calling components**:
```typescript
// Create separate layout for isolated pages
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-layout">{children}</div>;
}
```

2. **Avoid mixing server and client components**:
```typescript
// Don't mix these patterns in the same component tree
export default async function ServerComponent() { } // Server
"use client";
export default function ClientComponent() { } // Client
```

#### **Development vs Production**

1. **Handle React Strict Mode** (development double-renders):
```typescript
// Expect 2 calls in development, 1 in production
useEffect(() => {
  console.log('Effect running - normal in dev mode');
  fetchData();
}, []);
```

2. **Add environment checks** when needed:
```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
const apiBase = isDevelopment ? 'http://localhost:8000' : 'https://api.production.com';
```

### 🔍 Debugging Endless API Calls

When you see hundreds of API calls, check these in order:

1. **Browser Console**:
   - Look for component render logs
   - Check for error messages
   - See if useEffect is running repeatedly

2. **Add Debug Logs**:
```typescript
useEffect(() => {
  console.log('Component mounting/effect running');
  fetchData();
  
  return () => {
    console.log('Component unmounting/effect cleanup');
  };
}, []);
```

3. **Check Network Tab**:
   - Are calls coming from the same component?
   - Are there multiple instances of the same component?
   - Is there a request loop?

4. **Common Fixes**:
   - Add `"use client"` to components making API calls
   - Remove `cache: "no-store"` from fetch calls
   - Use static configuration instead of dynamic evaluation
   - Add fetch-once logic with `useState` flags
   - Pass data as props instead of importing directly

### ⚠️ Red Flags to Watch For

- **Mixed async/client components**: Server components with `async` used in client context
- **Dynamic imports in render**: `import` statements that change between renders  
- **Object dependencies in useEffect**: `useEffect(() => {}, [someObject])` where `someObject` reference changes
- **No cleanup in useEffect**: Missing return function for cleanup
- **Cache bypass**: Using `cache: "no-store"` unnecessarily
- **Environment variable evaluation**: Checking `process.env` in component render

Following these practices will prevent the endless API call issues and ensure your theme performs well in both development and production.

