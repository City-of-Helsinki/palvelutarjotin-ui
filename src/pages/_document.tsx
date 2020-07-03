import * as Sentry from '@sentry/browser';
import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

import documentLang from '../utils/documentLang';

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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
