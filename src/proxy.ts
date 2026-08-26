import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DEFAULT_LANGUAGE = 'fi';

/**
 * True when the path looks like a static public file (extension on the final segment).
 * Prefer this over pathname.includes('.') which matches any path containing a dot.
 */
export const isPublicFilePath = (pathname: string): boolean =>
  /\.[^/]+$/.test(pathname);

const requestType = {
  isStaticFile: (req: NextRequest) => req.nextUrl.pathname.startsWith('/_next'),
  isPagesFolderApi: (req: NextRequest) =>
    req.nextUrl.pathname.includes('/api/'),
  isPublicFile: (req: NextRequest) => isPublicFilePath(req.nextUrl.pathname),
  // Sentry tunnel route - must not be processed by locale middleware
  isSentryTunnel: (req: NextRequest) => req.nextUrl.pathname === '/monitoring',
};

/**
 * Enforce prefix for default locale 'fi'
 * https://github.com/vercel/next.js/discussions/18419
 * @param req
 */
const prefixDefaultLocale = async (req: NextRequest) => {
  const { pathname, search } = req.nextUrl;

  // The default locale needs to be redirected so that it uses the default language in URL.
  if (req.nextUrl.locale === 'default') {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LANGUAGE}${pathname}${search}`, req.url)
    );
  }
};

export async function proxy(req: NextRequest) {
  if (
    requestType.isStaticFile(req) ||
    requestType.isPagesFolderApi(req) ||
    requestType.isPublicFile(req) ||
    requestType.isSentryTunnel(req)
  ) {
    return NextResponse.next();
  }

  const response = await prefixDefaultLocale(req);
  return response || NextResponse.next();
}
