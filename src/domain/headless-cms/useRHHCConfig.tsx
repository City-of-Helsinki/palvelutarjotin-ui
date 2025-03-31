import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  Config,
  defaultConfig as rhhcDefaultConfig,
} from 'react-helsinki-headless-cms';

import AppConfig from './config';
import { getRoutedInternalHrefForLocale } from './utils';
import useLocale from '../../hooks/useLocale';
import type { I18nNamespace } from '../../types';
import getLanguageCode from '../../utils/getCurrentLanguageCode';

const CMS_API_DOMAIN = AppConfig.cmsOrigin;
const APP_DOMAIN = AppConfig.origin;
const internalHrefOrigins = [APP_DOMAIN, CMS_API_DOMAIN];

export const getIsHrefExternal = (href: string) => {
  if (href?.startsWith('/')) return false;
  return !internalHrefOrigins.some((origin) => href?.includes(origin));
};

export const useRHHCConfig = ({
  cmsApolloClient,
  eventsApolloClient,
}: {
  cmsApolloClient: ApolloClient<NormalizedCacheObject>;
  eventsApolloClient?: ApolloClient<NormalizedCacheObject>;
}) => {
  const locale = useLocale();
  const { t } = useTranslation<I18nNamespace>();
  return React.useMemo(
    (): Config => ({
      ...rhhcDefaultConfig,
      siteName: t('common:appName'),
      currentLanguageCode: getLanguageCode(locale),
      copy: {
        breadcrumbNavigationLabel: t(
          'common:breadcrumb.breadcrumbNavigationLabel'
        ),
        breadcrumbListLabel: t('common:breadcrumb.breadcrumbListLabel'),
        menuToggleAriaLabel: t('common:menu.menuToggleAriaLabel'),
        menuButtonLabel: t('common:menu.menuButtonLabel'),
        skipToContentLabel: t('common:linkSkipToContent'),
        openInExternalDomainAriaLabel: t('common:srOnly.opensInAnExternalSite'),
        openInNewTabAriaLabel: t('common:srOnly.opensInANewTab'),
        closeButtonLabelText: t('common:button.close'),
        loadMoreButtonLabelText: t('cms:archiveSearch.searchButtonLabelText'),
        showAllText: t('common:button.showAll'),
        archiveSearch: {
          title: '', // t('cms:archiveSearch.title'),
          searchTextPlaceholder: t('cms:archiveSearch.searchTextPlaceholder'),
          searchButtonLabelText: t('cms:archiveSearch.searchButtonLabelText'),
          loadMoreButtonLabelText: t(
            'cms:archiveSearch.loadMoreButtonLabelText'
          ),
          noResultsText: t('cms:archiveSearch.noResultsText'),
          noResultsTitle: t('cms:archiveSearch.noResultsTitle'),
          clearAll: t('cms:archiveSearch.buttonClearFilters'),
        },
        next: t('common:button.next'),
        previous: t('common:button.previous'),
      },
      customCopy: {
        loadMoreButtonVariant: 'primary',
        loadMoreButtonTheme: 'coat',
      },
      components: {
        ...rhhcDefaultConfig.components,
        Head: (props) => <Head {...props} />,
        Link: ({ href, ...props }) => <Link href={href || ''} {...props} />,
        EventCardContent: () => <div>TODO: EventCardContent</div>,
        ArticleCardContent: () => <div>TODO: ArticleCardContent</div>,
        VenueCardContent: () => <div>TODO: VenueCardContent</div>,
      },
      meta: {
        ...rhhcDefaultConfig.meta,
        manifestUrl: '/hds-favicon-kit/manifest.webmanifest',
      },
      fallbackImageUrls: [
        '/static/images/event_placeholder_A.jpg',
        '/static/images/event_placeholder_B.jpg',
        '/static/images/event_placeholder_C.jpg',
        '/static/images/event_placeholder_D.jpg',
      ],
      utils: {
        ...rhhcDefaultConfig.utils,
        getIsHrefExternal,
        // this does not work anymore with
        // article type as type is never passed to the function in new hcrc implementation
        getRoutedInternalHref: (link?: string | null) =>
          getRoutedInternalHrefForLocale(locale, link),
      },
      internalHrefOrigins: CMS_API_DOMAIN ? [CMS_API_DOMAIN] : [],
      apolloClient: cmsApolloClient,
      eventsApolloClient,
    }),
    [t, cmsApolloClient, eventsApolloClient, locale]
  );
};
