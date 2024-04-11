import { MockedResponse } from '@apollo/client/testing';
import * as React from 'react';

import { FORM_NAMES } from '../../../../constants';
import { createPlaceQueryMock } from '../../../../tests/apollo-mocks/placeMocks';
// eslint-disable-next-line max-len
import { createSchoolsAndKindergartensListQueryMock } from '../../../../tests/apollo-mocks/schoolsAndKindergartensListMock';
import { createStudyLevelsQueryMock } from '../../../../tests/apollo-mocks/studyLevelsMocks';
import { isFeatureEnabled } from '../../../../utils/featureFlags';
import {
  fakeLocalizedObject,
  StudyLevel,
} from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  waitFor,
  userEvent,
  configure,
  within,
  sleep,
} from '../../../../utils/testUtils';
import { defaultEnrolmentInitialValues } from '../constants';
import EnrolmentForm, { Props } from '../EnrolmentForm';

configure({ defaultHidden: true });

const defaultMocks: MockedResponse[] = [
  createStudyLevelsQueryMock(),
  createSchoolsAndKindergartensListQueryMock(10, [
    { id: 'test:place1', name: fakeLocalizedObject('place1') },
    { id: 'test:place2', name: fakeLocalizedObject('place2') },
    { id: 'test:place12', name: fakeLocalizedObject('place12') },
    { id: 'test:place123', name: fakeLocalizedObject('place123') },
  ]),
];

const renderComponent = ({
  props: { initialValues, ...restProps } = {},
  mocks = [],
}: {
  props?: Partial<Omit<Props, 'initialValues'>> & {
    initialValues?: Partial<Props['initialValues']>;
  };
  mocks?: MockedResponse[];
} = {}) => {
  const onCloseFormMock = jest.fn();
  const onSubmitMock = jest.fn();
  const renderResult = render(
    <EnrolmentForm
      enquiry
      onCloseForm={onCloseFormMock}
      onSubmit={onSubmitMock}
      submitting={false}
      initialValues={{ ...defaultEnrolmentInitialValues, ...initialValues }}
      {...restProps}
    />,
    { mocks: [...defaultMocks, ...mocks] }
  );

  return { ...renderResult, onCloseFormMock, onSubmitMock };
};

test('renders form and user can fill it and submit and form is saved to local storage', async () => {
  const { onSubmitMock } = renderComponent({
    props: { minGroupSize: 10, maxGroupSize: 20 },
  });

  await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });

  await userEvent.type(
    screen.getByRole('textbox', { name: /nimi/i }),
    'Nimi Niminen'
  );

  await userEvent.type(
    screen.getByRole('textbox', { name: /sähköpostiosoite/i }),
    'testi@testi.fi'
  );

  await userEvent.type(
    screen.getByRole('textbox', { name: /puhelinnumero/i }),
    '123321123'
  );

  await userEvent.click(
    screen.getByRole('checkbox', {
      name: /Paikka ei ole listalla/i,
    })
  );

  await userEvent.type(
    screen.getByRole('textbox', {
      name: /päiväkoti \/ koulu \/ oppilaitos/i,
    }),
    'Testikoulu'
  );

  await userEvent.type(screen.getByRole('textbox', { name: /ryhmä/i }), '4a');

  // select grade from dropdown

  await userEvent.click(
    screen.getByRole('button', { name: /luokka-aste \*/i })
  );

  await userEvent.click(screen.getByRole('option', { name: /4\. luokka/i }));

  await userEvent.click(screen.getByRole('option', { name: /2\. luokka/i }));

  // // close dropdown

  await userEvent.click(
    screen.getAllByRole('button', { name: /luokka-aste/i })[1]
  );

  await userEvent.type(screen.getByLabelText(/lapsia/i), '10');
  await userEvent.type(screen.getByLabelText(/aikuisia/i), '2');

  expect(
    screen.getByRole('checkbox', { name: /sama kuin ilmoittaja/i })
  ).toBeChecked();
  await userEvent.click(
    screen.getByRole('checkbox', { name: /sähköpostilla/i })
  );
  await userEvent.click(screen.getByText(/tekstiviestillä/i));

  await userEvent.click(
    screen.getByRole('button', { name: /Ilmoitusten kieli/ })
  );
  await userEvent.click(screen.getByRole('option', { name: /suomi/i }));

  await userEvent.type(
    screen.getByRole('textbox', { name: /lisätiedot \(valinnainen\)/i }),
    'Lisätietoja ilmoittautumiseen'
  );

  // test that error notification works

  await userEvent.click(
    screen.getByRole('button', { name: /lähetä varaustiedustelu/i })
  );
  const alertContainer = await screen.findByRole('alert');
  expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i);
  expect(alertContainer).toHaveTextContent(
    /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i
  );

  await userEvent.click(
    screen.getByRole('checkbox', {
      name: /hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa/i,
    })
  );

  await waitFor(() => {
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  await userEvent.click(
    screen.getByRole('button', { name: /lähetä varaustiedustelu/i })
  );

  if (isFeatureEnabled('FORMIK_PERSIST')) {
    // wait for debounce to trigger and populate localStorage
    await sleep(500);

    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(localStorage.getItem(FORM_NAMES.ENROLMENT_FORM)!)
    ).toMatchSnapshot();
  }

  expect(onSubmitMock).toHaveBeenCalledTimes(1);
  expect(onSubmitMock.mock.calls[0]).toMatchSnapshot();

  await sleep(500);
});

