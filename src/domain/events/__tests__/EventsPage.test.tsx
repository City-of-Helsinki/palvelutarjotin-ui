import { MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import { advanceTo, clear } from 'jest-date-mock';
import capitalize from 'lodash/capitalize';
import React from 'react';

import {
  Event,
  PopularKeywordsDocument,
  UpcomingEventsDocument,
} from '../../../generated/graphql';
import { emptyKeywordSetRequestMocks } from '../../../tests/apollo-mocks/keywordSetMocks';
import {
  fakePEvent,
  fakeLocalizedObject,
  fakeKeyword,
  fakeOccurrences,
  fakeOccurrence,
  fakeKeywords,
  fakeUpcomingEvents,
} from '../../../utils/mockDataUtils';
import { render, screen, configure, userEvent } from '../../../utils/testUtils';
import { ROUTES } from '../../app/routes/constants';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

jest.setTimeout(95_000);

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
  ...emptyKeywordSetRequestMocks,
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

  expect(
    await screen.findByRole('heading', {
      name: 'Hyvinvointia retkistä ja elämyksistä',
    })
  ).toBeInTheDocument();
  expect(await screen.findByLabelText('Hae tapahtumia')).toBeInTheDocument();
  await waitFor(() => {
    expect(
      screen.queryByLabelText('Kielet', { selector: 'button' })
    ).not.toBeInTheDocument();
  });

  await userEvent.click(
    screen.getByRole('button', { name: /tarkennettu haku/i })
  );

  expect(await screen.findByLabelText('Alueet')).toBeInTheDocument();
  expect(await screen.findByLabelText('Paikat')).toBeInTheDocument();
  expect(
    await screen.findByRole('textbox', { name: /alkaen/i })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('textbox', { name: /päättyen/i })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('button', { name: 'Hae tapahtumia' })
  ).toBeInTheDocument();

  expect(
    await screen.findByRole('heading', { name: 'Tulevat tapahtumat' })
  ).toBeInTheDocument();

  // one event has no upcoming occurrences
  expect(
    await screen.findByText('Ei tulevia tapahtuma-aikoja')
  ).toBeInTheDocument();

  for (const event of eventMocks) {
    if (!event?.name?.fi) {
      throw new Error('Event name is missing');
    }
    if (!event?.shortDescription?.fi) {
      throw new Error('Event description is missing');
    }
    expect(await screen.findByText(event.name.fi)).toBeInTheDocument();
    expect(
      await screen.findByText(event.shortDescription.fi)
    ).toBeInTheDocument();
  }

  for (const keyword of popularKultusKeywords) {
    const popularKeywordLink = await screen.findByRole('link', {
      name: keyword.name,
    });
    expect(popularKeywordLink).toHaveAttribute(
      'href',
      `${ROUTES.EVENTS_SEARCH}?categories=${keyword.id}`
    );
  }

  for (const keyword of keywords) {
    if (!keyword?.name?.fi) {
      throw new Error('keyword name is missing');
    }
    expect(
      await screen.findAllByText(capitalize(keyword.name.fi))
    ).toHaveLength(4);
  }

  expect(
    await screen.findByRole('button', { name: 'Näytä lisää' })
  ).toBeInTheDocument();
});
