import { screen } from '@testing-library/testcafe';

// import translations from '../../src/domain/app/i18n/fi.json';

export const header = {
  languageSelector: screen.getByRole('button', {
    name: /fi kielivalikko/i,
  }),
  languageSelectorItemEn: screen.getByRole('link', { name: /in english/i }),
  languageSelectorItemFi: screen.getByRole('link', { name: /suomeksi/i }),
  languageSelectorItemSv: screen.getByRole('link', { name: /på svenska/i }),
};
