import type { ButtonHTMLAttributes } from "react";

export interface ButtonWithProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "none";
  size?: "default" | "xs" | "sm" | "lg" | "icon";
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}
