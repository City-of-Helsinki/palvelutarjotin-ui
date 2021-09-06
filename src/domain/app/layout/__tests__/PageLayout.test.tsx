import React from 'react';
import { Provider } from 'react-redux';

import { render } from '../../../../utils/testUtils';
import { store } from '../../store';
import PageLayout from '../PageLayout';

it('PageLayout matches snapshot', () => {
  const { container } = render(
    <Provider store={store}>
      <PageLayout>
        <div>Page layout children</div>
      </PageLayout>
    </Provider>
  );
  expect(container.firstChild).toMatchSnapshot();
});
