import NextJsDocument, { Html, Head, Main, NextScript } from 'next/document';
import type { DocumentProps } from 'next/document';
import React from 'react';

type Props = {
  hdsCriticalRules: string;
} & DocumentProps;

class MyDocument extends NextJsDocument<Props> {
  render(): React.ReactElement {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
