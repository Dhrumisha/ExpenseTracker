// 1. React and Next.js Core
import React, { useEffect, useState } from "react";

import type { StaticImageData } from "next/image";
import NextImage from "next/image";
import Link from "next/link";

// 2. Third-party Libraries
import { twMerge } from "tailwind-merge";

// 3. UI Components
import type { IImageProps, INextImageProps } from "@/components/Image/types";
import { ViewportRender } from "@/components/ViewPortRender/ViewPortRender";

// 5. Types and Interfaces

// 6. Constants and Utils
import { DEFAULT_NOT_FOUND_IMAGE } from "@/utils/constants";

const isStaticImageData = (src: string | StaticImageData | undefined): src is StaticImageData => {
  return typeof src === "object" && src !== null && "src" in src && typeof src.src === "string";
};

const Image = React.forwardRef<HTMLImageElement, IImageProps>((props, ref) => {
  const {
    className = "",
    fallback = "Image failed to load",
    aspectRatio = "auto",
    objectFit = "cover",
    fallbackImage = DEFAULT_NOT_FOUND_IMAGE,
    rounded = "none",
    variant = "default",
    unoptimized = false,
    isBlobImage = false,
    withLink = false,
    link = "",
    ...rest
  } = props;
  // const { "azure:BlobUrl": azureBlobUrl } = useTypedSelector(
  //   (state) => state.common.adminAppConfig
  // );
  const [hasError, setHasError] = useState(false);
  const [fallbackImageError, setFallbackImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "aspect-auto",
  }[aspectRatio];

  const objectFitClasses = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  }[objectFit];

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  const baseClasses = "w-full max-h-full";
  const combinedClasses = twMerge(
    baseClasses,
    aspectRatioClasses,
    objectFitClasses,
    roundedClasses,
    className
  );

  useEffect(() => {
    setHasError(false);
    setFallbackImageError(false);
    setIsLoading(true);
  }, [rest.src]);

  const getSrc = () => {
    // Check if src is empty or invalid
    if (
      !rest.src ||
      (typeof rest.src === "string" && (rest.src === "" || rest.src.trim() === ""))
    ) {
      return {
        src: isStaticImageData(fallbackImage) ? fallbackImage.src : fallbackImage,
        isFallback: true,
      };
    }

    // if (isBlobImage) {
    //   return {
    //     src: `${azureBlobUrl}${rest.src}`,
    //     isFallback: false,
    //   };
    // }

    return {
      src: rest.src,
      isFallback: false,
    };
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const { src, isFallback } = getSrc();

  if (hasError && fallbackImageError) {
    return (
      <div
        className={twMerge(
          "flex items-center justify-center bg-gray-100 text-gray-500",
          combinedClasses
        )}
      >
        {typeof fallback === "string" ? <span className="text-sm">{fallback}</span> : fallback}
      </div>
    );
  }

  if (hasError || isFallback) {
    return variant === "next" ? (
      <NextImage
        {...(rest as INextImageProps)}
        src={isStaticImageData(fallbackImage) ? fallbackImage.src : fallbackImage}
        className={combinedClasses}
        onError={() => setFallbackImageError(true)}
        unoptimized={true}
      />
    ) : (
      <img
        alt={rest.alt || ""}
        ref={ref}
        src={isStaticImageData(fallbackImage) ? fallbackImage.src : fallbackImage}
        className={combinedClasses}
        onError={() => setFallbackImageError(true)}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  const imageUrl = `${src}`;

  const renderImage = () => {
    if (variant === "next") {
      const imageElement = (
        <NextImage
          {...(rest as INextImageProps)}
          src={imageUrl}
          unoptimized={unoptimized}
          className={combinedClasses}
          onError={() => setHasError(true)}
          onLoad={handleImageLoad}
        />
      );
      return withLink ? (
        <Link href={link} rel="noopener noreferrer" prefetch={false}>
          {imageElement}
        </Link>
      ) : (
        imageElement
      );
    } else {
      return (
        <img
          alt={rest.alt || ""}
          ref={ref}
          className={combinedClasses}
          onError={() => setHasError(true)}
          {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
          src={imageUrl}
          onLoad={handleImageLoad}
        />
      );
    }
  };

  // Skeleton loader placeholder matching image size
  const loaderOverlay = (
    <div className="flex animate-pulse space-x-4">
      <div className={twMerge("absolute inset-0 bg-gray-200", roundedClasses)} />
    </div>
  );

  return (
    <>
      <div className={twMerge("relative overflow-hidden", combinedClasses)}>
        {isLoading && loaderOverlay}
        <ViewportRender fallback={loaderOverlay}>{renderImage()}</ViewportRender>
      </div>
    </>
  );
});

Image.displayName = "Image";

export default Image;
