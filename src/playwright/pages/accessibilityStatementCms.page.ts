import type { Page } from '@playwright/test';

import { IN_10s } from '../constants';
import type { Timeout } from '../types';
import { CmsPage } from './cms.page';

export class AccessibilityStatementCmsPage extends CmsPage {
  protected readonly timeout: Timeout;

  constructor(page: Page) {
    super(page);
    this.timeout = IN_10s; // CMS page load can be slow
  }

  async isFinnish() {
    await this.isTitle('Saavutettavuusseloste', this.timeout);
  }

  async isSwedish() {
    await this.isTitle('Tillgänglighetsutlåtande', this.timeout);
  }

  async isEnglish() {
    await this.isTitle('Accessibility Statement', this.timeout);
  }
}
