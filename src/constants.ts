import { Language } from 'react-helsinki-headless-cms';

export const IS_CLIENT = typeof window !== 'undefined';

export enum FORM_NAMES {
  ENROLMENT_FORM = 'enrolment-form',
}

export enum LOCAL_STORAGE {
  RECOMMENDED_EVENTS_VARIABLES = 'recommended-events-variables',
}

export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
}

export enum EVENT_LANGUAGES {
  AR = 'ar',
  EN = 'en',
  FI = 'fi',
  RU = 'ru',
  SV = 'sv',
  ZH_HANS = 'zh_hans',
}

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export const ALL_I18N_NAMESPACES = [
  'common',
  'footer',
  'header',
  'enrolment',
  'event',
  'events',
  'form',
  'occurrence',
  'cms',
  'newsletter',
];

export const PRIVACY_POLICY_LINKS = {
  fi: 'https://www.hel.fi/static/liitteet/kanslia/rekisteriselosteet/Kuva/Kuva-EU-Palvelutarjotin.pdf',
  en: 'https://www.hel.fi/static/liitteet/kanslia/rekisteriselosteet/Kuva/Kuva-EU-Palvelutarjotin.pdf',
  sv: 'https://www.hel.fi/static/liitteet/kanslia/rekisteriselosteet/Kuva/Kuva-EU-Palvelutarjotin-SV.pdf',
};

export const ADMIN_EMAIL = {
  fi: 'kultus@hel.fi',
  en: 'kultus@hel.fi',
  sv: 'kultus@hel.fi',
};

export const DEFAULT_FOOTER_MENU_NAME: Record<Language, string> = {
  fi:
    process.env.NEXT_PUBLIC_CMS_FOOTER_MENU_NAME_FI ??
    'Palvelutarjotin-UI Footer (FI)',
  en:
    process.env.NEXT_PUBLIC_CMS_FOOTER_MENU_NAME_EN ??
    'Palvelutarjotin-UI Footer (EN)',
  sv:
    process.env.NEXT_PUBLIC_CMS_FOOTER_MENU_NAME_SV ??
    'Palvelutarjotin-UI Footer (SV)',
};
