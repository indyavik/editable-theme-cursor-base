'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Utility functions for deep object path operations
function get(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function set(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
}

// Section configuration for available section types
const AVAILABLE_SECTIONS = {
  hero: {
    displayName: 'Hero Section',
    description: 'Main banner with headline and call-to-action',
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
    defaultData: {
      title: 'About Us',
      story: 'Tell your business story here...',
      credentials: ['Professional Certification'],
      badges: ['Trusted Partner']
    }
  },
  services: {
    displayName: 'Services Section',
    description: 'List of services you offer',
    defaultData: {
      title: 'Our Services',
      items: [
        { title: 'Service 1', description: 'Description of service 1', icon: 'star' },
        { title: 'Service 2', description: 'Description of service 2', icon: 'star' }
      ]
    }
  },
  contact: {
    displayName: 'Contact Section',
    description: 'Contact information and form',
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
    defaultData: {
      title: 'What Our Clients Say',
      items: [
        { quote: 'Great service!', author: 'John Doe', company: 'ABC Corp' }
      ]
    }
  },
  whyChooseUs: {
    displayName: 'Why Choose Us Section',
    description: 'Reasons to choose your business',
    defaultData: {
      title: 'Why Choose Us',
      bullets: ['Reason 1', 'Reason 2', 'Reason 3']
    }
  },
  blogTeaser: {
    displayName: 'Blog Section',
    description: 'Latest blog posts or articles',
    defaultData: {
      title: 'Latest Insights',
      items: [
        { title: 'Blog Post 1', excerpt: 'Brief description...', href: '/blog/post-1' }
      ]
    }
  },
  industriesServed: {
    displayName: 'Industries Section',
    description: 'Industries you serve',
    defaultData: {
      title: 'Industries We Serve',
      items: ['Industry 1', 'Industry 2', 'Industry 3']
    }
  }
};

interface PreviewContextType {
  isPreviewMode: boolean;
  setIsPreviewMode: (enabled: boolean) => void;
  editedData: Record<string, any>;
  updateField: (path: string, value: any) => void;
  getValue: (path: string) => any;
  publishChanges: () => Promise<void>;
  discardChanges: () => void;
  hasChanges: boolean;
  isFieldEditable: (path: string) => boolean;
  // Section operations
  addSection: (sectionType: string, position?: number) => void;
  removeSection: (sectionId: string) => void;
  getAvailableSections: () => typeof AVAILABLE_SECTIONS;
  getSections: () => any[];
  canAddSection: (sectionType: string) => boolean;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

interface PreviewProviderProps {
  children: ReactNode;
  initialData: any;
  schema: any;
  siteSlug?: string;
}

export function PreviewProvider({ children, initialData, schema, siteSlug }: PreviewProviderProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [sections, setSections] = useState(initialData.sections || []);

  const updateField = (path: string, value: any) => {
    setEditedData(prev => {
      const newData = { ...prev };
      set(newData, path, value);
      return newData;
    });
    
    // Auto-save to localStorage for persistence
    if (typeof window !== 'undefined') {
      const storageKey = `preview-${siteSlug || 'default'}`;
      localStorage.setItem(storageKey, JSON.stringify({ ...editedData, [path]: value }));
    }
  };

  const getValue = (path: string): any => {
    const editedValue = get(editedData, path);
    if (editedValue !== undefined) {
      return editedValue;
    }
    return get(initialData, path);
  };

  const getSections = (): any[] => {
    // Return sections with any edits applied
    return sections.map(section => {
      const sectionEdits = get(editedData, `sections.${section.id}`);
      return sectionEdits ? { ...section, ...sectionEdits } : section;
    });
  };

  const canAddSection = (sectionType: string): boolean => {
    // Check if section type already exists
    return !sections.some(section => section.type === sectionType);
  };

  const addSection = (sectionType: string, position?: number) => {
    const sectionConfig = AVAILABLE_SECTIONS[sectionType as keyof typeof AVAILABLE_SECTIONS];
    if (!sectionConfig) return;

    // Check if section already exists
    if (!canAddSection(sectionType)) {
      console.warn(`Section type ${sectionType} already exists`);
      return;
    }

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
        // Insert at the specified position
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

    // Update edited data to reflect the change
    updateField('sections', getSections());
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => {
      const newSections = prev.filter(section => section.id !== sectionId);
      // Reorder remaining sections
      newSections.forEach((section, index) => {
        section.order = (index + 1) * 10;
      });
      return newSections;
    });
    updateField('sections', getSections());
  };

  const getAvailableSections = () => AVAILABLE_SECTIONS;

  const publishChanges = async () => {
    try {
      console.log('Publishing changes:', editedData);
      // TODO: Implement API call to publish changes
      setEditedData({});
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`preview-${siteSlug || 'default'}`);
      }
    } catch (error) {
      console.error('Error publishing changes:', error);
    }
  };

  const discardChanges = () => {
    setEditedData({});
    setSections(initialData.sections || []);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`preview-${siteSlug || 'default'}`);
    }
  };

  const hasChanges = Object.keys(editedData).length > 0;

  const isFieldEditable = (path: string): boolean => {
    const fieldSchema = get(schema, path);
    return fieldSchema?.editable === true;
  };

  const contextValue: PreviewContextType = {
    isPreviewMode,
    setIsPreviewMode,
    editedData,
    updateField,
    getValue,
    publishChanges,
    discardChanges,
    hasChanges,
    isFieldEditable,
    addSection,
    removeSection,
    getAvailableSections,
    getSections,
    canAddSection
  };

  return (
    <PreviewContext.Provider value={contextValue}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreviewContext(): PreviewContextType {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreviewContext must be used within a PreviewProvider');
  }
  return context;
}

