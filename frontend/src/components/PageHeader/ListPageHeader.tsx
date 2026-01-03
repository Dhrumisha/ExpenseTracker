"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import ButtonWithProps from "@/components/Button/Button";

interface PageHeaderProps {
  customModuleName?: string;
  customDescription?: string;
  isModel?: boolean;
  onClick?: () => void;
  isBreadcrumb?: boolean;
  showBackButton?: boolean;
  navigateUrl?: string;
  buttonName?: string;
  children?: ReactNode;
  className?: string;
  usedInsideSection?: boolean;
}

export const PageHeader = ({
  customModuleName,
  customDescription,
  isModel = false,
  onClick,
  showBackButton = false,
  navigateUrl,
  buttonName,
  children,
  className,
  usedInsideSection = false,
}: PageHeaderProps) => {

  return (
    <div
      className={`xl:px-8 px-2 flex flex-col gap-4 ${className ?? ""} ${
        usedInsideSection ? "py-0" : "lg:pt-6 pt-2"
      }`}
    >
      {/* Heading and Description */}
      <div className="w-full flex lg:flex-row flex-col items-center sm:justify-between justify-end gap-4 leading-10!">
        <div className="flex max-lg:w-full items-center gap-2 mb-4 md:mb-6 lg:mb-0">
          {showBackButton && navigateUrl && (
            <Link href={navigateUrl} prefetch={false}>
              <ButtonWithProps
                type="button"
                variant="ghost"
                size="default"
                aria-label="Back"
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </ButtonWithProps>
            </Link>
          )}
          <div>
            <h1 id={customModuleName} className="text-xl md:text-2xl font-bold text-foreground">
              {customModuleName}
            </h1>
            {customDescription && (
              <p className="text-sm md:text-base text-muted-foreground mt-1">{customDescription}</p>
            )}
          </div>
        </div>

        <div
          className="flex max-lg:flex-wrap max-lg:w-full xl:justify-end items-center justify-start gap-2 lg:leading-10!"
          role="toolbar"
          aria-labelledby={customModuleName}
        >
          {children}
          {buttonName && (
            <>
              {onClick && isModel ? (
                <ButtonWithProps
                  type="button"
                  icon={<Plus className="h-4 w-4" />}
                  size="lg"
                  onClick={onClick}
                  aria-label={`Add new ${buttonName.toLowerCase()}`}
                >
                  {buttonName}
                </ButtonWithProps>
              ) : navigateUrl ? (
                <ButtonWithProps
                  type="button"
                  size="lg"
                  variant="default"
                  icon={<Plus className="h-4 w-4" />}
                >
                  <Link
                    href={navigateUrl}
                    prefetch={false}
                    aria-label={`Add new ${buttonName.toLowerCase()}`}
                  >
                    {buttonName}
                  </Link>
                </ButtonWithProps>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
