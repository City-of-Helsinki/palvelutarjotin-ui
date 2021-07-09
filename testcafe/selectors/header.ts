import { screen, within } from '@testing-library/testcafe';

// import translations from '../../src/domain/app/i18n/fi.json';

const languageSelector = screen.getByRole('region', {
  name: /fi kielivalikko/i,
});

export const header = {
  languageSelector: screen.getByRole('button', {
    name: /fi kielivalikko/i,
  }),
  languageSelectorItemEn: within(languageSelector).getByText(/in english/i),
  languageSelectorItemFi: within(languageSelector).getByText(/suomeksi/i),
  languageSelectorItemSv: within(languageSelector).getByText(/på svenska/i),
};
