import React from 'react';

import { render } from '../../../utils/testUtils';
import AccessibilityStatement from '../AccessibilityStatement';

it('matches snapshot', () => {
  const { container } = render(<AccessibilityStatement />);

  expect(container).toMatchSnapshot();
});
