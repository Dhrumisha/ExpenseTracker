export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea label */
  label?: React.ReactNode;
  /** Whether to show red asterisk */
  asterisk?: boolean;
  /** Optional wrapper class */
  wrapperClassName?: string;
  /** Optional label class */
  labelClassName?: string;
  /** Resize behavior */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Whether field is part of Formik form */
  isFormikField?: boolean;
  /** Whether to show error messages */
  displayError?: boolean;
  /** Manual error state */
  error?: boolean;
  /** Manual error message */
  errorMessage?: string;
  /** Whether this should bypass permission checks */
  isUsedWithoutPermission?: boolean;
  /** Tooltip message */
  tooltipMessage?: string;
  /** Tooltip icon */
  tooltipIcon?: React.ReactNode;
}
