export const DEFAULT_APP_DOMAIN =
  process.env.NEXT_PUBLIC_APP_DOMAIN ||
  (typeof window !== 'undefined' && window.location.host.includes('kanbanex.vercel.app')
    ? 'app.kanbanex.vercel.app'
    : 'app.kabanex.vercel.app');

export const DEFAULT_LANDING_DOMAIN =
  process.env.NEXT_PUBLIC_LANDING_DOMAIN ||
  (typeof window !== 'undefined' && window.location.host.includes('kanbanex.vercel.app')
    ? 'kanbanex.vercel.app'
    : 'kabanex.vercel.app');

/**
 * Returns the full or relative URL to the App domain.
 * - In production: https://app.kabanex.vercel.app/{path}
 * - In development on localhost: /{path} (stays on current dev server) unless NEXT_PUBLIC_APP_URL is specified
 */
export function getAppUrl(path = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}${normalizedPath}`;
  }

  // In development, keep local relative paths
  if (process.env.NODE_ENV !== 'production') {
    return normalizedPath || '/';
  }

  if (typeof window !== 'undefined') {
    const host = window.location.host;
    // On localhost, keep relative routing so developer can test locally without external network redirect
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return normalizedPath || '/';
    }
    // If already on the app subdomain, keep relative
    if (host.startsWith('app.')) {
      return normalizedPath || '/';
    }
  }

  return `https://${DEFAULT_APP_DOMAIN}${normalizedPath}`;
}

/**
 * Returns the full or relative URL to the Marketing/Landing domain.
 * - In production: https://kabanex.vercel.app/{path}
 * - In development on localhost: /{path}
 */
export function getLandingUrl(path = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (process.env.NEXT_PUBLIC_LANDING_URL) {
    return `${process.env.NEXT_PUBLIC_LANDING_URL.replace(/\/$/, '')}${normalizedPath}`;
  }

  // In development, keep local relative paths
  if (process.env.NODE_ENV !== 'production') {
    return normalizedPath || '/';
  }

  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return normalizedPath || '/';
    }
    if (!host.startsWith('app.')) {
      return normalizedPath || '/';
    }
  }

  return `https://${DEFAULT_LANDING_DOMAIN}${normalizedPath}`;
}
