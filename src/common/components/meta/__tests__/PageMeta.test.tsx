import React from 'react';

import { render } from '../../../../utils/testUtils';
import PageMeta from '../PageMeta';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

it('renders meta elements to document head', async () => {
  render(
    <PageMeta
      title="Title"
      description="description"
      openGraphDescription="openGraphDescription"
      openGraphTitle="openGraphTitle"
    />
  );

  const getHeadElement = (selector: string) =>
    document.head.querySelector(selector);

  expect(document.title).toBe('Title');

  [
    ['meta[name="description"]', 'description'],
    ['meta[property="og:title"]', 'openGraphTitle'],
    ['meta[property="og:description"]', 'openGraphDescription'],
  ].forEach(([selector, content]) => {
    expect(getHeadElement(selector)).toHaveAttribute('content', content);
  });

  [
    'link[rel="canonical"]',
    'link[href="/hds-favicon-kit/favicon-32x32.ico"]',
    'link[href="/hds-favicon-kit/favicon.svg"]',
    'link[href="/hds-favicon-kit/apple-touch-icon.png"]',
  ].forEach((selector) => {
    expect(getHeadElement(selector)).toBeInTheDocument();
  });
});
