import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';

import i18n from '../../../../../tests/initI18n';
import { store } from '../../../store';
import { testIds as mobileMenuTestIds } from '../../mobileMenu/MobileMenu';
import MobileNavbar, { testIds as mobileNavbarTestIds } from '../MobileNavbar';

const languages = [
  { text: 'In English', value: 'en' },
  { text: 'Suomeksi', value: 'fi' },
  { text: 'På svenska', value: 'sv' },
];

const renderMobileNavbar = () => {
  render(
    <Provider store={store}>
      <MobileNavbar />
    </Provider>
  );

  const toggleButton = screen.getByTestId(mobileNavbarTestIds.toggleButton);

  const clickOnToggleButton = () => {
    userEvent.click(toggleButton);
  };

  const getLanguageButton = (language: string) =>
    screen.getByText(language, { selector: 'button' });

  const clickOnLanguageButton = (language: string) => {
    userEvent.click(getLanguageButton(language));
  };

  const menu = screen.getByTestId(mobileMenuTestIds.menu);

  return {
    clickOnLanguageButton,
    clickOnToggleButton,
    menu,
    toggleButton,
  };
};

describe('MobileNavbar component', () => {
  test('Mobile menu should be closed/opened by clicking menu button', () => {
    const { clickOnToggleButton, menu } = renderMobileNavbar();

    expect(menu).not.toHaveClass('menuOpen');

    clickOnToggleButton();
    expect(menu).toHaveClass('menuOpen');

    clickOnToggleButton();
    expect(menu).not.toHaveClass('menuOpen');
  });

  test('i18n language should be changed by clicking language button', () => {
    const {
      clickOnToggleButton,
      clickOnLanguageButton,
      menu,
    } = renderMobileNavbar();

    languages.forEach((language) => {
      clickOnToggleButton();
      expect(menu).toHaveClass('menuOpen');

      clickOnLanguageButton(language.text);
      expect(menu).not.toHaveClass('menuOpen');
      expect(i18n.language).toBe(language.value);
    });
  });
});
