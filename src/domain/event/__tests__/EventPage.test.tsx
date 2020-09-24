import { MockedProvider } from '@apollo/react-testing';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { advanceTo } from 'jest-date-mock';
import * as Router from 'next/router';
import React from 'react';

import enrolmentMessages from '../../../../public/static/locales/fi/enrolment.json';
import eventMessages from '../../../../public/static/locales/fi/event.json';
import occurrenceMessages from '../../../../public/static/locales/fi/occurrence.json';
import {
  EventDocument,
  PlaceDocument,
  VenueDocument,
} from '../../../generated/graphql';
import { Router as i18nRouter } from '../../../i18n';
import { ROUTES } from '../../app/routes/constants';
import eventsMockData from '../__mocks__/eventWithOccurrences.json';
import placeMock from '../__mocks__/placeMock.json';
import venueMock from '../__mocks__/venueMock.json';
import EventPage from '../EventPage';

const apolloMocks = [
  {
    request: {
      query: EventDocument,
      variables: {
        id: 'palvelutarjotin:afzunowba4',
        include: ['keywords,location'],
      },
    },
    result: eventsMockData,
  },
  {
    request: {
      query: PlaceDocument,
      variables: {
        id: eventsMockData.data.event.location.id,
      },
    },
    result: placeMock,
  },
  {
    request: {
      query: VenueDocument,
      variables: {
        id: eventsMockData.data.event.location.id,
      },
    },
    result: venueMock,
  },
];

const eventData = eventsMockData.data.event;
const originalUseRouter = Router.useRouter;

const rowText = '27.07.2020 12:00 – 12:30 Soukan kirjasto 0 / 30 Ilmoittaudu';

advanceTo(new Date(2020, 6, 23));

beforeAll(() => {
  jest.setTimeout(30000);
  (Router.useRouter as any) = () => {
    return {
      query: {
        eventId: eventsMockData.data.event.id,
      },
      asPath: '/fi/event/palvelutarjotin:afzunowba4',
    };
  };
});

afterAll(() => {
  jest.setTimeout(5000);
  (Router.useRouter as any) = originalUseRouter;
});

it('renders page and event information correctly', async () => {
  render(
    <MockedProvider mocks={apolloMocks}>
      <EventPage />
    </MockedProvider>
  );

  // wait for graphql request to complete
  await screen.findByRole('heading', {
    name: eventData.name.fi,
    hidden: true,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(placeMock.data.place.name.fi)).toHaveLength(
      10
    );
  });

  // items that should be found by text in the document
  const queryByText = [
    eventData.description.fi,
    eventData.pEvent.organisation.name,
    `Kuva: ${eventData.images[0].photographerName}`,
    eventMessages.contactPerson,
    eventData.pEvent.contactPhoneNumber,
    eventData.pEvent.contactPerson.name,
    eventData.pEvent.contactEmail,
  ];

  const queryByRole = [
    {
      role: 'heading',
      name: eventData.name.fi,
    },
    {
      role: 'heading',
      name: eventData.shortDescription.fi,
    },
    {
      role: 'img',
      name: eventData.images[0].altText,
    },
  ];

  queryByText.forEach((text) => {
    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  queryByRole.forEach((item) => {
    expect(
      screen.queryByRole(item.role, { name: item.name, hidden: true })
    ).toBeInTheDocument();
  });

  // Event image should have correct src url
  const eventImage = screen.queryByRole('img', {
    name: eventData.images[0].altText,
    hidden: true,
  });
  expect(eventImage).toHaveAttribute('src', eventData.images[0].url);

  // All keywords should be found in the document
  eventData.keywords.forEach((keyword) => {
    expect(
      screen.queryByText(keyword.name.fi, { exact: true })
    ).toBeInTheDocument();
  });
});

it('renders occurrences table and related stuff correctly', async () => {
  render(
    <MockedProvider mocks={apolloMocks}>
      <EventPage />
    </MockedProvider>
  );

  // wait for graphql request to complete
  await screen.findByRole('heading', {
    name: eventData.name.fi,
    hidden: true,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(placeMock.data.place.name.fi)).toHaveLength(
      10
    );
  });

  const occurrencesTitle = screen.queryByText(
    eventMessages.occurrencesTitle.replace('{{count}}', '10')
  );
  const showMoreOccurrencesButton = screen.queryByRole('button', {
    name: eventMessages.occurrenceList.loadMoreOccurrences,
    hidden: true,
  });
  const enrolmentButton = screen.queryByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonSelectOccurrences.replace(
      '{{neededOccurrences}}',
      eventData.pEvent.neededOccurrences.toString()
    ),
    hidden: true,
  });

  expect(occurrencesTitle).toBeInTheDocument();
  expect(showMoreOccurrencesButton).toBeInTheDocument();
  expect(enrolmentButton).toBeInTheDocument();
  expect(enrolmentButton).toBeDisabled();

  const columnHeaders = [
    enrolmentMessages.occurrenceTable.columnDate,
    enrolmentMessages.occurrenceTable.columnPlace,
    enrolmentMessages.occurrenceTable.columnSeatsInfo,
    enrolmentMessages.occurrenceTable.columnAdditionalInfo,
  ];

  columnHeaders.forEach((headerText) => {
    expect(
      screen.queryByRole('columnheader', { name: headerText })
    ).toBeInTheDocument();
  });

  const occurrences = within(screen.getByTestId('occurrences-section'));

  // might be too slow test
  expect(
    occurrences.getByRole('row', {
      name: rowText,
      hidden: true,
    })
  ).toBeInTheDocument();
});