test('render and focuses error notification correctly', async () => {
  renderComponent({ props: { enquiry: false } });

  await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });

  await userEvent.click(
    screen.getByRole('button', { name: /lähetä ilmoittautuminen/i })
  );

  const alertContainer = await screen.findByRole('alert');
  expect(alertContainer).toHaveTextContent(/Virhe lomakkeessa/i);

  const withinAlertContainer = within(alertContainer);

  const requiredFieldLabels = [
    'Hyväksyn tietojeni jakamisen tapahtuman järjestäjän kanssa',
    'Nimi',
    'Sähköpostiosoite',
    'Puhelinnumero',
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

  await userEvent.tab();

  expect(screen.getByRole('textbox', { name: /nimi/i })).toHaveFocus();
});

describe('max group size validation of the Children and Adults -fields', () => {
  const createEnrolmentForm = async (
    childrenCount: string,
    adultsCount: string,
    minGroupSize: number | undefined = 10,
    maxGroupSize: number | undefined = 20
  ) => {
    renderComponent({
      props: {
        minGroupSize,
        maxGroupSize,
      },
    });
    await screen.findByLabelText(/lapsia/i);
    childrenCount
      ? await userEvent.type(screen.getByLabelText(/lapsia/i), childrenCount)
      : await userEvent.click(screen.getByLabelText(/lapsia/i));
    adultsCount
      ? await userEvent.type(screen.getByLabelText(/aikuisia/i), adultsCount)
      : await userEvent.click(screen.getByLabelText(/aikuisia/i));
    await userEvent.tab();
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

  test('the enrolment should not be valid for empty group', async () => {
    await createEnrolmentForm('0', '0', undefined, undefined);
    await waitFor(() => {
      expect(
        screen.getAllByText(
          /Lasten ja aikuisten yhteislukumäärän tulee olla vähintään 1/i
        )
      ).toHaveLength(2);
    });
  });
});

test('mandatory additional information forces extraNeeds field to be required', async () => {
  renderComponent({
    props: {
      initialValues: { isMandatoryAdditionalInformationRequired: true },
    },
  });
  await screen.findByLabelText(/Lisätiedot/i);

  await userEvent.click(screen.getByRole('textbox', { name: /Lisätiedot/i }));

  await userEvent.tab();
  await screen.findByText(/Tämä kenttä on pakollinen/i);
});

test('Do not allow sms notifications if no phone number is given', async () => {
  renderComponent();
  await screen.findByLabelText(/Puhelinnumero/i);
  const phoneField = screen.getByLabelText(/Puhelinnumero/i);
  const smsField = screen.getByLabelText(/Tekstiviestillä/i);
  expect(phoneField).not.toHaveValue();
  expect(smsField).toBeDisabled();
  await userEvent.type(phoneField, '123');
  await userEvent.tab();
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  await userEvent.click(smsField);
  expect(smsField).toBeChecked();
  await userEvent.clear(phoneField);
  await userEvent.tab();
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).toBeDisabled();
  });
  expect(smsField).not.toBeChecked();
});

