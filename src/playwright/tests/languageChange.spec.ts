import { test, expect } from '@playwright/test';

import { KultusPage } from '../KultusPage';

const h1 = {
  fi: 'Kulttuuri- ja toimintakalenteri',
  sv: 'Kultur- och verksamhetskalendern',
  en: 'Cultural and activity calendar',
} as const;

test('language change (fi->sv->en->fi) changes page language', async ({
  page: origPage,
}) => {
  const page = KultusPage.create(origPage);
  await page.goto('/');
  await page.clickHeaderButton('Suomi');
  await expect(page.h1).toContainText(h1.fi);
  await page.clickHeaderButton('Svenska');
  await expect(page.h1).toContainText(h1.sv);
  await page.clickHeaderButton('English');
  await expect(page.h1).toContainText(h1.en);
  await page.clickHeaderButton('Suomi');
  await expect(page.h1).toContainText(h1.fi);
});

test('/ page is in Finnish', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText(h1.fi);
});

test('/fi page is in Finnish', async ({ page }) => {
  await page.goto('/fi');
  await expect(page.locator('h1')).toContainText(h1.fi);
});

test('/sv page is in Swedish', async ({ page }) => {
  await page.goto('/sv');
  await expect(page.locator('h1')).toContainText(h1.sv);
});

test('/en page is in English', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText(h1.en);
});
