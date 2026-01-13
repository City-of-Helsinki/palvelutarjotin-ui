import type { Page } from '@playwright/test';

import { BasePage } from './base.page';

type TargetGroupButton = 'Kohderyhmät' | 'Målgrupp' | 'Target groups';
type ZeroToTwoYears = '0-2 vuotiaat' | '0-2 år' | '0-2 years';
type TargetGroupOption = ZeroToTwoYears;
type SearchOption = TargetGroupOption;
type SearchEvents = 'Hae tapahtumia' | 'Sök evenemang' | 'Search events';
type AdvancedSearch = 'Tarkennettu haku' | 'Redigera sökning' | 'Edit search';
type SearchButton = SearchEvents | AdvancedSearch;
type SearchTextBox = SearchEvents | TargetGroupButton;
type TargetGroupField = TargetGroupButton;

export class SearchCapablePage extends BasePage {
  constructor(page: Page) {
    super(page);
    if (this.constructor === SearchCapablePage) {
      throw new Error(
        'Abstract SearchCapablePage class cannot be instantiated directly'
      );
    }
  }

  async clickSearchOption(name: SearchOption) {
    await this.mainContent.getByRole('option', { name }).first().click();
  }

  async fillSearchTextBox(name: SearchTextBox, value: string) {
    const searchTextBox = this.page.getByRole('textbox', { name });
    await searchTextBox.click(); // First open the text box by clicking on it
    await searchTextBox.fill(value);
  }

  async clickSearchButton(name: SearchButton) {
    const targetButton = this.mainContent.getByRole('button', { name }).first();
    await targetButton.click();
  }

  async clickTargetGroupField(name: TargetGroupField) {
    // Target groups is a combobox/textbox, not a button
    const field = this.mainContent.getByRole('combobox', { name }).first();
    await field.isVisible({ timeout: 5000 }).catch(() => false);
    await field.click();
  }
}
