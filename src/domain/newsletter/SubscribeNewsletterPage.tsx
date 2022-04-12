import axios from 'axios';
import { FormikHelpers } from 'formik';
import { IconLinkExternal, Notification } from 'hds-react';
import Link from 'next/link';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { convertSubscribeFormData } from '../../clients/gruppo/lib/subscribers';
import { ADMIN_EMAIL, PRIVACY_POLICY_LINKS } from '../../constants';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import { NewsletterSubscribeFormFields } from './newsletterSubscribeForm/constants';
import NewsletterSubscribeForm, {
  defaultInitialValues,
} from './newsletterSubscribeForm/NewsletterSubscribeForm';
import styles from './subscribeNewsletterPage.module.scss';

const PrivacyStatementLink = ({
  url,
  children,
  ...rest
}: {
  url: string;
  children?: React.ReactNode;
} & React.HTMLProps<HTMLAnchorElement>) => (
  <Link href={url} passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a {...rest}>
      {children}
      <IconLinkExternal className={styles.privacyStatementIcon} />
    </a>
  </Link>
);

const SubscribeNewsletterPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [notificationType, setNotificationType] = React.useState<
    'success' | 'error' | null
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
        setNotificationType('success');
      })
      .catch((e) => {
        setNotificationType('error');
      });
  };

  return (
    <PageWrapper title={t('newsletter:subscribeNewsletterPage.pageTitle')}>
      <div className={styles.subscribeNewsletter}>
        <Container>
          <h2>{t('newsletter:subscribeNewsletterPage.pageTitle')}</h2>
          {notificationType === 'success' && (
            <Notification
              type="success"
              label={t(
                'newsletter:newsletterSubscribeForm.subscribeSuccessLabel'
              )}
              position="top-right"
              autoClose
              onClose={notificationOnClose}
            >
              {t('newsletter:newsletterSubscribeForm.subscribeSuccess')}
            </Notification>
          )}
          {notificationType === 'error' && (
            <Notification
              type="error"
              label={t(
                'newsletter:newsletterSubscribeForm.subscribeFailedLabel'
              )}
              position="top-right"
              autoClose
              onClose={notificationOnClose}
            />
          )}
          <div>
            <Trans
              i18nKey="newsletter:subscribeNewsletterPage.leadText"
              values={{
                openInNewTab: t('common:srOnly.opensInANewTab'),
                adminMail: ADMIN_EMAIL[locale],
              }}
              components={{
                PrivacyStatementLink: (
                  <PrivacyStatementLink
                    url={PRIVACY_POLICY_LINKS[locale]}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                MailToAdminLink: <a href={`mailto:${ADMIN_EMAIL[locale]}`} />,
                Paragraph: <p />,
              }}
            />
          </div>

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
