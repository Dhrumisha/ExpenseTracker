export interface ItemHelperProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm";
  className?: string;
}

export interface ItemContentHelperProps {
  children: React.ReactNode;
  className?: string;
}

export interface ItemTitleHelperProps {
  children: React.ReactNode;
  className?: string;
}

export interface ItemDescriptionHelperProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface ItemMediaHelperProps {
  children: React.ReactNode;
  variant?: "default" | "icon" | "image";
  className?: string;
}

export interface ItemActionsHelperProps {
  children: React.ReactNode;
  className?: string;
}
