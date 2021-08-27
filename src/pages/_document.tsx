import * as Sentry from '@sentry/browser';
import jsdom from 'jsdom';
import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

import documentLang from '../utils/documentLang';

const document = new jsdom.JSDOM('<!DOCTYPE html>').window.document;
global.document = document;

process.on('unhandledRejection', (err) => {
  Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
  Sentry.captureException(err);
});

export default class MyDocument extends Document<DocumentProps> {
  render(): React.ReactElement {
    return (
      <Html lang={documentLang(this.props)}>
        <Head>
          {Array.from(document.head.getElementsByTagName('style')).map(
            (style, index) => (
              <style key={index} type={style.type}>
                {style.innerHTML}
              </style>
            )
          )}
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_KEY}`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
