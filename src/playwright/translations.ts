import { Translation } from './types';
import { Language } from '../types';

// Translations used by the Playwright tests.
export const TRANS = {
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
    fi: 'Ryhmä *',
    sv: 'Grupp *',
    en: 'Group name *',
  },
  name: {
    fi: 'Nimi *',
    sv: 'Namn *',
    en: 'Name *',
  },
  openEventPrefix: {
    fi: 'Siirry tapahtumaan: ',
    sv: 'Gå till evenemang: ',
    en: 'Go to event: ',
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

export type TranslationsOf<Keys extends keyof typeof TRANS> =
  (typeof TRANS)[Keys][Language];
