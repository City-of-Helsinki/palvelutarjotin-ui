import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DEFAULT_LANGUAGE = 'fi';

const requestType = {
  isStaticFile: (req: NextRequest) => req.nextUrl.pathname.startsWith('/_next'),
  isPagesFolderApi: (req: NextRequest) =>
    req.nextUrl.pathname.includes('/api/'),
  isPublicFile: (req: NextRequest) => /\.(.*)$/.test(req.nextUrl.pathname),
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

export async function middleware(req: NextRequest) {
  if (
    requestType.isStaticFile(req) ||
    requestType.isPagesFolderApi(req) ||
    requestType.isPublicFile(req)
  ) {
    return;
  }
  return prefixDefaultLocale(req);
}
