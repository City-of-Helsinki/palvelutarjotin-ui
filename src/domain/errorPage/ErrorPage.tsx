import { Button, IconInfoCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../hooks/useLocale';
import { Router } from '../../i18n';
import Container from '../app/layout/Container';
import styles from './errorPage.module.scss';

const ErrorPage: React.FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => {
  const locale = useLocale();
  const { t } = useTranslation();

  const goToFrontPage = () => {
    Router.push(`/${locale}`);
  };

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <IconInfoCircle size="l" />
        <h1>{title || t('common:errorPage.title')}</h1>
        <p className={styles.description}>
          {description || t('common:errorPage.description')}
        </p>
        <Button onClick={goToFrontPage}>{t('errorPage.returnToHome')}</Button>
      </div>
    </Container>
  );
};

export default ErrorPage;
