import { render } from '@testing-library/react';
import React from 'react';

import Navbar from '../Navbar';

it('Navbar matches snapshot', () => {
  const { container } = render(<Navbar />);

  expect(container.firstChild).toMatchSnapshot();
});
