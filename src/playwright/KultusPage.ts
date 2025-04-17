import type { Locator, Page } from '@playwright/test';

export class KultusPage {
  readonly page: Page;
  readonly h1: Locator;

  private constructor(page: Page) {
    this.page = page;
    this.h1 = page.locator('h1');
  }

  static create(page: Page) {
    const instance = new KultusPage(page);

    // Pass method calls not defined in KultusPage to the wrapped page object
    return new Proxy(instance, {
      get(target, prop, receiver) {
        // Return the property if it exists on KultusPage
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        // Get the value from the page object
        const value = Reflect.get(target.page, prop);

        // If it's a function, bind it to the page context
        if (typeof value === 'function') {
          return function (...args: unknown[]) {
            return value.apply(target.page, args);
          };
        }

        // Otherwise just return the value
        return value;
      },
    }) as KultusPage & Page;
  }

  header = () => this.page.getByRole('banner');
  footer = () => this.page.getByRole('contentinfo');

  clickFooterLink = (name: string) =>
    this.footer().getByRole('link', { name }).first().click();

  clickHeaderButton = (name: string) =>
    this.header().getByRole('button', { name }).first().click();
}
