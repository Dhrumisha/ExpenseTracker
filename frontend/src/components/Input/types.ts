import type { CSSProperties } from "react";

import type { FieldInputProps, FieldMetaProps, FormikProps } from "formik";
export interface IInputHelperProps {
  placeholder?: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  checked?: boolean;
  id?: string;
  value?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  displayError?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  asterisk?: boolean;
  formik?: boolean;
  field?: FieldInputProps<string>;
  meta?: FieldMetaProps<string>;
  form?: FormikProps<string | number>;
  isInline?: boolean;
  tooltipMessage?: string;
  tooltipIcon?: React.ReactNode;
  min?: number;
  max?: number;
  allowNegative?: boolean;
  autoSuggestion?: boolean;
  suggestions?: string[];
  isUsedWithoutPermission?: boolean;
  wrapperStyle?: CSSProperties;
  maxLength?: number;
  autoComplete?: string;
  [props: string]: any;
}
export interface InputOTPProps {
  length?: number;
  label?: string;
  name: string;
  onChangeOTP: (val: string) => void;
  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;
  value: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}
