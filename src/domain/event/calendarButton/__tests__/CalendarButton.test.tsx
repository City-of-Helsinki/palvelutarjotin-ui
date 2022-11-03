import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library//user-event';
import { render, screen, waitFor } from '@testing-library/react';
import * as ICS from 'ics';
import React from 'react';

import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../../generated/graphql';
import { createPlaceQueryMock } from '../../../../tests/apollo-mocks/placeMocks';
import {
  fakeEvent,
  fakeLocalizedObject,
} from '../../../../utils/mockDataUtils';
import CalendarButton from '../CalendarButton';

const placeId = 'placeid-234324';

const eventMock = fakeEvent() as EventFieldsFragment;

const mocks = [
  createPlaceQueryMock({
    id: placeId,
    name: fakeLocalizedObject('Lasten liikennekaupunki'),
  }),
];

const originalCreateEvent = ICS.createEvent;

beforeAll(() => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  (ICS as any).createEvent = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  (ICS as any).createEvent = originalCreateEvent;
});

const occurrence: OccurrenceFieldsFragment = {
  startTime: '2020-07-15T09:00:00+00:00',
} as OccurrenceFieldsFragment;

test('matches snapshot', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks}>
      <CalendarButton occurrence={occurrence} event={eventMock} />
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
      <CalendarButton occurrence={occurrence} event={eventMock} />
    </MockedProvider>
  );

  const downloadButton = await screen.findByRole('button', {
    name: /Lataa kalenteriin/i,
  });

  expect(downloadButton).toBeInTheDocument();
});

// FIXME: Fix the ICS-library usage in the tests
test.skip('works correctly when download button is clicked', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <CalendarButton occurrence={occurrence} event={eventMock} />
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
