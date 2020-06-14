import { ApolloProvider } from '@apollo/react-hooks';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import flow from 'lodash/flow';
import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

import '../assets/styles/main.scss';
import withApollo from '../domain/app/apollo/configureApollo';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import { appWithTranslation } from '../i18n';

interface Props {
  apollo: ApolloClient<NormalizedCacheObject>;
}

class MyApp extends App<Props> {
  render() {
    const { apollo, Component, pageProps } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Provider store={store}>
          <PageLayout {...pageProps} namespacesRequired={['common', 'footer']}>
            <Component {...pageProps} />
          </PageLayout>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default flow(withApollo, appWithTranslation)(MyApp);
