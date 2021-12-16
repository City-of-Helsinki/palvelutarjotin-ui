import axios from 'axios';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { convertSubscribeFormData } from '../../clients/gruppo/lib/subscribers';
import TextWithLineBreaks from '../../common/components/textWithLineBreaks/TextWithLineBreaks';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import { NewsletterSubscribeFormFields } from './newsletterSubscribeForm/constants';
import NewsletterSubscribeForm, {
  defaultInitialValues,
} from './newsletterSubscribeForm/NewsletterSubscribeForm';
import styles from './subscribeNewsletterPage.module.scss';

const SubscribeNewsletterPage: React.FC = () => {
  const { t } = useTranslation();

  const handleSubmit = async (values: NewsletterSubscribeFormFields) => {
    Promise.all(
      values.groups.map((group) =>
        axios.post(
          ROUTES.NEWSLETTER_SUBSCRIBE_API.replace(':group', group),
          convertSubscribeFormData(values)
        )
      )
    )
      .then(() => {
        toast(t('newsletter:newsletterSubscribeForm.subscribeSuccess'), {
          type: toast.TYPE.SUCCESS,
        });
      })
      .catch((e) => {
        toast(t('newsletter:newsletterSubscribeForm.subscribeFailed'), {
          type: toast.TYPE.ERROR,
        });
      });
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