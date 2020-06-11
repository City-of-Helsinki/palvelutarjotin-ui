import App from 'next/app';
import React from 'react';

import '../assets/styles/main.scss';

import { appWithTranslation } from '../i18n';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default appWithTranslation(MyApp);
