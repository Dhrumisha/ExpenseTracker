export type TabVariant = "default" | "pills";

export interface ITabsOption {
  value?: string | number;
  id?: string | number;
  label: string | React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  count?: number;
}

export interface ITabsWithProps {
  options: ITabsOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  onTabClick?: (value: number | string) => void;
  // Style variant
  variant?: TabVariant;
  // Scroll features
  showScrollButtons?: boolean;
  scrollAmount?: number;
  leftArrowIcon?: React.ReactNode;
  rightArrowIcon?: React.ReactNode;
  scrollButtonClassName?: string;
  // Styling
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  activeTabsTriggerClassName?: string;
  showActiveUnderline?: boolean;
  showContent?: boolean;
  // Other features
  isListPage?: boolean;
  usedInsideModal?: boolean;
}

export interface ITabsListHelperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface ITabsTriggerHelperProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface ITabsContentHelperProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
}
