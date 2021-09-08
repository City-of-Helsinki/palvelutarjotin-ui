import { IconStar } from 'hds-react';
import React from 'react';

import { NeighborhoodListDocument } from '../../../../generated/graphql';
import { fakeNeighborhoods } from '../../../../utils/mockDataUtils';
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { additionalDivisions } from '../../additionalDivisions';
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
  ...additionalDivisions.map((div) => div.name.fi),
];

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

const searchWord = 'saari';

const filteredDivisions = [
  'Karhusaari',
  'Kulosaari',
  'Lauttasaari',
  'Mustikkamaa-korkeasaari',
  'Talosaari',
  'Vartiosaari',
  'Vuosaari',
];

const divisions = fakeNeighborhoods(
  divisionNames.length,
  divisionNames.map((division) => ({
    id: division,
    name: {
      fi: division,
      en: division,
      sv: division,
    },
  }))
);

const neighborhoodsResponse = {
  data: { neighborhoodList: divisions },
};

const mocks = [
  {
    request: {
      query: NeighborhoodListDocument,
    },
    result: neighborhoodsResponse,
  },
];

const divisionId = divisions.data[0].id;
const divisionName = divisions.data[0].name?.fi ?? '';

test('should filter division options', async () => {
  render(<DivisionSelector {...defaultProps} />, {
    mocks,
  });

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
  render(<DivisionSelector {...defaultProps} value={[divisionId]} />, {
    mocks,
  });

  await waitFor(() => {
    expect(screen.getByText(divisionName)).toBeInTheDocument();
  });
});

test('disivions dropdown has additional divisions', async () => {
  render(<DivisionSelector {...defaultProps} value={[divisionId]} />, {
    mocks,
  });

  userEvent.click(screen.getByRole('button', { name: defaultProps.title }));

  additionalDivisions.forEach((divisionName) => {
    expect(
      screen.getByRole('checkbox', {
        name: divisionName.name.fi,
      })
    ).toBeInTheDocument();
  });
});
