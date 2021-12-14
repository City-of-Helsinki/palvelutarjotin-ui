import * as React from 'react';

import { render } from '../../../utils/testUtils';
import SubscribeNewsletterPage from '../SubscribeNewsletterPage';

describe('SubscribeNewsletterPage', () => {
  it('renders correctly', async () => {
    const { container } = render(<SubscribeNewsletterPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
