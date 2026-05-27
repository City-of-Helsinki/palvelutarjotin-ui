import { Formik } from 'formik';
import * as React from 'react';

import {
  render,
  screen,
  userEvent,
  within,
  configure,
  waitFor,
} from '../../../../utils/testUtils';
import { IsPartOfCulturalRoute } from '../constants';
import IsPartOfCulturalRouteField from '../IsPartOfCulturalRouteField';
import getValidationSchema from '../ValidationSchema';

configure({ defaultHidden: true });

const renderComponent = (initialValue: IsPartOfCulturalRoute | '' = '') =>
  render(
    <Formik
      initialValues={{ isPartOfCulturalRoute: initialValue }}
      onSubmit={jest.fn()}
      validationSchema={getValidationSchema({ isQueueEnrolment: false })}
    >
      {({ submitForm }) => (
        <>
          <IsPartOfCulturalRouteField formikFieldName="isPartOfCulturalRoute" />
          <button type="button" onClick={submitForm}>
            Submit
          </button>
        </>
      )}
    </Formik>
  );

const getGroup = () =>
  screen.findByRole('group', { name: /käynti sisältyy kulttuuripolkuun/i });

const getNoOrUnknownRadio = (group: HTMLElement) =>
  within(group).getByRole('radio', { name: /ei \/ en tiedä/i });

const getYesRadio = (group: HTMLElement) =>
  within(group).getByRole('radio', { name: /kyllä/i });

describe('IsPartOfCulturalRouteField', () => {
  it('renders the selection group with both radio options', async () => {
    renderComponent();
    const group = await getGroup();
    expect(getNoOrUnknownRadio(group)).toBeInTheDocument();
    expect(getYesRadio(group)).toBeInTheDocument();
  });

  it('has no radio checked when initial value is empty', async () => {
    renderComponent('');
    const group = await getGroup();
    expect(getNoOrUnknownRadio(group)).not.toBeChecked();
    expect(getYesRadio(group)).not.toBeChecked();
  });

  it('checks "No / I don\'t know" when initial value is NO_OR_UNKNOWN', async () => {
    renderComponent(IsPartOfCulturalRoute.NO_OR_UNKNOWN);
    const group = await getGroup();
    expect(getNoOrUnknownRadio(group)).toBeChecked();
    expect(getYesRadio(group)).not.toBeChecked();
  });

  it('checks "Yes" when initial value is YES', async () => {
    renderComponent(IsPartOfCulturalRoute.YES);
    const group = await getGroup();
    expect(getNoOrUnknownRadio(group)).not.toBeChecked();
    expect(getYesRadio(group)).toBeChecked();
  });

  it('checks only "Yes" radio after clicking it', async () => {
    renderComponent('');
    const group = await getGroup();
    await userEvent.click(getYesRadio(group));
    expect(getYesRadio(group)).toBeChecked();
    expect(getNoOrUnknownRadio(group)).not.toBeChecked();
  });

  it('checks only "No / I don\'t know" radio after clicking it', async () => {
    renderComponent('');
    const group = await getGroup();
    await userEvent.click(getNoOrUnknownRadio(group));
    expect(getNoOrUnknownRadio(group)).toBeChecked();
    expect(getYesRadio(group)).not.toBeChecked();
  });

  it('renders a "read more" link with correct href', async () => {
    renderComponent();
    const group = await getGroup();
    const link = within(group).getByRole('link', {
      name: /lue lisää kulttuuripoluista/i,
    });
    expect(link).toHaveAttribute(
      'href',
      '/fi/cms-page/kulttuurikasvatus/kulttuuripolulla-kulttuuria-kaikille'
    );
  });

  it.each([IsPartOfCulturalRoute.NO_OR_UNKNOWN, IsPartOfCulturalRoute.YES])(
    'shows no error text when submitted with valid value %p',
    async (validValue) => {
      renderComponent(validValue);

      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() =>
        expect(
          screen.queryByText(/tämä kenttä on pakollinen/i)
        ).not.toBeInTheDocument()
      );
    }
  );

  it('shows error text when the field is submitted without a selection', async () => {
    renderComponent('');

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await screen.findByText(/tämä kenttä on pakollinen/i);
  });
});
