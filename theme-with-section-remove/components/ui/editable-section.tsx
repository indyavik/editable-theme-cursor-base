'use client';

import React, { useState } from 'react';
import { usePreviewContext } from '@/lib/preview-context';
import { Button } from './button';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface EditableSectionProps {
  sectionId: string;
  sectionType: string;
  path: string;
  className?: string;
  children: React.ReactNode;
  onRemove?: () => void;
  onAddBefore?: () => void;
  onAddAfter?: () => void;
}

export function EditableSection({ 
  sectionId,
  sectionType,
  path,
  className = '',
  children,
  onRemove,
  onAddBefore,
  onAddAfter
}: EditableSectionProps) {
  const { isPreviewMode } = usePreviewContext();
  const [showControls, setShowControls] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // If not in preview mode, render normally
  if (!isPreviewMode) {
    return <div className={className}>{children}</div>;
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    setShowRemoveConfirm(false);
  };

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Add Section Button - Before */}
      {showControls && onAddBefore && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            size="sm"
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md"
            onClick={onAddBefore}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Section
          </Button>
        </div>
      )}

      {/* Section Controls Overlay */}
      {showControls && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-md"
            onClick={() => setShowRemoveConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-md cursor-move"
          >
            <GripVertical className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Section Content */}
      <div className="relative">
        {children}
        
        {/* Hover Overlay */}
        {showControls && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-300 bg-blue-50/20 pointer-events-none" />
        )}
      </div>

      {/* Add Section Button - After */}
      {showControls && onAddAfter && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            size="sm"
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md"
            onClick={onAddAfter}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Section
          </Button>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Remove Section</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove the {sectionType} section? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
              >
                Remove Section
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
