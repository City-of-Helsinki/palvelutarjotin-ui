import type { Locator, Page } from '@playwright/test';
import isEqual from 'lodash/isEqual';

import { expect } from '../testWithFixtures';
import type { Timeout } from '../types';

type LanguageButton = 'Suomi' | 'Svenska' | 'English';
type HeaderButton = LanguageButton;

type AccessibilityStatement =
  | 'Saavutettavuusseloste'
  | 'Tillgänglighetsutlåtande'
  | 'Accessibility Statement';
type FooterLink = AccessibilityStatement;

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
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }); // Network can be slow
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

  async isCookieConsentBoxVisible() {
    await expect(this.cookieConsentBox).toBeVisible();
  }

  async isCookieConsentBoxHidden(timeout?: Timeout) {
    await expect(this.cookieConsentBox).not.toBeVisible(timeout);
  }

  /**
   * Wait for given milliseconds.
   * @param delayMs milliseconds to wait
   */
  async waitForMs(delayMs: number) {
    await this.page.waitForTimeout(delayMs);
  }

  async approveCookies() {
    await this.cookieConsentApprove.click();
  }

  async containsSearchParams(searchParams: URLSearchParams) {
    await expect(this.page).toHaveURL((url) =>
      [...searchParams.keys()].every((key) =>
        isEqual(url.searchParams.get(key), searchParams.get(key))
      )
    );
  }

  async hasTitle(text: string, timeout?: Timeout) {
    await expect(this.h1).toContainText(text, timeout);
  }

  protected async hasVisibleHeading(name: string | RegExp, timeout?: Timeout) {
    await expect(this.page.getByRole('heading', { name })).toBeVisible(timeout);
  }
}
