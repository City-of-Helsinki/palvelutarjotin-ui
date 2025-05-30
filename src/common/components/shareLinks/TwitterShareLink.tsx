import { IconX } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import ShareLinkBase from './ShareLinkBase';
import { ShareLinkProps } from './types';
import type { I18nNamespace } from '../../../types';

const twitterShareUrl = 'https://twitter.com/share';

const TwitterShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const { t } = useTranslation<I18nNamespace>();
  const queryParameters = { url: sharedLink };
  const linkLabel = t('common:shareLink.shareOnTwitter');

  return (
    <ShareLinkBase
      url={twitterShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconX />}
    />
  );
};

export default TwitterShareLink;
