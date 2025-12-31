import type { TagHelperProps } from "./types";

export const TagWithProps = ({
  children,
  variant = "default",
  size = "md",
  onClose,
  className,
  ...props
}: TagHelperProps) => {
  const baseStyles = "inline-flex items-center gap-1 rounded-full font-medium transition-colors";

  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input bg-background",
    secondary: "bg-secondary text-secondary-foreground",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
      {...props}
    >
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 hover:opacity-70 focus:outline-none"
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default TagWithProps;
