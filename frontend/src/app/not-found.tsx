"use client";

import Link from "next/link";

import { Home, ArrowLeft } from "lucide-react";

import { ButtonWithProps } from "../components/Button/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl md:text-10xl font-extrabold text-muted/20 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card border border-border rounded-lg px-8 py-4 shadow-elevation-sm">
              <p className="text-2xl md:text-3xl font-bold text-foreground">Page Not Found</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or
            deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/">
            <ButtonWithProps
              variant="default"
              size="lg"
              icon={<Home className="h-5 w-5" />}
              iconPosition="left"
            >
              Go to Home
            </ButtonWithProps>
          </Link>
          <ButtonWithProps
            variant="outline"
            size="lg"
            icon={<ArrowLeft className="h-5 w-5" />}
            iconPosition="left"
            onClick={() => window.history.back()}
          >
            Go Back
          </ButtonWithProps>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}
