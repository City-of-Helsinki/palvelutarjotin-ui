import { IconLinkedin } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import ShareLinkBase from './ShareLinkBase';
import { ShareLinkProps } from './types';
import type { I18nNamespace } from '../../../types';

const linkedInShareUrl = 'https://linkedin.com/shareArticle';

const LinkedInShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const { t } = useTranslation<I18nNamespace>();
  const queryParameters = { url: sharedLink };
  const linkLabel = t('common:shareLink.shareOnLinkedIn');

  return (
    <ShareLinkBase
      url={linkedInShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconLinkedin />}
    />
  );
};

export default LinkedInShareLink;
