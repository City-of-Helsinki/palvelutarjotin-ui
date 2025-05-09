import type { Page } from '@playwright/test';

import type { Language } from '../../types';
import { LANGUAGES } from '../constants';
import { expect } from '../testWithFixtures';
import { SearchCapablePage } from './searchCapable.page';
import { MOCK_EVENTS_QUERY_RESPONSE } from '../mocks';
import { TRANS } from '../translations';

const EVENT_COUNT_REGEX = {
  fi: /Tapahtumat \d+ kpl/,
  sv: /Evenemang \d+ st/,
  en: /Events \d+ pc/,
} as const satisfies Record<Language, RegExp>;

export class SearchPage extends SearchCapablePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Go to the search page for the given language.
   * @param lang - Language
   */
  async gotoSearchPage(lang: Language) {
    await this.page.goto(`/${lang}/search`);
  }

  async openEvent(lang: Language, name: string) {
    await this.mainContent
      .getByRole('link', { name: TRANS.openEventPrefix[lang] + name })
      .first()
      .click();
  }

  async mockSearchResults() {
    await this.mockGraphQL('Events', MOCK_EVENTS_QUERY_RESPONSE);
  }

  async isReady() {
    await super.isReady();
    await expect(this.page).toHaveURL((url) =>
      LANGUAGES.some((lang) => url.pathname == `/${lang}/search`)
    );
  }

  async isFinnish() {
    return await this.isEventCountHeadingVisible('fi');
  }

  async isSwedish() {
    return await this.isEventCountHeadingVisible('sv');
  }

  async isEnglish() {
    return await this.isEventCountHeadingVisible('en');
  }

  async isEventCountHeadingVisible(lang: Language) {
    await this.hasVisibleHeading(EVENT_COUNT_REGEX[lang]);
  }
}
