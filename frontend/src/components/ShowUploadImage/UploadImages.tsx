"use client";

import React from "react";

import { ImageWithProps } from "@/components/Upload/Upload";

/**
 * CommonUploadImages
 * Convenience wrapper around CommonUploadImage with multiple enabled by default.
 */
export const CommonUploadImages: React.FC<React.ComponentProps<typeof ImageWithProps>> = (
  props
) => {
  return <ImageWithProps {...props} multiple />;
};

export default CommonUploadImages;
