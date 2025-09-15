'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { siteData, siteSchema } from './site-config';

// Utility functions for deep object path operations
function get(obj: any, path: string): any {
  if (!path || typeof path !== 'string') {
    return undefined;
  }
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function set(obj: any, path: string, value: any): any {
  if (!path || typeof path !== 'string') {
    return obj;
  }
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
}

// Helper function to extract data from the new config structure
function extractDataFromConfig() {
  return {
    site: siteData.site,
    features: siteData.features,
    sections: siteData.sections
  }
}

// Helper function to create schema from config - FIXED to match data structure
function createSchemaFromConfig() {
  return {
    site: siteSchema.site,
    features: siteSchema.features,
    sections: siteData.sections.map((section: any) => {
      const baseSectionSchema: any = (siteSchema.sections as any)[section.id] || {};
      const dataSchema: any = Object.fromEntries(
        Object.entries(baseSectionSchema).map(([key, fieldSchema]: [string, any]) => {
          if (fieldSchema && typeof fieldSchema === 'object' && fieldSchema.type === 'array') {
            const dataArray = (section.data as any)[key] || [];

            if (fieldSchema.itemSchema) {
              const itemTemplate = fieldSchema.itemSchema;
              const items = (Array.isArray(dataArray) ? dataArray : []).map(() => {
                if (itemTemplate && typeof itemTemplate === 'object' && !('type' in itemTemplate)) {
                  return Object.fromEntries(
                    Object.entries(itemTemplate).map(([ik, iv]: [string, any]) => [ik, iv])
                  );
                }
                return itemTemplate;
              });

              return [
                key,
                {
                  type: 'array',
                  editable: fieldSchema.editable,
                  description: fieldSchema.description,
                  items,
                },
              ];
            }

            const items = (Array.isArray(dataArray) ? dataArray : []).map(() => ({
              type: 'string',
              editable: true,
              description: 'Array item',
            }));

            return [
              key,
              {
                type: 'array',
                editable: fieldSchema.editable,
                description: fieldSchema.description,
                items,
              },
            ];
          }

          return [key, fieldSchema];
        })
      );

      return {
        id: section.id,
        type: section.type,
        enabled: section.enabled,
        order: section.order,
        data: dataSchema,
      };
    }),
  };
}

// Section configuration for available section types
// Removed hardcoded registry; we now read from schema.sectionTypes

function deriveDefaultFromFieldSchema(fieldSchema: any, fieldKey?: string): any {
  if (!fieldSchema || typeof fieldSchema !== 'object') return '';
  const key = (fieldKey || '').toLowerCase();
  switch (fieldSchema.type) {
    case 'string': {
      if (key.includes('name')) return 'Placeholder Name';
      if (key.includes('title')) return 'Placeholder Title';
      if (key.includes('subtitle')) return 'Placeholder Subtitle';
      if (key.includes('description') || key.includes('excerpt')) return 'Placeholder description...';
      if (key.includes('price')) return '$$';
      if (key.includes('email')) return 'email@example.com';
      if (key.includes('phone')) return '(555) 000-0000';
      if (key.includes('address')) return '123 Main St';
      if (key.includes('date')) return '2024-01-01';
      if (key.includes('company')) return 'Company';
      if (key.includes('slug')) return 'placeholder-slug';
      if (key.includes('message')) return 'Placeholder message';
      if (key.includes('label')) return 'Click me';
      if (key === 'href') return '#';
      return '';
    }
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'image':
      return '';
    case 'array': {
      return [];
    }
    default:
      return '';
  }
}

function deriveDefaultItemFromItemSchema(itemSchema: any): any {
  if (!itemSchema) return '';
  if (itemSchema && typeof itemSchema === 'object' && !('type' in itemSchema)) {
    // Complex item object
    return Object.fromEntries(
      Object.entries(itemSchema).map(([k, v]: [string, any]) => [k, deriveDefaultFromFieldSchema(v, k)])
    );
  }
  // Simple primitive item
  return deriveDefaultFromFieldSchema(itemSchema);
}

function deriveDefaultDataFromSectionSchema(sectionSchema: any): any {
  if (!sectionSchema || typeof sectionSchema !== 'object') return {};
  const result: any = {};
  Object.entries(sectionSchema).forEach(([key, fieldSchema]: [string, any]) => {
    if (fieldSchema?.type === 'array') {
      if (fieldSchema.itemSchema) {
        result[key] = [deriveDefaultItemFromItemSchema(fieldSchema.itemSchema)];
      } else {
        result[key] = [];
      }
    } else if (fieldSchema && typeof fieldSchema === 'object' && !('type' in fieldSchema)) {
      result[key] = Object.fromEntries(
        Object.entries(fieldSchema).map(([nk, nv]: [string, any]) => [nk, deriveDefaultFromFieldSchema(nv, nk)])
      );
    } else {
      result[key] = deriveDefaultFromFieldSchema(fieldSchema, key);
    }
  });
  return result;
}

function resolveArraySchema(arrayPath: string, schema: any): any {
  if (!arrayPath.startsWith('sections.')) return null;
  const parts = arrayPath.split('.');
  const sectionId = parts[1];
  const fieldPath = parts.slice(2);
  let node: any = schema?.sections?.[sectionId];
  for (let i = 0; i < fieldPath.length; i++) {
    const token = fieldPath[i];
    if (!node) return null;
    node = node[token];
  }
  return node;
}

function resolveArrayItemSchema(arrayPath: string, schema: any): any {
  // Expect arrayPath like: sections.services.items or sections[.id].items
  if (!arrayPath.startsWith('sections.')) return null;
  const parts = arrayPath.split('.');
  const sectionId = parts[1];
  const fieldPath = parts.slice(2); // e.g., ['items'] or nested
  let node: any = schema?.sections?.[sectionId];
  for (let i = 0; i < fieldPath.length; i++) {
    const token = fieldPath[i];
    if (!node) return null;
    if (node.type === 'array') {
      // next token should be the array field name or index; if index skip, use itemSchema
      const maybeIndex = token;
      const isIndex = !isNaN(Number(maybeIndex));
      if (isIndex) {
        node = node.itemSchema || { type: 'string', editable: true };
        continue;
      }
    }
    node = node[token];
  }
  // If the target node is an array, return its itemSchema; else return node
  if (node?.type === 'array') return node.itemSchema || { type: 'string', editable: true };
  return node;
}

function getArrayFromLiveState(arrayPath: string, getSectionsFn: () => any[]): any[] {
  if (!arrayPath.startsWith('sections.')) return [];
  const parts = arrayPath.split('.');
  const sectionId = parts[1];
  const innerPath = parts.slice(2).join('.');
  const section = getSectionsFn().find((s: any) => s.id === sectionId);
  if (!section) return [];
  const arr = get(section.data, innerPath);
  return Array.isArray(arr) ? arr : [];
}

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
  getAvailableSections: () => Record<string, any>;
  getSections: () => any[];
  // Array item operations
  addArrayItem: (arrayPath: string) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
  moveArrayItem: (arrayPath: string, from: number, to: number) => void;
  canAddArrayItem: (arrayPath: string) => boolean;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

interface PreviewProviderProps {
  children: ReactNode;
  initialData: any;
  schema: any;
  siteSlug?: string;
  pageType?: string; // optional page context to scope picker
}

function isPlainObject(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge(target: any, source: any): any {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    if (Array.isArray(source)) return [...source];
    return source;
  }
  const result: any = { ...target };
  Object.keys(source).forEach((key) => {
    const t = (target as any)[key];
    const s = (source as any)[key];
    if (Array.isArray(s)) {
      result[key] = Array.isArray(t) ? [...s] : [...s];
    } else if (isPlainObject(t) && isPlainObject(s)) {
      result[key] = deepMerge(t, s);
    } else {
      result[key] = s;
    }
  });
  return result;
}

export function PreviewProvider({ children, initialData, schema, siteSlug, pageType }: PreviewProviderProps) {
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

    // Support section-scoped paths like "sections.{sectionId}.items.0.name"
    if (path.startsWith('sections.')) {
      const parts = path.split('.');
      const sectionId = parts[1];
      const innerPath = parts.slice(2).join('.');
      const section = getSections().find((s: any) => s.id === sectionId);
      if (!section) return undefined;
      if (!innerPath) return section;
      return get(section.data, innerPath);
    }

    return get(initialData, path);
  };

  const getSections = (): any[] => {
    // Return sections with any edits applied
    return sections.map((section: any) => {
      const sectionEdits = get(editedData, `sections.${section.id}`);
      if (sectionEdits) {
        const mergedData = deepMerge(section.data, sectionEdits);
        return { ...section, data: mergedData };
      }
      return section;
    });
  };

  const addSection = (sectionType: string, position?: number) => {
    const registry = (schema as any)?.sectionTypes || {};
    const meta = registry[sectionType] as any;
    if (!meta) return;

    const schemaId = meta.schemaId || sectionType;
    const baseSectionSchema = (schema as any)?.sections?.[schemaId];
    const defaultData = meta.defaultData || deriveDefaultDataFromSectionSchema(baseSectionSchema);

    // For singleton, id should match schemaId to align with schema lookups;
    // For non-singleton, generate a unique id while keeping schemaId for lookups.
    const newId = meta.singleton ? schemaId : `${schemaId}-${Date.now()}`;

    const newSection: any = {
      id: newId,
      type: sectionType,
      enabled: true,
      order: position !== undefined ? position * 10 : (sections.length + 1) * 10,
      data: defaultData,
    };

    setSections((prev: any) => {
      const newSections = [...prev];
      if (position !== undefined) {
        newSections.splice(position, 0, newSection);
        return newSections.map((section: any, index: number) => ({ ...section, order: (index + 1) * 10 }));
      }
      newSections.push(newSection);
      return newSections;
    });

    updateField('sections', getSections());
  };

  const removeSection = (sectionId: string) => {
    setSections((prev: any) => prev.filter((section: any) => section.id !== sectionId));
    updateField('sections', getSections());
  };

  // Array editing APIs
  const addArrayItem = (arrayPath: string) => {
    const current = getArrayFromLiveState(arrayPath, getSections);
    const arraySchema = resolveArraySchema(arrayPath, schema);
    const maxItems = arraySchema?.maxItems as number | undefined;
    if (typeof maxItems === 'number' && current.length >= maxItems) {
      return;
    }
    const itemSchema = arraySchema?.itemSchema || resolveArrayItemSchema(arrayPath, schema);
    const newItem = deriveDefaultItemFromItemSchema(itemSchema);
    const next = [...current, newItem];
    updateField(arrayPath, next);
  };

  const canAddArrayItem = (arrayPath: string): boolean => {
    const current = getArrayFromLiveState(arrayPath, getSections);
    const arraySchema = resolveArraySchema(arrayPath, schema);
    const maxItems = arraySchema?.maxItems as number | undefined;
    if (typeof maxItems === 'number') {
      return current.length < maxItems;
    }
    return true;
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const current = getArrayFromLiveState(arrayPath, getSections);
    if (!Array.isArray(current) || index < 0 || index >= current.length) return;
    const next = current.filter((_: any, i: number) => i !== index);
    updateField(arrayPath, next);
  };

  const moveArrayItem = (arrayPath: string, from: number, to: number) => {
    const current = getArrayFromLiveState(arrayPath, getSections);
    if (!Array.isArray(current) || from === to || from < 0 || from >= current.length || to < 0 || to >= current.length) return;
    const next = [...current];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateField(arrayPath, next);
  };

  const getAvailableSections = () => {
    const registry = (schema as any)?.sectionTypes || {};
    const currentSectionTypes = sections.map((section: any) => section.type);

    // Optional page-scoped allowlist
    const allowed = pageType ? (schema as any)?.pages?.[pageType]?.allowedSectionTypes : undefined;

    const sectionsWithStatus: Record<string, any> = {};
    Object.entries(registry).forEach(([typeKey, meta]: [string, any]) => {
      if (Array.isArray(allowed) && !allowed.includes(typeKey)) return; // filtered out for this page
      const isAdded = currentSectionTypes.includes(typeKey);
      const canAdd = meta.singleton ? !isAdded : true;
      sectionsWithStatus[typeKey] = {
        displayName: meta.displayName,
        description: meta.description,
        isAdded,
        canAdd,
      };
    });

    return sectionsWithStatus;
  };

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

  // FIXED: isFieldEditable now properly handles nested data structure including array items
  const isFieldEditable = (path: string): boolean => {
    try {
      if (!schema) return false;

      // Site-level fields like "site.brand" or "features.blogEnabled"
      if (!path.startsWith('sections.')) {
        const fieldSchema = get(schema, path);
        return fieldSchema?.editable === true;
      }

      // Section fields like "sections.services.items.0.price" or "sections.hero-main.primaryCta.label"
      const parts = path.split('.');
      // parts[0] === 'sections'
      const sectionId = parts[1];
      const fieldPathTokens = parts.slice(2);

      // Look up the base section schema from schema.sections object
      const baseSectionSchema: any = (schema as any)?.sections?.[sectionId];
      if (!baseSectionSchema) return false;

      // Walk the schema following the field path tokens
      let node: any = baseSectionSchema;
      for (let i = 0; i < fieldPathTokens.length; i++) {
        const token = fieldPathTokens[i];
        if (!node) return false;

        // If current node defines an array field, handle numeric indices via itemSchema
        if (node && typeof node === 'object' && node.type === 'array') {
          // Next token could be a numeric index; if so, advance past index and drill into itemSchema
          const maybeIndex = token;
          const isIndex = !isNaN(Number(maybeIndex));
          if (isIndex) {
            // Move into item schema if available; otherwise assume simple editable item
            node = node.itemSchema || { editable: true };
            continue;
          }
        }

        // Regular object traversal
        node = node[token];
      }

      return node?.editable === true;
    } catch {
      return false;
    }
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
    addArrayItem,
    removeArrayItem,
    moveArrayItem,
    canAddArrayItem
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
  const { getAvailableSections } = usePreviewContext();
  const sectionsWithStatus = getAvailableSections();

  if (!isOpen) return null;

  const entries = Object.entries(sectionsWithStatus);
  const available = entries.filter(([, config]) => config.canAdd);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Add New Section</h3>

        {available.length === 0 ? (
          <div className="text-sm text-gray-600">
            No sections are available to add.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map(([key, config]) => (
              <div
                key={key}
                className={`border rounded-lg p-4 ${
                  config.canAdd 
                    ? 'hover:bg-gray-50 cursor-pointer border-gray-200' 
                    : 'bg-gray-100 cursor-not-allowed border-gray-300'
                }`}
                onClick={() => {
                  if (config.canAdd) {
                    onSelect(key);
                    onClose();
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium ${config.canAdd ? 'text-gray-900' : 'text-gray-500'}`}>
                    {config.displayName}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    config.isAdded 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {config.isAdded ? 'Added' : 'Available'}
                  </span>
                </div>
                <p className={`text-sm ${config.canAdd ? 'text-gray-600' : 'text-gray-400'}`}>
                  {config.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
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
