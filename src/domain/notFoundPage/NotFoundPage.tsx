import NextLink from 'next/link';
import { useTranslation, Trans } from 'next-i18next';
import React, { ReactElement } from 'react';

import type { I18nNamespace } from '../../types';
import ErrorPage from '../errorPage/ErrorPage';

interface RootLinkProps {
  children?: React.ReactNode;
}

const RootLink = ({ children }: RootLinkProps) => (
  <NextLink legacyBehavior href="/">
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a>{children}</a>
  </NextLink>
);

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation<I18nNamespace>();

  return (
    <ErrorPage
      title={t('common:notFound.textNotFound')}
      description={
        <Trans
          i18nKey="common:notFound.textNotFoundDescription"
          components={{
            a: <RootLink />,
          }}
        />
      }
    />
  );
};

export default NotFoundPage;
