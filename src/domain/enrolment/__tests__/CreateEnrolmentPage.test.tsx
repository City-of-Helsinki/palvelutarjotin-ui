import { MockedResponse } from '@apollo/react-testing';
import { axe } from 'jest-axe';
import { advanceTo } from 'jest-date-mock';
import React from 'react';
import wait from 'waait';

import {
  Event,
  EventDocument,
  OccurrenceNode,
  PlaceDocument,
  StudyLevelsDocument,
} from '../../../generated/graphql';
import * as graphqlFns from '../../../generated/graphql';
import {
  fakePEvent,
  fakeLocalizedObject,
  fakeEvent,
  fakeOccurrences,
  fakePlace,
  fakeStudyLevels,
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

const mockBase = (event: Event): MockedResponse => ({
  request: {
    query: EventDocument,
    variables: { id: eventId, include: ['location'] },
  },
  result: {
    data: {
      event,
    },
  },
});

const mockStudyLevels = (): MockedResponse => ({
  request: {
    query: StudyLevelsDocument,
    variables: {},
  },
  result: {
    data: {
      studyLevels: fakeStudyLevels(),
    },
  },
});

// mock that has enrol time ended
const occurrenceOverrides1: Partial<OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 10, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 10, 12, 30) },
  { id: 'sdfgdfhbf345345yreg' },
];

// mock that has enrol time ended
const mock1: MockedResponse[] = [
  mockBase(
    fakeEvent({
      name: fakeLocalizedObject(eventName),
      pEvent: fakePEvent({
        enrolmentStart: new Date(2020, 8, 7).toISOString(),
        enrolmentEndDays: 3,
        occurrences: fakeOccurrences(3, occurrenceOverrides1),
        neededOccurrences: 2,
      }),
    })
  ),
  mockStudyLevels(),
];

const occurrenceOverrides2: Partial<OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: 'sdfgdfhbf345345yreg' },
];

const mock2: MockedResponse[] = [
  mockBase(
    fakeEvent({
      name: fakeLocalizedObject(eventName),
      pEvent: fakePEvent({
        enrolmentStart: new Date(2020, 8, 20).toISOString(),
        enrolmentEndDays: 3,
        occurrences: fakeOccurrences(3, occurrenceOverrides2),
        neededOccurrences: 2,
        mandatoryAdditionalInformation: true,
      }),
    })
  ),
  mockStudyLevels(),
];

const occurrenceOverrides3: Partial<OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 26, 13, 20) },
  { id: 'sdfgdfhbf345345yreg' },
];

const mock3: MockedResponse[] = [
  {
    request: {
      query: PlaceDocument,
      variables: {
        id: locationId,
      },
    },
    result: {
      data: {
        place: fakePlace({ name: fakeLocalizedObject('Kirjasto') }),
      },
    },
  },
  mockBase(
    fakeEvent({
      name: fakeLocalizedObject(eventName),
      location: fakePlace({ id: locationId }),
      pEvent: fakePEvent({
        enrolmentStart: new Date(2020, 8, 7).toISOString(),
        enrolmentEndDays: 3,
        occurrences: fakeOccurrences(3, occurrenceOverrides3),
        neededOccurrences: 2,
      }),
    })
  ),
  mockStudyLevels(),
];

const mock4: MockedResponse[] = [
  mockBase(
    fakeEvent({
      name: fakeLocalizedObject(eventName),
      location: fakePlace({ id: locationId }),
      pEvent: fakePEvent({
        enrolmentStart: new Date(2020, 8, 7).toISOString(),
        enrolmentEndDays: 3,
        occurrences: fakeOccurrences(3, occurrenceOverrides3),
        neededOccurrences: 2,
        mandatoryAdditionalInformation: true,
      }),
    })
  ),
];

advanceTo(new Date(2020, 8, 8));
jest.setTimeout(20000);

