import type { ChangeEvent } from "react";
import { useState } from "react";

import { ErrorMessage, Field, useFormikContext } from "formik";
import { CircleQuestionMark } from "lucide-react";

import FormErrorMessage from "@/components/FormErrorMessage/FormErrorMessage";
import type { IInputHelperProps } from "@/components/Input/types";
import { LabelWithProps } from "@/components/Label/Label";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { TooltipWithProps } from "../Tooltip/TooltipWithProps";

// Wrapper component to handle Formik context for error display
const ConditionalErrorMessage = ({
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

const Input = ({
  className = "", // Additional CSS classes for the input element
  wrapperClassName = "", // Additional CSS classes for the wrapper div
  name = "", // Field name (required for Formik integration)
  defaultValue = "", // Default value for uncontrolled input
  displayError = true, // Whether to display validation errors
  disabled, // Manually disable the input field
  label, // Label text displayed above the input
  labelClassName = "", // Additional CSS classes for the label
  error, // Manual error state (for non-Formik usage)
  errorMessage, // Manual error message (for non-Formik usage)
  asterisk = false, // Show asterisk (*) to indicate required field
  formik = false, // Enable Formik integration. When true, uses Formik's Field component
  autoSuggestion = false, // Enable auto-suggestion dropdown
  suggestions = [], // Array of suggestion strings for auto-suggestion feature
  onChange, // Callback function called when input value changes
  value, // Controlled input value
  wrapperStyle, // Inline styles for the wrapper div
  isUsedWithoutPermission = false, // Bypass permission checks. When true, field won't be disabled based on permissions
  ...res // All other standard HTML input props (type, placeholder, maxLength, autoComplete, etc.)
}: IInputHelperProps) => {
  // Show action panel only if user has edit/delete permissions or is super user
  // View-only users should NOT see the action panel
  const isDisabled = isUsedWithoutPermission || disabled;

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Call the original onChange if provided
    onChange?.(e);

    if (!autoSuggestion) {
      return;
    }
    //Below is the logic for auto suggestion

    const value = e.target.value;

    // Only show suggestions if there's input value
    if (value.trim()) {
      setShowSuggestions(true);
      // Filter suggestions based on input
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      // Hide suggestions if input is empty
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // setInputValue(suggestion);

    setShowSuggestions(false);

    // Simulate an input change event
    const simulatedEvent = {
      target: { value: suggestion, name },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(simulatedEvent);
  };

  // Extract required and id from res to prevent HTML5 validation and handle id separately
  const { required, id: resId, ...restProps } = res;

  const inputProps: any = {
    type: restProps.type || "text",
    name,
    maxLength: restProps.maxLength || 255,
    ...restProps,
    className: cn(
      // error && "border-destructive focus-visible:ring-destructive",
      isDisabled && "cursor-not-allowed opacity-50",
      className
    ),
    autoComplete: restProps.autoComplete || "new-password",
    disabled: isDisabled,
    // Remove required attribute to prevent HTML5 validation
    // Use Formik validation instead
    ...(defaultValue && {
      defaultValue: defaultValue,
    }),
    ...(value && {
      value: value,
    }),
    ...(onChange && {
      onChange: handleInputChange,
    }),
  };

  // ==================== RENDER ====================
  return (
    <div className={cn("flex flex-col gap-2 relative", wrapperClassName)} style={wrapperStyle}>
      {/* Label - Only render if label prop is provided */}
      {label && (
        <div className="flex items-center gap-2">
          <LabelWithProps className={labelClassName} required={asterisk} htmlFor={name}>
            {label}
          </LabelWithProps>
          {res?.tooltipMessage && (
            <TooltipWithProps content={res?.tooltipMessage}>
              {res?.tooltipIcon || (
                <CircleQuestionMark size={16} className="text-gray-500 cursor-pointer" />
              )}
            </TooltipWithProps>
          )}
        </div>
      )}

      {/* Input Field - Use Formik Field if formik prop is true, otherwise use regular input */}
      {formik ? (
        <Field name={name}>
          {({ field: formikField, meta: formikMeta }: any) => {
            // Check if field has been touched and has an error
            const hasFormikError = formikMeta.touched && formikMeta.error;
            const fieldInputProps = {
              ...inputProps,
              ...formikField, // Spread Formik field props (value, onChange, onBlur, etc.)
              id: resId || name, // Use resId if provided, otherwise fall back to name
              className: cn(
                inputProps.className
                // Apply error styling if field has error
                // hasFormikError &&
                //   "border-destructive focus-visible:ring-destructive"
              ),
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                // Call Formik's onChange first, then our custom handler
                formikField.onChange(e);
                handleInputChange(e);
              },
            };
            return <ShadcnInput {...fieldInputProps} />;
          }}
        </Field>
      ) : (
        // Regular input (non-Formik mode)
        // Use resId if provided, otherwise fall back to name
        <ShadcnInput {...inputProps} id={resId || name} />
      )}

      {/* Error Messages - Show Formik errors if formik is enabled, otherwise show manual error */}
      {displayError && formik ? (
        <ConditionalErrorMessage fieldName={name} fieldId={name} />
      ) : errorMessage ? (
        <FormErrorMessage error={errorMessage} displayError={displayError} />
      ) : null}

      {/* Auto-Suggestion Dropdown - Only show if autoSuggestion is enabled and there are suggestions */}
      {autoSuggestion && showSuggestions && (
        <ul className="absolute top-full left-0 z-10 w-full mt-1 border border-input bg-background rounded-md shadow-md max-h-60 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            // Render filtered suggestions
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 cursor-pointer text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))
          ) : (
            // Show "No Match Found" if no suggestions match
            <li className="px-3 py-2 text-muted-foreground italic">No Match Found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Input;
