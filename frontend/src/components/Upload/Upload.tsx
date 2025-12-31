// src/components/common/CommonUploadImage/index.tsx

"use client";

import React, { useRef, useState } from "react";

import { useField } from "formik";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

import type { ImageWithProps as ImageWithPropsProps } from "@/components/ShowUploadImage/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * CommonUploadImage Component
 *
 * A specialized image upload component with preview
 * Extends CommonUpload with image-specific features
 *
 * @example
 * <CommonUploadImage
 *   name="profileImage"
 *   label="Profile Picture"
 *   aspectRatio="1:1"
 *   maxSize={2}
 *   showDimensions
 * />
 */
export const ImageWithProps: React.FC<ImageWithPropsProps> = ({
  name,
  label,
  helperText,
  required = false,
  disabled = false,
  containerClassName,
  multiple = false,
  maxSize = 5, // in MB
  maxFiles = 5,
  accept,
  aspectRatio = "free",
  previewSize = "md",
  showDimensions = true,
  dragAndDrop = true,
  uploadText = "Choose images or drag and drop",
  uploadIcon,
  showPreview = true,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Formik integration
  const [field, meta, helpers] = useField(name);

  // Determine if we should show error
  const showError = (meta.touched && meta.error) || validationError;
  const errorMessage = validationError || meta.error;

  // Get current files
  const currentFiles: File[] = Array.isArray(field.value) ? field.value : [];

  // Generate unique IDs
  const uploadId = `upload-image-${name}`;
  const errorId = `${uploadId}-error`;
  const helperId = `${uploadId}-helper`;

  // Validate image file
  const validateImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const acceptsImages = !accept || accept.includes("image");
      // If only images are accepted, validate mimetype
      if (acceptsImages) {
        if (!file.type.startsWith("image/")) {
          resolve("File must be an image");
          return;
        }
      }

      // Check file size
      const maxSizeBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        resolve(`Image exceeds maximum size of ${maxSize}MB`);
        return;
      }

      // Validate dimensions for images only
      if (acceptsImages) {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve(null); // Valid
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve("Invalid image file");
        };
        img.src = URL.createObjectURL(file);
        return;
      }

      // Non-image files considered valid if size checks passed
      resolve(null);
    });
  };

  // Create image preview
  const createPreview = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setValidationError("");

    const filesArray = Array.from(files);

    // Validate each image
    for (const file of filesArray) {
      const error = await validateImage(file);
      if (error) {
        setValidationError(error);
        return;
      }
    }

    // Check max files
    const totalFiles = multiple ? currentFiles.length + filesArray.length : filesArray.length;
    if (totalFiles > maxFiles) {
      setValidationError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Create previews only for images and if enabled
    const acceptsImages = !accept || accept.includes("image");
    const newPreviews =
      acceptsImages && showPreview ? await Promise.all(filesArray.map(createPreview)) : [];

    // Update Formik field
    let newFiles: File[];
    let allPreviews: string[];

    if (multiple) {
      newFiles = [...currentFiles, ...filesArray];
      allPreviews = [...imagePreviews, ...newPreviews];
    } else {
      newFiles = [filesArray[0]];
      allPreviews = [newPreviews[0]];
      // Clean up old preview
      if (imagePreviews.length > 0) {
        imagePreviews.forEach((preview) => {
          if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        });
      }
    }

    setImagePreviews(allPreviews);
    helpers.setValue(newFiles);
    helpers.setTouched(true);

    // Call custom handler if provided
    if (onFileSelect) {
      onFileSelect(newFiles);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && dragAndDrop) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    // Clean up preview
    const preview = imagePreviews[index];
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const newFiles = currentFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImagePreviews(newPreviews);
    helpers.setValue(newFiles.length > 0 ? newFiles : undefined);
    setValidationError("");
  };

  // Get preview container size
  const getPreviewSize = () => {
    switch (previewSize) {
      case "sm":
        return "w-20 h-20";
      case "md":
        return "w-32 h-32";
      case "lg":
        return "w-48 h-48";
      default:
        return "w-32 h-32";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div className={cn("space-y-3", containerClassName)}>
      {/* Label */}
      {label && (
        <Label className={cn(showError && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          isDragging && !disabled && "border-primary bg-primary/5",
          showError && "border-destructive",
          !showError && !isDragging && "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id={uploadId}
          type="file"
          accept={accept ?? "image/*"}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={cn(showError && errorId, helperText && helperId)}
        />

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {uploadIcon || <ImageIcon className="h-12 w-12 text-muted-foreground" />}
          <div className="space-y-1">
            <p className="text-sm font-medium">{uploadText}</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to {maxSize}MB
              {aspectRatio !== "free" && ` • ${aspectRatio} aspect ratio`}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse Images
          </Button>
        </div>
      </div>

      {/* Image Previews */}
      {showPreview && imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className={cn(
                "relative group rounded-lg overflow-hidden border bg-muted",
                getPreviewSize()
              )}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                {showDimensions && currentFiles[index] && (
                  <p className="text-xs text-white mb-2">
                    {formatFileSize(currentFiles[index].size)}
                  </p>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !showError && (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {showError && (
        <p
          id={errorId}
          className="text-sm font-medium text-destructive flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ImageWithProps;
