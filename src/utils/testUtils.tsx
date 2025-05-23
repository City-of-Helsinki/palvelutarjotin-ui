import { ParsedUrlQuery } from 'querystring';

import { InMemoryCache } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { NextRouter, Router } from 'next/router';
import React from 'react';

import TestProviders from './TestProviders';
import { createApolloCache } from '../domain/app/apollo/cache';

export const arrowUpKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 38, key: 'ArrowUp' });

export const arrowDownKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 40, key: 'ArrowDown' });

export const enterKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 13, key: 'Enter' });

export const escKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 27, key: 'Escape' });

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const customRender: CustomRender = (
  ui,
  { mocks = [], path = '/', query = {}, router = {} } = {}
) => {
  const renderResult = render(ui, {
    wrapper: ({ children }) => (
      <TestProviders
        mocks={mocks}
        router={router}
        cache={createApolloCache()}
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
  path?: string;
  query?: ParsedUrlQuery;
  router?: Partial<NextRouter>;
  cache?: InMemoryCache;
};

export type CustomRender = {
  (ui: React.ReactElement, options?: CustomRenderOptions): CustomRenderResult;
};

type CustomRenderResult = RenderResult;

export { customRender as render };

// re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
