import Link from 'next/link';
import { useTranslation, Trans } from 'next-i18next';
import React, { ReactElement } from 'react';

import ErrorPage from '../errorPage/ErrorPage';

interface RootLinkProps {
  children?: React.ReactNode;
}

const RootLink = ({ children }: RootLinkProps) => (
  <Link href="/">
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a>{children}</a>
  </Link>
);

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation();

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
