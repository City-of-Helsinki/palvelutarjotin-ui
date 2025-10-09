import * as matomo from '@socialgouv/matomo-next';
import type { ContentSource } from 'hds-react';
import { CookieModal } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React, { useCallback } from 'react';

import useLocale from '../../hooks/useLocale';
import type { I18nNamespace } from '../../types';
import { MAIN_CONTENT_ID } from '../app/layout/PageLayout';

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
};

const CookieConsent: React.FC<Props> = ({ appName, allowLanguageSwitch }) => {
  const locale = useLocale();
  const { t, i18n } = useTranslation<I18nNamespace>();
  const [language, setLanguage] =
    React.useState<ContentSource['currentLanguage']>(locale);
  const [showCookieConsentModal, setShowCookieConsentModal] =
    React.useState(true);

  const onLanguageChange = useCallback(
    (newLang: string) => {
      if (allowLanguageSwitch) {
        setLanguage(newLang as ContentSource['currentLanguage']);
        i18n.changeLanguage(newLang);
      }
    },
    [i18n, setLanguage, allowLanguageSwitch]
  );

  const onAllConsentsGiven: ContentSource['onAllConsentsGiven'] = (
    consents
  ) => {
    setShowCookieConsentModal(false);

    if (consents.matomo) {
      matomo.push(['setConsentGiven']);
      matomo.push(['setCookieConsentGiven']);
    } else {
      matomo.push(['forgetCookieConsentGiven']);
      setShowCookieConsentModal(true);
    }
  };

  const onConsentsParsed: ContentSource['onConsentsParsed'] = (consents) => {
    if (consents.matomo === undefined) {
      // tell matomo to wait for consent:
      matomo.push(['requireCookieConsent']);
      matomo.push(['requireConsent']);
    } else if (consents.matomo === false) {
      matomo.push(['forgetConsentGiven']);
    }
  };

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
      onAllConsentsGiven,
      onConsentsParsed,
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
            commonGroup: 'statistics',
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
          // {
          //   title: t('common:consent.groups.matomo.title'),
          //   text: t('common:consent.groups.matomo.text'),
          //   expandAriaLabel: t('common:consent.groups.matomo.expandAriaLabel'),
          //   checkboxAriaDescription: t(
          //     'common:consent.groups.matomo.checkboxAriaDescription'
          //   ),
          //   cookies: [
          //     {
          //       id: 'matomo',
          //       name: '_pk*',
          //       hostName: 'digia.fi',
          //       description: t('common:consent.cookies.matomo'),
          //       expiration: t('common:consent.expiration.days', { days: 393 }),
          //     },
          //   ],
          // },
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
