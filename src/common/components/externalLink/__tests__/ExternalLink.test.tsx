import * as React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import ExternalLink from '../ExternalLink';

const linkText = 'TestLink';

it('matches snapshot', () => {
  const { container } = render(
    <ExternalLink href="https://test.test.fi">{linkText}</ExternalLink>
  );

  expect(container).toMatchSnapshot();
});

it('contains link and sr texts + srOnly className', () => {
  render(<ExternalLink href="https://test.test.fi">{linkText}</ExternalLink>);

  expect(screen.queryByText(linkText)).toBeInTheDocument();
  expect(screen.getByText('Avautuu uudessa välilehdessä')).toHaveClass(
    'srOnly'
  );
});
