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
  fakeOccurrences,
  fakeOccurrence,
} from '../../../utils/mockDataUtils';
import {
  render,
  screen,
  act,
  configure,
  userEvent,
  fireEvent,
} from '../../../utils/testUtils';
import EventsSearchPage from '../EventsSearchPage';

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
      nextOccurrence: fakeOccurrences(1, [
        fakeOccurrence({
          startTime: new Date(2020, 8, 20, 10, 30).toISOString(),
        }),
      ]),
    }),
    keywords: fakeKeywords,
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
    keywords: fakeKeywords,
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
    keywords: fakeKeywords,
  },
  {
    name: fakeLocalizedObject('Testitapahtuma 4'),
    shortDescription: fakeLocalizedObject('Tapahtuman lyhytkuvaus 4'),
    pEvent: fakePEvent({
      nextOccurrence: null,
      occurrences: fakeOccurrences(0),
    }),
    keywords: fakeKeywords,
  },
];

const mocks: MockedResponse[] = [
  {
    request: {
      query: EventsDocument,
      variables: {
        include: ['keywords', 'location', 'audience'],
        keyword: [],
        allOngoingAnd: null,
        inLanguage: '',
        location: '',
        start: 'now',
        pageSize: 10,
        sort: 'start_time',
        end: null,
        organisationId: '',
        division: '',
      },
    },
    result: {
      data: {
        events: fakeEvents(4, eventMocks),
      },
    },
  },
];

afterEach(() => {
  clear();
});

test('renders search form and events list with correct information', async () => {
  advanceTo(testDate);
  render(<EventsSearchPage />, { mocks });

  await act(wait);

  expect(screen.queryByLabelText('Hae tapahtumia')).toBeInTheDocument();

  // compact search panel has languages hidden
  expect(
    screen.queryByLabelText('Kielet', { selector: 'button' })
  ).not.toBeInTheDocument();

  // expand search panel
  userEvent.click(screen.getByRole('button', { name: /muokkaa hakua/i }));

  expect(
    screen.queryByRole('button', { name: /piilota lisäkentät/i })
  ).toBeInTheDocument();

  expect(screen.queryByLabelText('Alueet')).toBeInTheDocument();
  expect(screen.queryByLabelText('Paikat')).toBeInTheDocument();
  expect(screen.queryByLabelText('Alkaen')).toBeInTheDocument();
  expect(screen.queryByLabelText('Päättyen')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Hae tapahtumia' })
  ).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /järjestys/i })).toHaveTextContent(
    'Ajankohtaista'
  );

  expect(
    screen.queryByRole('heading', { name: 'Tapahtumat 4 kpl' })
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

  fakeKeywords.forEach((keyword) => {
    if (!keyword?.name?.fi) {
      throw new Error('keyword name is missing');
    }
    expect(screen.getAllByText(keyword.name.fi)).toHaveLength(4);
  });
});

test('search form is compact state when only text parameter is used', async () => {
  advanceTo(testDate);
  const searchText = 'hakusana';
  render(<EventsSearchPage />, { mocks, query: { text: searchText } });

  const textInput = await screen.findByRole('textbox', {
    name: /hae tapahtumia/i,
  });
  expect(textInput).toHaveValue(searchText);

  testAdvancedSearchNotVisible();
});

test('search form expands when text input is focused', async () => {
  advanceTo(testDate);
  const searchText = 'hakusana';
  render(<EventsSearchPage />, { mocks, query: { text: searchText } });

  const textInput = await screen.findByRole('textbox', {
    name: /hae tapahtumia/i,
  });
  expect(textInput).toHaveValue(searchText);

  testAdvancedSearchNotVisible();

  fireEvent.focus(textInput);

  testAdvancedSearchIsVisible();
});

test('search form is in advanced state if advanced search parameters are used', async () => {
  advanceTo(testDate);
  const searchText = 'hakusana';
  render(<EventsSearchPage />, {
    mocks,
    query: { text: searchText, categories: 'categories=kultus%3A13' },
  });

  const textInput = await screen.findByRole('textbox', {
    name: /hae tapahtumia/i,
  });
  expect(textInput).toHaveValue(searchText);

  testAdvancedSearchIsVisible();

  // hides advanced search
  userEvent.click(
    screen.getByRole('button', {
      name: /piilota lisäkentät/i,
    })
  );

  testAdvancedSearchNotVisible();
});

const advancedSearchInputLabels = [
  'Kohderyhmät',
  'Paikat',
  'Alkaen',
  'Päättyen',
  'Kategoriat',
  'Aktiviteetit',
  'Alueet',
  'Kielet',
];

function testAdvancedSearchNotVisible() {
  for (const label in advancedSearchInputLabels) {
    expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
  }

  expect(
    screen.queryByRole('button', { name: 'Hae tapahtumia' })
  ).not.toBeInTheDocument();
}

function testAdvancedSearchIsVisible() {
  for (const label of advancedSearchInputLabels) {
    expect(screen.queryAllByLabelText(label)[0]).toBeInTheDocument();
  }

  expect(
    screen.queryByRole('button', { name: 'Hae tapahtumia' })
  ).toBeInTheDocument();
}