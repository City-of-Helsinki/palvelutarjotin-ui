import type { ContentSource } from 'hds-react';
import { CookieModal } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import useLocale from '../../hooks/useLocale';
import { MAIN_CONTENT_ID } from '../app/layout/PageLayout';

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
};

const CookieConsent: React.FC<Props> = ({ appName, allowLanguageSwitch }) => {
  const locale = useLocale();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] =
    React.useState<ContentSource['currentLanguage']>(locale);

  const [showCookieConsentModal, setShowCookieConsentModal] =
    React.useState(true);

  const onLanguageChange = React.useCallback(
    (newLang: string) => {
      if (allowLanguageSwitch) {
        setLanguage(newLang as ContentSource['currentLanguage']);
        i18n.changeLanguage(newLang);
      }
    },
    [i18n, setLanguage, allowLanguageSwitch]
  );
  const contentSource: ContentSource = React.useMemo(
    () => ({
      siteName: appName,
      onAllConsentsGiven: () => {
        setShowCookieConsentModal(false);
      },
      currentLanguage: language as string as ContentSource['currentLanguage'],
      requiredCookies: {
        groups: [
          {
            commonGroup: 'essential',
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
                id: 'matomo',
                name: '_pk*',
                hostName: 'digia.fi',
                description: t('common:consent.cookies.matomo'),
                expiration: t('common:consent.expiration.days', { days: 393 }),
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
        groups: [
          {
            title: t('common:consent.groups.servicemap.title'),
            text: t('common:consent.groups.servicemap.text'),
            expandAriaLabel: t(
              'common:consent.groups.servicemap.expandAriaLabel'
            ),
            checkboxAriaDescription: t(
              'common:consent.groups.servicemap.checkboxAriaDescription'
            ),
            cookies: [
              {
                id: 'servicemap_analytics',
                name: '_pk.fi*',
                hostName: 'palvelukartta.hel.fi',
                description: t('common:consent.cookies.servicemap_analytics'),
                expiration: t('common:consent.expiration.days', { days: 393 }),
              },
              {
                id: 'servicemap_session',
                name: 'ADRUM',
                hostName: 'palvelukartta.hel.fi',
                description: t('common:consent.cookies.servicemap_session'),
                expiration: t('common:consent.expiration.session'),
              },
              {
                id: 'servicemap_ga',
                name: '_ga*',
                hostName: 'palvelukartta.hel.fi',
                description: t('common:consent.cookies.servicemap_ga'),
                expiration: t('common:consent.expiration.session'),
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
    [t, language, appName, onLanguageChange]
  );

  if (!showCookieConsentModal) return null;

  return <CookieModal contentSource={contentSource} />;
};

export default CookieConsent;
