"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";

import Link from "next/link";

import { ArrowLeft, Save, X } from "lucide-react";

import ButtonWithProps from "@/components/Button/Button";
import { TooltipWithProps } from "@/components/Tooltip/TooltipWithProps";

interface CreatePageHeaderProps {
  module: string;
  description?: string;
  navigateUrl?: string;
  onNavigate?: () => void;
  saveButtonName?: string;
  cancelButtonName?: string;
  validateForm?: () => void;
  toolTipMessage?: string;
  buttonType?: "button" | "submit" | "reset";
  borderShow?: boolean;
  children?: ReactNode;
  onSubmit?: () => void;
  showBackButton?: boolean;
  showCancelButton?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const CreatePageHeader = ({
  module, // The title/module name to display
  description, // Description text to display below the title
  navigateUrl = "", // The navigateUrl for the cancel button link and back button
  onNavigate, // Function to handle redirect/navigation (alternative to navigateUrl)
  saveButtonName = "Save", // Text for the save button
  cancelButtonName = "Cancel", // Text for the cancel button
  validateForm, // Form validation function
  toolTipMessage, // Tooltip message to display
  buttonType = "button", // Type of the save button
  borderShow = false, // Whether to show the border
  children, // Optional child elements to render
  onSubmit, // Function to call when form is submitted
  showBackButton = true, // Whether to show the back button
  showCancelButton = true, // Whether to show the cancel button
  isDisabled = false, // Whether the save button is disabled
  isLoading = false, // Whether the save button is in loading state
}: CreatePageHeaderProps) => {

  // Show action panel only if user has edit/delete permissions or is super user
  // View-only users should NOT see the action panel

  const handleValidation = useCallback(async () => {
    try {
      if (validateForm instanceof Function) {
        await validateForm();
      }
      if (onSubmit instanceof Function) {
        await onSubmit();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [validateForm, onSubmit]);

  return (
    <div
      className={`flex flex-col px-8 space-y-4 lg:pt-6 pt-4 ${
        borderShow ? "border-b border-gray-light pb-6" : ""
      }`}
    >
      {/* Back Button - Top Left */}
      {showBackButton && (navigateUrl || onNavigate) && (
        <div>
          {onNavigate ? (
            <ButtonWithProps
              type="button"
              className="bg-none hover:bg-gray-100"
              icon={<ArrowLeft className="size-4" />}
              variant="link"
              onClick={onNavigate}
              size="xs"
            >
              Back
            </ButtonWithProps>
          ) : (
            <Link href={navigateUrl} prefetch={false}>
              <ButtonWithProps
                type="button"
                className="bg-none hover:bg-gray-100"
                icon={<ArrowLeft className="size-4" />}
                variant="link"
                size="xs"
              >
                Back
              </ButtonWithProps>
            </Link>
          )}
        </div>
      )}

      {/* Title, Description and Action Buttons - In One Line */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Title and Description */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {module}
            {toolTipMessage && (
              <TooltipWithProps content={toolTipMessage}>
                <span className="uppercase tracking-wide font-bold ml-2 cursor-help inline-block">
                  ℹ️
                </span>
              </TooltipWithProps>
            )}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex gap-3 items-center">
          {showCancelButton &&
            (navigateUrl || onNavigate) &&
            (onNavigate ? (
              <ButtonWithProps
                type="button"
                icon={<X className="h-4 w-4" />}
                variant="outline"
                onClick={onNavigate}
              >
                {cancelButtonName}
              </ButtonWithProps>
            ) : (
              <Link href={navigateUrl} prefetch={false}>
                <ButtonWithProps
                  type="button"
                  size="lg"
                  icon={<X className="h-4 w-4" />}
                  variant="outline"
                >
                  {cancelButtonName}
                </ButtonWithProps>
              </Link>
            ))}
          {children}
          {(validateForm || onSubmit) ? (
            <ButtonWithProps
              disabled={isDisabled || isLoading}
              loading={isLoading}
              size="lg"
              icon={<Save className="h-4 w-4" />}
              type={buttonType}
              onMouseDown={handleValidation}
            >
              {saveButtonName}
            </ButtonWithProps>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreatePageHeader;
