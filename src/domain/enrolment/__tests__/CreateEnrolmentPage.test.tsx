import { MockedResponse } from '@apollo/react-testing';
import { advanceTo } from 'jest-date-mock';
import React from 'react';
import wait from 'waait';

import {
  Event,
  EventDocument,
  OccurrenceNode,
  PlaceDocument,
} from '../../../generated/graphql';
import * as graphqlFns from '../../../generated/graphql';
import {
  fakePEvent,
  fakeLocalizedObject,
  fakeEvent,
  fakeOccurrences,
  fakeLocation,
} from '../../../utils/mockDataUtils';
import {
  render,
  screen,
  act,
  waitFor,
  userEvent,
  configure,
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
      }),
    })
  ),
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
        place: fakeLocation({ name: fakeLocalizedObject('Kirjasto') }),
      },
    },
  },
  mockBase(
    fakeEvent({
      name: fakeLocalizedObject(eventName),
      location: fakeLocation({ id: locationId }),
      pEvent: fakePEvent({
        enrolmentStart: new Date(2020, 8, 7).toISOString(),
        enrolmentEndDays: 3,
        occurrences: fakeOccurrences(3, occurrenceOverrides3),
        neededOccurrences: 2,
      }),
    })
  ),
];

advanceTo(new Date(2020, 8, 8));
jest.setTimeout(20000);

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
      name: '25.09.2020 12:30 – 12:30 Kirjasto 0 / 30',
    })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('row', {
      name: '26.09.2020 13:20 – 12:30 Kirjasto 0 / 30',
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
    screen.getByRole('button', { name: /luokka\-aste valitse\.\.\./i })
  );
  userEvent.click(screen.getByRole('option', { name: /4\. luokka/i }));

  userEvent.type(screen.getByLabelText('Lapsia'), '10');
  userEvent.type(screen.getByLabelText('Aikuisia'), '2');

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
  userEvent.click(
    screen.getByRole('checkbox', {
      name: /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i,
    })
  );

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
            studyLevel: 'GRADE_4',
          },
        },
      },
    });
  });
});
