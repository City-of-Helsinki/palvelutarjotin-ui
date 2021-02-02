import { MockedProvider } from '@apollo/react-testing';
import {
  configure,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { advanceTo } from 'jest-date-mock';
import * as Router from 'next/router';
import React from 'react';

import enrolmentMessages from '../../../../public/static/locales/fi/enrolment.json';
import eventMessages from '../../../../public/static/locales/fi/event.json';
import occurrenceMessages from '../../../../public/static/locales/fi/occurrence.json';
import {
  EventDocument,
  Language,
  PlaceDocument,
  VenueDocument,
} from '../../../generated/graphql';
import { Router as i18nRouter } from '../../../i18n';
import {
  fakeEvent,
  fakeImage,
  fakeKeyword,
  fakeLocalizedObject,
  fakeOccurrences,
  fakeOrganisation,
  fakePerson,
  fakePEvent,
  fakePlace,
  fakeVenue,
} from '../../../utils/mockDataUtils';
import { ROUTES } from '../../app/routes/constants';
import EventPage from '../EventPage';

const data = {
  id: 'palvelutarjotin:afzunowba4',
  placeId: '123321123',
  name: 'Testitapahtuma',
  description: 'Tapahtuman pitkä kuvaus',
  organisationName: 'Testiorganisaatio',
  contactPersonName: 'contact person',
  contactPersonEmail: 'testi@testaaja.fi',
  contactPersonPhoneNumber: '123321123',
  shortDescription: 'Tapahtuman lyhyt kuvaus',
  imagePhotographerName: 'Valo valokuvaaja',
  fakeAltText: 'Vaihtoehtoinen teksti',
  neededOccurrences: 3,
  placeName: 'Soukan kirjasto',
  keywords: ['perheet', 'lapset'],
  venueDescription: 'Venue description',
  placeId1: 'sdgfdgsequrwtw',
  placeId2: 'adsgfhwdgfnsagdbs',
  placeId3: 'aghrewghher534643',
};

const eventResult = {
  data: {
    event: fakeEvent({
      id: data.id,
      name: fakeLocalizedObject(data.name),
      description: fakeLocalizedObject(data.description),
      shortDescription: fakeLocalizedObject(data.shortDescription),
      location: fakePlace({ id: data.placeId }),
      pEvent: fakePEvent({
        enrolmentEndDays: 1,
        enrolmentStart: '2020-07-13T06:00:00+00:00',
        organisation: fakeOrganisation({ name: data.organisationName }),
        contactPhoneNumber: data.contactPersonPhoneNumber,
        contactEmail: data.contactPersonEmail,
        contactPerson: fakePerson({
          name: data.contactPersonName,
        }),
        occurrences: fakeOccurrences(11, [
          {
            startTime: '2020-07-15T09:00:00+00:00',
            placeId: data.placeId,
            id: data.placeId1,
          },
          {
            startTime: '2020-07-16T09:00:00+00:00',
            placeId: data.placeId,
            id: data.placeId2,
          },
          {
            startTime: '2020-07-19T09:00:00+00:00',
            placeId: data.placeId,
            id: data.placeId3,
          },
          { startTime: '2020-07-20T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-21T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-22T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-23T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-27T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-28T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-29T09:00:00+00:00', placeId: data.placeId },
          { startTime: '2020-07-30T09:30:00+00:00', placeId: data.placeId },
        ]),
        neededOccurrences: data.neededOccurrences,
      }),
      images: [
        fakeImage({
          photographerName: data.imagePhotographerName,
          altText: data.fakeAltText,
        }),
      ],
      keywords: data.keywords.map((k) =>
        fakeKeyword({ name: fakeLocalizedObject(k) })
      ),
    }),
  },
};

const placeResult = {
  data: {
    place: fakePlace({ name: fakeLocalizedObject(data.placeName) }),
  },
};

const venueResult = {
  data: {
    venue: fakeVenue({
      translations: [
        {
          description: data.venueDescription,
          languageCode: Language.Fi,
          __typename: 'VenueTranslationType',
        },
      ],
    }),
  },
};

configure({ defaultHidden: true });

const apolloMocks = [
  {
    request: {
      query: EventDocument,
      variables: {
        id: data.id,
        include: ['keywords', 'location'],
      },
    },
    result: eventResult,
  },
  {
    request: {
      query: PlaceDocument,
      variables: {
        id: data.placeId,
      },
    },
    result: placeResult,
  },
  {
    request: {
      query: VenueDocument,
      variables: {
        id: data.placeId,
      },
    },
    result: venueResult,
  },
];

const eventData = eventResult.data.event;
const originalUseRouter = Router.useRouter;

const rowText = `27.07.2020 12:00 – 12:30 ${data.placeName} 30 / 30 Ilmoittaudu`;

advanceTo(new Date(2020, 6, 14));

beforeAll(() => {
  jest.setTimeout(30000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Router.useRouter as any) = () => {
    return {
      query: {
        eventId: eventResult.data.event.id,
      },
      asPath: '/fi/event/palvelutarjotin:afzunowba4',
    };
  };
});

afterAll(() => {
  jest.setTimeout(5000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    name: data.name,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(10);
  });

  // items that should be found by text in the document
  const queryByText = [
    data.description,
    data.organisationName,
    data.shortDescription,
    `Kuva: ${data.imagePhotographerName}`,
    data.contactPersonPhoneNumber,
    data.contactPersonName,
    data.contactPersonEmail,
    eventMessages.contactPerson,
  ];

  const queryByRole = [
    {
      role: 'heading',
      name: data.name,
    },
    {
      role: 'img',
      name: data.fakeAltText,
    },
  ];

  queryByText.forEach((text) => {
    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  queryByRole.forEach((item) => {
    expect(
      screen.getByRole(item.role, { name: item.name })
    ).toBeInTheDocument();
  });

  // Event image should have correct src url
  const eventImage = screen.queryByRole('img', {
    name: data.fakeAltText,
  });
  expect(eventImage).toHaveAttribute('src', eventData.images[0].url);

  // All keywords should be found in the document
  data.keywords.forEach((keyword) => {
    expect(screen.queryByText(keyword, { exact: true })).toBeInTheDocument();
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
    name: data.name,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(10);
  });

  const occurrencesTitle = screen.queryByText(
    eventMessages.occurrencesTitle.replace('{{count}}', '10')
  );
  const showMoreOccurrencesButton = screen.queryByRole('button', {
    name: eventMessages.occurrenceList.loadMoreOccurrences,
  });
  const enrolmentButton = screen.queryByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonSelectOccurrences.replace(
      '{{neededOccurrences}}',
      eventData.pEvent.neededOccurrences.toString()
    ),
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
    name: data.name,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(10);
  });

  let occurrenceEnrolmentButtons = screen.getAllByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonEnrolOccurrence,
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
    })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', {
      name: getSelectedOccurrencesButtonText(2, 3),
    })
  ).not.toBeInTheDocument();

  // buttons from previous query are stale because of rerender
  // -> new query is needed
  occurrenceEnrolmentButtons = screen.getAllByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonEnrolOccurrence,
  });

  userEvent.click(occurrenceEnrolmentButtons[0]);

  expect(
    screen.queryAllByRole('button', {
      name: getSelectedOccurrencesButtonText(2, 3),
    })
  ).toHaveLength(2);

  occurrenceEnrolmentButtons = screen.getAllByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonEnrolOccurrence,
  });

  userEvent.click(occurrenceEnrolmentButtons[0]);

  userEvent.click(
    screen.getByRole('button', {
      name: eventMessages.occurrenceList.loadMoreOccurrences,
    })
  );

  // should be 3 buttons with valittu text and not disabled
  expect(
    screen
      .queryAllByRole('button', {
        name: getSelectedOccurrencesButtonText(3, data.neededOccurrences),
      })
      .filter((button) => !button.hasAttribute('disabled'))
  ).toHaveLength(3);

  // should be 7 disabled buttons with 'valittu' text
  expect(
    screen
      .queryAllByRole('button', {
        name: getSelectedOccurrencesButtonText(3, data.neededOccurrences),
      })
      .filter((button) => button.hasAttribute('disabled'))
  ).toHaveLength(8);

  const originalRouter = i18nRouter.push;
  i18nRouter.push = jest.fn();

  userEvent.click(screen.getByRole('button', { name: 'Ilmoittaudu' }));

  expect(i18nRouter.push).toHaveBeenCalledWith({
    pathname: ROUTES.CREATE_ENROLMENT.replace(':id', eventData.id as string),
    query: {
      occurrences: [data.placeId1, data.placeId2, data.placeId3],
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
    name: data.name,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(10);
  });

  const occurrenceRow = within(
    screen.getByRole('row', {
      name: rowText,
    })
  );

  const expandButton = occurrenceRow.getByRole('button', {
    name: occurrenceMessages.showOccurrenceDetails,
  });

  expect(
    screen.queryByText(occurrenceMessages.dateAndTimeTitle)
  ).not.toBeInTheDocument();

  userEvent.click(expandButton);

  await waitFor(() => {
    expect(screen.queryByText(data.venueDescription)).toBeInTheDocument();
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
    name: data.name,
  });

  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(10);
  });

  userEvent.click(
    screen.getByLabelText(eventMessages.occurrenceList.labelStartDateFilter)
  );
  userEvent.click(screen.getByRole('button', { name: 'Valitse 28.07.2020' }));
  userEvent.click(
    screen.getByLabelText(eventMessages.occurrenceList.labelEndDateFilter)
  );
  userEvent.click(screen.getByRole('button', { name: 'Valitse 29.07.2020' }));

  const tableRows = screen.getAllByRole('row');

  // 2 occurrences should be visible + header row for table
  expect(tableRows).toHaveLength(3);

  const occurrenceEnrolButtons = screen.getAllByRole('button', {
    name: eventMessages.occurrenceList.enrolOccurrenceButton,
  });
  expect(occurrenceEnrolButtons).toHaveLength(2);
});
