import type { Page } from '@playwright/test';
import isEqual from 'lodash/isEqual';

import { BasePage } from './base.page';
import type { Language } from '../../types';
import { IN_10s, LANGUAGES } from '../constants';
import { expect } from '../testWithFixtures';

const EVENT_COUNT_REGEX = {
  fi: /Tapahtumat \d+ kpl/,
  sv: /Evenemang \d+ st/,
  en: /Events \d+ pc/,
} as const;

export class SearchPage extends BasePage {
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
    return await this.checkEventCountHeading('fi');
  }

  async isSwedish() {
    return await this.checkEventCountHeading('sv');
  }

  async isEnglish() {
    return await this.checkEventCountHeading('en');
  }

  async containsSearchParams(searchParams: URLSearchParams) {
    await expect(this.page).toHaveURL((url) =>
      [...searchParams.keys()].every((key) =>
        isEqual(url.searchParams.get(key), searchParams.get(key))
      )
    );
  }

  private async checkEventCountHeading(lang: Language) {
    return await expect(
      this.page.getByRole('heading', { name: EVENT_COUNT_REGEX[lang] })
    ).toBeVisible(IN_10s); // Search page load can be slow
  }
}
