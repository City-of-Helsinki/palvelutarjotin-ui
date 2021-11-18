/* eslint-disable @typescript-eslint/no-explicit-any */
import userEvent from '@testing-library/user-event';
import { advanceTo } from 'jest-date-mock';
import React from 'react';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

import enrolmentMessages from '../../../../public/locales/fi/enrolment.json';
import eventMessages from '../../../../public/locales/fi/event.json';
import occurrenceMessages from '../../../../public/locales/fi/occurrence.json';
import {
  Language,
  OccurrenceSeatType,
  VenueNode,
  Event,
  NotificationType,
} from '../../../generated/graphql';
import * as graphqlFuncs from '../../../generated/graphql';
import { createEventQueryMockIncludeLanguageAndAudience } from '../../../tests/apollo-mocks/eventMocks';
import { createPlaceQueryMock } from '../../../tests/apollo-mocks/placeMocks';
import { createVenueQueryMock } from '../../../tests/apollo-mocks/venueMocks';
import {
  fakeImage,
  fakeInLanguage,
  fakeKeyword,
  fakeLocalizedObject,
  fakeOccurrences,
  fakeOrganisation,
  fakePerson,
  fakePEvent,
  fakePlace,
} from '../../../utils/mockDataUtils';
import {
  render,
  configure,
  screen,
  waitFor,
  within,
  CustomRenderOptions,
} from '../../../utils/testUtils';
import { ROUTES } from '../../app/routes/constants';
import { ENROLMENT_URL_PARAMS } from '../../enrolment/constants';
import { categorisationSectionTestId } from '../eventBasicInfo/EventCategorisation';
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
  venueDescription: 'Venue description',
  placeId1: 'sdgfdgsequrwtw',
  placeId2: 'adsgfhwdgfnsagdbs',
  placeId3: 'aghrewghher534643',
  keywords: ['perheet', 'lapset'],
  categories: ['Musiikki', 'Teatteri'],
  audience: ['1.–2. luokat', '3.–6. luokat', 'Valmistava opetus'],
  additionalCriteria: ['Luento', 'Työpaja', 'perheet'],
  languages: ['suomi', 'englanti'],
};

const createFakeKeyword = (k: string) =>
  fakeKeyword({ name: fakeLocalizedObject(k), id: k });

const occurrences = [
  {
    startTime: '2020-07-15T09:00:00+00:00',
    placeId: data.placeId,
    id: data.placeId1,
    amountOfSeats: 30,
    seatsApproved: 10,
    remainingSeats: 20,
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
  // cancelled event
  {
    startTime: '2020-07-20T09:00:00+00:00',
    placeId: data.placeId,
    cancelled: true,
  },
  { startTime: '2020-07-21T09:00:00+00:00', placeId: data.placeId },
  { startTime: '2020-07-22T09:00:00+00:00', placeId: data.placeId },
  // full event
  {
    startTime: '2020-07-23T09:00:00+00:00',
    placeId: data.placeId,
    amountOfSeats: 1,
    remainingSeats: 0,
    seatsTaken: 1,
    seatType: OccurrenceSeatType.EnrolmentCount,
  },
  {
    startTime: '2020-07-27T09:00:00+00:00',
    placeId: data.placeId,
  },
  {
    startTime: '2020-07-28T09:00:00+00:00',
    placeId: data.placeId,
  },
  // full event
  {
    startTime: '2020-07-29T09:00:00+00:00',
    placeId: data.placeId,
    amountOfSeats: 30,
    seatsApproved: 10,
    remainingSeats: 20,
    seatsTaken: 30,
  },
  {
    startTime: '2020-07-30T09:30:00+00:00',
    placeId: data.placeId,
  },
];

const pEventData = fakePEvent({
  enrolmentEndDays: 1,
  enrolmentStart: '2020-07-13T06:00:00+00:00',
  organisation: fakeOrganisation({ name: data.organisationName }),
  contactPhoneNumber: data.contactPersonPhoneNumber,
  contactEmail: data.contactPersonEmail,
  contactPerson: fakePerson({
    name: data.contactPersonName,
  }),
  occurrences: fakeOccurrences(11, occurrences),
  neededOccurrences: data.neededOccurrences,
});

const eventData: Partial<Event> = {
  id: data.id,
  name: fakeLocalizedObject(data.name),
  description: fakeLocalizedObject(data.description),
  shortDescription: fakeLocalizedObject(data.shortDescription),
  location: fakePlace({
    id: data.placeId,
    name: fakeLocalizedObject(data.placeName),
  }),
  pEvent: pEventData,
  images: [
    fakeImage({
      photographerName: data.imagePhotographerName,
      altText: data.fakeAltText,
    }),
  ],
  keywords: data.keywords.map(createFakeKeyword),
  categories: data.categories.map(createFakeKeyword),
  audience: data.audience.map(createFakeKeyword),
  // activities
  additionalCriteria: data.additionalCriteria.map(createFakeKeyword),
  inLanguage: [
    fakeInLanguage(),
    fakeInLanguage({
      id: 'en',
      internalId: 'https://api.hel.fi/linkedevents-test/v1/language/en/',
      name: {
        en: 'English',
        fi: 'englanti',
        sv: 'Engelska',
        __typename: 'LocalisedObject',
      },
    }),
  ],
};

const venueData: Partial<VenueNode> = {
  hasClothingStorage: true,
  hasSnackEatingPlace: true,
  outdoorActivity: true,
  hasToiletNearby: true,
  hasAreaForGroupWork: true,
  hasIndoorPlayingArea: true,
  hasOutdoorPlayingArea: true,
  translations: [
    {
      description: data.venueDescription,
      languageCode: Language.Fi,
      __typename: 'VenueTranslationType',
    },
  ],
};

configure({ defaultHidden: true });

const apolloMocks = [
  createEventQueryMockIncludeLanguageAndAudience({ id: data.id, ...eventData }),
  createPlaceQueryMock({
    id: data.placeId,
    name: fakeLocalizedObject(data.placeName),
  }),
  createVenueQueryMock({ id: data.placeId, ...venueData }),
];

advanceTo(new Date(2020, 6, 14));

const renderComponent = (options?: CustomRenderOptions) => {
  return render(<EventPage />, {
    mocks: apolloMocks,
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
    ...options,
  });
};

const waitForRequestsToComplete = async () => {
  await screen.findByRole('heading', {
    name: data.name,
  });
  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(10);
  });
};

