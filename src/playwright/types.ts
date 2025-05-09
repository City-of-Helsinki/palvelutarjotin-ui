import type { Locator } from '@playwright/test';

import type { Language } from '../types';

export type GetByRoleOptions = Omit<
  NonNullable<Parameters<Locator['getByRole']>[1]>,
  'name'
>;
export type Timeout = { timeout?: number };
export type LanguageButton = 'Suomi' | 'Svenska' | 'English';
export type HeaderButton = LanguageButton;
export type AccessibilityStatement =
  | 'Saavutettavuusseloste'
  | 'Tillgänglighetsutlåtande'
  | 'Accessibility Statement';
export type FooterLink = AccessibilityStatement;

export type TargetGroupButton = 'Kohderyhmät' | 'Målgrupp' | 'Target groups';
export type ZeroToTwoYears = '0-2 vuotiaat' | '0-2 år' | '0-2 years';
export type TargetGroupOption = ZeroToTwoYears;
export type SearchOption = TargetGroupOption;
export type SearchEvents = 'Hae tapahtumia' | 'Sök evenemang' | 'Search events';
export type SearchButton = SearchEvents | TargetGroupButton;
export type SearchTextBox = SearchEvents;

export type Translation = Record<Language, string>;
