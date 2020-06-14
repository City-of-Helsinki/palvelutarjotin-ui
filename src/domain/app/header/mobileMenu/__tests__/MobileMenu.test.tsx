import { render } from '@testing-library/react';
import React from 'react';

import MobileMenu from '../MobileMenu';

it('MobileMenu matches snapshot', () => {
  const { container } = render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <MobileMenu isMenuOpen={true} onClose={() => {}} />
  );

  expect(container.firstChild).toMatchSnapshot();
});
