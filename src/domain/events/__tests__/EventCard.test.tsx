import { MockedResponse } from '@apollo/client/testing';
import { advanceTo } from 'jest-date-mock';
import React from 'react';

import * as graphql from '../../../generated/graphql';
import { emptyKeywordSetRequestMocks } from '../../../tests/apollo-mocks/keywordSetMocks';
import {
  fakeEvent,
  fakeKeyword,
  fakeLocalizedObject,
  fakeOccurrences,
  fakePEvent,
} from '../../../utils/mockDataUtils';
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import EventCard from '../../event/eventCard/EventCard';

const getPlaceRequestMock = (id: string) => ({
  request: {
    query: graphql.PlaceDocument,
    variables: {
      id,
    },
  },
  result: {
    data: null,
  },
});

describe('EventCard', () => {
  describe('List of occurrences', () => {
    it('renders a button to view multiple occurrences when event has them', async () => {
      const occurrences = fakeOccurrences(3, [
        { startTime: new Date(2020, 8, 20, 10, 30).toISOString() },
        { startTime: new Date(2020, 9, 21, 10, 20).toISOString() },
        { startTime: new Date(2020, 10, 22, 12, 40).toISOString() },
      ]);
      const event = fakeEvent({
        keywords: [
          fakeKeyword({
            name: fakeLocalizedObject('Avainsana'),
            id: 'kultus:1',
          }),
        ],
        pEvent: fakePEvent({
          nextOccurrenceDatetime: occurrences.edges[0]?.node?.startTime,
          lastOccurrenceDatetime: occurrences.edges[2]?.node?.startTime,
          nextOccurrence: fakeOccurrences(1, [
            {
              startTime: new Date(2020, 8, 20, 10, 30).toISOString(),
            },
          ]),
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
              upcoming: true,
            },
          },
          result: {
            data: {
              occurrences: occurrences,
            },
          },
        },
        ...emptyKeywordSetRequestMocks,
        getPlaceRequestMock(event.location?.id ?? ''),
      ];

      render(<EventCard event={event} link={'#'} />, { mocks: apolloMocks });
      await waitFor(() => {
        expect(
          screen.getByText(/sunnuntaina 20\.9\. klo 10:30/)
        ).toBeInTheDocument();
      });
      expect(screen.queryByText(/21.9 klo 10:20/)).not.toBeInTheDocument();
      expect(screen.queryByText(/22.10 klo 12:40/)).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.click(
          await screen.findByRole('button', {
            name: /\+ muita tapahtuma-aikoja/i,
          })
        );
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      await screen.findByRole('button', {
        name: /piilota muut ajat/i,
      });

      await waitFor(() => {
        expect(screen.getByText(/klo 10:20/)).toBeInTheDocument();
        expect(screen.getByText(/klo 12:40/)).toBeInTheDocument();
      });
      expect(
        screen.getByText(/sunnuntaina 20\.9\. klo 10:30/)
      ).toBeInTheDocument();
    });

    it('does not render a button to view multiple occurrences when only 1 occurrence presents', () => {
      const occurrences = fakeOccurrences(1);
      const event = fakeEvent({
        pEvent: fakePEvent({ occurrences }),
      });

      render(
        <EventCard
          event={event}
          link={`fi/event/${event.pEvent.linkedEventId}`}
        />,
        {
          mocks: [
            ...emptyKeywordSetRequestMocks,
            getPlaceRequestMock(event.location?.id ?? ''),
          ],
        }
      );

      expect(
        screen.queryByRole('button', {
          name: /\+ muita tapahtuma-aikoja/i,
        })
      ).not.toBeInTheDocument();
    });

    it('renders multiday occurrence time correctly', async () => {
      const nextOccurrence = {
        startTime: new Date(2020, 8, 20, 10, 30).toISOString(),
        endTime: new Date(2020, 8, 22, 10, 30).toISOString(),
      };
      const occurrences = fakeOccurrences(3, [
        nextOccurrence,
        {
          startTime: new Date(2020, 9, 21, 10, 20).toISOString(),
          endTime: new Date(2020, 9, 28, 10, 20).toISOString(),
        },
        {
          startTime: new Date(2020, 10, 22, 12, 40).toISOString(),
          endTime: new Date(2020, 10, 25, 12, 40).toISOString(),
        },
      ]);
      const event = fakeEvent({
        name: fakeLocalizedObject('Nimi'),
        shortDescription: fakeLocalizedObject('Kuvaus'),
        keywords: [
          fakeKeyword({
            name: fakeLocalizedObject('Avainsana'),
            id: 'kultus: 1',
          }),
        ],
        pEvent: fakePEvent({
          nextOccurrenceDatetime: occurrences.edges[0]?.node?.startTime,
          lastOccurrenceDatetime: occurrences.edges[2]?.node?.startTime,
          nextOccurrence: fakeOccurrences(1, [nextOccurrence]),
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
              upcoming: true,
            },
          },
          result: {
            data: {
              occurrences: occurrences,
            },
          },
        },
        ...emptyKeywordSetRequestMocks,
        getPlaceRequestMock(event.location?.id ?? ''),
      ];

      const { container } = render(<EventCard event={event} link={'#'} />, {
        mocks: apolloMocks,
      });

      await waitFor(() => {
        expect(screen.getByText('20.9.2020 – 22.9.2020')).toBeInTheDocument();
      });

      await act(async () => {
        await userEvent.click(
          await screen.findByRole('button', {
            name: /\+ muita tapahtuma-aikoja/i,
          })
        );
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      await screen.findByRole('button', {
        name: /piilota muut ajat/i,
      });

      screen.getByText('21.10.2020 – 28.10.2020');
      screen.getByText('22.11.2020 – 25.11.2020');

      expect(container).toMatchSnapshot();
    });
  });
  describe('dates', () => {
    it('renders date as tomorrow and ignores enrolment days', async () => {
      advanceTo(new Date(2020, 8, 19));
      const occurrences = fakeOccurrences(3, [
        { startTime: new Date(2020, 8, 20, 10, 30).toISOString() },
      ]);
      const event = fakeEvent({
        pEvent: fakePEvent({
          nextOccurrence: occurrences,
          enrolmentEndDays: 10,
        }),
      });
      render(<EventCard event={event} link={'#'} />, {
        mocks: [
          ...emptyKeywordSetRequestMocks,
          getPlaceRequestMock(event.location?.id ?? ''),
        ],
      });
      await waitFor(() => {
        expect(screen.getByText(/huomenna klo 10:30/i)).toBeInTheDocument();
      });
    });
  });
});
