import * as graphql from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeOccurrences,
  fakePEvent,
} from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import EventCard from '../EventCard';

const internalEventWithSpace = fakeEvent({
  pEvent: fakePEvent({
    enrolmentStart: '2020-07-13T06:00:00+00:00',
    externalEnrolmentUrl: null,
    hasSpaceForEnrolments: true,
    occurrences: fakeOccurrences(2, [
      {
        remainingSeats: 1,
        seatsApproved: 1,
        seatsTaken: 1,
      },
    ]),
  }),
});

const internalEventFull = fakeEvent({
  pEvent: fakePEvent({
    enrolmentStart: '2020-07-13T06:00:00+00:00',
    externalEnrolmentUrl: null,
    hasSpaceForEnrolments: false,
    occurrences: fakeOccurrences(2, [
      {
        remainingSeats: 0,
        seatsApproved: 1,
        seatsTaken: 1,
      },
    ]),
  }),
});

const externalEvent = fakeEvent({
  pEvent: fakePEvent({
    enrolmentStart: null,
    externalEnrolmentUrl: 'https://external-enrolment-url.com',
    hasSpaceForEnrolments: null,
    occurrences: fakeOccurrences(2, [
      {
        remainingSeats: undefined,
        seatsApproved: undefined,
        seatsTaken: undefined,
      },
    ]),
  }),
});

const eventWithoutEnrolmentSystem = fakeEvent({
  pEvent: fakePEvent({
    enrolmentStart: null,
    externalEnrolmentUrl: null,
    hasSpaceForEnrolments: null,
    occurrences: fakeOccurrences(2),
  }),
});

const emptyKeywordSetRequestMocks = [
  {
    request: {
      query: graphql.KeywordSetDocument,
      variables: {
        setType: 'TARGET_GROUP',
      },
    },
    result: {
      data: { keywordSet: null },
    },
  },
  {
    request: {
      query: graphql.KeywordSetDocument,
      variables: {
        setType: 'CATEGORY',
      },
    },
    result: {
      data: { keywordSet: null },
    },
  },
  {
    request: {
      query: graphql.KeywordSetDocument,
      variables: {
        setType: 'ADDITIONAL_CRITERIA',
      },
    },
    result: {
      data: { keywordSet: null },
    },
  },
];

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
  describe('enrolment status', () => {
    it('shows full when none of the event occurrences have space left for enrolments', async () => {
      render(<EventCard event={internalEventFull} link="#" />, {
        mocks: [
          ...emptyKeywordSetRequestMocks,
          getPlaceRequestMock(internalEventFull.location?.id!),
        ],
      });
      expect(screen.getByText(/täynnä/i)).toBeInTheDocument();
    });

    it('shows free when some of the event occurrences have any space left for enrolments', async () => {
      render(<EventCard event={internalEventWithSpace} link="#" />, {
        mocks: [
          ...emptyKeywordSetRequestMocks,
          getPlaceRequestMock(internalEventWithSpace.location?.id!),
        ],
      });
      expect(screen.getByText(/paikkoja jäljellä/i)).toBeInTheDocument();
    });

    it('shows external enrolments when event enrolments are handled on some another site', async () => {
      render(<EventCard event={externalEvent} link="#" />, {
        mocks: [
          ...emptyKeywordSetRequestMocks,
          getPlaceRequestMock(externalEvent.location?.id!),
        ],
      });
      expect(
        screen.getByText(/ilmoittautuminen muulla sivustolla/i)
      ).toBeInTheDocument();
    });

    it('shows no enrolment status when the event has no enrolment system enabled', async () => {
      render(<EventCard event={eventWithoutEnrolmentSystem} link="#" />, {
        mocks: [
          ...emptyKeywordSetRequestMocks,
          getPlaceRequestMock(eventWithoutEnrolmentSystem.location?.id!),
        ],
      });
      expect(screen.queryByText(/täynnä/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/paikkoja jäljellä/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/ilmoittautuminen muulla sivustolla/i)
      ).not.toBeInTheDocument();
    });
  });
});
