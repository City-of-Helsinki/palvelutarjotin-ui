import { IconFacebook } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import ShareLinkBase from './ShareLinkBase';
import { ShareLinkProps } from './types';

const fbShareUrl = 'https://www.facebook.com/sharer/sharer.php';

const FacebookShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const { t } = useTranslation();

  const queryParameters = { u: sharedLink };
  const linkLabel = t('common:shareLink.shareOnFacebook');

  return (
    <ShareLinkBase
      url={fbShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconFacebook />}
    />
  );
};

export default FacebookShareLink;