it('selecting enrolments works and buttons have correct texts', async () => {
  render(
    <MockedProvider mocks={apolloMocks}>
      <EventPage />
    </MockedProvider>
  );

  // wait for graphql request to complete
  await screen.findByRole('heading', {
    name: eventData.name.fi,
    hidden: true,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(placeMock.data.place.name.fi)).toHaveLength(
      10
    );
  });

  let occurrenceEnrolmentButtons = screen.getAllByRole('button', {
    name: 'Ilmoittaudu',
    hidden: true,
  });

  userEvent.click(occurrenceEnrolmentButtons[0]);

  const getSelectedOccurrencesButtonText = (
    selectedOccurrences: number,
    neededOccurrences: number
  ) =>
    occurrenceMessages.occurrenceSelection.buttonSelectedOccurrences
      .replace('{{selectedOccurrences}}', selectedOccurrences.toString())
      .replace('{{neededOccurrences}}', neededOccurrences.toString());

  expect(
    screen.queryByRole('button', {
      name: getSelectedOccurrencesButtonText(1, 3),
      hidden: true,
    })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', {
      name: getSelectedOccurrencesButtonText(2, 3),
      hidden: true,
    })
  ).not.toBeInTheDocument();

  // buttons from previous query are stale because of rerender
  // -> new query is needed
  occurrenceEnrolmentButtons = screen.getAllByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonEnrolOccurrence,
    hidden: true,
  });

  userEvent.click(occurrenceEnrolmentButtons[0]);

  expect(
    screen.queryAllByRole('button', {
      name: getSelectedOccurrencesButtonText(2, 3),
      hidden: true,
    })
  ).toHaveLength(2);

  occurrenceEnrolmentButtons = screen.getAllByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonEnrolOccurrence,
    hidden: true,
  });

  userEvent.click(occurrenceEnrolmentButtons[0]);

  userEvent.click(
    screen.getByRole('button', {
      name: eventMessages.occurrenceList.loadMoreOccurrences,
      hidden: true,
    })
  );

  // should be 3 buttons with valittu text and not diabled
  expect(
    screen
      .queryAllByRole('button', {
        name: getSelectedOccurrencesButtonText(3, 3),
        hidden: true,
      })
      .filter((button) => !button.hasAttribute('disabled'))
  ).toHaveLength(3);

  // should be 2 disabled buttons with 'valittu' text
  expect(
    screen
      .queryAllByRole('button', {
        name: getSelectedOccurrencesButtonText(3, 3),
        hidden: true,
      })
      .filter((button) => button.hasAttribute('disabled'))
  ).toHaveLength(2);

  const originalRouter = i18nRouter.push;
  i18nRouter.push = jest.fn();

  userEvent.click(screen.getByRole('button', { name: 'Ilmoittaudu' }));

  expect(i18nRouter.push).toHaveBeenCalledWith({
    pathname: ROUTES.CREATE_ENROLMENT.replace(':id', eventData.id as string),
    query: {
      occurrences: [
        'T2NjdXJyZW5jZU5vZGU6ODM=',
        'T2NjdXJyZW5jZU5vZGU6ODQ=',
        'T2NjdXJyZW5jZU5vZGU6ODU=',
      ],
    },
  });

  i18nRouter.push = originalRouter;
});

it('opens expanded area when clicked', async () => {
  render(
    <MockedProvider mocks={apolloMocks}>
      <EventPage />
    </MockedProvider>
  );

  // wait for graphql request to complete
  await screen.findByRole('heading', {
    name: eventData.name.fi,
    hidden: true,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(placeMock.data.place.name.fi)).toHaveLength(
      10
    );
  });

  const occurrenceRow = within(
    screen.getByRole('row', {
      name: rowText,
      hidden: true,
    })
  );

  const expandButton = occurrenceRow.getByRole('button', {
    name: occurrenceMessages.showOccurrenceDetails,
    hidden: true,
  });

  expect(
    screen.queryByText(occurrenceMessages.dateAndTimeTitle)
  ).not.toBeInTheDocument();

  userEvent.click(expandButton);

  await waitFor(() => {
    expect(
      screen.queryByText(venueMock.data.venue.translations[0].description)
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByText(occurrenceMessages.dateAndTimeTitle)
  ).toBeInTheDocument();
});

it('filters occurrence list correctly when sate filters are selected', async () => {
  render(
    <MockedProvider mocks={apolloMocks}>
      <EventPage />
    </MockedProvider>
  );

  // wait for graphql request to complete
  await screen.findByRole('heading', {
    name: eventData.name.fi,
    hidden: true,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(placeMock.data.place.name.fi)).toHaveLength(
      10
    );
  });

  userEvent.click(
    screen.getByLabelText(eventMessages.occurrenceList.labelStartDateFilter)
  );
  userEvent.click(
    screen.getByRole('button', { name: 'Valitse 28.07.2020', hidden: true })
  );
  userEvent.click(
    screen.getByLabelText(eventMessages.occurrenceList.labelEndDateFilter)
  );
  userEvent.click(
    screen.getByRole('button', { name: 'Valitse 29.07.2020', hidden: true })
  );

  const tableRows = screen.getAllByRole('row');

  // 2 occurrences should be visible + header row for table
  expect(tableRows).toHaveLength(3);

  const occurrenceEnrolButtons = screen.getAllByRole('button', {
    name: eventMessages.occurrenceList.enrolOccurrenceButton,
    hidden: true,
  });
  expect(occurrenceEnrolButtons).toHaveLength(2);
});
