import { IconLinkExternal } from 'hds-react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import SrOnly from '../SrOnly/SrOnly';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  isEmail?: boolean;
};

const ExternalLink: React.FC<Props> = ({ children, isEmail, ...props }) => {
  const { t } = useTranslation();
  return (
    <a
      {...props}
      href={isEmail ? `mailto:${props.href}` : getExternalUrl(props.href)}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <IconLinkExternal
        style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}
      />
      <SrOnly>{t('common:srOnly.opensInANewTab')}</SrOnly>
    </a>
  );
};

const getExternalUrl = (url: string) => {
  if (url.match(/^https?:\/\//)) {
    return url;
  }
  return `//${url}`;
};

export default ExternalLink;
