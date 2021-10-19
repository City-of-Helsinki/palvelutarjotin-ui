import { IconStar } from 'hds-react';
import { graphql } from 'msw';
import React from 'react';

import { server } from '../../../../tests/msw/server';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { fakeDivisions } from '../../../../utils/usMockDataUtils';
import DivisionSelector from '../DivisionSelector';

const divisionNames = [
  'Eira',
  'Etu-töölö',
  'Haaga',
  'Hermanni',
  'Herttoniemi',
  'Karhusaari',
  'Kulosaari',
  'Lauttasaari',
  'Mustikkamaa-korkeasaari',
  'Talosaari',
  'Vartiosaari',
  'Vuosaari',
];

const divisions = fakeDivisions(divisionNames);
const searchWord = 'saari';
const divisionId = divisions[0].id ?? '';
const divisionName = divisions[0].name?.fi ?? '';

const filteredDivisions = divisionNames.filter((name) =>
  name.includes(searchWord)
);

const defaultProps = {
  checkboxName: 'divisions_checkbox',
  icon: <IconStar />,
  name: 'divisions',
  onChange: jest.fn(),
  showSearch: true,
  title: 'Alueet',
  inputPlaceholder: 'Kirjoita hakusana',
  value: [],
};

test('should filter division options', async () => {
  render(<DivisionSelector {...defaultProps} />);

  userEvent.click(screen.getByRole('button', { name: defaultProps.title }));

  userEvent.type(
    screen.getByRole('textbox', {
      name: /kirjoita hakusana/i,
    }),
    // uppercase to test case insesitivity
    searchWord.toUpperCase()
  );

  await waitFor(() => {
    expect(
      screen.getByRole('checkbox', { name: filteredDivisions[0] })
    ).toBeInTheDocument();
  });

  filteredDivisions.forEach((filteredDivision) => {
    expect(
      screen.getByRole('checkbox', { name: filteredDivision })
    ).toBeInTheDocument();
  });

  divisionNames
    .filter((division) => !filteredDivisions.includes(division))
    .forEach((excludedDivision) => {
      expect(
        screen.queryByRole('checkbox', { name: excludedDivision })
      ).not.toBeInTheDocument();
    });
});

test('should render selected value correctly', async () => {
  render(<DivisionSelector {...defaultProps} value={[divisionId]} />);

  await waitFor(() => {
    expect(screen.getByText(divisionName)).toBeInTheDocument();
  });
});
