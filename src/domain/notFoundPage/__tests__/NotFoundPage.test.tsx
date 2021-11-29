import React from 'react';

import { render, screen } from '../../../utils/testUtils';
import NotFoundPage from '../NotFoundPage';

test('renders correctly', () => {
  render(<NotFoundPage />);

  expect(
    screen.getByRole('heading', {
      name: 'Valitettavasti hakemaanne sivua ei löytynyt.',
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Tervetuloa tutustumaan uudistuneen/)
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Palaa etusivulle' })
  ).toBeInTheDocument();
});
