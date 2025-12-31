import type { InputHTMLAttributes } from "react";

export interface ButtonGroupOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}
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
export interface ButtonGroupWithProps extends BaseFormikComponentProps {
  options: ButtonGroupOption[];
  multiple?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  orientation?: "horizontal" | "vertical";
}
export interface ButtonGroupWithProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  options: ButtonGroupOption[];
  multiple?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  orientation?: "horizontal" | "vertical";
}
