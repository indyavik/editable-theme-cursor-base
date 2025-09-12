'use client';

import React from 'react';
import { usePreviewContext } from '@/lib/preview-context';

interface EditableTextProps {
  path: string;           // "sections.hero.shortHeadline" or "site.brand"
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export function EditableText({ 
  path, 
  value, 
  className = '', 
  children
}: EditableTextProps) {
  try {
    const { 
      isPreviewMode, 
      updateField, 
      isFieldEditable, 
      getValue 
    } = usePreviewContext();
    
    // Get the current value (which might be edited)
    const currentValue = getValue(path) || value;
    const isEditable = isFieldEditable(path);
    
    // Safety check: ensure currentValue is a string
    const displayValue = typeof currentValue === 'string' ? currentValue : String(currentValue || '');
    
    // If not in preview mode or not editable, render normally
    if (!isPreviewMode || !isEditable) {
      return children || <span className={className}>{displayValue}</span>;
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      const newValue = e.target.innerText;
      if (newValue !== displayValue) {
        updateField(path, newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.currentTarget.innerText = displayValue;
        e.currentTarget.blur();
      }
    };
    
    // Preview mode with contentEditable
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        className={`${className} hover:outline-2 hover:outline-dashed hover:outline-blue-300 focus:outline-2 focus:outline-solid focus:outline-blue-500 cursor-text`}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{ minHeight: '1em' }}
      >
        {displayValue}
      </div>
    );
    
  } catch (error) {
    // Fallback if preview context fails
    console.error('Preview context error:', error);
    return children || <span className={className}>{value}</span>;
  }
}

// Specialized component for CTA buttons
export function EditableCTA({ 
  path, 
  cta, 
  className = '',
  children 
}: {
  path: string;
  cta: { label: string; href: string };
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <EditableText 
        path={`${path}.label`}
        value={cta.label}
        className={className}
      />
      {children}
    </>
  );
}

// Specialized component for arrays (like services, testimonials)
export function EditableList({ 
  path, 
  items, 
  renderItem,
  className = ''
}: {
  path: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}) {
  // For now, just render normally - array editing can be added later
  return (
    <div className={className}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
} 
