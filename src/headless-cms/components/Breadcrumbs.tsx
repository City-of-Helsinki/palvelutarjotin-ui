import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../../domain/app/layout/Container';
import { getCmsPath } from '../../domain/app/routes/utils';
import useLocale from '../../hooks/useLocale';
import { stripLocaleFromUri } from '../utils';
import styles from './cmsPage.module.scss';

export type Breadcrumb = { title: string; uri: string };

const Breadcrumbs: React.FC<{ breadcrumbs: Breadcrumb[] }> = ({
  breadcrumbs,
}) => {
  const locale = useLocale();
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <ul className={styles.breadcrumbList}>
        {!!breadcrumbs.length && (
          <li key="home">
            <Link href="/">{t('cms:linkFrontPage')}</Link>
          </li>
        )}
        {breadcrumbs.map((breadcrumb, index, all) => {
          const uriWithoutLocale = stripLocaleFromUri(breadcrumb.uri);
          const to = `/${locale}${getCmsPath(uriWithoutLocale)}`;
          const isLastItem = all.length === index + 1;
          return (
            <li key={breadcrumb.uri}>
              {isLastItem ? (
                breadcrumb.title
              ) : (
                <Link href={to}>{breadcrumb.title}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
};

export default Breadcrumbs;
