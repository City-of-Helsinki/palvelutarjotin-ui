/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { advanceTo } from 'jest-date-mock';
import React from 'react';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

import { FORM_NAMES } from '../../../constants';
import * as graphqlFns from '../../../generated/graphql';
import { createDefaultEventQueryMock } from '../../../tests/apollo-mocks/eventMocks';
import { createPlaceQueryMock } from '../../../tests/apollo-mocks/placeMocks';
import { createStudyLevelsQueryMock } from '../../../tests/apollo-mocks/studyLevelsMocks';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import {
  fakeLocalizedObject,
  fakeOccurrences,
  fakePEvent,
  fakePlace,
} from '../../../utils/mockDataUtils';
import { getRecommendedEventsQueryVariables } from '../../../utils/recommendedEventsUtils';
import {
  render,
  configure,
  screen,
  waitFor,
  within,
  CustomRenderOptions,
} from '../../../utils/testUtils';
import { ROUTES } from '../../app/routes/constants';
import * as utils from '../../enrolment/utils';
import EventPage from '../EventPage';

configure({ defaultHidden: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(utils.getCAPTCHAToken as any) = jest.fn().mockResolvedValue('captcha-token');

const eventId = '123321';
const occurrenceId1 = '123321';
const occurrenceId2 = '321123';
const eventName = 'Testitapahtuma';
const locationId = 'locationId';
const locationName = 'Kirjasto';

const createPageMock = (
  pEventOverrides: Partial<graphqlFns.PalvelutarjotinEventNode>,
  locationId?: string
): MockedResponse[] => [
  createDefaultEventQueryMock({
    include: ['audience', 'in_language'],
    result: {
      id: eventId,
      name: fakeLocalizedObject(eventName),
      location: fakePlace(
        locationId
          ? { id: locationId, name: fakeLocalizedObject(locationName) }
          : {}
      ),
      pEvent: fakePEvent(pEventOverrides),
    },
  }),
  createStudyLevelsQueryMock(),
];

const occurrenceEnrolDifferentTimes: Partial<graphqlFns.OccurrenceNode>[] = [
  { id: occurrenceId1, startTime: new Date(2020, 8, 25, 12, 30) },
  { id: occurrenceId2, startTime: new Date(2020, 8, 26, 13, 20) },
  { id: 'sdfgdfhbf345345yreg', startTime: new Date(2020, 8, 26, 14, 20) },
];

const pageMockWithSelectedPlace: MockedResponse[] = [
  createPlaceQueryMock({
    id: locationId,
    name: fakeLocalizedObject(locationName),
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

const pageMockEnrolHandpick: MockedResponse[] = createPageMock(
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

const renderComponent = (options?: CustomRenderOptions) => {
  return render(<EventPage />, {
    query: { eventId: eventId },
    path: `/fi${ROUTES.EVENT_DETAILS.replace(':id', eventId)}`,
    ...options,
  });
};

advanceTo(new Date(2020, 8, 8));

// if these tests give bunch of act warnings that fill up console, comment test step out and add back one by one
// or the other way aroung + add "await act(() => wait(500))" as the last line in the test

test('user can select single occurrences and enrol to it with enrolment form', async () => {
  // eslint-disable-next-line import/namespace
  const enrolOccurrenceMock = jest.fn();
  jest
    .spyOn(graphqlFns, 'useEnrolOccurrenceMutation')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue([enrolOccurrenceMock, { loading: false }] as any);

  renderComponent({
    mocks: pageMockEnrolHandpick,
  });

  const rows = await screen.findAllByRole('row');

  expect(rows[1].textContent).toMatchInlineSnapshot(
    `"25.9.2020 pe12:30 – 13:30suomi, englantifi, enKirjasto30 / 30Näytä lisätiedot"`
  );

  userEvent.click(
    within(rows[1]).getByRole('button', {
      name: /näytä tapahtuma-ajan lisätiedot/i,
    })
  );

  userEvent.click(screen.getByText(/varaustiedustelu/i));

  await screen.findByRole('heading', { name: 'Ilmoittajan tiedot' });

  await fillForm({
    additionalInfoName: /Lisätiedot \*/i,
    submitButtonName: /lähetä varaustiedustelu/i,
  });

  if (isFeatureEnabled('FORMIK_PERSIST')) {
    // wait for debounce to trigger and populate localStorage
    await act(() => wait(500));

    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(localStorage.getItem(FORM_NAMES.ENROLMENT_FORM)!)
    ).toMatchSnapshot();
  }

  await waitFor(() => {
    expect(getRecommendedEventsQueryVariables()).toEqual({
      unitIds: [null],
      studyLevels: ['kultus:55', 'kultus:56'],
    });
  });

  await waitFor(() => {
    expect(enrolOccurrenceMock).toHaveBeenCalledWith({
      variables: {
        input: {
          captchaKey: 'captcha-token',
          notificationType: 'EMAIL_SMS',
          occurrenceIds: ['123321'],
          person: undefined,
          studyGroup: {
            amountOfAdult: 2,
            extraNeeds: 'Lisätietoja ilmoittautumiseen',
            groupName: '4a',
            groupSize: 10,
            unitId: null,
            unitName: 'Testikoulu',
            person: {
              emailAddress: 'testi@testi.fi',
              language: 'FI',
              name: 'Nimi Niminen',
              phoneNumber: '123321123',
            },
            studyLevels: ['GRADE_2', 'GRADE_4'],
          },
        },
      },
    });
  });
});

test('user can select multiple occurrences and enrol to them with enrolment form', async () => {
  // eslint-disable-next-line import/namespace
  const enrolOccurrenceMock = jest.fn();
  jest
    .spyOn(graphqlFns, 'useEnrolOccurrenceMutation')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue([enrolOccurrenceMock, { loading: false }] as any);

  renderComponent({
    mocks: pageMockWithSelectedPlace,
  });

  await screen.findAllByRole('button', {
    name: /näytä tapahtuma-ajan lisätiedot/i,
  });

  const rows = await screen.findAllByRole('row');

  expect(rows[1].textContent).toMatchInlineSnapshot(
    `"25.9.2020 pe12:30 – 13:30suomi, englantifi, enKirjasto30 / 30Näytä lisätiedot"`
  );
  expect(rows[2].textContent).toMatchInlineSnapshot(
    `"26.9.2020 la13:20 – 14:20suomi, englantifi, enKirjasto30 / 30Näytä lisätiedot"`
  );
  expect(rows[3].textContent).toMatchInlineSnapshot(
    `"26.9.2020 la14:20 – 15:20suomi, englantifi, enKirjasto30 / 30Näytä lisätiedot"`
  );

  userEvent.click(
    within(rows[1]).getByRole('checkbox', { name: 'Valitse tapahtuma-aika' })
  );
  userEvent.click(
    within(rows[2]).getByRole('checkbox', { name: 'Valitse tapahtuma-aika' })
  );
  userEvent.click(screen.getByRole('button', { name: /ilmoittaudu/i }));

  await fillForm();

  if (isFeatureEnabled('FORMIK_PERSIST')) {
    // wait for debounce to trigger and populate localStorage
    await act(() => wait(500));

    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(localStorage.getItem(FORM_NAMES.ENROLMENT_FORM)!)
    ).toMatchSnapshot();
  }

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
            unitId: null,
            unitName: 'Testikoulu',
            person: {
              emailAddress: 'testi@testi.fi',
              language: 'FI',
              name: 'Nimi Niminen',
              phoneNumber: '123321123',
            },
            studyLevels: ['GRADE_2', 'GRADE_4'],
          },
        },
      },
    });
  });
});

