import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

import documentLang from '../utils/documentLang';

export default class MyDocument extends Document<DocumentProps> {
  render(): React.ReactElement {
    return (
      <Html lang={documentLang(this.props)}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
