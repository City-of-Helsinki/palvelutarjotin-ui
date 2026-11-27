import type { NextRequest } from 'next/server';

import { isPublicFilePath, proxy } from '../proxy';

describe('isPublicFilePath', () => {
  it.each([
    '/favicon.ico',
    '/robots.txt',
    '/file.js',
    '/assets/image.png',
    '/static/font.woff2',
    // Final segment looks like a filename with an extension (same as Next PUBLIC_FILE)
    '/fi/cms-page/hello.world',
    '/.well-known/security.txt',
  ])('treats %s as a public file', (pathname) => {
    expect(isPublicFilePath(pathname)).toBe(true);
  });

  it.each([
    '/search',
    '/fi/cms-page/hello',
    // Dot only in an earlier segment — was a false positive with includes('.')
    '/en/something.with.dots/page',
    '/monitoring',
    '/',
    '/file.',
  ])('does not treat %s as a public file', (pathname) => {
    expect(isPublicFilePath(pathname)).toBe(false);
  });
});

describe('proxy', () => {
  const createRequest = (
    pathname: string,
    { locale = 'fi', search = '' }: { locale?: string; search?: string } = {}
  ): NextRequest =>
    ({
      nextUrl: { pathname, locale, search },
      url: `http://localhost${pathname}${search}`,
    }) as unknown as NextRequest;

  it.each([
    ['static files', '/_next/static/chunk.js'],
    ['pages folder api routes', '/api/newsletter'],
    ['public files', '/favicon.ico'],
    ['the Sentry tunnel route', '/monitoring'],
  ])('passes %s through without redirecting', (_, pathname) => {
    const response = proxy(createRequest(pathname, { locale: 'default' }));
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects the default locale to the default language prefix', () => {
    const response = proxy(
      createRequest('/search', { locale: 'default', search: '?text=foo' })
    );
    expect(response.headers.get('location')).toBe(
      'http://localhost/fi/search?text=foo'
    );
  });

  it('does not redirect requests that already have a locale', () => {
    const response = proxy(createRequest('/search', { locale: 'sv' }));
    expect(response.headers.get('location')).toBeNull();
  });
});
