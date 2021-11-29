import { ParsedUrlQuery } from 'querystring';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';

import { createApolloCache } from '../domain/app/apollo/configureApollo';
import { store as reduxStore } from '../domain/app/store';

export const arrowUpKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 38, key: 'ArrowUp' });

export const arrowDownKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 40, key: 'ArrowDown' });

export const enterKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 13, key: 'Enter' });

export const escKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 27, key: 'Escape' });

const customRender: CustomRender = (
  ui,
  { mocks = [], store = reduxStore, path = '/', query = {}, router = {} } = {}
) => {
  const Wrapper: React.FC = ({ children }) => (
    <RouterContext.Provider
      value={{
        ...mockRouter,
        ...router,
        ...(path ? { pathname: path, asPath: path, basePath: path } : {}),
        ...(query ? { query } : {}),
      }}
    >
      <Provider store={store}>
        <MockedProvider mocks={mocks} cache={createApolloCache()}>
          {children as React.ReactElement}
        </MockedProvider>
      </Provider>
    </RouterContext.Provider>
  );

  const renderResult = render(ui, {
    wrapper: Wrapper,
  });
  return { ...renderResult };
};
const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
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

export type CustomRenderOptions = {
  mocks?: MockedResponse[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: Store<any, AnyAction>;
  path?: string;
  query?: ParsedUrlQuery;
  router?: Partial<NextRouter>;
};

type CustomRender = {
  (ui: React.ReactElement, options?: CustomRenderOptions): CustomRenderResult;
};

type CustomRenderResult = RenderResult;

// eslint-disable-next-line import/export
export { customRender as render };

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
