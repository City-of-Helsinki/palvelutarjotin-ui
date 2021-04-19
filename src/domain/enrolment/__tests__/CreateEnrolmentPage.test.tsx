import { MockedResponse } from '@apollo/react-testing';
import { axe } from 'jest-axe';
import { advanceTo } from 'jest-date-mock';
import React from 'react';
import wait from 'waait';

import {
  OccurrenceNode,
  PalvelutarjotinEventNode,
} from '../../../generated/graphql';
import * as graphqlFns from '../../../generated/graphql';
import { createEventQueryMock } from '../../../tests/apollo-mocks/eventMocks';
import { createPlaceQueryMock } from '../../../tests/apollo-mocks/placeMocks';
import { createStudyLevelsQueryMock } from '../../../tests/apollo-mocks/studyLevelsMocks';
import {
  fakePEvent,
  fakeLocalizedObject,
  fakeOccurrences,
  fakePlace,
} from '../../../utils/mockDataUtils';
import {
  render,
  screen,
  act,
  waitFor,
  userEvent,
  configure,
  within,
} from '../../../utils/testUtils';
import CreateEnrolmentPage from '../CreateEnrolmentPage';
import * as utils from '../utils';

const eventId = '123321';
const occurrenceId1 = '123321';
const occurrenceId2 = '321123';
const occurrenceIds = [occurrenceId1, occurrenceId2];
const eventName = 'Testitapahtuma';
const locationId = 'locationId';

configure({ defaultHidden: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(utils.getCAPTCHAToken as any) = jest.fn().mockResolvedValue('captcha-token');

const createPageMock = (
  pEventOverrides: Partial<PalvelutarjotinEventNode>,
  locationId?: string
): MockedResponse[] => [
  createEventQueryMock({
    id: eventId,
    name: fakeLocalizedObject(eventName),
    location: fakePlace(locationId ? { id: locationId } : {}),
    pEvent: fakePEvent(pEventOverrides),
  }),
  createStudyLevelsQueryMock(),
];

// mock that has enrol time ended
const occurencesEnrolTimeEnded: Partial<OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 10, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 10, 12, 30) },
  { id: 'sdfgdfhbf345345yreg' },
];

const occurencesEnrolSameTimes: Partial<OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: 'sdfgdfhbf345345yreg' },
];

const occurrenceEnrolDifferentTimes: Partial<OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 26, 13, 20) },
  { id: 'sdfgdfhbf345345yreg' },
];

const pageMockEnrolTimeEnded = createPageMock({
  enrolmentStart: new Date(2020, 8, 7).toISOString(),
  enrolmentEndDays: 3,
  occurrences: fakeOccurrences(3, occurencesEnrolTimeEnded),
  neededOccurrences: 2,
});

const PageMockEnrolTimeNotStarted: MockedResponse[] = createPageMock({
  enrolmentStart: new Date(2020, 8, 20).toISOString(),
  enrolmentEndDays: 3,
  occurrences: fakeOccurrences(3, occurencesEnrolSameTimes),
  neededOccurrences: 2,
  mandatoryAdditionalInformation: true,
});

const PageMockWithSelectedPlace: MockedResponse[] = [
  createPlaceQueryMock({
    id: locationId,
    name: fakeLocalizedObject('Kirjasto'),
  }),
  ...createPageMock(
    {
      enrolmentStart: new Date(2020, 8, 7).toISOString(),
      enrolmentEndDays: 3,
      occurrences: fakeOccurrences(3, occurrenceEnrolDifferentTimes),
      neededOccurrences: 2,
    },
    locationId
  ),
];

const pageMockWithLocation: MockedResponse[] = createPageMock(
  {
    enrolmentStart: new Date(2020, 8, 7).toISOString(),
    enrolmentEndDays: 3,
    occurrences: fakeOccurrences(3, occurrenceEnrolDifferentTimes),
    neededOccurrences: 2,
    mandatoryAdditionalInformation: true,
  },
  locationId
);

