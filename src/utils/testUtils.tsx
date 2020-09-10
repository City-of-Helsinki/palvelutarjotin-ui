import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import * as router from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';

import { store as reduxStore } from '../domain/app/store';

export const arrowUpKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 38, key: 'ArrowUp' });

export const arrowDownKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 40, key: 'ArrowDown' });

export const enterKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 13, key: 'Enter' });

export const escKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 27, key: 'Escape' });

export const tabKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 9, key: 'Tab' });

const customRender: CustomRender = (
  ui,
  { mocks = [], store = reduxStore, path = '/', query = {} } = {}
) => {
  jest.spyOn(router, 'useRouter').mockReturnValue({
    query,
    pathname: path,
    asPath: path,
    route: '',
    basePath: path,
  } as any);

  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <MockedProvider mocks={mocks}>
        {children as React.ReactElement}
      </MockedProvider>
    </Provider>
  );

  const renderResult = render(ui, { wrapper: Wrapper });
  return { ...renderResult };
};

type CustomRender = {
  (
    ui: React.ReactElement,
    options?: {
      mocks?: MockedResponse[];
      store?: Store<any, AnyAction>;
      path?: string;
      query?: {};
    }
  ): CustomRenderResult;
};

type CustomRenderResult = RenderResult;

export { customRender as render, reduxStore };

// re-export everything
export * from '@testing-library/react';
export { render as defaultRender } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
