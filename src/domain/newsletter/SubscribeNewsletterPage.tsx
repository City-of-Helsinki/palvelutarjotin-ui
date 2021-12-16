import axios from 'axios';
import { FormikHelpers } from 'formik';
import { Notification } from 'hds-react';
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
  const [notification, setNotification] = React.useState<JSX.Element | null>(
    null
  );
  const [notificationAutoCloseOpen, setNotificationAutoCloseOpen] =
    React.useState(false);

  const notificationOnClose = () => {
    setNotificationAutoCloseOpen(false);
    setNotification(null);
  };

  const successfulNotification = (
    <Notification
      type="success"
      label={t('newsletter:newsletterSubscribeForm.subscribeSuccessLabel')}
      position="top-right"
      autoClose
      onClose={notificationOnClose}
    >
      {t('newsletter:newsletterSubscribeForm.subscribeSuccess')}
    </Notification>
  );

  const errorNotification = (
    <Notification
      type="error"
      label={t('newsletter:newsletterSubscribeForm.subscribeFailedLabel')}
      position="top-right"
      autoClose
      onClose={notificationOnClose}
    />
  );

  const handleSubmit = async (
    values: NewsletterSubscribeFormFields,
    actions: FormikHelpers<NewsletterSubscribeFormFields>
  ) => {
    Promise.all(
      values.groups.map((group) =>
        axios.post(
          ROUTES.NEWSLETTER_SUBSCRIBE_API.replace(':group', group),
          convertSubscribeFormData(values)
        )
      )
    )
      .then(() => {
        actions.resetForm();
        setNotification(successfulNotification);
        setNotificationAutoCloseOpen(true);
      })
      .catch((e) => {
        setNotification(errorNotification);
        setNotificationAutoCloseOpen(true);
      });
  };

  return (
    <PageWrapper title={t('newsletter:subscribeNewsletterPage.pageTitle')}>
      <div className={styles.subscribeNewsletter}>
        <Container>
          <h2>{t('newsletter:subscribeNewsletterPage.pageTitle')}</h2>
          {notificationAutoCloseOpen && notification}
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