const PageMockEnrolHandpick: MockedResponse[] = createPageMock(
  {
    enrolmentStart: new Date(2020, 8, 7).toISOString(),
    enrolmentEndDays: 3,
    occurrences: fakeOccurrences(1, [
      { id: occurrenceId1, startTime: new Date(2020, 8, 25, 12, 30) },
    ]),
    neededOccurrences: 1,
    autoAcceptance: false,
    mandatoryAdditionalInformation: true,
  },
  locationId
);

advanceTo(new Date(2020, 8, 8));
jest.setTimeout(20000);

// Notification component has a problem:
// "svg elements with an img role have an alternative text (svg-img-alt)"
test.skip('page is accessible', async () => {
  const { container } = render(<CreateEnrolmentPage />, {
    mocks: PageMockEnrolTimeNotStarted,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await act(wait);
  expect(await axe(container)).toHaveNoViolations();
});

test('has enrolment title and button', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: PageMockWithSelectedPlace,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await screen.findByRole('heading', { name: 'Ilmoittaudu tapahtumaan' });
  await screen.findByRole('button', { name: /lähetä ilmoittautuminen/i });
});

test('has inquiry title and button', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: PageMockEnrolHandpick,
    query: { eventId: eventId, occurrences: [occurrenceId1] },
  });

  await screen.findByRole('heading', { name: /varaustiedustelu tapahtumaan/i });
  await screen.findByRole('button', { name: /lähetä varaustiedustelu/i });
});

test('renders enrolment has ended text', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: pageMockEnrolTimeEnded,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await screen.findByRole('heading', { name: 'Ilmoittaudu tapahtumaan' });
});

test('renders enrolment has ended text', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: pageMockEnrolTimeEnded,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await screen.findByRole('heading', { name: 'Ilmoittaudu tapahtumaan' });
  await screen.findByText(eventName);
  await screen.findByText('Ilmoittautuminen päättynyt');
  await screen.findByText('Tapahtuman ilmoittautuminen on päättynyt');

  expect(
    screen.queryByRole('heading', { name: /ilmoittajan tiedot/i })
  ).not.toBeInTheDocument();
});

test('renders enrolment has not started yet text', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: PageMockEnrolTimeNotStarted,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await screen.findByRole('heading', { name: 'Ilmoittaudu tapahtumaan' });
  await screen.findByText(eventName);
  await screen.findByText('Ilmoitautuminen ei ole avautunut');
  await screen.findByText('Tapahtuman ilmoittautuminen ei ole vielä avautunut');

  expect(
    screen.queryByRole('heading', { name: /ilmoittajan tiedot/i })
  ).not.toBeInTheDocument();
});

