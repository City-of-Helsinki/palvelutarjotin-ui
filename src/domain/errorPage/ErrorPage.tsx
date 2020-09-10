import { Button, IconInfoCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Router } from '../../i18n';
import Container from '../app/layout/Container';
import { ROUTES } from '../app/routes/constants';
import styles from './errorPage.module.scss';

const ErrorPage: React.FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => {
  const { t } = useTranslation();

  const goToFrontPage = () => {
    Router.push(ROUTES.HOME);
  };

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <IconInfoCircle size="l" />
        <h1>{title || t('common:errorPage.title')}</h1>
        <p className={styles.description}>
          {description || t('common:errorPage.description')}
        </p>
        <Button onClick={goToFrontPage}>
          {t('common:errorPage.returnToHome')}
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPage;
