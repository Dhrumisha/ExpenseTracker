import type { ImageProps as NextImageProps, StaticImageData } from "next/image";

export type ImageVariant = "default" | "next";

export interface iBaseImageProps {
  className?: string;
  loadPriority?: "high" | "low" | "auto";
  fallback?: string | React.ReactNode;
  fallbackImage?: string | StaticImageData;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  variant?: ImageVariant;
  isBlobImage?: boolean;
  withLink?: boolean;
  link?: string;
}

// Omit objectFit from NextImageProps to avoid conflict
export interface INextImageProps
  extends Omit<NextImageProps, "objectFit" | "src">, iBaseImageProps {
  variant: "next";
  width: number;
  height: number;
  src: string | StaticImageData;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  withLink?: boolean;
  link?: string;
}

export interface IDefaultImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>, iBaseImageProps {
  variant?: "default" | "next";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  withLink?: boolean;
  link?: string;
  unoptimized?: boolean;
}

export type IImageProps = IDefaultImageProps | INextImageProps;
