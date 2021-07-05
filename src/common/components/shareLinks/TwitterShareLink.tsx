import { IconTwitter } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import ShareLinkBase from './ShareLinkBase';
import { ShareLinkProps } from './types';

const twitterShareUrl = 'https://twitter.com/share';

const TwitterShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const { t } = useTranslation();
  const queryParameters = { url: sharedLink };
  const linkLabel = t('common:shareLink.shareOnTwitter');

  return (
    <ShareLinkBase
      url={twitterShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconTwitter />}
    />
  );
};

export default TwitterShareLink;
