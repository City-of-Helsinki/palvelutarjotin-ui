import { render } from '@testing-library/react';
import React from 'react';

import LoadingSpinner from '../LoadingSpinner';

it('LoadingSpinner matches snapshot', () => {
  const { container } = render(<LoadingSpinner isLoading={true} />);
  expect(container.outerHTML).toMatchSnapshot();
});

it('render spinner if isLoading is true', () => {
  const { container } = render(<LoadingSpinner isLoading={true} />);
  expect(container.firstChild?.firstChild).toHaveClass('spinner');
});

it('render child component if isLoading is false', () => {
  const { container } = render(
    <LoadingSpinner isLoading={false}>
      <div className="component"></div>
    </LoadingSpinner>
  );
  expect(container.firstChild).toHaveClass('component');
});
