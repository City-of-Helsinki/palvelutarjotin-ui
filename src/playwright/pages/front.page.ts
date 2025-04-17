import type { Page } from '@playwright/test';

import { BasePage } from './base.page';
import type { Language } from '../../types';

type AllowedPaths = '/' | `/${Language}`;

export class FrontPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  static async create(page: Page, path: AllowedPaths) {
    const frontPage = new FrontPage(page);
    await frontPage.page.goto(path);
    return frontPage;
  }

  async isFinnish() {
    await this.isTitle('Kulttuuri- ja toimintakalenteri');
  }

  async isSwedish() {
    await this.isTitle('Kultur- och verksamhetskalendern');
  }

  async isEnglish() {
    await this.isTitle('Cultural and activity calendar');
  }
}
