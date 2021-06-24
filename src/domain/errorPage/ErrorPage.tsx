import { Button, IconInfoCircle } from 'hds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import Container from '../app/layout/Container';
import { ROUTES } from '../app/routes/constants';
import styles from './errorPage.module.scss';

const ErrorPage: React.FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const goToFrontPage = () => {
    router.push(ROUTES.HOME);
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
