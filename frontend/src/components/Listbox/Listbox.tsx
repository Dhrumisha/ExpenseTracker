import * as React from "react";

import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { LabelWithProps } from "../Label/Label";

import type { ListboxHelperProps } from "./types";

export const ListboxWithProps = ({
  label,
  required,
  id,
  name,
  value,
  options,
  placeholder = "Select an option",
  className,
  wrapperClassName,
  labelClassName,
  disabled,
  errorMessage,
  error,
  displayError = true,
  onChange,
  onBlur,
  // Formik props
  formik = false,
  field,
  meta,
  // form,
}: ListboxHelperProps) => {
  // Formik integration
  const isFormikMode = formik && field && meta;
  const fieldName = isFormikMode ? field.name : name;
  const fieldId = id || fieldName;
  const fieldValue = isFormikMode ? field.value : value;
  const fieldError = isFormikMode ? meta.error : errorMessage;
  const hasError = isFormikMode ? meta.touched && meta.error : error;
  const showError = Boolean(displayError && hasError && fieldError);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isFormikMode && field.onChange) {
      field.onChange(e);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (isFormikMode && field.onBlur) {
      field.onBlur(e);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className={wrapperClassName}>
      {label && (
        <LabelWithProps className={labelClassName} required={required} htmlFor={fieldId}>
          {label}
        </LabelWithProps>
      )}
      <select
        id={fieldId}
        name={fieldName}
        value={fieldValue !== undefined ? fieldValue : ""}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={className}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${fieldId}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <FormErrorMessage error={fieldError} id={`${fieldId}-error`} displayError={showError} />
    </div>
  );
};

export default ListboxWithProps;
