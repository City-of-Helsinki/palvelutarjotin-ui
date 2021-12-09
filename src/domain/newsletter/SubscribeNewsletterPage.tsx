import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import TextWithLineBreaks from '../../common/components/textWithLineBreaks/TextWithLineBreaks';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import NewsletterSubscribeForm, {
  defaultInitialValues,
  NewsletterSubscribeFormFields,
} from './newsletterSubscribeForm/NewsletterSubscribeForm';
import styles from './subscribeNewsletterPage.module.scss';

const SubscribeNewsletterPage: React.FC = () => {
  const { t } = useTranslation();

  const handleSubmit = async (values: NewsletterSubscribeFormFields) => {
    try {
      toast(t('newsletter:newsletterSubscribeForm.subscribeSuccess'), {
        type: toast.TYPE.SUCCESS,
      });
    } catch (error) {
      toast(t('newsletter:newsletterSubscribeForm.subscribeFailed'), {
        type: toast.TYPE.ERROR,
      });
    }
  };

  return (
    <PageWrapper title={t('newsletter:subscribeNewsletterPage.pageTitle')}>
      <div className={styles.subscribeNewsletter}>
        <Container>
          <h2>{t('newsletter:subscribeNewsletterPage.pageTitle')}</h2>
          <TextWithLineBreaks
            as="p"
            text={t('newsletter:subscribeNewsletterPage.leadText')}
          />
          <NewsletterSubscribeForm
            initialValues={defaultInitialValues}
            onSubmit={handleSubmit}
          />
        </Container>
      </div>
    </PageWrapper>
  );
};

export default SubscribeNewsletterPage;
