import getLocalisedString from '../getLocalisedString';

const localisedObj = {
  en: 'text en',
  fi: 'text fi',
};

describe('getLocalisedString function', () => {
  it('should return localised string', () => {
    expect(getLocalisedString(localisedObj, 'en')).toBe('text en');
    expect(getLocalisedString(localisedObj, 'fi')).toBe('text fi');
  });

  it('should return string in default language when localised string is not found', () => {
    expect(getLocalisedString(localisedObj, 'sv')).toBe('text fi');
  });
});
