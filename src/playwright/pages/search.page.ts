import type { Page } from '@playwright/test';

import type { Language } from '../../types';
import { LANGUAGES } from '../constants';
import { expect } from '../testWithFixtures';
import { SearchCapablePage } from './searchCapable.page';

const EVENT_COUNT_REGEX = {
  fi: /Tapahtumat \d+ kpl/,
  sv: /Evenemang \d+ st/,
  en: /Events \d+ pc/,
} as const;

export class SearchPage extends SearchCapablePage {
  constructor(page: Page) {
    super(page);
  }

  async isReady() {
    await super.isReady();
    await expect(this.page).toHaveURL((url) =>
      LANGUAGES.some((lang) => url.pathname == `/${lang}/search`)
    );
  }

  async isFinnish() {
    return await this.testEventCountHeading('fi');
  }

  async isSwedish() {
    return await this.testEventCountHeading('sv');
  }

  async isEnglish() {
    return await this.testEventCountHeading('en');
  }

  private async testEventCountHeading(lang: Language) {
    return await expect(
      this.page.getByRole('heading', { name: EVENT_COUNT_REGEX[lang] })
    ).toBeVisible({ timeout: 10_000 }); // Search page load can be slow
  }
}
