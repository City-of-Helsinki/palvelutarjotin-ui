import { IconArrowLeft } from 'hds-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { createBackButtonHref } from './utils';

/**
 * Back to event search from the event details page.
 */
export default function BackFromEventDetailsButton() {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const [, search] = asPath.split('?');
  const href = createBackButtonHref(search);

  return (
    <NextLink href={href} aria-label={t('common:buttonBack')}>
      <IconArrowLeft size="m" />
    </NextLink>
  );
}
