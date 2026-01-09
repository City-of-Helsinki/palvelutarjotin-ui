// TODO: Component disabled - needs migration to hds-react v4 CookieBanner API
// CookieModal has been removed in hds-react v4
import React from 'react';

// Imports commented out until migration is complete
// import { useMatomo } from '@jonkoops/matomo-tracker-react';
// import { useCookies } from 'hds-react';
// import { useTranslation } from 'next-i18next';
// import { useCallback } from 'react';
// import useLocale from '../../hooks/useLocale';
// import type { I18nNamespace } from '../../types';
// import { MAIN_CONTENT_ID } from '../app/layout/PageLayout';

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
};

// Type definition kept for reference during migration to hds-react v4 CookieBanner API
/*
type ContentSource = {
  currentLanguage: string;
  siteName: string;
  texts: any;
  onAllConsentsGiven: () => void;
  requiredCookies: any;
  optionalCookies: any;
  focusTargetSelector: string;
  onLanguageChange: (lang: string) => void;
};
*/

const CookieConsent: React.FC<Props> = () => {
  // TODO: Migrate to hds-react v4 CookieBanner API
  // The CookieModal component has been removed in hds-react v4
  // and replaced with CookieBanner, useCookieConsent, etc.
  // For now, cookie consent is disabled.
  // eslint-disable-next-line no-console
  console.warn(
    'CookieConsent: Migration to hds-react v4 CookieBanner API required'
  );

  // Temporarily disable until proper migration
  return null;

  /* Previous implementation - kept for reference during migration to hds-react v4 CookieBanner API
  
  const contentSource: ContentSource = React.useMemo(
    () => ({
      siteName: appName,
      texts: {
        sections: {
          main: {
            text: t('common:consent.texts.sections.main.text'),
          },
        },
        ui: {
          approveOnlyRequiredConsents: t(
            'common:consent.texts.ui.approveOnlyRequiredConsents'
          ),
          hideSettings: t('common:consent.texts.ui.hideSettings'),
        },
      },
      onAllConsentsGiven: () => {
        setShowCookieConsentModal(false);
        handleMatomoUpdate();
      },
      currentLanguage: language as string as ContentSource['currentLanguage'],
      requiredCookies: {
        title: t('common:consent.required.title'),
        text: t('common:consent.required.text'),
        groups: [
          {
            id: 'essential-custom',
            title: t('common:consent.groups.essential.title'),
            text: t('common:consent.groups.essential.text'),
            cookies: [
              {
                id: 'wordpress',
                name: 'wordpress_*, wp-settings-*',
                hostName: 'api.hel.fi',
                description: t('common:consent.cookies.wordpress'),
                expiration: t('common:consent.expiration.session'),
              },
              {
                id: 'linkedevents',
                name: 'linkedevents-api-prod-csrftoken',
                hostName: 'api.hel.fi',
                description: t('common:consent.cookies.linkedevents'),
                expiration: t('common:consent.expiration.year'),
              },
              {
                id: 'i18next',
                name: 'i18next',
                hostName: 'api.hel.fi',
                description: t('common:consent.cookies.i18next'),
                expiration: t('common:consent.expiration.session'),
              },
            ],
          },
        ],
      },
      optionalCookies: {
        title: t('common:consent.optional.title'),
        groups: [
          {
            title: t('common:consent.groups.matomo.title'),
            text: t('common:consent.groups.matomo.text'),
            expandAriaLabel: t('common:consent.groups.matomo.expandAriaLabel'),
            checkboxAriaDescription: t(
              'common:consent.groups.matomo.checkboxAriaDescription'
            ),
            cookies: [
              {
                id: 'matomo',
                name: '_pk*',
                hostName: 'digia.fi',
                description: t('common:consent.cookies.matomo'),
                expiration: t('common:consent.expiration.days', { days: 393 }),
              },
            ],
          },
        ],
      },
      language: {
        current: language,
        onLanguageChange,
      },
      focusTargetSelector: MAIN_CONTENT_ID,
    }),
    [t, language, appName, onLanguageChange, handleMatomoUpdate]
  );

  if (!showCookieConsentModal) return null;
  return <CookieModal contentSource={contentSource} />;
  */
};

export default CookieConsent;
