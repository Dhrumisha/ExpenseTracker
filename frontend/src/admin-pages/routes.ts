// Centralized application route definitions.
// Use these instead of hardcoded path strings for navigation and guards.

export const ROUTES = {
  root: "/",
  auth: {
    signIn:"/sign-in",
    signUp: "/sign-up",
    forgotPassword: "/forgot-password",
    setPassword: "/set-password/*",
    resetPassword: "/reset-password",
  },
  admin: {
    root: "/admin",
    overview: "/admin/overview",
    transactions:"/admin/transactions",
    accounts:"/admin/accounts",
    settings:"/admin/settings"
  }
} as const;

export const publicRoutes = [
  ROUTES.auth.signIn,
  ROUTES.auth.forgotPassword,
  ROUTES.auth.resetPassword,
  ROUTES.auth.signUp,
  ROUTES.auth.setPassword,
];

export type AppRoutes = typeof ROUTES;

// Common helper function to build routes with path segments
export const buildRoute = (basePath: string, ...segments: (string | number)[]): string => {
  const pathSegments = segments.map(String).join("/");
  return `${basePath}${pathSegments ? `/${pathSegments}` : ""}`;
};

// Common helper function to build routes with query parameters
export const buildRouteWithQuery = (
  basePath: string,
  params: Record<string, string | number | null | undefined>
): string => {
  const queryString = Object.entries(params)
    .filter(([ , value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return `${basePath}${queryString ? `?${queryString}` : ""}`;
};
