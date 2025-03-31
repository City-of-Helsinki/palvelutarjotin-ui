import { Koros } from 'hds-react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './eventsPage.module.scss';
import { usePopularKeywordsQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import type { I18nNamespace } from '../../types';
import localizedString from '../../utils/getLocalisedString';
import Container from '../app/layout/Container';
import { ROUTES } from '../app/routes/constants';

/**
 * Fetch a list of popular keywords and a list of links.
 * NOTE: a list of popular keywords will update eventually,
 * so it does not make sense to load it with SSR, meaning
 * the query hook is configured with `ssr: false`.
 */
export const PopularKeywords: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation<I18nNamespace>();
  const { data } = usePopularKeywordsQuery({
    variables: {
      amount: 10,
      showAllKeywords: true,
    },
    ssr: false, // Updated regularly
  });
  const popularKeywords = data?.popularKultusKeywords?.data;

  return (
    <div className={styles.popularKeywords}>
      <div className={styles.popularKeywordsSection}>
        <Container>
          {popularKeywords && (
            <h2>{t('events:titlePopularEventCategories')}</h2>
          )}
          <div className={styles.keywordsList}>
            {popularKeywords?.map((keyword) => (
              <NextLink
                legacyBehavior
                key={keyword.id}
                href={{
                  pathname: ROUTES.EVENTS_SEARCH,
                  query: keyword.id ? { categories: [keyword.id] } : null,
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{localizedString(keyword.name, locale)}</a>
              </NextLink>
            ))}
          </div>
        </Container>
      </div>
      <Koros className={styles.korosBottom} />
    </div>
  );
};