const fillForm = async ({
  additionalInfoName = /lisätiedot \(valinnainen\)/i,
  submitButtonName = /lähetä ilmoittautuminen/i,
}: {
  additionalInfoName?: RegExp | string;
  submitButtonName?: RegExp | string;
} = {}) => {
  const enrolmentForm = within(screen.getByTestId('enrolment-form'));

  userEvent.type(enrolmentForm.getByLabelText(/nimi/i), 'Nimi Niminen');

  userEvent.type(
    enrolmentForm.getByLabelText(/sähköpostiosoite/i),
    'testi@testi.fi'
  );

  userEvent.type(enrolmentForm.getByLabelText(/puhelinnumero/i), '123321123');

  userEvent.click(enrolmentForm.getByLabelText(/paikka ei ole listalla/i));

  userEvent.type(
    enrolmentForm.getByLabelText(/päiväkoti \/ koulu \/ oppilaitos/i),
    'Testikoulu'
  );
  userEvent.type(enrolmentForm.getByLabelText(/ryhmä/i), '4a');

  // select grade from dropdown
  userEvent.click(enrolmentForm.getByRole('button', { name: /luokka-aste/i }));

  const grade1 = await enrolmentForm.findByRole('option', {
    name: /2\. luokka/i,
  });
  const grade2 = await enrolmentForm.findByRole('option', {
    name: /4\. luokka/i,
  });
  userEvent.click(grade1);
  userEvent.click(grade2);

  // close dropdown
  userEvent.click(enrolmentForm.getByRole('button', { name: /luokka-aste/i }));

  userEvent.type(enrolmentForm.getByLabelText(/lapsia/i), '10');
  userEvent.type(enrolmentForm.getByLabelText(/aikuisia/i), '2');

  expect(
    enrolmentForm.getByRole('checkbox', { name: /sama kuin ilmoittaja/i })
  ).toBeChecked();
  userEvent.click(
    enrolmentForm.getByRole('checkbox', { name: /sähköpostilla/i })
  );
  userEvent.click(enrolmentForm.getByText(/tekstiviestillä/i));

  userEvent.click(
    enrolmentForm.getByRole('button', { name: /Ilmoitusten kieli/ })
  );
  userEvent.click(enrolmentForm.getByRole('option', { name: /suomi/i }));

  userEvent.type(
    enrolmentForm.getByRole('textbox', { name: additionalInfoName }),
    'Lisätietoja ilmoittautumiseen'
  );

  // test that error notification works
  userEvent.click(
    enrolmentForm.getByRole('button', { name: submitButtonName })
  );
  const alertContainer = await enrolmentForm.findByRole('alert');
  expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i);
  expect(alertContainer).toHaveTextContent(
    /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i
  );

  userEvent.click(
    enrolmentForm.getByRole('checkbox', {
      name: /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i,
    })
  );

  await waitFor(() => {
    expect(enrolmentForm.queryByRole('alert')).not.toBeInTheDocument();
  });

  userEvent.click(
    enrolmentForm.getByRole('button', { name: submitButtonName })
  );
};
