# Theme1 - Editable Website Template

A Next.js website template with **in-place editing capabilities** for easy content management without a traditional CMS.

## 🎯 Features

- **In-place text editing** - Click any text to edit directly on the page
- **Image upload functionality** - Upload and replace images with hover overlay
- **Preview mode toggle** - Switch between viewing and editing modes
- **Real-time character limits** - Enforce content constraints as you type
- **Auto-save to localStorage** - Changes persist across browser sessions
- **Publish/Discard system** - Save changes permanently or revert
- **Schema-driven editing** - Only fields marked as `editable: true` can be modified

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## ✏️ How to Edit Content

1. **Enable Preview Mode**: Click the "Editing OFF" toggle in the top toolbar
2. **Edit Text**: Click on any editable text to modify it directly
3. **Upload Images**: Hover over images and click "Upload Image" button
4. **Save Changes**: Click "Publish Changes" to save permanently
5. **Discard Changes**: Click "Discard All" to revert to original

## 🏗️ Architecture Overview

### Core Components

The editable functionality is built with **3 custom components**:

#### 1. **EditableText Component** (`components/ui/editable-text.tsx`)
- **Purpose**: In-place text editing with `contentEditable`
- **Features**: 
  - Real-time character limit enforcement
  - Keyboard shortcuts (Enter to save, Escape to cancel)
  - Preserves original styling during editing
  - Schema-driven validation

#### 2. **EditableImage Component** (`components/ui/editable-image.tsx`)
- **Purpose**: Image upload and editing with hover overlay
- **Features**:
  - File upload with validation (image types only, max 5MB)
  - Instant preview using data URLs
  - Remove image functionality
  - Hover overlay with upload/remove buttons

#### 3. **PreviewContext Provider** (`lib/preview-context.tsx`)
- **Purpose**: Global state management for preview mode
- **Features**:
  - Preview mode toggle
  - Edit tracking and change counting
  - localStorage persistence
  - Publish/discard functionality
  - Schema validation

### Schema System

#### **Site Data Schema** (`lib/site-data-schema.ts`)
Defines which fields are editable and their constraints:

```typescript
export const siteDataSchema = {
  sections: {
    hero: {
      shortHeadline: { 
        type: 'string', 
        maxLength: 100, 
        editable: true,  // ← This makes it editable
        description: 'Main headline'
      },
      heroImage: {
        type: 'image',   // ← Special type for images
        editable: true,
        description: 'Hero section image'
      }
    }
  }
}
```

#### **Site Data** (`lib/site-data.ts`)
Contains the actual content:

```typescript
export const siteData = {
  sections: [
    {
      id: "hero",
      data: {
        shortHeadline: "Your Headline Here",
        heroImage: "/accountant.png"
      }
    }
  ]
}
```

## 📁 File Structure

```
theme1/
├── components/
│   ├── ui/
│   │   ├── editable-text.tsx      # Text editing component
│   │   ├── editable-image.tsx     # Image editing component
│   │   └── button.tsx             # UI dependency
│   └── sections/
│       ├── hero-section.tsx       # Uses EditableText & EditableImage
│       ├── about-section.tsx      # Uses EditableText
│       └── contact-section.tsx    # Uses EditableText
├── lib/
│   ├── preview-context.tsx        # State management
│   ├── site-data-schema.ts        # Field definitions
│   └── site-data.ts              # Content data
└── app/
    └── page.tsx                   # Wraps with PreviewProvider
```

## 🔧 Implementation Guide

### Step 1: Add Editable Fields to Schema

In `lib/site-data-schema.ts`, mark fields as editable:

```typescript
yourField: { 
  type: 'string', 
  maxLength: 100, 
  editable: true,  // ← Add this
  description: 'Field description'
}
```

### Step 2: Add Data to Site Data

In `lib/site-data.ts`, add the field value:

```typescript
data: {
  yourField: "Your content here"
}
```

### Step 3: Wrap with EditableText

In your section component:

```typescript
import { EditableText } from "@/components/ui/editable-text"

// Replace this:
<div>{data.yourField}</div>

// With this:
<EditableText
  path="sections.yourSection.yourField"
  value={data.yourField}
  className="your-styling-classes"
/>
```

