import type { Locator, Page } from '@playwright/test';

import { Language } from '../../types';
import { LANGUAGES } from '../constants';
import { expect } from '../testWithFixtures';
import { BasePage } from './base.page';
import { Translation } from '../types';

// Translations for the event page
const TRANS = {
  adults: {
    fi: 'Aikuisia *',
    sv: 'Vuxna *',
    en: 'Adults *',
  },
  acceptDataSharing: {
    fi: 'Hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa',
    sv: 'Jag samtycker till att dela mina uppgifter med arrangören av evenemanget',
    en: 'I agree to share my information with the event organizer',
  },
  additionalInfo: {
    fi: 'Lisätiedot',
    sv: 'Ytterligare information',
    en: 'Additional information',
  },
  autoSuggestLoading: {
    fi: 'Ladataan',
    sv: 'Laddning',
    en: 'Loading',
  },
  autoSuggestNoResults: {
    fi: 'Ei tuloksia',
    sv: 'Inga resultat',
    en: 'No results',
  },
  children: {
    fi: 'Lapsia *',
    sv: 'Barn *',
    en: 'Children *',
  },
  emailAddress: {
    fi: 'Sähköpostiosoite *',
    sv: 'E-post *',
    en: 'Email address *',
  },
  group: {
    fi: /^Ryhmä \*/,
    sv: /^Grupp \*/,
    en: /^Group name \*/,
  },
  name: {
    fi: /^Nimi \*/,
    sv: /^Namn \*/,
    en: /^Name \*/,
  },
  phoneNumber: {
    fi: 'Puhelinnumero *',
    sv: 'Telefonnummer *',
    en: 'Phone number *',
  },
  preschoolStudyLevel: {
    fi: '5-6 -vuotiaat',
    sv: '5-6 åringar',
    en: '5-6 aged',
  },
  reservationEnquiry: {
    fi: 'Varaustiedustelu',
    sv: 'Bokningsförfrågan',
    en: 'Reservation enquiry',
  },
  reservationEnquirySent: {
    fi: 'Varaustiedustelu lähetetty',
    sv: 'Bokningsförfrågan skickad',
    en: 'Reservation enquiry sent',
  },
  showOccurrenceDetails: {
    fi: 'Näytä tapahtuma-ajan lisätiedot',
    sv: 'Visa tidpunkten för evenemanget',
    en: 'Show occurrence details',
  },
  studyGroupUnit: {
    fi: 'Päiväkoti / koulu / oppilaitos',
    sv: 'Daghem / skola / läroanstalt',
    en: 'Kindergarten / school / college',
  },
  daycareKamppiStudyGroupUnit: {
    fi: 'Päiväkoti Kamppi',
    sv: 'Daghemmet Kamppi',
    en: 'Daycare Kamppi',
  },
  studyLevel: {
    fi: 'Luokka-aste *',
    sv: 'Årskurs *',
    en: 'Grade level *',
  },
  submitEnquiry: {
    fi: 'Lähetä varaustiedustelu',
    sv: 'Skicka anmälan',
    en: 'Submit enquiry',
  },
} as const satisfies Record<string, Translation>;

type TranslationsOf<Keys extends keyof typeof TRANS> =
  (typeof TRANS)[Keys][Language];

type EnrolmentFormButton = TranslationsOf<'submitEnquiry'>;
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

  async clickEnrolmentFormCombobox() {
    // Study level field is a combobox - just get the first one (should be the study level)
    // The aria-label changes dynamically, so we can't match by exact name
    const combobox = this.enrolmentForm.getByRole('combobox').first();
    await combobox.click();
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

  async openStudyLevelDropdown() {
    await this.clickEnrolmentFormCombobox();
  }

  async clickStudyLevelOption(lang: Language, name: StudyLevelOption) {
    // The listbox doesn't have a reliable name attribute, just get the visible listbox
    const listbox = this.enrolmentForm.getByRole('listbox').first();

    await listbox.getByRole('option', { name }).click();
  }

  async clickPreschoolStudyLevelOption(lang: Language) {
    await this.clickStudyLevelOption(lang, TRANS.preschoolStudyLevel[lang]);
  }

  async fillNotifierName(lang: Language, value: string) {
    await this.fillEnrolmentFormTextBox(TRANS.name[lang], value);
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

  async fillEnrolmentFormTextBox(name: EnrolmentFormTextBox, value: string) {
    const textBox = this.enrolmentForm.getByRole('textbox', { name });
    await textBox.click(); // First click to focus/open the text box
    await textBox.fill(value);
  }

  async selectDaycareKamppiForStudyGroupUnit(lang: Language) {
    const daycareKamppi = TRANS.daycareKamppiStudyGroupUnit[lang];
    await this.searchStudyGroupUnitsWithText(lang, daycareKamppi);
    await this.selectStudyGroupUnitFromResults(daycareKamppi);
  }

  async selectPreschoolForStudyLevel(lang: Language) {
    await this.openStudyLevelDropdown();
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
