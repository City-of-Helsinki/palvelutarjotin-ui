import { render } from '@testing-library/react';
import React from 'react';

import Container from '../Container';

it('Container matches snapshot', () => {
  const { container } = render(<Container>Container children</Container>);

  expect(container.firstChild).toMatchSnapshot();
});
