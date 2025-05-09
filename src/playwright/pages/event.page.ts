import type { Locator, Page } from '@playwright/test';

import { Language } from '../../types';
import { LANGUAGES } from '../constants';
import { expect } from '../testWithFixtures';
import { BasePage } from './base.page';
import {
  MOCK_ENROL_OCCURRENCE_MUTATION_RESPONSE,
  MOCK_EVENT_QUERY_RESPONSE,
  MOCK_SCHOOLS_AND_KINDERGARTENS_LIST_QUERY_RESPONSE,
  MOCK_STUDY_LEVELS_QUERY_RESPONSE,
} from '../mocks';
import { TRANS, TranslationsOf } from '../translations';
import { GetByRoleOptions } from '../types';

type EnrolmentFormButton = TranslationsOf<'studyLevel' | 'submitEnquiry'>;
type EnrolmentFormTextBox = TranslationsOf<
  | 'additionalInfo'
  | 'emailAddress'
  | 'group'
  | 'name'
  | 'phoneNumber'
  | 'studyGroupUnit'
>;
type EnrolmentFormSpinButton = TranslationsOf<'adults' | 'children'>;
type EnrolmentFormCheckBox = TranslationsOf<'acceptDataSharing'>;

type OccurrencesSectionButton = TranslationsOf<
  'showOccurrenceDetails' | 'reservationEnquiry'
>;

type StudyLevelOption = TranslationsOf<'preschoolStudyLevel'>;
type StudyGroupUnitOption = TranslationsOf<'daycareKamppiStudyGroupUnit'>;

export class EventPage extends BasePage {
  protected readonly enrolmentForm: Locator;
  protected readonly occurrencesSection: Locator;

  constructor(page: Page) {
    super(page);
    this.enrolmentForm = this.page.getByTestId('enrolment-form');
    this.occurrencesSection = this.page.getByTestId('occurrences-section');
  }

  async isReady() {
    await super.isReady();
    await expect(this.page).toHaveURL((url) =>
      LANGUAGES.some((lang) => url.pathname.startsWith(`/${lang}/event/`))
    );
  }

  async clickEnrolmentFormButton(name: EnrolmentFormButton) {
    await this.enrolmentForm.getByRole('button', { name }).click();
  }

  async clickOccurrencesSectionButton(name: OccurrencesSectionButton) {
    await this.occurrencesSection.getByRole('button', { name }).click();
  }

  async showOccurrenceDetails(lang: Language) {
    await this.clickOccurrencesSectionButton(TRANS.showOccurrenceDetails[lang]);
  }

  async showReservationEnquiryForm(lang: Language) {
    await this.clickOccurrencesSectionButton(TRANS.reservationEnquiry[lang]);
  }

  async openStudyLevelDropdown(lang: Language) {
    await this.clickEnrolmentFormButton(TRANS.studyLevel[lang]);
  }

  async clickStudyLevelOption(lang: Language, name: StudyLevelOption) {
    await this.page
      .getByRole('listbox', { name: TRANS.studyLevel[lang] })
      .getByRole('option', { name })
      .getByLabel('check')
      .click();
  }

  async clickPreschoolStudyLevelOption(lang: Language) {
    await this.clickStudyLevelOption(lang, TRANS.preschoolStudyLevel[lang]);
  }

  async fillNotifierName(lang: Language, value: string) {
    await this.fillEnrolmentFormTextBox(TRANS.name[lang], value, {
      exact: true, // Needed to avoid multiple matches e.g. "Name" and "Group name"
    });
  }

  async fillNotifierEmail(lang: Language, value: string) {
    await this.fillEnrolmentFormTextBox(TRANS.emailAddress[lang], value);
  }

  async fillNotifierPhoneNumber(lang: Language, value: string) {
    await this.fillEnrolmentFormTextBox(TRANS.phoneNumber[lang], value);
  }

  async checkEnrolmentFormCheckBox(name: EnrolmentFormCheckBox) {
    const checkBox = this.enrolmentForm.getByRole('checkbox', { name });
    await checkBox.check();
  }

