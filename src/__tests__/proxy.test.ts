import { isPublicFilePath } from '../proxy';

describe('isPublicFilePath', () => {
  it.each([
    '/favicon.ico',
    '/robots.txt',
    '/file.js',
    '/assets/image.png',
    '/static/font.woff2',
    // Final segment looks like a filename with an extension (same as Next PUBLIC_FILE)
    '/fi/cms-page/hello.world',
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
  ])('does not treat %s as a public file', (pathname) => {
    expect(isPublicFilePath(pathname)).toBe(false);
  });
});
