import { render } from '@testing-library/react';
import React from 'react';

import TwitterShareLink from '../TwitterShareLink';
import { ShareLinkProps } from '../types';

const getWrapper = (props: ShareLinkProps) =>
  render(<TwitterShareLink {...props} />);

test('should apply aria label', () => {
  const sharedLink = 'https://helsinki.fi/some/';
  const { getByLabelText } = getWrapper({ sharedLink });

  expect(getByLabelText('Jaa Twitterissä')).toBeInTheDocument();
});

test('<TwitterShareLink /> matches snapshot', () => {
  const sharedLink = 'https://helsinki.fi/some/';
  const { container } = getWrapper({ sharedLink });

  expect(container.firstChild).toMatchSnapshot();
});