beforeAll(() => {
  jest.setTimeout(30000);
});

afterAll(() => {
  jest.setTimeout(5000);
});

it('shows full events correctly in occurrences list', async () => {
  renderComponent();
  await waitForRequestsToComplete();

  const fullOccurrenceRowText1 =
    '23.7.2020 to12:00 – 13:00Soukan kirjasto0 / 1Tapahtuma on täynnä';
  const fullOccurrenceRowText2 =
    '29.7.2020 ke12:00 – 13:00Soukan kirjasto0 / 30Tapahtuma on täynnä';

  const tableRows = screen.queryAllByRole('row');
  expect(tableRows[7]).toHaveTextContent(fullOccurrenceRowText1);
  expect(tableRows[10]).toHaveTextContent(fullOccurrenceRowText2);
});

it('shows cancelled events correctly in list', async () => {
  renderComponent();
  await waitForRequestsToComplete();

  const cancelledOccurrenceRowText =
    '20.7.2020 ma12:00 – 13:00Soukan kirjasto30 / 30Tapahtuma on peruttu';

  const tableRows = screen.queryAllByRole('row');
  expect(tableRows[4]).toHaveTextContent(cancelledOccurrenceRowText);
});

it('renders page and event information correctly', async () => {
  renderComponent();
  await waitForRequestsToComplete();

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
  expect(eventImage).toHaveAttribute('src', eventData.images?.[0].url);

  // All keywords should be found in the document
  data.keywords.forEach((keyword) => {
    expect(
      screen.queryAllByText(keyword, { exact: true }).length
    ).toBeGreaterThanOrEqual(1);
  });
});

it('renders categorisation section with all categories and keywords', async () => {
  renderComponent();
  await waitForRequestsToComplete();

  const categorisationContainer = within(
    screen.getByTestId(categorisationSectionTestId)
  );

  [
    ...data.categories,
    ...data.audience,
    ...data.keywords,
    ...data.additionalCriteria,
    ...data.languages,
  ].forEach((k) => {
    expect(
      categorisationContainer.getByText(new RegExp(k, 'i'))
    ).toBeInTheDocument();
  });
});

