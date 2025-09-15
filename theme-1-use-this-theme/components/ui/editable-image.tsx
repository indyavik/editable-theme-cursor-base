"use client"

import { useState, useRef } from "react"
import { usePreviewContext } from "../../lib/preview-context"
import { Upload, X } from "lucide-react"
import { Button } from "./button"

interface EditableImageProps {
  path: string
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function EditableImage({ 
  path, 
  src, 
  alt, 
  width = 500, 
  height = 500, 
  className = "",
  priority = false 
}: EditableImageProps) {
  const { isPreviewMode, updateField, getValue } = usePreviewContext()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const currentSrc = getValue(path) || src

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Create a data URL for immediate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        updateField(path, dataUrl)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    updateField(path, "")
  }

  if (!isPreviewMode) {
    // Normal display mode - just show the image
    return (
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    )
  }

  // Preview mode - show image with upload overlay
  return (
    <div className="relative group">
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
      
      {/* Upload overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            size="sm"
            className="bg-white text-black hover:bg-gray-100"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
          
          {currentSrc && (
            <Button
              onClick={handleRemoveImage}
              size="sm"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}
