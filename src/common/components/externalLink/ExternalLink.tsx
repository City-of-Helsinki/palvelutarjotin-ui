import { IconLinkExternal } from 'hds-react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import type { I18nNamespace } from '../../../types';
import SrOnly from '../SrOnly/SrOnly';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  iconPosition?: 'left' | 'right';
};

const ExternalLink: React.FC<Props> = ({
  children,
  iconPosition = 'right',
  ...props
}) => {
  const { t } = useTranslation<I18nNamespace>();
  return (
    <a {...props} href={props.href} target="_blank" rel="noreferrer">
      {iconPosition === 'left' && (
        <IconLinkExternal
          style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}
        />
      )}
      {children}
      {iconPosition === 'right' && (
        <IconLinkExternal
          style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}
        />
      )}
      <SrOnly>{t('common:srOnly.opensInANewTab')}</SrOnly>
    </a>
  );
};

export const getExternalUrl = (url: string): string => {
  if (url.match(/^https?:\/\//)) {
    return url;
  }
  return `//${url}`;
};

export default ExternalLink;
