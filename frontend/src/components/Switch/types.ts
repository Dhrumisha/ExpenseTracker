// import { InputHTMLAttributes } from 'react';

export interface BaseFormikComponentProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
}

export interface SwitchWithProps extends BaseFormikComponentProps {
  className?: string;
  switchPosition?: "left" | "right";
  onCheckedChange?: (checked: boolean) => void;
}
