import { ParsedUrlQuery } from 'querystring';

import { InMemoryCache } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { NextRouter, Router } from 'next/router';
import React from 'react';

import { createApolloCache } from '../domain/app/apollo/configureApollo';
import { store as reduxStore } from '../domain/app/store';
import TestProviders from './TestProviders';

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
  const renderResult = render(ui, {
    wrapper: ({ children }) => (
      <TestProviders
        mocks={mocks}
        router={router}
        cache={createApolloCache()}
        store={store}
        path={path}
        query={query}
      >
        {children}
      </TestProviders>
    ),
  });
  return {
    ...renderResult,
    router: Router,
  };
};

export type CustomRenderOptions = {
  mocks?: MockedResponse[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: Store<any, AnyAction>;
  path?: string;
  query?: ParsedUrlQuery;
  router?: Partial<NextRouter>;
  cache?: InMemoryCache;
};

export type CustomRender = {
  (ui: React.ReactElement, options?: CustomRenderOptions): CustomRenderResult;
};

type CustomRenderResult = RenderResult;

// eslint-disable-next-line import/export
export { customRender as render };

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
