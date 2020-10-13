import React, { ReactElement } from 'react';

import { useTranslation } from '../../i18n';
import ErrorPage from '../errorPage/ErrorPage';

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation();

  return <ErrorPage title={t('common:notFound.textNotFound')} />;
};

export default NotFoundPage;
