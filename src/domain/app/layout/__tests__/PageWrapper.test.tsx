import * as React from 'react';

import { render } from '../../../../utils/testUtils';
import PageWrapper from '../PageWrapper';

test('PageWrapper matches snapshot', async () => {
  const { container } = render(
    <PageWrapper>
      <div>Children</div>
    </PageWrapper>
  );

  expect(container).toMatchSnapshot();
});
