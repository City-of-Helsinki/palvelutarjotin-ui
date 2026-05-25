import sanitizeDomId from '../sanitizeDomId';

describe('sanitizeDomId function', () => {
  it('replaces unsafe characters with a dash', () => {
    expect(sanitizeDomId('abc:123/def')).toBe('abc-123-def');
  });

  it('keeps safe characters untouched', () => {
    expect(sanitizeDomId('abc_123-DEF')).toBe('abc_123-DEF');
  });
});
