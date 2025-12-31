import type { ReactNode } from "react";

import { useInViewport } from "@/hooks/useInViewPort";

interface ViewportRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  as?: any;
}

export function ViewportRender({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
  className = "",
  as: Tag = "span",
}: ViewportRenderProps) {
  const [ref, isInView] = useInViewport<HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <Tag ref={ref as any} className={className}>
      {isInView ? children : fallback}
    </Tag>
  );
}