  async fillEnrolmentFormTextBox(
    name: EnrolmentFormTextBox,
    value: string,
    options?: GetByRoleOptions
  ) {
    const textBox = this.enrolmentForm.getByRole('textbox', {
      name,
      ...options,
    });
    await textBox.click(); // First click to focus/open the text box
    await textBox.fill(value);
  }

  async selectDaycareKamppiForStudyGroupUnit(lang: Language) {
    const daycareKamppi = TRANS.daycareKamppiStudyGroupUnit[lang];
    await this.searchStudyGroupUnitsWithText(lang, daycareKamppi);
    await this.selectStudyGroupUnitFromResults(daycareKamppi);
  }

  async selectPreschoolForStudyLevel(lang: Language) {
    await this.openStudyLevelDropdown(lang);
    await this.clickPreschoolStudyLevelOption(lang);
  }

  async fillEnrolmentFormSpinButton(
    name: EnrolmentFormSpinButton,
    value: string
  ) {
    const spinButton = this.enrolmentForm.getByRole('spinbutton', { name });
    await spinButton.fill(value);
  }

  async acceptDataSharing(lang: Language) {
    await this.checkEnrolmentFormCheckBox(TRANS.acceptDataSharing[lang]);
  }

  async submitReservationEnquiry(lang: Language) {
    await this.clickEnrolmentFormButton(TRANS.submitEnquiry[lang]);
  }

  async fillStudyGroupName(lang: Language, value: string) {
    await this.fillEnrolmentFormTextBox(TRANS.group[lang], value);
  }

  async selectNumberOfChildren(lang: Language, value: string) {
    await this.fillEnrolmentFormSpinButton(TRANS.children[lang], value);
  }

  async selectNumberOfAdults(lang: Language, value: string) {
    await this.fillEnrolmentFormSpinButton(TRANS.adults[lang], value);
  }

  async fillAdditionalInfo(lang: Language, value: string) {
    await this.fillEnrolmentFormTextBox(TRANS.additionalInfo[lang], value);
  }

  async isReservationEnquirySent(lang: Language) {
    await this.hasVisibleHeading(TRANS.reservationEnquirySent[lang]);
  }

  async mockEventDetails() {
    await this.mockGraphQL('Event', MOCK_EVENT_QUERY_RESPONSE);
  }

  async mockDaycareKamppiIntoStudyGroupUnits() {
    await this.mockGraphQL(
      'SchoolsAndKindergartensList',
      MOCK_SCHOOLS_AND_KINDERGARTENS_LIST_QUERY_RESPONSE
    );
  }

  async mockStudyLevels() {
    await this.mockGraphQL('StudyLevels', MOCK_STUDY_LEVELS_QUERY_RESPONSE);
  }

  async mockEnrolOccurrenceMutation() {
    await this.mockGraphQL(
      'EnrolOccurrence',
      MOCK_ENROL_OCCURRENCE_MUTATION_RESPONSE
    );
  }

  /**
   * Wait for study group unit list to load with at least a single option.
   */
  protected async hasLoadedStudyGroupUnits(lang: Language) {
    const loading = TRANS.autoSuggestLoading[lang];
    const noResults = TRANS.autoSuggestNoResults[lang];

    // Loop twice because the order of "Loading" and "No results" is unknown and
    // thus waiting for them in the wrong order could make the waiting ineffective.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of [1, 2]) {
      await expect(this.enrolmentForm.getByText(loading)).not.toBeVisible();
      await expect(this.enrolmentForm.getByText(noResults)).not.toBeVisible();
    }
  }

  protected async selectStudyGroupUnitFromResults(name: StudyGroupUnitOption) {
    const option = this.enrolmentForm.getByRole('option', { name });
    await option.click();
  }

  protected async searchStudyGroupUnitsWithText(
    lang: Language,
    value: StudyGroupUnitOption
  ) {
    await this.fillEnrolmentFormTextBox(TRANS.studyGroupUnit[lang], value);
    await this.hasLoadedStudyGroupUnits(lang);
  }
}
