import type React from "react";
export interface FileValidationRules {
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  acceptedFormats?: string[]; // e.g., ["image/jpeg", "image/png"]
  maxFiles?: number;
}
export interface ImageWithProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  accept?: string; // input accept attribute
  aspectRatio?: string;
  previewSize?: "sm" | "md" | "lg";
  showDimensions?: boolean;
  dragAndDrop?: boolean;
  uploadText?: string;
  uploadIcon?: React.ReactNode;
  showPreview?: boolean;
  onFileSelect?: (files: File[]) => void;
}
