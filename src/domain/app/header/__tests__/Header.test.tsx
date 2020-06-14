import { render } from '@testing-library/react';
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