// Notification component has a problem:
// "svg elements with an img role have an alternative text (svg-img-alt)"
test.skip('page is accessible', async () => {
  const { container } = render(<CreateEnrolmentPage />, {
    mocks: mock1,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await act(wait);
  expect(await axe(container)).toHaveNoViolations();
});

test('renders enrolment has ended text', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: mock1,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await act(wait);

  expect(
    screen.getByRole('heading', { name: 'Ilmoittaudu tapahtumaan' })
  ).toBeInTheDocument();

  expect(screen.queryByText(eventName)).toBeInTheDocument();
  expect(screen.queryByText('Ilmoittautuminen päättynyt')).toBeInTheDocument();
  expect(
    screen.queryByText('Tapahtuman ilmoittautuminen on päättynyt')
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('heading', { name: /ilmoittajan tiedot/i })
  ).not.toBeInTheDocument();
});

test('renders enrolment has not started yet text', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: mock2,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await act(wait);

  expect(
    screen.getByRole('heading', { name: 'Ilmoittaudu tapahtumaan' })
  ).toBeInTheDocument();

  expect(screen.queryByText(eventName)).toBeInTheDocument();
  expect(
    screen.queryByText('Ilmoitautuminen ei ole avautunut')
  ).toBeInTheDocument();
  expect(
    screen.queryByText('Tapahtuman ilmoittautuminen ei ole vielä avautunut')
  ).toBeInTheDocument();

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
    mocks: mock3,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: /ilmoittajan tiedot/i })
    ).toBeInTheDocument();
  });

  expect(
    screen.getByRole('heading', { name: 'Ilmoittaudu tapahtumaan' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', { name: 'Valitut tapahtuma-ajat' })
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryAllByText('Kirjasto')).toHaveLength(2);
  });

  expect(
    screen.queryByRole('row', {
      name: '25.09.2020 12:30 – 12:30 Kirjasto 30 / 30',
    })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('row', {
      name: '26.09.2020 13:20 – 12:30 Kirjasto 30 / 30',
    })
  ).toBeInTheDocument();

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

  userEvent.click(screen.getByRole('button', { name: /Suomi/ }));
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
    mocks: mock3,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: /ilmoittajan tiedot/i })
    ).toBeInTheDocument();
  });

  userEvent.click(
    screen.getByRole('button', { name: /lähetä ilmoittautuminen/i })
  );

  const alertContainer = await screen.findByRole('alert');
  expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i);

  const withinAlertContainer = within(alertContainer);

  const requiredFieldLabels = [
    'Hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa',
    'Nimi',
    'Puhelinnumero',
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

test('amount of adults is limited to 1 when there is 1 seat left after children', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: mock3,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await waitFor(() => {
    expect(screen.getByLabelText(/lapsia/i)).toBeInTheDocument();
  });
  userEvent.type(screen.getByLabelText(/lapsia/i), '19');
  userEvent.type(screen.getByLabelText(/aikuisia/i), '2');
  userEvent.tab();
  await waitFor(() => {
    expect(
      screen.getByText(
        /Arvon tulee olla enintään 1 yhdessä lasten lukumäärän kanssa/i
      )
    ).toBeInTheDocument();
  });
});

test('amount of adults is limited to 0 when children fills the group in whole', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: mock3,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await waitFor(() => {
    expect(screen.getByLabelText(/lapsia/i)).toBeInTheDocument();
  });
  userEvent.type(screen.getByLabelText(/lapsia/i), '20');
  userEvent.type(screen.getByLabelText(/aikuisia/i), '2');
  userEvent.tab();
  await waitFor(() => {
    expect(
      screen.getByText(
        /Arvon tulee olla enintään 0 yhdessä lasten lukumäärän kanssa/i
      )
    ).toBeInTheDocument();
  });
});

test('adults should not validated against max group limit when there are already too many children', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: mock3,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await waitFor(() => {
    expect(screen.getByLabelText(/lapsia/i)).toBeInTheDocument();
  });
  userEvent.type(screen.getByLabelText(/lapsia/i), '21');
  userEvent.type(screen.getByLabelText(/aikuisia/i), '2');
  userEvent.tab();
  await waitFor(() => {
    expect(
      screen.getByText(/Arvon tulee olla enintään 20/i)
    ).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(
      screen.queryByText(
        /Arvon tulee olla enintään 0 yhdessä lasten lukumäärän kanssa/i
      )
    ).not.toBeInTheDocument();
  });
});

test('mandatory additional information forces extraNeeds field to be required', async () => {
  render(<CreateEnrolmentPage />, {
    mocks: mock4,
    query: { eventId: eventId, occurrences: occurrenceIds },
  });
  await waitFor(() => {
    expect(screen.getByLabelText(/Lisätiedot/i)).toBeInTheDocument();
  });
  userEvent.type(screen.getByRole('textbox', { name: /Lisätiedot/i }), '');
  userEvent.tab();
  await waitFor(() => {
    expect(screen.getByText(/Tämä kenttä on pakollinen/i)).toBeInTheDocument();
  });
});