it('renders occurrences table and related stuff correctly', async () => {
  renderComponent();
  await waitForRequestsToComplete();

  const occurrencesTitle = screen.queryByText(
    eventMessages.occurrencesTitle.replace('{{count}}', '11')
  );
  const showMoreOccurrencesButton = screen.queryByRole('button', {
    name: eventMessages.occurrenceList.loadMoreOccurrences,
  });
  const enrolmentButton = screen.queryByRole('button', {
    name: occurrenceMessages.occurrenceSelection.buttonSelectOccurrences.replace(
      '{{neededOccurrences}}',
      eventData.pEvent?.neededOccurrences.toString() ?? '0'
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
  ];

  columnHeaders.forEach((headerText) => {
    expect(
      screen.queryByRole('columnheader', { name: headerText })
    ).toBeInTheDocument();
  });

  const rowText = `27.7.2020 ma12:00 – 13:00Soukan kirjasto30 / 30Näytä tiedot`;

  const tableRows = screen.getAllByRole('row');
  expect(tableRows[8]).toHaveTextContent(rowText);
});

it('hides seats left column header when event has external enrolment', async () => {
  renderComponent({
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        id: data.id,
        ...eventData,
        pEvent: {
          ...pEventData,
          externalEnrolmentUrl: 'https://external-enrolment.com',
          occurrences: fakeOccurrences(1, [occurrences[0]]),
        },
      }),
      createPlaceQueryMock({
        id: data.placeId,
        name: fakeLocalizedObject(data.placeName),
      }),
      createVenueQueryMock({ id: data.placeId, ...venueData }),
    ],
  });

  await waitFor(() => {
    expect(screen.queryAllByText(data.placeName)).toHaveLength(1);
  });

  // seats column should be hidden when event has external enrolment
  expect(
    screen.queryByRole('columnheader', { name: /paikkoja jäljellä/i })
  ).not.toBeInTheDocument();
  screen.getByRole('link', {
    name: /ilmoittaudu avautuu uudessa välilehdessä/i,
  });

  const tableRows = screen.getAllByRole('row');
  expect(tableRows[1]).toHaveTextContent(
    '15.7.2020 ke12:00 – 13:00Soukan kirjastoIlmoittauduAvautuu uudessa välilehdessä'
  );
});

it('selecting enrolments works and buttons have correct texts', async () => {
  const pushMock = jest.fn();
  renderComponent({ router: { push: pushMock } });
  await waitForRequestsToComplete();

  const getOccurrenceCheckboxes = () =>
    screen.queryAllByRole('checkbox', {
      name: 'Valitse tapahtuma-aika',
    });

  let occurrenceEnrolmentButtons = getOccurrenceCheckboxes();

  // 3 events should have disabled checkbox because they are either cancelled, in the past or full
  expect(
    occurrenceEnrolmentButtons.filter(
      (checkbox) => (checkbox as HTMLInputElement).disabled
    )
  ).toHaveLength(3);

  userEvent.click(occurrenceEnrolmentButtons[0]);

  expect(occurrenceEnrolmentButtons[0]).toBeChecked();

  // buttons from previous query are stale because of rerender
  // -> new query is needed
  occurrenceEnrolmentButtons = getOccurrenceCheckboxes();

  userEvent.click(occurrenceEnrolmentButtons[1]);

  expect(occurrenceEnrolmentButtons[1]).toBeChecked();

  occurrenceEnrolmentButtons = getOccurrenceCheckboxes();

  userEvent.click(occurrenceEnrolmentButtons[2]);

  userEvent.click(
    screen.getByRole('button', {
      name: eventMessages.occurrenceList.loadMoreOccurrences,
    })
  );

  // should be 3 buttons with valittu text and not disabled
  expect(
    getOccurrenceCheckboxes().filter(
      (checkbox) => (checkbox as HTMLInputElement).checked
    )
  ).toHaveLength(3);

  // should be 8 disabled buttons with 'valittu' text
  expect(
    getOccurrenceCheckboxes().filter(
      (checkbox) =>
        !(checkbox as HTMLInputElement).checked &&
        (checkbox as HTMLInputElement).disabled
    )
  ).toHaveLength(8);

  userEvent.click(screen.getByRole('button', { name: 'Ilmoittaudu' }));

  // should render form when user has clicked "Ilmoittaudu"
  await screen.findByRole('heading', {
    name: /ilmoittajan tiedot/i,
  });
  expect(
    screen.getAllByRole('button', { name: /peruuta ja sulje lomake/i })
  ).toHaveLength(2);
});

