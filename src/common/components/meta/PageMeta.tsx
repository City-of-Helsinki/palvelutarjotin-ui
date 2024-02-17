import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Language } from '../../../types';

export type Props = {
  // Title of page, required for accessibility: pages should have unique titles
  // so that screen reader users are able to determine when the current page is
  // changed.
  title: string;
  description?: string | null;
  image?: string | null;
  canonicalUrl?: string | null;
  openGraphDescription?: string | null;
  openGraphTitle?: string | null;
  openGraphType?: string | null;
  twitterDescription?: string | null;
  twitterTitle?: string | null;
  localePaths?: {
    path: string;
    locale: Language;
  }[];
};

export function getLanguageAwarePath(
  locale: Language | undefined,
  path: string
): string {
  if (locale === 'fi') {
    return path;
  }

  return `/${locale}${path}`;
}

const PageMeta: React.FC<Props> = ({
  title,
  description,
  image,
  openGraphType,
  twitterDescription,
  twitterTitle,
  localePaths,
  ...seo
}) => {
  const { locale, asPath } = useRouter();
  const canonical = getLanguageAwarePath(locale as Language, asPath);
  const openGraphTitle = seo.openGraphTitle ?? title;
  const openGraphDescription = seo.openGraphDescription ?? description;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={openGraphTitle} />
        {openGraphDescription && (
          <meta property="og:description" content={openGraphDescription} />
        )}
        {image && <meta property="og:image" content={image} />}
        {openGraphType && <meta property="og:type" content={openGraphType} />}
        {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
        {twitterDescription && (
          <meta name="twitter:description" content={twitterDescription} />
        )}
        {localePaths?.map(({ locale, path }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={path} />
        ))}
        <link rel="canonical" href={canonical} />
        <link
          rel="icon"
          href="/hds-favicon-kit/favicon-32x32.ico"
          sizes="any"
        />
        <link
          rel="icon"
          href="/hds-favicon-kit/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="/hds-favicon-kit/apple-touch-icon.png"
        />
      </Head>
    </>
  );
};

export default PageMeta;
