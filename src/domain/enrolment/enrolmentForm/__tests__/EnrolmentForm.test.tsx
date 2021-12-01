import { MockedResponse } from '@apollo/client/testing';
import * as React from 'react';
import wait from 'waait';

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
  act,
  configure,
  within,
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

jest.setTimeout(30000);

test('renders form and user can fill it and submit and form is saved to local storage', async () => {
  const { onSubmitMock } = renderComponent({
    props: { minGroupSize: 10, maxGroupSize: 20 },
  });

  await screen.findByRole('heading', { name: /ilmoittajan tiedot/i });

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
  userEvent.click(
    screen.getByRole('checkbox', {
      name: /Paikka ei ole listalla/i,
    })
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /päiväkoti \/ koulu \/ oppilaitos/i }),
    'Testikoulu'
  );
  userEvent.type(screen.getByRole('textbox', { name: /ryhmä/i }), '4a');

  // select grade from dropdown
  userEvent.click(screen.getByRole('button', { name: /luokka-aste \*/i }));

  userEvent.click(screen.getByRole('option', { name: /4\. luokka/i }));
  userEvent.click(screen.getByRole('option', { name: /2\. luokka/i }));

  // // close dropdown
  userEvent.click(screen.getByRole('button', { name: /luokka-aste/i }));

  userEvent.type(screen.getByLabelText(/lapsia/i), '10');
  userEvent.type(screen.getByLabelText(/aikuisia/i), '2');

  expect(
    screen.getByRole('checkbox', { name: /sama kuin ilmoittaja/i })
  ).toBeChecked();
  userEvent.click(screen.getByRole('checkbox', { name: /sähköpostilla/i }));
  userEvent.click(screen.getByText(/tekstiviestillä/i));

  userEvent.click(screen.getByRole('button', { name: /Ilmoitusten kieli/ }));
  userEvent.click(screen.getByRole('option', { name: /suomi/i }));

  userEvent.type(
    screen.getByRole('textbox', { name: /lisätiedot \(valinnainen\)/i }),
    'Lisätietoja ilmoittautumiseen'
  );

  // test that error notification works
  userEvent.click(
    screen.getByRole('button', { name: /lähetä varaustiedustelu/i })
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
    screen.getByRole('button', { name: /lähetä varaustiedustelu/i })
  );

  if (isFeatureEnabled('FORMIK_PERSIST')) {
    // wait for debounce to trigger and populate localStorage
    await act(() => wait(500));

    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(localStorage.getItem(FORM_NAMES.ENROLMENT_FORM)!)
    ).toMatchSnapshot();
  }

  expect(onSubmitMock).toHaveBeenCalledTimes(1);
  expect(onSubmitMock.mock.calls[0]).toMatchSnapshot();

  await act(() => wait(500));
});

test('render and focuses error notification correctly', async () => {
  renderComponent({ props: { enquiry: false } });

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

  expect(screen.getByRole('textbox', { name: /nimi/i })).toHaveFocus();
});

