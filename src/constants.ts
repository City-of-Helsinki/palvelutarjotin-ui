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

export const FEEDBACK_LINKS = {
  fi: 'https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/osallistu-ja-vaikuta/palaute',
  en: 'https://www.hel.fi/helsinki/en/administration/participate/feedback',
  sv: 'https://www.hel.fi/helsinki/sv/stad-och-forvaltning/delta/feedback',
};

export const PROVIDER_UI_LINKS = {
  fi: 'https://provider.kultus.fi',
  en: 'https://provider.kultus.fi/en',
  sv: 'https://provider.kultus.fi/sv',
};
