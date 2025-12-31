// src/components/common/CommonImage/index.tsx

"use client";

import React, { useState, useEffect } from "react";

import { ImageOff } from "lucide-react";

import type { ImageWithProps } from "@/components/ShowImage/types";
import { cn } from "@/lib/utils";

/**
 * Imagewithprops Component
 *
 * A reusable image component with fallback support and loading states
 * Uses Next.js Image component for optimization
 *
 * @example
 * <Imagewithprops
 *   src="/profile.jpg"
 *   alt="User profile"
 *   aspectRatio="1:1"
 *   objectFit="cover"
 *   fallbackSrc="/default-avatar.png"
 * />
 */
export const Imagewithprops: React.FC<ImageWithProps> = ({
  src,
  alt,
  fallbackSrc = "/placeholder-image.png",
  aspectRatio = "auto",
  objectFit = "cover",
  loading = "lazy",
  showPlaceholder = true,
  className,
  ...imageProps
}) => {
  // Handle empty string src by converting to null/undefined
  const initialSrc = src && src.trim() !== "" ? src : null;
  const [imageSrc, setImageSrc] = useState<string | null>(initialSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sync imageSrc with src prop changes
  useEffect(() => {
    const newSrc = src && src.trim() !== "" ? src : null;
    setImageSrc(newSrc);
    if (newSrc) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Get aspect ratio padding
  const getAspectRatioPadding = () => {
    switch (aspectRatio) {
      case "1:1":
        return "pb-[100%]";
      case "4:3":
        return "pb-[75%]";
      case "16:9":
        return "pb-[56.25%]";
      default:
        return "";
    }
  };

  // Get object fit class
  const getObjectFitClass = () => {
    switch (objectFit) {
      case "cover":
        return "object-cover";
      case "contain":
        return "object-contain";
      case "fill":
        return "object-fill";
      case "none":
        return "object-none";
      default:
        return "object-cover";
    }
  };

  // If error and no fallback, show placeholder
  if (hasError && !fallbackSrc && showPlaceholder) {
    return (
      <div
        className={cn(
          "relative w-full bg-muted rounded-md flex items-center justify-center",
          aspectRatio !== "auto" && getAspectRatioPadding(),
          aspectRatio === "auto" && "aspect-video",
          className
        )}
      >
        <ImageOff className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md",
        aspectRatio !== "auto" && getAspectRatioPadding(),
        className
      )}
    >
      {/* Loading skeleton */}
      {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}

      {/* Image */}
      {imageSrc && imageSrc.trim() !== "" && (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full",
            aspectRatio !== "auto" && "absolute inset-0",
            getObjectFitClass(),
            isLoading && "opacity-0",
            "transition-opacity duration-300"
          )}
          {...imageProps}
        />
      )}
    </div>
  );
};

export default Imagewithprops;
