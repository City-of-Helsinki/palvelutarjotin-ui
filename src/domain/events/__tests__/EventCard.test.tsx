import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import * as graphql from '../../../generated/graphql';
import {
  fakeEvent,
  fakeOccurrences,
  fakePEvent,
} from '../../../utils/mockDataUtils';
import { render, screen, userEvent, waitFor } from '../../../utils/testUtils';
import EventCard from '../../event/eventCard/EventCard';

it('renders a button to view multiple occurrences when event has them', async () => {
  const occurrences = fakeOccurrences(3, [
    { startTime: new Date(2020, 8, 20, 10, 30).toISOString() },
    { startTime: new Date(2020, 9, 21, 10, 20).toISOString() },
    { startTime: new Date(2020, 10, 22, 12, 40).toISOString() },
  ]);
  const event = fakeEvent({
    pEvent: fakePEvent({
      occurrences,
      nextOccurrenceDatetime: occurrences.edges[0]?.node?.startTime,
      lastOccurrenceDatetime: occurrences.edges[2]?.node?.startTime,
    }),
  });
  const apolloMocks: MockedResponse[] = [
    {
      request: {
        query: graphql.OccurrencesDocument,
        variables: {
          cancelled: false,
          pEvent: event.pEvent.id,
          orderBy: 'startTime',
        },
      },
      result: {
        data: {
          occurrences: occurrences,
        },
      },
    },
    {
      request: {
        query: graphql.OccurrencesDocument,
        variables: {
          cancelled: false,
          pEvent: event.pEvent.id,
          orderBy: 'startTime',
        },
      },
      result: {
        data: {
          occurrences: occurrences,
        },
      },
    },
  ];

  render(<EventCard event={event} link={'#'} />, { mocks: apolloMocks });
  await waitFor(() => {
    expect(
      screen.getByText(/sunnuntaina 20\.9\. klo 10:30/)
    ).toBeInTheDocument();
  });
  expect(screen.queryByText(/21.9 klo 10:20/)).not.toBeInTheDocument();
  expect(screen.queryByText(/22.10 klo 12:40/)).not.toBeInTheDocument();

  userEvent.click(
    screen.getByRole('button', {
      name: /\+ muita tapahtuma-aikoja/i,
    })
  );

  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/klo 10:20/)).toBeInTheDocument();
    expect(screen.getByText(/klo 12:40/)).toBeInTheDocument();
  });
  expect(screen.getByText(/sunnuntaina 20\.9\. klo 10:30/)).toBeInTheDocument();
});

it('does not render a button to view multiple occurrences when only 1 occurrence presents', () => {
  const occurrences = fakeOccurrences(1);
  const event = fakeEvent({
    pEvent: fakePEvent({ occurrences }),
  });

  render(
    <EventCard event={event} link={`fi/event/${event.pEvent.linkedEventId}`} />
  );

  expect(
    screen.queryByRole('button', {
      name: /\+ muita tapahtuma-aikoja/i,
    })
  ).not.toBeInTheDocument();
});
