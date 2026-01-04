import * as React from "react";

import { CircleQuestionMark } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { LabelWithProps } from "../Label/Label";
import { TooltipWithProps } from "../Tooltip/TooltipWithProps";

import type { IInputHelperProps } from "./types";

export const InputWithProps = ({
  label,
  tooltipMessage,
  tooltipIcon,
  error,
  errorMessage,
  required,
  id,
  value,
  defaultValue,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  checked,
  className,
  wrapperClassName,
  labelClassName,
  disabled,
  type,
  displayError = true,
  name,
  formik = false,
  field,
  meta,
  isInline,
  form: _form, // Exclude Formik form prop to avoid conflict with native HTML form attribute
  ...props
}: IInputHelperProps) => {
  // Formik integration
  const isFormikMode = formik && field && meta;
  const fieldName = isFormikMode ? field.name : name;
  const fieldId = id || fieldName;
  const fieldValue = isFormikMode ? field.value : value;
  const fieldError = isFormikMode ? meta.error : errorMessage;
  const hasError = isFormikMode ? meta.touched && meta.error : error;
  const showError = Boolean(displayError && hasError && fieldError);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFormikMode && field.onChange) {
      field.onChange(e);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isFormikMode && field.onBlur) {
      field.onBlur(e);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex gap-2",
          isInline ? "lg:flex-row flex-col" : "flex-col",
          wrapperClassName
        )}
      >
        <div className="flex gap-2">
          {label && (
            <LabelWithProps className={labelClassName} required={required} htmlFor={fieldId}>
              {label}
            </LabelWithProps>
          )}
          {tooltipMessage && (
            <TooltipWithProps content={tooltipMessage}>
              {tooltipIcon || (
                <CircleQuestionMark size={16} className="text-gray-500 cursor-pointer" />
              )}
            </TooltipWithProps>
          )}
        </div>
        <Input
          id={fieldId}
          name={fieldName}
          type={type}
          placeholder={placeholder}
          checked={checked}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={onFocus}
          value={fieldValue !== undefined ? fieldValue : undefined}
          defaultValue={!isFormikMode && defaultValue ? defaultValue : undefined}
          disabled={disabled}
          className={className}
          aria-invalid={!!showError}
          aria-describedby={showError ? `${fieldId}-error` : undefined}
          {...props}
        />
        <FormErrorMessage error={fieldError} id={`${fieldId}-error`} displayError={showError} />
      </div>
    </>
  );
};

export default InputWithProps;
