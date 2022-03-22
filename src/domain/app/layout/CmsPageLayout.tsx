import React from 'react';
import { Page } from 'react-helsinki-headless-cms';

import Footer from '../footer/Footer';
import Header from '../header/Header';

type Props = {
  children: React.ReactNode;
};

export default function CmsPageLayout({ children }: Props): JSX.Element {
  return (
    <Page navigation={<Header />} content={children} footer={<Footer />} />
  );
}
