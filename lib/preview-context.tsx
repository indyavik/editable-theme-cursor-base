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
    isFieldEditable
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
            {changesCount === 0 ? 'Click text to edit' : 'Keep editing or publish when ready'}
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