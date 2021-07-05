import { useTranslation } from 'next-i18next';
import * as React from 'react';

import SrOnly from '../SrOnly/SrOnly';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ExternalLink: React.FC<Props> = ({ children, ...props }) => {
  const { t } = useTranslation();
  return (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
      <SrOnly>{t('common:srOnly.opensInANewTab')}</SrOnly>
    </a>
  );
};

export default ExternalLink;