describe('max group size validation of the Children and Adults -fields', () => {
  const createEnrolmentForm = async (
    childrenCount: string,
    adultsCount: string
  ) => {
    renderComponent({
      props: { minGroupSize: 10, maxGroupSize: 20 },
    });
    await screen.findByLabelText(/lapsia/i);
    childrenCount
      ? userEvent.type(screen.getByLabelText(/lapsia/i), childrenCount)
      : userEvent.click(screen.getByLabelText(/lapsia/i));
    adultsCount
      ? userEvent.type(screen.getByLabelText(/aikuisia/i), adultsCount)
      : userEvent.click(screen.getByLabelText(/aikuisia/i));
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
  renderComponent({
    props: {
      initialValues: { isMandatoryAdditionalInformationRequired: true },
    },
  });
  await screen.findByLabelText(/Lisätiedot/i);
  userEvent.click(screen.getByRole('textbox', { name: /Lisätiedot/i }));
  userEvent.tab();
  await screen.findByText(/Tämä kenttä on pakollinen/i);
});

test('Do not allow sms notifications if no phone number is given', async () => {
  renderComponent();
  await screen.findByLabelText(/Puhelinnumero/i);
  const phoneField = screen.getByLabelText(/Puhelinnumero/i);
  const smsField = screen.getByLabelText(/Tekstiviestillä/i);
  expect(phoneField).not.toHaveValue();
  expect(smsField).toBeDisabled();
  userEvent.type(phoneField, '123');
  act(() => userEvent.tab());
  await waitFor(() => {
    expect(screen.getByLabelText(/Tekstiviestillä/i)).not.toBeDisabled();
  });
  act(() => userEvent.click(smsField));
  expect(smsField).toBeChecked();
  userEvent.clear(phoneField);
  act(() => userEvent.tab());
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
      const emailInput = screen.getAllByLabelText(/sähköpostiosoite \*/i)[0];
      expect(emailInput).toHaveValue(testValues.studyGroup.person.emailAddress);
      const phoneInput = screen.getAllByLabelText(/puhelinnumero/i)[0];
      expect(phoneInput).toHaveValue(testValues.studyGroup.person.phoneNumber);
      userEvent.click(
        screen.getByRole('checkbox', {
          name: /Paikka ei ole listalla/i,
        })
      );
      const studyGroupUnitName = screen.getByLabelText(
        /päiväkoti \/ koulu \/ oppilaitos \*/i
      );
      expect(studyGroupUnitName).toHaveValue(testValues.studyGroup.unitName);
      const studyGroupNameInput = screen.getByLabelText(/ryhmä/i);
      expect(studyGroupNameInput).toHaveValue(testValues.studyGroup.groupName);
      // grade level should be selected
      screen.getByText(/1\. luokka/i);
      const childrenCountInput = screen.getByLabelText(/lapsia \*/i);
      expect(childrenCountInput).toHaveValue(10);
      const adultsCountInput = screen.getByLabelText(/aikuisia \*/i);
      expect(adultsCountInput).toHaveValue(1);
      const extraNeedsInput = screen.getByLabelText(
        /lisätiedot \(valinnainen\)/i
      );
      expect(extraNeedsInput).toHaveValue(testValues.studyGroup.extraNeeds);
      const chargeOfTheGroupCheckbox =
        screen.getByLabelText(/sama kuin ilmoittaja/i);
      expect(chargeOfTheGroupCheckbox).toBeChecked();
      await act(wait);
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
    userEvent.click(
      screen.getByRole('checkbox', {
        name: /paikka ei ole listalla/i,
      })
    );

    // It renders the freetext input field
    expect(
      screen.queryByText(/etsi helsinkiläistä toimipistettä/i)
    ).not.toBeInTheDocument();

    expect(screen.getByText(/kirjoita toimipaikan nimi/i)).toBeInTheDocument();

    userEvent.type(getUnitFieldInput(), 'Testikoulu');

    userEvent.tab();

    expect(getUnitFieldInput()).toHaveValue('Testikoulu');

    // wait for network requests and state updates
    await act(wait);
  });

  it('renders a list of schools and kindergartens in unit id field', async () => {
    await setupUnitFieldTest();

    const unitFieldInput = screen.getByRole('textbox', {
      name: /päiväkoti \/ koulu \/ oppilaitos/i,
    });

    // avoid act warning by clicking the input first
    act(() => userEvent.click(unitFieldInput));
    userEvent.type(unitFieldInput, 'place');

    // The inserted text should filter autosuggest field options
    await screen.findByText('place12');
    expect(screen.getByText('place123')).toBeInTheDocument();
    expect(screen.queryByText('place1')).toBeInTheDocument();
    expect(screen.queryByText('place2')).toBeInTheDocument();

    // Type to unit id field
    act(() => userEvent.clear(unitFieldInput));

    // avoid act warning by clicking the input first
    act(() => userEvent.click(unitFieldInput));
    userEvent.type(unitFieldInput, 'place12');

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
      act(() => userEvent.click(getUnitFieldInput()));
      userEvent.type(getUnitFieldInput(), 'place12');
      await screen.findByText('place12');

      // Select an unit
      userEvent.click(screen.getByText('place12'));

      await waitFor(() => {
        expect(getUnitFieldInput().nextElementSibling).toHaveTextContent(
          placeMocks ? 'place12' : 'unitPlaceSelector.noPlaceFoundError'
        );
      });
    }
  );

  it('clears the unit id value when a clear button is clicked', async () => {
    await setupUnitFieldTest();

    act(() => userEvent.click(getUnitFieldInput()));
    userEvent.type(getUnitFieldInput(), 'place12');

    await screen.findByText('place12');

    // Select an unit
    userEvent.click(screen.getByText('place12'));

    expect(getUnitFieldInput().nextElementSibling).toBeDefined();

    // clear the selection
    userEvent.click(
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
