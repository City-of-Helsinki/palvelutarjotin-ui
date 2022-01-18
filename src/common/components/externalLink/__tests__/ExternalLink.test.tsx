import * as React from 'react';

import isEmail from '../../../../utils/isEmail';
import { render, screen, cleanup } from '../../../../utils/testUtils';
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

// basically testing that isEmail function works
it('renders email link with mailto: prefix', () => {
  const email = 'test_email@email.com';
  render(
    <ExternalLink href={isEmail(email) ? `mailto:${email}` : email}>
      {linkText}
    </ExternalLink>
  );

  const link = screen.queryByText(linkText);
  expect(link).toHaveAttribute('href', `mailto:${email}`);
});

it('allows icon to be placed on the left or right of link label', () => {
  render(<ExternalLink href="https://test.test.fi">{linkText}</ExternalLink>);

  expect(screen.getByRole('link')).toMatchInlineSnapshot(`
<a
  href="https://test.test.fi"
  rel="noreferrer"
  target="_blank"
>
  TestLink
  <svg
    class="Icon-module_icon__1Jtzj icon_hds-icon__1YqNC Icon-module_s__2WGWe icon_hds-icon--size-s__2Lkik"
    role="img"
    style="vertical-align: middle; margin-left: 0.5rem;"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      fill-rule="evenodd"
    >
      <path
        d="M0 0h24v24H0z"
      />
      <path
        d="M10 3v2H5v14h14v-5h2v7H3V3h7zm11 0v8h-2V6.413l-7 7.001L10.586 12l6.999-7H13V3h8z"
        fill="currentColor"
      />
    </g>
  </svg>
  <div
    class="srOnly"
  >
    Avautuu uudessa välilehdessä
  </div>
</a>
`);

  cleanup();

  render(
    <ExternalLink href="https://test.test.fi" iconPosition="left">
      {linkText}
    </ExternalLink>
  );

  expect(screen.getByRole('link')).toMatchInlineSnapshot(`
<a
  href="https://test.test.fi"
  rel="noreferrer"
  target="_blank"
>
  <svg
    class="Icon-module_icon__1Jtzj icon_hds-icon__1YqNC Icon-module_s__2WGWe icon_hds-icon--size-s__2Lkik"
    role="img"
    style="vertical-align: middle; margin-right: 0.5rem;"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      fill-rule="evenodd"
    >
      <path
        d="M0 0h24v24H0z"
      />
      <path
        d="M10 3v2H5v14h14v-5h2v7H3V3h7zm11 0v8h-2V6.413l-7 7.001L10.586 12l6.999-7H13V3h8z"
        fill="currentColor"
      />
    </g>
  </svg>
  TestLink
  <div
    class="srOnly"
  >
    Avautuu uudessa välilehdessä
  </div>
</a>
`);
});