test('Allow sms notifications if any of the phone numbers are given', async () => {
  renderComponent();
  await screen.findByLabelText(/Sama kuin ilmoittaja/i);
  const isResponsiblePersonField =
    screen.getByLabelText(/Sama kuin ilmoittaja/i);

  await userEvent.click(isResponsiblePersonField);

  const phoneFields = screen.queryAllByLabelText(/Puhelinnumero/i);

  phoneFields.forEach(async (f) => await userEvent.type(f, '123'));
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  await userEvent.clear(phoneFields[0]);
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  phoneFields.forEach(async (f) => await userEvent.clear(f));
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).toBeDisabled();
  });
});

if (isFeatureEnabled('FORMIK_PERSIST')) {
  describe('form local storage', () => {
    const testValues = {
      hasEmailNotification: true,
      hasSmsNotification: false,
      isSameResponsiblePerson: true,
      isSharingDataAccepted: false,
      isMandatoryAdditionalInformationRequired: false,
      language: '',
      studyGroup: {
        person: {
          name: 'Test person',
          phoneNumber: '12312343657',
          emailAddress: 'test@test.com',
        },
        unitName: 'study group name',
        unitId: null,
        groupName: 'group name',
        groupSize: '10',
        amountOfAdult: '1',
        studyLevels: [StudyLevel.Grade_1],
        extraNeeds: 'extra needs',
        preferredTimes: 'preferred times',
      },
      person: {
        name: '',
        phoneNumber: '',
        emailAddress: '',
      },
    };
    const formikDefaultState = {
      values: testValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      initialValues: defaultEnrolmentInitialValues,
      initialErrors: {},
      initialTouched: {},
      isValid: true,
      dirty: true,
      validateOnBlur: true,
      validateOnChange: true,
      validateOnMount: false,
    };
    test("form doesn't break if localstorage data is deprecated", async () => {
      localStorage.setItem(
        FORM_NAMES.ENROLMENT_FORM,
        // change studygroup in localstorage to differ from form values
        JSON.stringify({
          ...formikDefaultState,
          values: { ...testValues, studyGroup: { name: 'name' } },
        })
      );
      renderComponent();
      await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });
      const nameInput = (
        await screen.findAllByRole('textbox', { name: /nimi \*/i })
      )[0];
      // shoud not initialize from local storage
      expect(nameInput).toHaveValue('');
    });

    test('form is prefilled from local storage', async () => {
      localStorage.setItem(
        FORM_NAMES.ENROLMENT_FORM,
        JSON.stringify(formikDefaultState)
      );
      renderComponent();
      await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });
      const nameInput = (
        await screen.findAllByRole('textbox', { name: /nimi \*/i })
      )[0];
      expect(nameInput).toHaveValue(testValues.studyGroup.person.name);
      const emailInput = screen.getAllByRole('textbox', {
        name: /sähköpostiosoite \*/i,
      })[0];
      expect(emailInput).toHaveValue(testValues.studyGroup.person.emailAddress);
      const phoneInput = screen.getAllByRole('textbox', {
        name: /puhelinnumero \*/i,
      })[0];
      expect(phoneInput).toHaveValue(testValues.studyGroup.person.phoneNumber);
      await userEvent.click(
        screen.getByRole('checkbox', {
          name: /Paikka ei ole listalla/i,
        })
      );
      const studyGroupUnitName = screen.getByRole('textbox', {
        name: /päiväkoti \/ koulu \/ oppilaitos/i,
      });
      expect(studyGroupUnitName).toHaveValue(testValues.studyGroup.unitName);
      const studyGroupNameInput = screen.getByRole('textbox', {
        name: /ryhmä \*/i,
      });
      expect(studyGroupNameInput).toHaveValue(testValues.studyGroup.groupName);
      // grade level should be selected
      screen.getByText(/1\. luokka/i);
      const childrenCountInput = screen.getByRole('spinbutton', {
        name: /lapsia \*/i,
      });
      expect(childrenCountInput).toHaveValue(10);
      const adultsCountInput = screen.getByRole('spinbutton', {
        name: /aikuisia \*/i,
      });
      expect(adultsCountInput).toHaveValue(1);
      const extraNeedsInput = screen.getByRole('textbox', {
        name: /lisätiedot \(valinnainen\)/i,
      });
      expect(extraNeedsInput).toHaveValue(testValues.studyGroup.extraNeeds);
      const chargeOfTheGroupCheckbox = screen.getByRole('checkbox', {
        name: /sama kuin ilmoittaja/i,
      });
      expect(chargeOfTheGroupCheckbox).toBeChecked();
    });
  });
}

