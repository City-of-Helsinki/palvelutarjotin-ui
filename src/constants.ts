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
  'cms',
  'common',
  'enrolment',
  'event',
  'events',
  'footer',
  'form',
  'header',
  'newsletter',
  'occurrence',
] as const;

export const PRIVACY_POLICY_LINKS = {
  fi: 'https://hkih.production.geniem.io/uploads/sites/5/2022/11/739f5edc-rekisteriseloste-kultus.fi_.pdf',
  en: 'https://hkih.production.geniem.io/uploads/sites/5/2022/11/bf2f8d34-rekisteriseloste-kultus.fi_en.pdf',
  sv: 'https://hkih.production.geniem.io/uploads/sites/5/2022/11/0d425f44-rekisteriseloste-kultus.fi_sv.pdf',
};

export const ADMIN_EMAIL = {
  fi: 'kultus@hel.fi',
  en: 'kultus@hel.fi',
  sv: 'kultus@hel.fi',
};

export const DEFAULT_FOOTER_MENU_NAME: Record<SUPPORTED_LANGUAGES, string> = {
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

export const DEFAULT_HEADER_MENU_NAME: Record<SUPPORTED_LANGUAGES, string> = {
  fi:
    process.env.NEXT_PUBLIC_CMS_HEADER_MENU_NAME_FI ??
    'Palvelutarjotin all UIs Header (FI)',
  en:
    process.env.NEXT_PUBLIC_CMS_HEADER_MENU_NAME_EN ??
    'Palvelutarjotin all UIs Header (EN)',
  sv:
    process.env.NEXT_PUBLIC_CMS_HEADER_MENU_NAME_SV ??
    'Palvelutarjotin all UIs Header (SV)',
};

export const TOAST_AUTO_CLOSE_DURATION_MS = 10_000;

// Check recommended formats: https://hds.hel.fi/guidelines/data-formats

export const DATE_FORMAT = 'd.M.yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;
export const TIMEZONE = 'Europe/Helsinki';
