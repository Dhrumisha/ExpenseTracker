import type { ImgHTMLAttributes } from "react";

export interface ImageWithProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none";
  loading?: "lazy" | "eager";
  showPlaceholder?: boolean;
}