it('opens expanded area with enrolment button when clicked', async () => {
  renderComponent();
  await waitForRequestsToComplete();

  const occurrenceRow = within(screen.getAllByRole('row')[8]);

  const expandButton = occurrenceRow.getByRole('button', {
    name: occurrenceMessages.buttonShowDetails,
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

  [
    'Eväidensyöntipaikka',
    'Ulkovaatesäilytys',
    'Toiminta tapahtuu ulkona',
    'WC lähellä tilaa',
    'Ryhmätyötilaa',
    'Leikkitilaa sisällä',
    'Leikkitilaa ulkona',
  ].forEach((amenity) => {
    expect(screen.queryByText(amenity)).toBeInTheDocument();
  });
});

it('filters occurrence list correctly when sate filters are selected', async () => {
  renderComponent();
  await waitForRequestsToComplete();

  userEvent.click(
    screen.getByLabelText(eventMessages.occurrenceList.labelStartDateFilter)
  );
  userEvent.click(screen.getByRole('button', { name: 'Valitse 28.7.2020' }));
  userEvent.click(
    screen.getByLabelText(eventMessages.occurrenceList.labelEndDateFilter)
  );
  userEvent.click(screen.getByRole('button', { name: 'Valitse 29.7.2020' }));

  const tableRows = screen.getAllByRole('row');

  // 2 occurrences should be visible + header row for table
  expect(tableRows).toHaveLength(3);

  const occurrenceEnrolButtons = screen.getAllByRole('button', {
    name: 'Näytä tiedot',
  });
  expect(occurrenceEnrolButtons).toHaveLength(1);
});

describe('refetch of event works correctly', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockEventQuery = (refetchMock: jest.Mock) => {
    jest
      .spyOn(graphqlFuncs, 'useEventQuery')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockReturnValue({
        refetch: refetchMock,
        data: {},
        loading: true,
      } as any);
  };

  it('refetches event so that occurrences update after enrolment is done', async () => {
    const refetchMock = jest.fn();
    mockEventQuery(refetchMock);
    renderComponent({
      path: `/fi/${ROUTES.EVENT_DETAILS.replace(':id', data.id)}?${
        ENROLMENT_URL_PARAMS.ENROLMENT_CREATED
      }=true`,
      query: {
        eventId: data.id,
        [ENROLMENT_URL_PARAMS.ENROLMENT_CREATED]: 'true',
      },
    });

    expect(refetchMock).toHaveBeenCalled();
  });

  it("won't try to refetch if enrolment wasn't created", async () => {
    const refetchMock = jest.fn();
    mockEventQuery(refetchMock);
    renderComponent({
      path: `/fi/${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
      query: {
        eventId: data.id,
      },
    });

    expect(refetchMock).not.toHaveBeenCalled();
  });
});

it('informs when there are no occurrences in future', async () => {
  render(<EventPage />, {
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        ...eventData,
        id: data.id,
        pEvent: fakePEvent({
          ...eventData.pEvent,
          occurrences: fakeOccurrences(0),
        }),
      }),
    ],
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
  });

  await screen.findByText('Tapahtumalla ei ole tapahtuma-aikoja');
});

it('hides enrolment button when enrolment is not required', async () => {
  render(<EventPage />, {
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        ...eventData,
        id: data.id,
        pEvent: fakePEvent({
          ...eventData.pEvent,
          autoAcceptance: false,
          neededOccurrences: 0,
          externalEnrolmentUrl: null,
          enrolmentStart: null,
          occurrences: fakeOccurrences(1),
        }),
      }),
    ],
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
  });

  await act(wait);

  expect(
    screen.queryByRole('button', { name: 'Ilmoittaudu' })
  ).not.toBeInTheDocument();
});

it('shows external enrolment link in occurrence row when event has external enrolment url', async () => {
  const externalEnrolmentUrl = 'https://test.enrolment.fi/';
  render(<EventPage />, {
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        ...eventData,
        id: data.id,
        pEvent: fakePEvent({
          ...eventData.pEvent,
          autoAcceptance: false,
          neededOccurrences: 0,
          externalEnrolmentUrl,
          occurrences: fakeOccurrences(1),
          enrolmentStart: null,
        }),
      }),
    ],
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
  });

  const enrolmentLink = await screen.findByRole('link', {
    name: /ilmoittaudu/i,
  });
  expect(enrolmentLink).toHaveAttribute('href', externalEnrolmentUrl);
});

it('shows inquire registration button when no autoacceptance', async () => {
  render(<EventPage />, {
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        ...eventData,
        id: data.id,
        pEvent: fakePEvent({
          ...eventData.pEvent,
          autoAcceptance: false,
          neededOccurrences: 1,
          occurrences: fakeOccurrences(1),
        }),
      }),
    ],
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
  });

  const showDetailsButton = await screen.findByRole('button', {
    name: /näytä tiedot/i,
  });
  userEvent.click(showDetailsButton);

  await screen.findByRole('button', {
    name: /varaustiedustelu/i,
  });
});

it('shows normal enrolment button when autoacceptance is on', async () => {
  render(<EventPage />, {
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        ...eventData,
        id: data.id,
        pEvent: fakePEvent({
          ...eventData.pEvent,
          autoAcceptance: true,
          neededOccurrences: 1,
          occurrences: fakeOccurrences(1),
        }),
      }),
    ],
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
  });

  const showDetailsButton = await screen.findByRole('button', {
    name: /näytä tiedot/i,
  });
  userEvent.click(showDetailsButton);

  await screen.findByRole('button', {
    name: /ilmoittaudu/i,
  });
});

it('renders a link which leads to all events of the organisation', async () => {
  renderComponent();
  await waitForRequestsToComplete();
  await screen.findByRole('link', { name: /näytä järjestäjän tapahtumat/i });
  [
    data.contactPersonName,
    data.contactPersonEmail,
    data.contactPersonPhoneNumber,
  ].forEach((text) => expect(screen.queryByText(text)).toBeInTheDocument());
});

it('does not render organisation section when organisation is not given', async () => {
  const eventWithoutOrganisationMock =
    createEventQueryMockIncludeLanguageAndAudience({
      ...eventData,
      id: data.id,
      pEvent: fakePEvent({
        ...eventData.pEvent,
        organisation: fakeOrganisation({
          ...eventData.pEvent?.organisation,
          name: '',
        }),
      }),
    });
  const [, ...mocks] = apolloMocks;

  render(<EventPage />, {
    mocks: [eventWithoutOrganisationMock, ...mocks],
    query: { eventId: eventData.id },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', data.id)}`,
  });
  await waitForRequestsToComplete();
  expect(
    screen.queryByRole('link', { name: /näytä järjestäjän tapahtumat/i })
  ).not.toBeInTheDocument();

  [
    data.contactPersonName,
    data.contactPersonEmail,
    data.contactPersonPhoneNumber,
  ].forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());
});

it('shows enrolment confirmation notification after enrolment is done', async () => {
  renderComponent({
    path: `/fi/${ROUTES.EVENT_DETAILS.replace(':id', data.id)}?${
      ENROLMENT_URL_PARAMS.ENROLMENT_CREATED
    }=true&${ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE}=${NotificationType.Email}`,
    query: {
      eventId: data.id,
      [ENROLMENT_URL_PARAMS.ENROLMENT_CREATED]: 'true',
      [ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE]: NotificationType.Email,
    },
  });

  await screen.findByRole('heading', {
    name: /ilmoittautuminen lähetetty/i,
  });
  await screen.getByText(/lähetämme sinulle vahvistuksen sähköpostitse\./i);
});

it('shows inquire registration notification after enrolment is done', async () => {
  render(<EventPage />, {
    mocks: [
      createEventQueryMockIncludeLanguageAndAudience({
        ...eventData,
        id: data.id,
        pEvent: fakePEvent({
          ...eventData.pEvent,
          autoAcceptance: false,
          neededOccurrences: 1,
          occurrences: fakeOccurrences(1),
        }),
      }),
    ],
    path: `/fi/${ROUTES.EVENT_DETAILS.replace(':id', data.id)}?${
      ENROLMENT_URL_PARAMS.ENROLMENT_CREATED
    }=true&${ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE}=${
      NotificationType.EmailSms
    }`,
    query: {
      eventId: data.id,
      [ENROLMENT_URL_PARAMS.ENROLMENT_CREATED]: 'true',
      [ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE]: NotificationType.EmailSms,
    },
  });

  await screen.findByRole('heading', {
    name: /varaustiedustelu lähetetty/i,
  });
  await screen.getByText(
    /lähetämme sinulle vahvistuksen sähköpostitse ja tekstiviestillä\./i
  );
});
