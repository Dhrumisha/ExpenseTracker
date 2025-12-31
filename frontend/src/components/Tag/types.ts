export interface TagHelperProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  onClose?: () => void;
  className?: string;
}
