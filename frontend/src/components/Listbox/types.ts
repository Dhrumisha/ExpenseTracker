import type { FieldInputProps, FieldMetaProps, FormikProps } from "formik";

export interface ListboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ListboxHelperProps {
  label?: string;
  required?: boolean;
  id?: string;
  name?: string;
  value?: string | number;
  options: ListboxOption[];
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  errorMessage?: string;
  error?: boolean;
  displayError?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  // Formik integration props
  formik?: boolean;
  field?: FieldInputProps<any>;
  meta?: FieldMetaProps<any>;
  form?: FormikProps<any>;
}
