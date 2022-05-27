import React from 'react';
import { Page } from 'react-helsinki-headless-cms';

import Footer from '../footer/Footer';
import Header from '../header/Header';
import styles from './pageLayout.module.scss';

type Props = {
  children: React.ReactNode;
};

export default function CmsPageLayout({ children }: Props): JSX.Element {
  return (
    <Page
      navigation={<Header />}
      content={<div className={styles.pageBody}>{children}</div>}
      footer={<Footer />}
    />
  );
}