### Step 4: For Images, Use EditableImage

```typescript
import { EditableImage } from "@/components/ui/editable-image"

// Replace this:
<img src={data.imagePath} alt="Description" />

// With this:
<EditableImage
  path="sections.yourSection.imagePath"
  src={data.imagePath}
  alt="Description"
  width={500}
  height={500}
  className="your-styling-classes"
/>
```

## 🎨 Customization

### Adding New Editable Fields

1. **Update Schema**: Add field definition with `editable: true`
2. **Update Data**: Add field value to site data
3. **Update Component**: Wrap with `EditableText` or `EditableImage`
4. **Test**: Enable preview mode and verify editing works

### Styling Editable Elements

EditableText preserves original styling:

```typescript
<EditableText
  path="sections.hero.title"
  value={data.title}
  className="text-4xl font-bold text-blue-600"  // ← Styling preserved
/>
```

### Character Limits

Set in schema and enforced automatically:

```typescript
title: { 
  type: 'string', 
  maxLength: 50,  // ← Enforced in real-time
  editable: true 
}
```

## 🔄 State Management

### Preview Mode States

- **Viewing Mode**: Normal website display, no editing
- **Preview Mode**: Editable elements show hover states and editing capabilities
- **Editing State**: Individual fields being actively edited

### Data Flow

1. **Initial Load**: Data loaded from `site-data.ts`
2. **Edit**: Changes stored in `editedData` state + localStorage
3. **Publish**: Changes saved to backend (TODO: implement API)
4. **Discard**: Changes cleared, revert to original data

## 🚀 Deployment

The theme includes Docker support:

```bash
# Build Docker image
docker build -f Dockerfile.site1 -t theme1 .

# Run container
docker run -p 3000:3000 theme1
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Preview mode toggle works
- [ ] Text editing preserves styling
- [ ] Character limits enforced
- [ ] Image upload works
- [ ] Image removal works
- [ ] Changes persist in localStorage
- [ ] Publish button shows change count
- [ ] Discard button clears changes

### Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (limited support)

## �� Troubleshooting

### Common Issues

**"EditableText not working"**
- Check if field is marked `editable: true` in schema
- Verify PreviewProvider is wrapping the page
- Ensure path matches schema structure

**"Image upload not working"**
- Check file size (max 5MB)
- Verify file type (images only)
- Check browser console for errors

**"Changes not persisting"**
- Check localStorage in browser dev tools
- Verify PreviewProvider is properly configured
- Check for JavaScript errors

### Debug Mode

Enable debug logging in `preview-context.tsx`:

```typescript
console.log('Preview mode:', isPreviewMode)
console.log('Edited data:', editedData)
```

## 📚 API Reference

### EditableText Props

```typescript
interface EditableTextProps {
  path: string           // Schema path (e.g., "sections.hero.title")
  value: string          // Current value
  className?: string     // CSS classes (preserved during editing)
}
```

### EditableImage Props

```typescript
interface EditableImageProps {
  path: string           // Schema path
  src: string           // Current image source
  alt: string           // Alt text
  width?: number        // Image width
  height?: number       // Image height
  className?: string    // CSS classes
  priority?: boolean    // Next.js image priority
}
```

### PreviewContext Methods

```typescript
const {
  isPreviewMode,        // boolean - current mode
  updateField,          // (path, value) => void - update field
  getValue,             // (path) => any - get current value
  publishChanges,       // () => void - save changes
  discardChanges,       // () => void - discard changes
  changesCount          // number - number of pending changes
} = usePreviewContext()
```

## 🤝 Contributing

When adding new editable functionality:

1. **Follow the pattern**: Schema → Data → Component → Test
2. **Keep it simple**: Use existing EditableText/EditableImage components
3. **Test thoroughly**: Verify in both viewing and preview modes
4. **Document changes**: Update this README if adding new features

## 📄 License

This theme is part of the Summit Bookkeeping project.

---

**Need help?** Check the troubleshooting section or review the component source code for implementation details.
