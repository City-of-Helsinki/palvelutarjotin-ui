import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library//user-event';
import { render, screen, waitFor } from '@testing-library/react';
import * as ICS from 'ics';
import React from 'react';

import { PlaceDocument } from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeLocalizedObject,
  fakePlace,
} from '../../../../utils/mockDataUtils';
import CalendarButton from '../CalendarButton';

const placeId = 'placeid-234324';
const placeResult = {
  data: {
    place: fakePlace({
      id: placeId,
      name: fakeLocalizedObject('Lasten liikennekaupunki'),
    }),
  },
};

const eventMock = fakeEvent();

const mocks = [
  {
    request: {
      query: PlaceDocument,
      variables: {
        id: placeId,
      },
    },
    result: placeResult,
  },
];

const originalCreateEvent = ICS.createEvent;

beforeAll(() => {
  (ICS as any).createEvent = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  (ICS as any).createEvent = originalCreateEvent;
});

const occurrence = {
  startTime: '2020-07-15T09:00:00+00:00',
};

test('matches snapshot', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks}>
      <CalendarButton occurrence={occurrence as any} event={eventMock as any} />
    </MockedProvider>
  );

  await screen.findByRole('button', {
    name: /Lataa kalenteriin/i,
  });

  expect(container.firstChild).toMatchSnapshot();
});

test('renders correct label', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <CalendarButton occurrence={occurrence as any} event={eventMock as any} />
    </MockedProvider>
  );

  const downloadButton = await screen.findByRole('button', {
    name: /Lataa kalenteriin/i,
  });

  expect(downloadButton).toBeInTheDocument();
});

test('works correctly when download button is clicked', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <CalendarButton occurrence={occurrence as any} event={eventMock as any} />
    </MockedProvider>
  );

  const downloadButton = await screen.findByRole('button', {
    name: /Lataa kalenteriin/i,
  });

  userEvent.click(downloadButton);

  expect(downloadButton).toBeInTheDocument();

  await waitFor(() => {
    expect(ICS.createEvent).toHaveBeenCalled();
  });
});
