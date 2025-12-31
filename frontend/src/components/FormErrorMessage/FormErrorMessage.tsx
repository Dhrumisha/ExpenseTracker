export interface FormErrorMessageProps {
  error?: string;
  id?: string;
  className?: string;
  displayError?: boolean;
}

export const FormErrorMessage = ({
  error,
  id,
  className,
  displayError = true,
}: FormErrorMessageProps) => {
  if (!displayError || !error) return null;

  return (
    <p
      id={id || "error-message"}
      className={className || "text-sm font-medium text-destructive"}
      role="alert"
    >
      {error}
    </p>
  );
};

export default FormErrorMessage;
