import type { Page } from '@playwright/test';

import { SearchCapablePage } from './searchCapable.page';
import type { Language } from '../../types';

type AllowedFrontPagePaths = '/' | `/${Language}`;

export class FrontPage extends SearchCapablePage {
  constructor(page: Page) {
    super(page);
  }

  static async create(page: Page, path: AllowedFrontPagePaths) {
    const frontPage = new FrontPage(page);
    await frontPage.page.goto(path);
    return frontPage;
  }

  async isFinnish() {
    await this.hasTitle('Kulttuuri- ja toimintakalenteri');
  }

  async isSwedish() {
    await this.hasTitle('Kultur- och verksamhetskalendern');
  }

  async isEnglish() {
    await this.hasTitle('Cultural and activity calendar');
  }
}
