export const DEFAULT_APP_DOMAIN =
  process.env.NEXT_PUBLIC_APP_DOMAIN || 'kanbanex.vercel.app';

export const DEFAULT_LANDING_DOMAIN =
  process.env.NEXT_PUBLIC_LANDING_DOMAIN || 'kanbanex.vercel.app';

/**
 * Returns the URL or path to the app routes (/overview, /login, /signup, etc.).
 * Always returns relative paths unless NEXT_PUBLIC_APP_URL is explicitly configured with an absolute origin.
 */
export function getAppUrl(path = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}${normalizedPath}`;
  }

  return normalizedPath || '/';
}

/**
 * Returns the URL or path to the landing/marketing routes (/, /legal/..., etc.).
 * Always returns relative paths unless NEXT_PUBLIC_LANDING_URL is explicitly configured with an absolute origin.
 */
export function getLandingUrl(path = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (process.env.NEXT_PUBLIC_LANDING_URL && process.env.NEXT_PUBLIC_LANDING_URL.startsWith('http')) {
    return `${process.env.NEXT_PUBLIC_LANDING_URL.replace(/\/$/, '')}${normalizedPath}`;
  }

  return normalizedPath || '/';
}
