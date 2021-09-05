import { MockedResponse } from '@apollo/client/testing';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';
import wait from 'waait';

import { EventsDocument, Event } from '../../../generated/graphql';
import {
  fakeEvents,
  fakePEvent,
  fakeLocalizedObject,
  fakeKeyword,
} from '../../../utils/mockDataUtils';
import { render, screen, act, configure } from '../../../utils/testUtils';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

const testDate = new Date(2020, 5, 20);

const fakeKeywords = [
  fakeKeyword({ name: fakeLocalizedObject('vanhukset') }),
  fakeKeyword({ name: fakeLocalizedObject('nuoret') }),
  fakeKeyword({ name: fakeLocalizedObject('lapset') }),
  fakeKeyword({ name: fakeLocalizedObject('ilmainen') }),
];

const eventMocks: Partial<Event>[] = [
  {
    name: fakeLocalizedObject('Testitapahtuma 1'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 1'),
    pEvent: fakePEvent({
      nextOccurrenceDatetime: new Date(2020, 8, 20, 10, 30).toISOString(),
      lastOccurrenceDatetime: '',
    }),
    keywords: fakeKeywords,
  },
  {
    name: fakeLocalizedObject('Testitapahtuma 2'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 2'),
    pEvent: fakePEvent({
      nextOccurrenceDatetime: new Date(2020, 9, 21, 10, 20).toISOString(),
      lastOccurrenceDatetime: '',
    }),
    keywords: fakeKeywords,
  },
  {
    name: fakeLocalizedObject('Testitapahtuma 3'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 3'),
    pEvent: fakePEvent({
      nextOccurrenceDatetime: new Date(2020, 10, 22, 12, 40).toISOString(),
      lastOccurrenceDatetime: '',
    }),
    keywords: fakeKeywords,
  },
];

const mocks: MockedResponse[] = [
  {
    request: {
      query: EventsDocument,
      variables: {
        include: ['keywords', 'location'],
        keyword: [],
        text: '',
        inLanguage: '',
        location: '',
        start: 'now',
        pageSize: 10,
        sort: 'start_time',
        end: null,
        organisationId: '',
      },
    },
    result: {
      data: {
        events: fakeEvents(3, eventMocks),
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
  ).toBeInTheDocument();
  expect(screen.queryByLabelText('Paikat')).toBeInTheDocument();
  expect(screen.queryByLabelText('Alkaen')).toBeInTheDocument();
  expect(screen.queryByLabelText('Päättyen')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Hae' })).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Tyhjennä hakuehdot' })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/Järjestys/i, { selector: 'button' })
  ).toHaveTextContent('Ajankohta');

  expect(
    screen.queryByRole('heading', { name: 'Tapahtumat 3 kpl' })
  ).toBeInTheDocument();

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

  fakeKeywords.forEach((keyword) => {
    if (!keyword?.name?.fi) {
      throw new Error('keyword name is missing');
    }
    expect(screen.getAllByText(keyword.name.fi)).toHaveLength(3);
  });
});
