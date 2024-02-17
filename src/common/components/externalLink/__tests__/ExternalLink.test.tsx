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
        aria-hidden="true"
        aria-label="link-external"
        class="Icon-module_icon__1Jtzj icon_hds-icon__1YqNC Icon-module_s__2WGWe icon_hds-icon--size-s__2Lkik"
        role="img"
        style="vertical-align: middle; margin-left: 0.5rem;"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M5 3V19H21V21H3V3H5ZM21 3V12H19V6.413L9.91421 15.5L8.5 14.0858L17.585 5H12V3H21Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
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
        aria-hidden="true"
        aria-label="link-external"
        class="Icon-module_icon__1Jtzj icon_hds-icon__1YqNC Icon-module_s__2WGWe icon_hds-icon--size-s__2Lkik"
        role="img"
        style="vertical-align: middle; margin-right: 0.5rem;"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M5 3V19H21V21H3V3H5ZM21 3V12H19V6.413L9.91421 15.5L8.5 14.0858L17.585 5H12V3H21Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
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
