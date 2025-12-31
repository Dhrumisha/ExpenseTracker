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
export interface CheckboxWithProps extends BaseFormikComponentProps {
  checkboxPosition?: "left" | "right";
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}
