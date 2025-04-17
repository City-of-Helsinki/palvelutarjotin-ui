import type { Page } from '@playwright/test';

import { BasePage } from './base.page';
import { LANGUAGES } from '../constants';
import { expect } from '../testWithFixtures';

export class CmsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isReady() {
    await super.isReady();
    await expect(this.page).toHaveURL((url) =>
      LANGUAGES.some((lang) => url.pathname.startsWith(`/${lang}/cms-page/`))
    );
  }
}
