import type { Page } from '@playwright/test';

import type { Timeout } from '../types';
import { CmsPage } from './cms.page';

export class AccessibilityStatementCmsPage extends CmsPage {
  protected readonly timeout: Timeout;

  constructor(page: Page) {
    super(page);
    this.timeout = { timeout: 10_000 }; // CMS page load can be slow
  }

  async isFinnish() {
    await this.hasTitle('Saavutettavuusseloste', this.timeout);
  }

  async isSwedish() {
    await this.hasTitle('Tillgänglighetsutlåtande', this.timeout);
  }

  async isEnglish() {
    await this.hasTitle('Accessibility Statement', this.timeout);
  }
}
