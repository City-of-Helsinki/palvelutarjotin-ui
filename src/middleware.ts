/* eslint-disable max-len */
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
 * Enforces a prefix for the default locale 'fi'.
 * Redirects requests with the 'default' locale to the same URL with the default language prefix.
 * @see {@link https://github.com/vercel/next.js/discussions/18419}
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

/**
 * Generates a Content Security Policy (CSP) header string with a nonce.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateCSPHeader = (nonce: string) => {
  return `
    default-src 'self';
    script-src 'self' ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    } https://m.youtube.com https://www.youtube.com https://webanalytics.digiaiiris.com *.google.com *.gstatic.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: *.hel.fi *.hel.ninja *.ytimg.com *.youtube.com *.vimeo.com *.vimeocdn.com *.blob.core.windows.net *.hkih.hion.dev;
    font-src 'self' *.hel.fi *.hel.ninja;
    connect-src 'self' localhost:* 127.0.0.1:* *.hel.fi *.hel.ninja *.hkih.hion.dev *.digiaiiris.com;
    object-src 'none';
    media-src 'self' *.hel.fi *.hel.ninja *.hkih.hion.dev;
    manifest-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' *.hel.fi *.hel.ninja *.youtube.com www.youtube-nocookie.com *.vimeo.com *.google.com;
    frame-ancestors 'none';
    worker-src    'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
};

/**
 * Generates and sets the CSP header and x-nonce header for the request.
 */
const getCSPHeader = (request: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    // Replace newline characters and spaces
    generateCSPHeader(nonce)
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
  return requestHeaders;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

/**
 * Middleware function to handle requests.
 */
export async function middleware(req: NextRequest) {
  if (
    requestType.isStaticFile(req) ||
    requestType.isPagesFolderApi(req) ||
    requestType.isPublicFile(req)
  ) {
    return; // Early return for excluded requests
  }

  // Handle default locale redirection.
  const prefixRedirectResponse = await prefixDefaultLocale(req);
  if (prefixRedirectResponse) {
    return prefixRedirectResponse; // Early return if redirection occurs
  }

  // Apply CSP headers to the request.
  const requestHeaders = getCSPHeader(req);

  // Pass the modified request to the next handler.
  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}
