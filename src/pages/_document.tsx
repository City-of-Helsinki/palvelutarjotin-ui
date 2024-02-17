import * as Sentry from '@sentry/browser';
import NextJsDocument, { Html, Head, Main, NextScript } from 'next/document';
import type { DocumentContext, DocumentProps } from 'next/document';
import React from 'react';

import documentLang from '../utils/documentLang';

process.on('unhandledRejection', (err) => {
  Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
  Sentry.captureException(err);
});

class MyDocument extends NextJsDocument<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render
    const initialProps = await NextJsDocument.getInitialProps(ctx);

    return { ...initialProps };
  }
  render(): React.ReactElement {
    return (
      <Html lang={documentLang(this.props)}>
        <Head>
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

export default MyDocument;
