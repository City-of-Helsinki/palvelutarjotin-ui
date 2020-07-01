import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../errorPage/ErrorPage';

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation();

  return <ErrorPage title={t('common:notFound.textNotFound')} />;
};

export default NotFoundPage;