describe('UnitField', () => {
  const getUnitFieldInput = () =>
    screen.getByRole('textbox', {
      name: /päiväkoti \/ koulu \/ oppilaitos/i,
    });

  const setupUnitFieldTest = async (testMocks: MockedResponse[] = []) => {
    renderComponent({
      mocks: testMocks,
      props: {
        minGroupSize: 10,
        maxGroupSize: 20,
      },
    });

    await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });
  };

  it('renders properly', async () => {
    await setupUnitFieldTest();

    expect(
      screen.getByText(/etsi helsinkiläistä toimipistettä/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/kirjoita toimipaikan nimi/i)
    ).not.toBeInTheDocument();

    // When checkbox is checked
    await userEvent.click(
      screen.getByRole('checkbox', {
        name: /paikka ei ole listalla/i,
      })
    );

    // It renders the freetext input field
    expect(
      screen.queryByText(/etsi helsinkiläistä toimipistettä/i)
    ).not.toBeInTheDocument();

    expect(screen.getByText(/kirjoita toimipaikan nimi/i)).toBeInTheDocument();

    await userEvent.type(getUnitFieldInput(), 'Testikoulu');

    await userEvent.tab();

    expect(getUnitFieldInput()).toHaveValue('Testikoulu');

    // wait for network requests and state updates
    await sleep(500);
  });

  it('renders a list of schools and kindergartens in unit id field', async () => {
    await setupUnitFieldTest();

    const unitFieldInput = screen.getByRole('textbox', {
      name: /päiväkoti \/ koulu \/ oppilaitos/i,
    });

    // avoid act warning by clicking the input first
    await userEvent.click(unitFieldInput);
    await userEvent.type(unitFieldInput, 'place');

    // The inserted text should filter autosuggest field options
    await screen.findByText('place12');
    expect(screen.getByText('place123')).toBeInTheDocument();
    expect(screen.queryByText('place1')).toBeInTheDocument();
    expect(screen.queryByText('place2')).toBeInTheDocument();

    // Type to unit id field
    await userEvent.clear(unitFieldInput);

    // avoid act warning by clicking the input first
    await userEvent.click(unitFieldInput);
    await userEvent.type(unitFieldInput, 'place12');

    // The inserted text should filter autosuggest field options
    await screen.findByText('place12');
    expect(screen.getByText('place123')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('place1')).not.toBeInTheDocument();
      expect(screen.queryByText('place2')).not.toBeInTheDocument();
    });
  });

  it.each<MockedResponse[] | undefined>([
    [
      createPlaceQueryMock({
        id: 'test:place12',
        name: fakeLocalizedObject('place12'),
      }),
    ],
    undefined,
  ])(
    'shows the unit text in a autosuggest div next to the input (%p)',
    async (placeMocks) => {
      await setupUnitFieldTest(placeMocks);

      // avoid act warning by clicking the input first
      await userEvent.click(getUnitFieldInput());
      await userEvent.type(getUnitFieldInput(), 'place12');
      await screen.findByText('place12');

      // Select an unit
      await userEvent.click(screen.getByText('place12'));

      await waitFor(() => {
        expect(getUnitFieldInput().nextElementSibling).toHaveTextContent(
          placeMocks ? 'place12' : 'unitPlaceSelector.noPlaceFoundError'
        );
      });
    }
  );

  it('clears the unit id value when a clear button is clicked', async () => {
    await setupUnitFieldTest();

    await userEvent.click(getUnitFieldInput());
    await userEvent.type(getUnitFieldInput(), 'place12');

    await screen.findByText('place12');

    // Select an unit
    await userEvent.click(screen.getByText('place12'));

    expect(getUnitFieldInput().nextElementSibling).toBeDefined();

    // clear the selection

    await userEvent.click(
      screen.getByRole('button', {
        name: /poista arvo/i,
      })
    );

    // No sibling anymore when the value is cleared
    await waitFor(() => {
      expect(getUnitFieldInput().nextElementSibling).toBe(null);
    });
  });
});
