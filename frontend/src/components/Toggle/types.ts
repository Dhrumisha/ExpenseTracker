export interface ToggleHelperProps {
  children: React.ReactNode;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}
