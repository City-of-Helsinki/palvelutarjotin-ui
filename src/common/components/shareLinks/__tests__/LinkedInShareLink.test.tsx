import { render } from '@testing-library/react';
import React from 'react';

import LinkedInShareLink from '../LinkedInShareLink';
import { ShareLinkProps } from '../types';

const getWrapper = (props: ShareLinkProps) =>
  render(<LinkedInShareLink {...props} />);

test('should apply aria label', () => {
  const sharedLink = 'https://helsinki.fi/some/';
  const { getByLabelText } = getWrapper({ sharedLink });

  expect(getByLabelText('Jaa LinkedInissä')).toBeInTheDocument();
});

test('<LinkedInShareLink /> matches snapshot', () => {
  const sharedLink = 'https://helsinki.fi/some/';
  const { container } = getWrapper({ sharedLink });

  expect(container.firstChild).toMatchSnapshot();
});
