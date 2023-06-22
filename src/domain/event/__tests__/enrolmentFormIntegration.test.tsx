/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { advanceTo } from 'jest-date-mock';
import React from 'react';

import { FORM_NAMES } from '../../../constants';
import * as graphqlFns from '../../../generated/graphql';
import { KeywordSetDocument, VenueDocument } from '../../../generated/graphql';
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
  sleep,
} from '../../../utils/testUtils';
import { ROUTES } from '../../app/routes/constants';
import EventPage from '../EventPage';

configure({ defaultHidden: true });
jest.setTimeout(100_000);
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

  {
    request: {
      query: KeywordSetDocument,
      variables: {
        setType: 'CATEGORY',
      },
    },
    result: {
      data: {
        keywordSet: null,
      },
    },
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        setType: 'TARGET_GROUP',
      },
    },
    result: {
      data: {
        keywordSet: null,
      },
    },
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        setType: 'ADDITIONAL_CRITERIA',
      },
    },
    result: {
      data: {
        keywordSet: null,
      },
    },
  },

  {
    request: {
      query: VenueDocument,
      variables: {
        id: 'locationId',
      },
    },
    result: {
      data: {
        venue: null,
      },
    },
  },
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

  await userEvent.click(
    within(rows[1]).getByRole('button', {
      name: /näytä tapahtuma-ajan lisätiedot/i,
    })
  );
  await userEvent.click(await screen.findByText(/varaustiedustelu/i));

  await screen.findByRole('heading', { name: 'Ilmoittajan tiedot' });

  await fillForm({
    additionalInfoName: /Lisätiedot \*/i,
    submitButtonName: /lähetä varaustiedustelu/i,
    testConfirmation: true,
  });

  if (isFeatureEnabled('FORMIK_PERSIST')) {
    // wait for debounce to trigger and populate localStorage
    await sleep(500);

    await waitFor(() =>
      expect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem(FORM_NAMES.ENROLMENT_FORM)!)
      ).toMatchSnapshot()
    );

    await waitFor(() => {
      expect(getRecommendedEventsQueryVariables()).toEqual({
        unitIds: [null],
        studyLevels: ['kultus:55', 'kultus:56'],
      });
    });
  }

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
  await sleep(500);
}, 150000);

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

  await userEvent.click(
    within(rows[1]).getByRole('checkbox', {
      name: 'Valitse tapahtuma-aika',
    })
  );

  await userEvent.click(
    within(rows[2]).getByRole('checkbox', {
      name: 'Valitse tapahtuma-aika',
    })
  );

  await userEvent.click(
    await screen.findByRole('button', { name: 'Ilmoittaudu' })
  );

  await screen.findByRole('heading', { name: 'Ilmoittajan tiedot' });

  await fillForm();

  if (isFeatureEnabled('FORMIK_PERSIST')) {
    // wait for debounce to trigger and populate localStorage
    await sleep(500);
    await waitFor(() =>
      expect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem(FORM_NAMES.ENROLMENT_FORM)!)
      ).toMatchSnapshot()
    );
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
  await sleep(500);
});

async function testErrorNotification({
  enrolmentForm,
  submitButtonName,
}: {
  enrolmentForm?: any;
  submitButtonName?: RegExp | string;
}) {
  // test that error notification works

  await userEvent.click(
    enrolmentForm.getByRole('button', { name: submitButtonName })
  );

  const alertContainer = await enrolmentForm.findByRole('alert');
  await waitFor(() =>
    expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i)
  );
  expect(alertContainer).toHaveTextContent(
    /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i
  );

  await userEvent.click(
    enrolmentForm.getByRole('checkbox', {
      name: /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i,
    })
  );

  await sleep(500);
  await waitFor(() => {
    expect(enrolmentForm.queryByRole('alert')).not.toBeInTheDocument();
  });
}

async function fillForm({
  additionalInfoName = /lisätiedot \(valinnainen\)/i,
  submitButtonName = /lähetä ilmoittautuminen/i,
  testConfirmation = false,
}: {
  additionalInfoName?: RegExp | string;
  submitButtonName?: RegExp | string;
  testConfirmation?: boolean;
} = {}) {
  const user = userEvent.setup();
  await waitFor(() => {
    expect(screen.getByTestId('enrolment-form')).toBeInTheDocument();
  });
  const enrolmentForm = within(screen.getByTestId('enrolment-form'));
  const getField = async (name: RegExp | string, role: string = 'textbox') =>
    await enrolmentForm.findByRole(role, { name });
  const fillField = async (fieldName: RegExp | string, input: string) => {
    const field = await getField(fieldName);
    await user.type(field, input);
    await waitFor(() => expect(field).toHaveValue(input));
  };

  await fillField(/nimi \*/i, 'Nimi Niminen');
  await fillField(/sähköpostiosoite \*/i, 'testi@testi.fi');
  await fillField(/puhelinnumero \*/i, '123321123');

  await user.click(enrolmentForm.getByLabelText(/paikka ei ole listalla/i));
  await sleep(500);
  await fillField(/päiväkoti \/ koulu \/ oppilaitos/i, 'Testikoulu');
  await fillField(/ryhmä/i, '4a');

  // select grade from dropdown
  const gradeButton = enrolmentForm.getByRole('button', {
    name: /luokka-aste/i,
  });
  await user.click(within(gradeButton?.parentElement!).getByText(/valitse/i));
  await user.click(
    await within(gradeButton?.parentElement!).findByRole('option', {
      name: /2\. luokka/i,
    })
  );
  await user.click(
    await within(gradeButton?.parentElement!).findByRole('option', {
      name: /4\. luokka/i,
    })
  );
  // close dropdown
  await user.click(gradeButton);
  await user.type(await enrolmentForm.findByLabelText(/lapsia/i), '10');
  await user.type(await enrolmentForm.findByLabelText(/aikuisia/i), '2');

  expect(
    enrolmentForm.getByRole('checkbox', { name: /sama kuin ilmoittaja/i })
  ).toBeChecked();

  await user.click(await getField(/sähköpostilla/i, 'checkbox'));
  await user.click(enrolmentForm.getByText(/tekstiviestillä/i));
  await user.click(await getField(/Ilmoitusten kieli/, 'button'));

  await user.click(
    await enrolmentForm.findByRole(
      'option',
      { name: /suomi/i },
      { timeout: 3000 }
    )
  );

  await fillField(additionalInfoName, 'Lisätietoja ilmoittautumiseen');
  await sleep(500);
  // test that error notification works
  if (testConfirmation) {
    await testErrorNotification({ enrolmentForm, submitButtonName });
  } else {
    await user.click(
      enrolmentForm.getByRole('checkbox', {
        name: /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i,
      })
    );
  }
  await sleep(500);
  await user.click(
    enrolmentForm.getByRole('button', { name: submitButtonName })
  );
  await sleep(500);
  // await waitFor(() => {
  //   expect(screen.queryByTestId('enrolment-form')).not.toBeInTheDocument();
  // });
}
