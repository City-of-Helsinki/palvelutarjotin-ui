import { IconLinkedin } from 'hds-react';
import React from 'react';

import { useTranslation } from '../../../i18n';
import ShareLinkBase from './ShareLinkBase';
import { ShareLinkProps } from './types';

const linkedInShareUrl = 'https://linkedin.com/shareArticle';

const LinkedInShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const { t } = useTranslation();
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
