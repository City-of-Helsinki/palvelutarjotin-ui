import * as Sentry from '@sentry/browser';
import * as hds from 'hds-react';
import { getCriticalHdsRules } from 'hds-react';
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

type Props = {
  hdsCriticalRules: string;
} & DocumentProps;

class MyDocument extends NextJsDocument<Props> {
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
    const hdsCriticalRules = await getCriticalHdsRules(
      initialProps.html,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (hds as any).hdsStyles
    );

    return { ...initialProps, hdsCriticalRules };
  }
  render(): React.ReactElement {
    return (
      <Html lang={documentLang(this.props)}>
        <Head>
          <style
            data-used-styles
            dangerouslySetInnerHTML={{ __html: this.props.hdsCriticalRules }}
          />
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