// Section picker modal component
export function SectionPicker({ isOpen, onClose, onSelect }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sectionType: string) => void;
}) {
  const { getAvailableSections, canAddSection } = usePreviewContext();
  const availableSections = getAvailableSections();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Add New Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(availableSections).map(([key, config]) => {
            const canAdd = canAddSection(key);
            return (
              <div
                key={key}
                className={`border rounded-lg p-4 ${
                  canAdd 
                    ? 'hover:bg-gray-50 cursor-pointer' 
                    : 'bg-gray-100 cursor-not-allowed opacity-60'
                }`}
                onClick={() => {
                  if (canAdd) {
                    onSelect(key);
                    onClose();
                  }
                }}
              >
                <h4 className="font-medium mb-2">{config.displayName}</h4>
                <p className="text-sm text-gray-600">{config.description}</p>
                {!canAdd && (
                  <p className="text-xs text-red-500 mt-2">Already added</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Simplified Preview toolbar component
export function PreviewToolbar() {
  const { 
    isPreviewMode, 
    setIsPreviewMode, 
    hasChanges, 
    publishChanges, 
    discardChanges,
    editedData
  } = usePreviewContext();

  const changesCount = Object.keys(editedData).length;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-4 border-2 border-blue-500">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-sm font-bold text-blue-600">PREVIEW MODE</div>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPreviewMode}
            onChange={(e) => setIsPreviewMode(e.target.checked)}
            className="rounded w-5 h-5"
          />
          <span className="text-sm font-medium">
            {isPreviewMode ? 'Editing ON' : 'Editing OFF'}
          </span>
        </label>
        
        {changesCount > 0 && (
          <>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-xs text-blue-600 font-medium">
              {changesCount} field{changesCount !== 1 ? 's' : ''} edited
            </span>
            <button
              onClick={publishChanges}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              Publish Changes
            </button>
            <button
              onClick={discardChanges}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Discard All
            </button>
          </>
        )}
        
        {isPreviewMode && (
          <div className="text-xs text-gray-500">
            {changesCount === 0 ? 'Click text to edit, hover sections to manage' : 'Keep editing or publish when ready'}
          </div>
        )}
      </div>
      
      {/* Simple debug view */}
      {changesCount > 0 && (
        <details className="mt-2 text-xs text-gray-600">
          <summary className="cursor-pointer">View changes ({changesCount})</summary>
          <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
            {JSON.stringify(editedData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
