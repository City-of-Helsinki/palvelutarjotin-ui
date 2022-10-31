import { Footer } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import {
  FEEDBACK_LINKS,
  PRIVACY_POLICY_LINKS,
  PROVIDER_UI_LINKS,
  TERMS_OF_SERVICE_SLUGS,
} from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { ROUTES } from '../routes/constants';
import { getCmsPagePath } from '../routes/utils';
import styles from './footer.module.scss';

const FooterSection = (): React.ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();

  const isNewsletterEnabled = isFeatureEnabled('NEWSLETTER');

  // override Footer component default behaviour which focuses skip-link

  return (
    <Footer title={t('appName')} className={styles.footer}>
      <Footer.Base
        copyrightHolder={t('footer:copyrightText')}
        copyrightText={t('footer:allRightsReservedText')}
      >
        <Footer.Item
          as={'a'}
          href={`/${locale}` + getCmsPath(`/${TERMS_OF_SERVICE_SLUGS[locale]}`)}
          label={t('common:termsOfService')}
        />
        {isNewsletterEnabled && (
          <Footer.Item
            as={'a'}
            href={`/${locale}${ROUTES.NEWSLETTER}`}
            label={t('common:subscribeNewsletter.title')}
          />
        )}
        <Footer.Item
          as={'a'}
          href={PROVIDER_UI_LINKS[locale]}
          label={t('common:providerUI')}
          target="_blank"
          rel="noopener noreferrer"
        />
        <Footer.Item
          as={'a'}
          href={PRIVACY_POLICY_LINKS[locale]}
          label={t('common:privacyPolicy')}
        />
        <Footer.Item
          as={'a'}
          href={'/accessibility'}
          label={t('common:accessibilityStatement.title')}
        />
        <Footer.Item
          as={'a'}
          href={FEEDBACK_LINKS[locale]}
          label={t('common:feedbackLink')}
        />
      </Footer.Base>
    </Footer>
  );
};

export default FooterSection;
