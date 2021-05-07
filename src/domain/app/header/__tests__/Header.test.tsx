import { render, findAllByText, queryAllByText } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../../store';
import Header from '../Header';

it('Header matches snapshot', () => {
  const { container } = render(
    <Provider store={store}>
      <Header />
    </Provider>
  );

  expect(container.firstChild).toMatchSnapshot();
});

describe('cimode in language selector', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test('cimode is rendered in a list of languages when feature flag is on', async () => {
    process.env.NEXT_PUBLIC_LANGUAGE_CIMODE_VISIBLE = 'true';
    const { container } = render(<Header />);
    await findAllByText(container, /CIMODE/);
  });

  test('cimode is not rendered in a list of languages when feature flag is off', async () => {
    process.env.NEXT_PUBLIC_LANGUAGE_CIMODE_VISIBLE = 'false';
    const { container } = render(<Header />);
    expect(queryAllByText(container, /CIMODE/).length).toBe(0);
  });
});
