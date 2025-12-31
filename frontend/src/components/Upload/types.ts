import type { InputHTMLAttributes } from "react";
export interface BaseFormikComponentProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
}
export interface InputWithProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name">, BaseFormikComponentProps {
  showErrorIcon?: boolean;
  showSuccessIcon?: boolean;
}
export interface FileValidationRules {
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  acceptedFormats?: string[]; // e.g., ["image/jpeg", "image/png"]
  maxFiles?: number;
}
export interface UploadWithProps extends BaseFormikComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  validation?: FileValidationRules;
  showPreview?: boolean;
  dragAndDrop?: boolean;
  uploadText?: string;
  uploadIcon?: React.ReactNode;
  onFileSelect?: (files: File[]) => void;
}
