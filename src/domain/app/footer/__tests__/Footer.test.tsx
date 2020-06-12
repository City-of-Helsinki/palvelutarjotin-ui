import { render } from '@testing-library/react';
import React from 'react';

import Footer from '../Footer';

it('Footer matches snapshot', () => {
  const { container } = render(<Footer />);

  expect(container.firstChild).toMatchSnapshot();
});
