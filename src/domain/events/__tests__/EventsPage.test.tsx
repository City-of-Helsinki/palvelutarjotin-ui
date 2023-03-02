import { MockedResponse } from '@apollo/client/testing';
import { advanceTo, clear } from 'jest-date-mock';
import capitalize from 'lodash/capitalize';
import React from 'react';
import wait from 'waait';

import {
  Event,
  PopularKeywordsDocument,
  UpcomingEventsDocument,
} from '../../../generated/graphql';
import {
  fakePEvent,
  fakeLocalizedObject,
  fakeKeyword,
  fakeOccurrences,
  fakeOccurrence,
  fakeKeywords,
  fakeUpcomingEvents,
} from '../../../utils/mockDataUtils';
import {
  render,
  screen,
  act,
  configure,
  userEvent,
} from '../../../utils/testUtils';
import { ROUTES } from '../../app/routes/constants';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

jest.setTimeout(70_000);

const testDate = new Date(2020, 5, 20);

const popularKultusKeywords = [
  { name: 'Vaikuttaminen ja osallisuus', id: 'asfdghg1435' },
  { name: 'Teatteri, tanssi ja sirkus', id: 'asdgfh64hjfg' },
  { name: 'Musiikki', id: 'dfgh78' },
  { name: 'Sanataide ja kirjallisuus', id: 'dfghjgj679' },
  { name: 'Tiede', id: 'sdgfhghm567' },
];

const keywords = [
  fakeKeyword({ name: fakeLocalizedObject('Vanhukset') }),
  fakeKeyword({ name: fakeLocalizedObject('Nuoret') }),
  fakeKeyword({ name: fakeLocalizedObject('Lapset') }),
  fakeKeyword({ name: fakeLocalizedObject('Ilmainen') }),
];

const eventMocks: Partial<Event>[] = [
  {
    name: fakeLocalizedObject('Testitapahtuma 1'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 1'),
    pEvent: fakePEvent({
      nextOccurrence: fakeOccurrences(1, [
        fakeOccurrence({
          startTime: new Date(2020, 8, 20, 10, 30).toISOString(),
        }),
      ]),
    }),
    keywords: keywords,
  },
  {
    name: fakeLocalizedObject('Testitapahtuma 2'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 2'),
    pEvent: fakePEvent({
      nextOccurrence: fakeOccurrences(1, [
        fakeOccurrence({
          startTime: new Date(2020, 9, 21, 10, 20).toISOString(),
        }),
      ]),
    }),
    keywords: keywords,
  },
  {
    name: fakeLocalizedObject('Testitapahtuma 3'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 3'),
    pEvent: fakePEvent({
      nextOccurrence: fakeOccurrences(1, [
        fakeOccurrence({
          startTime: new Date(2020, 10, 22, 12, 40).toISOString(),
        }),
      ]),
    }),
    keywords: keywords,
  },
  {
    name: fakeLocalizedObject('Testitapahtuma 4'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 4'),
    pEvent: fakePEvent({
      nextOccurrence: null,
      occurrences: fakeOccurrences(0),
    }),
    keywords: keywords,
  },
];

const mocks: MockedResponse[] = [
  {
    request: {
      query: UpcomingEventsDocument,
      variables: {
        include: ['keywords', 'location', 'audience', 'in_language'],
      },
    },
    result: {
      data: {
        upcomingEvents: fakeUpcomingEvents(4, eventMocks),
      },
    },
  },
  {
    request: {
      query: PopularKeywordsDocument,
      variables: {
        amount: 10,
        showAllKeywords: true,
      },
    },
    result: {
      data: {
        popularKultusKeywords: fakeKeywords(
          5,
          popularKultusKeywords.map((k) => ({
            name: fakeLocalizedObject(k.name),
            id: k.id,
          }))
        ),
      },
    },
  },
];

afterEach(() => {
  clear();
});

test('renders search form and events list with correct information', async () => {
  advanceTo(testDate);
  render(<EventsPage />, { mocks });

  await act(wait);

  expect(
    screen.queryByRole('heading', {
      name: 'Oppimisen elämyksiä koko kaupungissa',
    })
  ).toBeInTheDocument();
  expect(screen.queryByLabelText('Hae tapahtumia')).toBeInTheDocument();
  expect(
    screen.queryByLabelText('Kielet', { selector: 'button' })
  ).not.toBeInTheDocument();

  await userEvent.click(
    screen.getByRole('button', { name: /tarkennettu haku/i })
  );

  expect(screen.queryByLabelText('Alueet')).toBeInTheDocument();
  expect(screen.queryByLabelText('Paikat')).toBeInTheDocument();
  expect(screen.queryByLabelText('Alkaen')).toBeInTheDocument();
  expect(screen.queryByLabelText('Päättyen')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Hae tapahtumia' })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('heading', { name: 'Tulevat tapahtumat' })
  ).toBeInTheDocument();

  // one event has no upcoming occurrences
  expect(screen.queryByText('Ei tulevia tapahtuma-aikoja')).toBeInTheDocument();

  eventMocks.forEach((event) => {
    if (!event?.name?.fi) {
      throw new Error('Event name is missing');
    }
    if (!event?.shortDescription?.fi) {
      throw new Error('Event description is missing');
    }
    expect(screen.queryByText(event.name.fi)).toBeInTheDocument();
    expect(screen.queryByText(event.shortDescription.fi)).toBeInTheDocument();
  });

  for (const keyword of popularKultusKeywords) {
    const popularKeywordLink = await screen.findByRole('link', {
      name: keyword.name,
    });
    expect(popularKeywordLink).toHaveAttribute(
      'href',
      `${ROUTES.EVENTS_SEARCH}?categories=${keyword.id}`
    );
  }

  keywords.forEach((keyword) => {
    if (!keyword?.name?.fi) {
      throw new Error('keyword name is missing');
    }
    expect(screen.getAllByText(capitalize(keyword.name.fi))).toHaveLength(4);
  });

  expect(
    screen.queryByRole('button', { name: 'Näytä lisää' })
  ).toBeInTheDocument();
});
