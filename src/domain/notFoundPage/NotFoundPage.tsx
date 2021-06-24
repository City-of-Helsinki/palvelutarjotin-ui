import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import ErrorPage from '../errorPage/ErrorPage';

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation();

  return <ErrorPage title={t('common:notFound.textNotFound')} />;
};

export default NotFoundPage;
