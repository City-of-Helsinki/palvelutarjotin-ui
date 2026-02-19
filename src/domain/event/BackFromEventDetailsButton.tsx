import { IconArrowLeft, IconSize } from 'hds-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { createBackButtonHref } from './utils';
import { SCROLL_RESTORATION_ELEMENT_ID_PREFIX } from '../events/constants';

/**
 * Back to event search from the event details page.
 */
export default function BackFromEventDetailsButton() {
  const { t } = useTranslation();
  const {
    asPath,
    query: { eventId },
  } = useRouter();
  const [, currentSearch] = asPath.split('?');
  const { pathname, search } = createBackButtonHref(currentSearch);
  const hash = `#${SCROLL_RESTORATION_ELEMENT_ID_PREFIX}${eventId}`;

  const href = pathname + (search ? `?${search}` : '') + hash;
  // Disable back button scroll, because we have our own custom implementation
  // to fix issues in nextjs: see
  // 1. https://github.com/vercel/next.js/issues/68746
  // 2. https://github.com/vercel/next.js/issues/3303
  // 3. https://github.com/vercel/next.js/discussions/44013
  const scroll = false;
  return (
    <NextLink href={href} aria-label={t('common:buttonBack')} scroll={scroll}>
      <IconArrowLeft size={IconSize.Medium} />
    </NextLink>
  );
}
