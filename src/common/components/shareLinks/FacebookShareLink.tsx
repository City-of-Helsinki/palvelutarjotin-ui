import { IconFacebook } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ShareLinkBase from './ShareLinkBase';
import { ShareLinkProps } from './types';
import type { I18nNamespace } from '../../../types';

const fbShareUrl = 'https://www.facebook.com/sharer/sharer.php';

const FacebookShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const { t } = useTranslation<I18nNamespace>();

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
