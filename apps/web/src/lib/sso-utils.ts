/**
 * Centralized SSO Redirection Utilities for MCOM Ecosystem
 */

export function getCentralCustomerSignupUrl(returnPath: string = "/auth/sso"): string {
  const solutionsUrl = process.env.NEXT_PUBLIC_MCOM_SOLUTIONS_URL || "https://mcomsolutions.vercel.app";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3005");
  const callbackUrl = `${appUrl}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}`;

  const params = new URLSearchParams({
    client_id: "mcom-loyalty",
    source: "mcomloyalty",
    redirect_uri: callbackUrl,
    redirect: callbackUrl,
  });

  return `${solutionsUrl}/register/customer?${params.toString()}`;
}

export function getCentralBusinessSignupUrl(returnPath: string = "/auth/sso"): string {
  const solutionsUrl = process.env.NEXT_PUBLIC_MCOM_SOLUTIONS_URL || "https://mcomsolutions.vercel.app";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3005");
  const callbackUrl = `${appUrl}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}`;

  const params = new URLSearchParams({
    client_id: "mcom-loyalty",
    source: "mcomloyalty",
    redirect_uri: callbackUrl,
    redirect: callbackUrl,
  });

  return `${solutionsUrl}/getstarted/business?${params.toString()}`;
}

export function getCentralLoginUrl(returnPath: string = "/auth/sso", state?: string): string {
  const solutionsUrl = process.env.NEXT_PUBLIC_MCOM_SOLUTIONS_URL || "https://mcomsolutions.vercel.app";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3005");
  const callbackUrl = `${appUrl}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}`;

  const params = new URLSearchParams({
    client_id: "mcom-loyalty",
    source: "mcomloyalty",
    redirect_uri: callbackUrl,
    redirect: callbackUrl,
  });

  if (state) {
    params.append("state", state);
  }

  return `${solutionsUrl}/login?${params.toString()}`;
}
