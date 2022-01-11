import axios from 'axios';
import { FormikHelpers, FormikState } from 'formik';
import { Notification } from 'hds-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { convertSubscribeFormData } from '../../clients/gruppo/lib/subscribers';
import TextWithLineBreaks from '../../common/components/textWithLineBreaks/TextWithLineBreaks';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import {
  NewsletterGroupId,
  NewsletterSubscribeFormFields,
} from './newsletterSubscribeForm/constants';
import NewsletterSubscribeForm, {
  defaultInitialValues,
} from './newsletterSubscribeForm/NewsletterSubscribeForm';
import styles from './subscribeNewsletterPage.module.scss';

const SubscribeNewsletterPage: React.FC = () => {
  const { t } = useTranslation();
  const [notificationType, setNotificationType] = React.useState<
    | 'subscribeSuccess'
    | 'subscribeError'
    | 'deleteSuccess'
    | 'deleteError'
    | null
  >(null);

  const notificationOnClose = () => {
    setNotificationType(null);
  };

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
        setNotificationType('subscribeSuccess');
      })
      .catch((e) => {
        setNotificationType('subscribeError');
      });
  };

  const handleDeleteAccount = async (
    email: string,
    resetForm: (
      nextState?:
        | Partial<FormikState<NewsletterSubscribeFormFields>>
        | undefined
    ) => void
  ) => {
    Promise.all(
      Object.values(NewsletterGroupId).map((group) =>
        axios.delete(
          `${ROUTES.NEWSLETTER_SUBSCRIBE_API.replace(
            ':group',
            group
          )}?email=${email}`
        )
      )
    )
      .then(() => {
        resetForm();
        setNotificationType('deleteSuccess');
      })
      .catch((e) => {
        setNotificationType('deleteError');
      });
  };

  const SuccessNotification: React.FC<{
    label: string;
    message?: string;
  }> = ({ label, message }) => (
    <Notification
      type="success"
      label={label}
      position="top-right"
      autoClose
      onClose={notificationOnClose}
    >
      {message}
    </Notification>
  );

  const ErrorNotification: React.FC<{
    label: string;
    message?: string;
  }> = ({ label, message }) => (
    <Notification
      type="success"
      label={label}
      position="top-right"
      autoClose
      onClose={notificationOnClose}
    >
      {message}
    </Notification>
  );

  return (
    <PageWrapper title={t('newsletter:subscribeNewsletterPage.pageTitle')}>
      <div className={styles.subscribeNewsletter}>
        <Container>
          <h2>{t('newsletter:subscribeNewsletterPage.pageTitle')}</h2>
          {notificationType === 'subscribeSuccess' && (
            <SuccessNotification
              label={t('newsletter:newsletterSubscribeForm.subscribeSuccess')}
              message={t(
                'newsletter:newsletterSubscribeForm.subscribeSuccessLabel'
              )}
            />
          )}
          {notificationType === 'deleteSuccess' && (
            <SuccessNotification
              label={t('newsletter:newsletterSubscribeForm.deleteSuccess')}
              message={t(
                'newsletter:newsletterSubscribeForm.deleteSuccessLabel'
              )}
            />
          )}
          {notificationType === 'subscribeError' && (
            <ErrorNotification
              label={t(
                'newsletter:newsletterSubscribeForm.subscribeFailedLabel'
              )}
            />
          )}
          {notificationType === 'deleteError' && (
            <ErrorNotification
              label={t('newsletter:newsletterSubscribeForm.deleteFailedLabel')}
            />
          )}
          <TextWithLineBreaks
            as="p"
            text={t('newsletter:subscribeNewsletterPage.leadText')}
          />
          <NewsletterSubscribeForm
            initialValues={defaultInitialValues}
            onSubmit={handleSubmit}
            onDeleteAccount={handleDeleteAccount}
          />
        </Container>
      </div>
    </PageWrapper>
  );
};

export default SubscribeNewsletterPage;
