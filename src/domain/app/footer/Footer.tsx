import { Footer } from 'hds-react';
import React from 'react';

import SrOnly from '../../../common/components/SrOnly/SrOnly';
import { FEEDBACK_LINKS, PRIVACY_POLICY_LINKS } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import styles from './footer.module.scss';

interface Props {
  isMobileMenuOpen?: boolean;
}

const FooterSection = (): React.ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();

  // override Footer component default behaviour which focuses skip-link

  return (
    <Footer title={t('appName')} className={styles.footer}>
      <Footer.Base
        copyrightHolder={t('footer:copyrightText')}
        copyrightText={t('footer:allRightsReservedText')}
      >
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
