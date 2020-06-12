import { render } from '@testing-library/react';
import React from 'react';

import PageLayout from '../PageLayout';

it('PageLayout matches snapshot', () => {
  const { container } = render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>
  );
  expect(container.firstChild).toMatchSnapshot();
});
