import React from 'react';

import { render, screen } from '../../../utils/testUtils';
import NotFoundPage from '../NotFoundPage';

test('renders correctly', () => {
  render(<NotFoundPage />);

  expect(
    screen.getByRole('heading', { name: 'Etsimääsi sivua ei löytynyt' })
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Pahoittelemme, mutta palvelussa ilmeni virhe. Voit yrittää uudestaan, mutta jos tilanne toistuu, ' +
        'kerro siitä meille alalaidan palautelinkin kautta.'
    )
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Palaa etusivulle' })
  ).toBeInTheDocument();
});