test('renders form and user can fill it and submit', async () => {
  // eslint-disable-next-line import/namespace
  const enrolOccurrenceMock = jest.fn();
  jest
    .spyOn(graphqlFns, 'useEnrolOccurrenceMutation')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue([enrolOccurrenceMock] as any);
  render(<CreateEnrolmentPage />, {
    mocks: PageMockWithSelectedPlace,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });
  await screen.findByRole('heading', { name: 'Ilmoittaudu tapahtumaan' });
  await screen.findByRole('heading', { name: 'Valitut tapahtuma-ajat' });

  await waitFor(() => {
    expect(screen.getAllByText('Kirjasto')).toHaveLength(2);
  });

  await screen.findByRole('row', {
    name: '25.09.2020 pe 12:30 – 12:30 Kirjasto 30 / 30',
  });

  await screen.findByRole('row', {
    name: '26.09.2020 la 13:20 – 12:30 Kirjasto 30 / 30',
  });

  userEvent.type(
    screen.getByRole('textbox', { name: /nimi/i }),
    'Nimi Niminen'
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /sähköpostiosoite/i }),
    'testi@testi.fi'
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /puhelinnumero/i }),
    '123321123'
  );

  userEvent.type(
    screen.getByRole('textbox', { name: /puhelinnumero/i }),
    '123321123'
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /päiväkoti \/ koulu \/ oppilaitos/i }),
    'Testikoulu'
  );
  userEvent.type(screen.getByRole('textbox', { name: /ryhmä/i }), '4a');

  // select grade from dropdown
  userEvent.click(
    screen.getByRole('button', { name: /luokka-aste valitse\.\.\./i })
  );

  userEvent.click(screen.getByRole('option', { name: /4\. luokka/i }));
  userEvent.click(screen.getByRole('option', { name: /2\. luokka/i }));

  // close dropdown
  userEvent.click(screen.getByRole('button', { name: /luokka-aste/i }));

  userEvent.type(screen.getByLabelText(/lapsia/i), '10');
  userEvent.type(screen.getByLabelText(/aikuisia/i), '2');

  expect(
    screen.getByRole('checkbox', { name: /sama kuin ilmoittaja/i })
  ).toBeChecked();
  userEvent.click(screen.getByRole('checkbox', { name: /sähköpostilla/i }));
  userEvent.click(screen.getByText(/tekstiviestillä/i));

  userEvent.click(screen.getByRole('button', { name: /suomi/ }));
  userEvent.click(screen.getByRole('option', { name: /suomi/i }));

  userEvent.type(
    screen.getByRole('textbox', { name: /lisätiedot \(valinnainen\)/i }),
    'Lisätietoja ilmoittautumiseen'
  );

  // test that error notification works
  userEvent.click(
    screen.getByRole('button', { name: /lähetä ilmoittautuminen/i })
  );
  const alertContainer = await screen.findByRole('alert');
  expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i);
  expect(alertContainer).toHaveTextContent(
    /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i
  );

  userEvent.click(
    screen.getByRole('checkbox', {
      name: /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i,
    })
  );

  await waitFor(() => {
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  userEvent.click(
    screen.getByRole('button', { name: /lähetä ilmoittautuminen/i })
  );

  await waitFor(() => {
    expect(enrolOccurrenceMock).toHaveBeenCalledWith({
      variables: {
        input: {
          captchaKey: 'captcha-token',
          notificationType: 'EMAIL_SMS',
          occurrenceIds: ['123321', '321123'],
          person: undefined,
          studyGroup: {
            amountOfAdult: 2,
            extraNeeds: 'Lisätietoja ilmoittautumiseen',
            groupName: '4a',
            groupSize: 10,
            name: 'Testikoulu',
            person: {
              emailAddress: 'testi@testi.fi',
              language: 'FI',
              name: 'Nimi Niminen',
              phoneNumber: '123321123123321123',
            },
            studyLevels: ['GRADE_4', 'GRADE_2'],
          },
        },
      },
    });
  });
});

test('render and focuses error notification correctly', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: PageMockWithSelectedPlace,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });

  userEvent.click(
    screen.getByRole('button', { name: /lähetä ilmoittautuminen/i })
  );

  const alertContainer = await screen.findByRole('alert');
  expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i);

  const withinAlertContainer = within(alertContainer);

  const requiredFieldLabels = [
    'Hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa',
    'Nimi',
    'Sähköpostiosoite',
    'Päiväkoti / koulu / oppilaitos',
    'Ryhmä',
    'Lapsia',
    'Aikuisia',
    'Luokka-aste',
  ];

  requiredFieldLabels.forEach((label) => {
    expect(withinAlertContainer.getByText(label)).toBeInTheDocument();
  });

  expect(alertContainer).toHaveFocus();

  userEvent.tab();

  expect(screen.getByRole('textbox', { name: 'Nimi' })).toHaveFocus();
});

