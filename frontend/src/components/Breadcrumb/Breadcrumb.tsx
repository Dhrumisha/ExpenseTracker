"use client";

import React, { useMemo } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home } from "lucide-react";

import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppSelector } from "@/redux";
import type { CompanyModules, ModuleItem } from "@/types/common/redux/module-slice.types";

interface BreadcrumbItemData {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

// Normalize path by removing trailing slashes
const normalizePath = (path: string): string => path.replace(/\/$/, "");

// Check if paths match (exact or prefix match)
const pathMatches = (modulePath: string, currentPath: string): boolean => {
  const normalizedModulePath = normalizePath(modulePath);
  const normalizedPath = normalizePath(currentPath);
  return (
    normalizedModulePath === normalizedPath
    // normalizedPath.startsWith(normalizedModulePath + "/")
  );
};

// Get the module path from either href or path_url
const getModulePath = (module: ModuleItem): string | null => {
  return module.path_url || null;
};

interface ModuleMatchResult {
  key: string;
  module: ModuleItem;
  parentKey: string | null;
  parentModule: ModuleItem | null;
  matchLength: number;
  pathDepth: number;
}

/**
 * Find the current module and its parent by matching the current path
 * Returns both the matched module and its parent for breadcrumb building
 */
const findModuleWithParent = (
  modules: CompanyModules,
  currentPath: string
): ModuleMatchResult | null => {
  const normalizedPath = normalizePath(currentPath);
  const matches: ModuleMatchResult[] = [];

  // Search through all modules and their children
  for (const [parentKey, parentModule] of Object.entries(modules)) {
    // Skip non-object entries like "is_super"
    if (parentModule == null || typeof parentModule !== "object") continue;

    const parentPath = getModulePath(parentModule);

    // Check if parent module matches
    if (parentPath && pathMatches(parentPath, normalizedPath)) {
      const segments = normalizePath(parentPath).split("/").filter(Boolean);
      const pathSegments = normalizedPath.split("/").filter(Boolean);

      let matchingSegments = 0;
      for (let i = 0; i < Math.min(segments.length, pathSegments.length); i++) {
        if (segments[i] === pathSegments[i]) matchingSegments++;
        else break;
      }

      matches.push({
        key: parentKey,
        module: parentModule,
        parentKey: null,
        parentModule: null,
        matchLength: matchingSegments,
        pathDepth: segments.length,
      });
    }

    // Search through children
    if (parentModule.children) {
      for (const [childKey, childModule] of Object.entries(parentModule.children)) {
        if (childModule == null) continue;

        const childPath = getModulePath(childModule);

        if (childPath && pathMatches(childPath, normalizedPath)) {
          const segments = normalizePath(childPath).split("/").filter(Boolean);
          const pathSegments = normalizedPath.split("/").filter(Boolean);

          let matchingSegments = 0;
          for (let i = 0; i < Math.min(segments.length, pathSegments.length); i++) {
            if (segments[i] === pathSegments[i]) matchingSegments++;
            else break;
          }

          matches.push({
            key: childKey,
            module: childModule,
            parentKey: parentKey,
            parentModule: parentModule,
            matchLength: matchingSegments,
            pathDepth: segments.length,
          });
        }

        // Search through nested children (grandchildren)
        if (childModule.children) {
          for (const [grandchildKey, grandchildModule] of Object.entries(childModule.children)) {
            if (grandchildModule == null) continue;

            const grandchildPath = getModulePath(grandchildModule);

            if (grandchildPath && pathMatches(grandchildPath, normalizedPath)) {
              const segments = normalizePath(grandchildPath).split("/").filter(Boolean);
              const pathSegments = normalizedPath.split("/").filter(Boolean);

              let matchingSegments = 0;
              for (let i = 0; i < Math.min(segments.length, pathSegments.length); i++) {
                if (segments[i] === pathSegments[i]) matchingSegments++;
                else break;
              }

              matches.push({
                key: grandchildKey,
                module: grandchildModule,
                parentKey: childKey,
                parentModule: childModule,
                matchLength: matchingSegments,
                pathDepth: segments.length,
              });
            }
          }
        }
      }
    }
  }

  if (matches.length === 0) return null;

  // Sort by match quality (more matching segments and deeper paths are better)
  matches.sort((a, b) => {
    if (b.matchLength !== a.matchLength) {
      return b.matchLength - a.matchLength;
    }
    return b.pathDepth - a.pathDepth;
  });
  return matches[0];
};

/**
 * Find the top-level parent module by module_id
 */
const findTopLevelParent = (
  modules: CompanyModules,
  parentId: number | null
): { key: string; module: ModuleItem } | null => {
  if (parentId === null) return null;

  for (const [key, module] of Object.entries(modules)) {
    if (module == null || typeof module !== "object") continue;
    if (module.module_id === parentId) {
      return { key, module };
    }
  }
  return null;
};

export interface AppBreadcrumbProps {
  /** Optional custom home path */
  homePath?: string;
  /** Optional custom home label */
  homeLabel?: string;
  /** Optional additional className for the breadcrumb container */
  className?: string;
  /** Optional flag to show/hide home icon */
  showHomeIcon?: boolean;
}

export const Breadcrumb = ({
  homePath = "/admin/dashboard",
  homeLabel = "Home",
  className,
  showHomeIcon = true,
}: AppBreadcrumbProps) => {
  const pathname = usePathname();
  const modules = useAppSelector((state) => state.modules.modules);

  const breadcrumbItems = useMemo((): BreadcrumbItemData[] => {
    const items: BreadcrumbItemData[] = [];

    // Always add Home as first item
    items.push({
      label: homeLabel,
      href: homePath,
    });

    // Guard against undefined or empty modules
    if (!modules || Object.keys(modules).length === 0) {
      return items;
    }

    // Find the current module and its parent
    const result = findModuleWithParent(modules, pathname);

    if (!result) {
      return items;
    }

    const { key, module, parentKey, parentModule } = result;

    // If we have a parent module, we might need to find the grandparent
    if (parentModule && parentKey) {
      // Check if parent has a parent (for nested structures)
      const grandparent = findTopLevelParent(modules, parentModule.parent_id ?? null);

      if (grandparent) {
        // We have grandparent -> parent -> current
        const grandparentPath = getModulePath(grandparent.module);
        items.push({
          label: grandparent.key,
          href: grandparentPath && grandparentPath.startsWith("/") ? grandparentPath : undefined,
        });
      }

      // Add parent module
      const parentPath = getModulePath(parentModule);
      items.push({
        label: parentKey,
        href: parentPath && parentPath.startsWith("/") ? parentPath : undefined,
      });
    } else if (module.parent_id) {
      // Current module has a parent but we matched the parent directly
      // Find the top-level parent
      const topParent = findTopLevelParent(modules, module.parent_id);
      if (topParent) {
        const topParentPath = getModulePath(topParent.module);
        items.push({
          label: topParent.key,
          href: topParentPath && topParentPath.startsWith("/") ? topParentPath : undefined,
        });
      }
    }

    // Add current module as the last item (current page)
    items.push({
      label: key,
      isCurrentPage: true,
    });

    return items;
  }, [modules, pathname, homePath, homeLabel]);

  // Don't render if only home is present
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <BreadcrumbRoot className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="flex items-center gap-1.5">
                    {index === 0 && showHomeIcon && <Home className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {index === 0 && showHomeIcon && <Home className="h-4 w-4" />}
                  {item.label}
                </span>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};

export default Breadcrumb;
