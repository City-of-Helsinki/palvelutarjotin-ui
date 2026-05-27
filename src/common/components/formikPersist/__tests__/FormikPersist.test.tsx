import { act, render, waitFor } from '@testing-library/react';
import { Formik, FormikProps } from 'formik';
import * as React from 'react';

import Persist from '../FormikPersist';

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const formName = 'form-name';

const defaultState = {
  values: { name: 'Name from local storage' },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
  submitCount: 0,
  initialValues: { name: 'Test name' },
  initialErrors: {},
  initialTouched: {},
  isValid: true,
  dirty: true,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnMount: false,
};

test('attempts to rehydrate on mount', async () => {
  let injected: FormikProps<{ name: string }>;

  (localStorage.getItem as jest.Mock).mockReturnValueOnce(
    JSON.stringify({
      ...defaultState,
      values: { name: 'Name from local storage' },
    })
  );

  render(
    <Formik initialValues={{ name: 'Test name' }} onSubmit={jest.fn()}>
      {(props: FormikProps<{ name: string }>) => {
        injected = props;

        return (
          <div>
            <Persist
              name={formName}
              debounceTime={0}
              initialValues={{ name: '' }}
            />
          </div>
        );
      }}
    </Formik>
  );

  expect(localStorage.getItem).toHaveBeenCalled();

  expect(injected!.values.name).toEqual('Name from local storage');

  act(() => {
    injected.setValues({ name: 'changed value' });
  });

  expect(injected!.values.name).toEqual('changed value');

  await waitFor(() => {
    expect(localStorage.setItem).toHaveBeenCalledWith(
      formName,
      JSON.stringify({ ...defaultState, values: { name: 'changed value' } })
    );
  });
});

test('attempts to rehydrate on mount if session storage is true on props', async () => {
  let injected: FormikProps<{ name: string }>;

  (sessionStorage.getItem as jest.Mock).mockReturnValueOnce(
    JSON.stringify({
      ...defaultState,
      values: { name: 'Name from session storage' },
    })
  );

  render(
    <Formik initialValues={{ name: 'Test name' }} onSubmit={jest.fn()}>
      {(props: FormikProps<{ name: string }>) => {
        injected = props;

        return (
          <div>
            <Persist
              name={formName}
              debounceTime={0}
              isSessionStorage={true}
              initialValues={{ name: 'Name from local storage' }}
            />
          </div>
        );
      }}
    </Formik>
  );

  expect(sessionStorage.getItem).toHaveBeenCalled();

  expect(injected!.values.name).toEqual('Name from session storage');

  act(() => {
    injected.setValues({ name: 'changed value' });
  });

  expect(injected!.values.name).toEqual('changed value');

  await waitFor(() => {
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      formName,
      JSON.stringify({ ...defaultState, values: { name: 'changed value' } })
    );
  });
});

test('alwaysFreshFields resets listed fields to their initial values', async () => {
  let injected: FormikProps<{ regularField: string; freshField: string }>;

  (localStorage.getItem as jest.Mock).mockReturnValueOnce(
    JSON.stringify({
      ...defaultState,
      values: {
        regularField: 'Persisted value of regular field',
        freshField: 'Persisted value of fresh field',
      },
    })
  );

  render(
    <Formik
      initialValues={{
        regularField: 'Initial value of regular field in Formik',
        freshField: 'Initial value of fresh field in Formik',
      }}
      onSubmit={jest.fn()}
    >
      {(props: FormikProps<{ regularField: string; freshField: string }>) => {
        injected = props;

        return (
          <div>
            <Persist
              name={formName}
              debounceTime={0}
              initialValues={{
                regularField: 'Initial value of regular field in Persist',
                freshField: 'Initial value of fresh field in Persist',
              }}
              alwaysFreshFields={['freshField']}
            />
          </div>
        );
      }}
    </Formik>
  );

  expect(localStorage.getItem).toHaveBeenCalled();

  // regularField is not in alwaysFreshFields, so it should be restored from storage
  expect(injected!.values.regularField).toEqual(
    'Persisted value of regular field'
  );
  // freshField is in alwaysFreshFields, so it must be reset to its initial value:
  expect(injected!.values.freshField).toEqual(
    'Initial value of fresh field in Persist'
  );
});
