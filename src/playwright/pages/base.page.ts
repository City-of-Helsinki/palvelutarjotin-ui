import type { Locator, Page } from '@playwright/test';

import { IN_10s } from '../constants';
import { expect } from '../testWithFixtures';
import { Timeout } from '../types';

type LanguageButton = 'Suomi' | 'Svenska' | 'English';
type HeaderButton = LanguageButton;

type AccessibilityStatementLink =
  | 'Saavutettavuusseloste'
  | 'Tillgänglighetsutlåtande'
  | 'Accessibility Statement';
type FooterLink = AccessibilityStatementLink;

type SearchButton = 'Hae tapahtumia' | 'Sök evenemang' | 'Search events';
type TargetGroupButton = 'Kohderyhmät' | 'Målgrupp' | 'Target groups';

type ZeroToTwoYears = '0-2 vuotiaat' | '0-2 år' | '0-2 years';
type TargetGroupOption = ZeroToTwoYears;
type MainContentOption = TargetGroupOption;

type MainContentTextBox = SearchButton;

type MainContentButton = SearchButton | TargetGroupButton;

export class BasePage {
  protected readonly page: Page;
  protected readonly h1: Locator;
  protected readonly footer: Locator;
  protected readonly header: Locator;
  protected readonly mainContent: Locator;
  protected readonly cookieConsentBox: Locator;
  protected readonly cookieConsentApprove: Locator;

  constructor(page: Page) {
    if (this.constructor === BasePage) {
      throw new Error(
        'Abstract BasePage class cannot be instantiated directly'
      );
    }
    this.page = page;
    this.h1 = page.locator('h1');
    this.header = page.getByRole('banner');
    this.footer = page.getByRole('contentinfo');
    this.mainContent = page.locator('#main-content');
    this.cookieConsentBox = page.locator('#cookie-consent-content');
    this.cookieConsentApprove = page.getByTestId(
      'cookie-consent-approve-required-button'
    );
  }

  async isReady() {
    await this.page.waitForLoadState('networkidle', IN_10s); // Network can be slow
  }

  async reload() {
    return await this.page.reload();
  }

  async clickFooterLink(name: FooterLink) {
    await this.footer.getByRole('link', { name }).first().click();
  }

  async clickHeaderButton(name: HeaderButton) {
    await this.header.getByRole('button', { name }).first().click();
  }

  async clickSearchOption(name: MainContentOption) {
    await this.mainContent.getByRole('option', { name }).first().click();
  }

  async fillSearchTextBox(name: MainContentTextBox, value: string) {
    const searchTextBox = this.page.getByRole('textbox', { name });
    await searchTextBox.click(); // First open the text box by clicking on it
    await searchTextBox.fill(value);
  }

  async clickSearchButton(name: MainContentButton) {
    await this.mainContent.getByRole('button', { name }).first().click();
  }

  async isCookieConsentBoxVisible(timeout?: number) {
    await expect(this.cookieConsentBox).toBeVisible({ timeout });
  }

  async isCookieConsentBoxHidden(timeout?: number) {
    await expect(this.cookieConsentBox).not.toBeVisible({ timeout });
  }

  async isCookieConsentBoxHiddenAfterMs(delayMs: number) {
    await this.page.waitForTimeout(delayMs);
    await this.isCookieConsentBoxHidden(0); // Instant check
  }

  async approveCookies() {
    await this.cookieConsentApprove.click();
  }

  protected async isTitle(text: string, timeout?: Timeout) {
    await expect(this.h1).toContainText(text, timeout);
  }
}
