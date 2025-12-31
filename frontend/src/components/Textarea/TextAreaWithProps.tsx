"use client";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { CircleQuestionMark } from "lucide-react";

import FormErrorMessage from "@/components/FormErrorMessage/FormErrorMessage";
import { Textarea as ShadTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import LabelWithProps from "../Label/Label";
import { TooltipWithProps } from "../Tooltip/TooltipWithProps";

import type { TextareaProps } from "./types";

// Wrapper component to handle Formik context for error display
const ConditionalTextareaErrorMessage = ({
  fieldName,
  fieldId,
}: {
  fieldName: string;
  fieldId: string;
}) => {
  const formikContext = useFormikContext();

  return (
    <ErrorMessage name={fieldName}>
      {(errorMsg) => {
        if (!errorMsg) return null;

        // Get field meta to check if field is touched
        const fieldMeta = formikContext.getFieldMeta(fieldName);

        // Only show error if field is touched OR form has been submitted
        const shouldShowError = fieldMeta.touched || formikContext.submitCount > 0;

        if (!shouldShowError) return null;

        return <FormErrorMessage error={errorMsg} id={`${fieldId}-error`} displayError={true} />;
      }}
    </ErrorMessage>
  );
};

/**
 * EnhancedTextarea wraps ShadCN Textarea with:
 * - Permission handling
 * - Label + asterisk
 * - Error messages (Formik or manual)
 * - Resize behavior
 * - Formik support
 */
export const TextareaWithProps = ({
  name = "",
  id,
  label,
  // asterisk = false,
  resize = "vertical",
  wrapperClassName = "",
  labelClassName = "",
  className = "",
  disabled = false,
  isUsedWithoutPermission = false,
  isFormikField = false,
  displayError = true,
  error,
  errorMessage,
  ...props
}: TextareaProps) => {

  // Permission logic (same as your original component)
  const isDisabled = isUsedWithoutPermission || disabled;

  // Handle resize modes
  const resizeStyles = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  }[resize];

  const textareaClassName = cn(
    "w-full",
    resizeStyles,
    error && "border-red-500 focus:border-red-500 focus-visible:ring-red-500",
    className
  );

  const textareaProps = {
    id: id || name,
    name,
    disabled: isDisabled,
    ...props,
    className: textareaClassName,
  };

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2">
          <LabelWithProps className={labelClassName} required={props.required} htmlFor={id || name}>
            {label}
          </LabelWithProps>
          {props?.tooltipMessage && (
            <TooltipWithProps content={props?.tooltipMessage}>
              {props?.tooltipIcon || (
                <CircleQuestionMark size={16} className="text-gray-500 cursor-pointer" />
              )}
            </TooltipWithProps>
          )}
        </div>
      )}

      {/* Textarea — either Formik Field or normal ShadCN */}
      {isFormikField ? (
        <Field {...textareaProps} as={ShadTextarea} />
      ) : (
        <ShadTextarea {...textareaProps} />
      )}

      {/* Error Handling */}
      {displayError && isFormikField ? (
        <ConditionalTextareaErrorMessage fieldName={name} fieldId={id || name} />
      ) : errorMessage ? (
        <FormErrorMessage error={errorMessage} displayError={displayError} />
      ) : null}
    </div>
  );
};