describe('max group size validation of the Children and Adults -fields', () => {
  const createEnrolmentForm = async (
    childrenCount: string,
    adultsCount: string
  ) => {
    render(<CreateEnrolmentPage />, {
      mocks: PageMockWithSelectedPlace,
      query: { eventId: eventId, occurrences: occurrenceIds },
    });
    await screen.findByLabelText(/lapsia/i);
    userEvent.type(screen.getByLabelText(/lapsia/i), childrenCount);
    userEvent.type(screen.getByLabelText(/aikuisia/i), adultsCount);
    userEvent.tab();
  };

  test('both of the fields are greater than the max group size', async () => {
    await createEnrolmentForm('21', '22');
    await waitFor(() => {
      expect(
        screen.getAllByText(
          /Lasten ja aikuisten yhteislukumäärän tulee olla enintään 20/i
        )
      ).toHaveLength(2);
    });
  });

  test('both of the fields are less than the min group size, but the total is valid', async () => {
    await createEnrolmentForm('8', '9');
    await waitFor(() => {
      expect(
        screen.queryByText(
          /Lasten ja aikuisten yhteislukumäärän tulee olla enintään 20/i
        )
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText(
        /Lasten ja aikuisten yhteislukumäärän tulee olla vähintään 10/i
      )
    ).not.toBeInTheDocument();
  });

  test('one of the fields are less than the min group size, but the total is valid', async () => {
    await createEnrolmentForm('7', '11');
    await waitFor(() => {
      expect(
        screen.queryByText(
          /Lasten ja aikuisten yhteislukumäärän tulee olla enintään 20/i
        )
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText(
        /Lasten ja aikuisten yhteislukumäärän tulee olla vähintään 10/i
      )
    ).not.toBeInTheDocument();
  });

  test('one field is greater than the max group size and another one is (still) empty', async () => {
    await createEnrolmentForm('21', '');
    await screen.findByText(
      /Lasten ja aikuisten yhteislukumäärän tulee olla enintään 20/i
    );
    await screen.findByText(/Tämä kenttä on pakollinen/i);
  });

  test('the total count is less than minimum', async () => {
    await createEnrolmentForm('1', '2');
    await waitFor(() => {
      expect(
        screen.getAllByText(
          /Lasten ja aikuisten yhteislukumäärän tulee olla vähintään 10/i
        )
      ).toHaveLength(2);
    });
  });

  test('both the fields are valid as a single, but the total is greater than the maximum group size', async () => {
    await createEnrolmentForm('19', '18');
    await screen.findByText(
      /Arvon tulee olla enintään 2 yhdessä aikuisten lukumäärän kanssa/i
    );
    await screen.findByText(
      /Arvon tulee olla enintään 1 yhdessä lasten lukumäärän kanssa/i
    );
  });

  test('one of the field values is valid, but another one is greater than the max group size', async () => {
    await createEnrolmentForm('22', '18');
    await screen.findByText(
      /Arvon tulee olla enintään 2 yhdessä aikuisten lukumäärän kanssa/i
    );
    expect(
      screen.queryByText(
        /Arvon tulee olla enintään 1 yhdessä lasten lukumäärän kanssa/i
      )
    ).not.toBeInTheDocument();
  });
});

test('mandatory additional information forces extraNeeds field to be required', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: pageMockWithLocation,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await screen.findByLabelText(/Lisätiedot/i);
  userEvent.type(screen.getByRole('textbox', { name: /Lisätiedot/i }), '');
  userEvent.tab();
  await screen.findByText(/Tämä kenttä on pakollinen/i);
});

test('Do not allow sms notifications if no phone number is given', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: pageMockWithLocation,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await screen.findByLabelText(/Puhelinnumero/i);
  const phoneField = screen.getByLabelText(/Puhelinnumero/i);
  const smsField = screen.getByLabelText(/Tekstiviestillä/i);
  expect(phoneField).not.toHaveValue();
  expect(smsField).toBeDisabled();
  userEvent.type(phoneField, '123');
  userEvent.tab();
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  userEvent.click(smsField);
  expect(smsField).toBeChecked();
  userEvent.clear(phoneField);
  userEvent.tab();
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).toBeDisabled();
  });
  expect(smsField).not.toBeChecked();
});

test('Allow sms notifications if any of the phone numbers are given', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: pageMockWithLocation,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await screen.findByLabelText(/Sama kuin ilmoittaja/i);
  const isResponsiblePersonField = screen.getByLabelText(
    /Sama kuin ilmoittaja/i
  );

  userEvent.click(isResponsiblePersonField);

  const phoneFields = screen.queryAllByLabelText(/Puhelinnumero/i);

  phoneFields.forEach((f) => userEvent.type(f, '123'));
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  userEvent.clear(phoneFields[0]);
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  phoneFields.forEach((f) => userEvent.clear(f));
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).toBeDisabled();
  });
});
