import { ApolloClient, useApolloClient } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { NextRouter } from 'next/router';
import React from 'react';
import {
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
  Config as RHHCConfig,
} from 'react-helsinki-headless-cms';
import { Provider } from 'react-redux';

import { CustomRenderOptions } from './testUtils';
import { store as reduxStore } from '../domain/app/store';

const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  forward: jest.fn(() => true),
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

type Props = {
  children: React.ReactNode;
} & CustomRenderOptions;

function TestProviders(props: Props): JSX.Element {
  const {
    mocks,
    children,
    router,
    cache,
    store = reduxStore,
    path = '/',
    query = {},
  } = props;
  return (
    <Provider store={store}>
      <MockedProvider mocks={mocks} cache={cache}>
        <RHHCConfigProviderWithMockedApolloClient {...props}>
          <RouterContext.Provider
            value={{
              ...mockRouter,
              ...router,
              ...(path ? { pathname: path, asPath: path, basePath: path } : {}),
              ...(query ? { query } : {}),
            }}
          >
            {children as React.ReactElement}
          </RouterContext.Provider>
        </RHHCConfigProviderWithMockedApolloClient>
      </MockedProvider>
    </Provider>
  );
}

function RHHCConfigProviderWithMockedApolloClient({ children }: Props) {
  const cmsApolloClient = useApolloClient();
  return (
    <RHHCConfigProvider config={getRHHCConfig(cmsApolloClient)}>
      {children}
    </RHHCConfigProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getRHHCConfig(apolloClient: ApolloClient<object>) {
  return {
    ...rhhcDefaultConfig,
    copy: {
      ...rhhcDefaultConfig.copy,
      openInNewTabAriaLabel: 'Avautuu uudessa välilehdessä.',
      openInExternalDomainAriaLabel: 'Avautuu uudella sivustolla.',
    },
    currentLanguageCode: 'FI',
    apolloClient,
  } as RHHCConfig;
}

export default TestProviders;
