export interface ITooltipProps {
  content: React.ReactNode; // Content In the Tooltip text or custom JSX content
  asChild?: boolean; // Tooltip trigger type — default “default”, but “asChild” for direct child or children
  contentClassName?: string; // Additional class names for Tooltip content
  sideOffset?: number; // Offset distance between tooltip and trigger element
  children: React.ReactNode; // The element(s) that will trigger the tooltip
}
