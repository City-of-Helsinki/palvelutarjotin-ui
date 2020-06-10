import React from 'react';
import { render } from '@testing-library/react';

import App from '../pages/index';

describe('Index page', () => {
  it('Should match Snapshot', () => {
    const { container } = render(<App />)

    expect(container).toMatchSnapshot()
  })
})