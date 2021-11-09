import { FormikProps, useFormikContext } from 'formik';
import isEqual from 'lodash/isEqual';
import * as React from 'react';

import useIsMounted from '../../../hooks/useIsMounted';
import keyify from '../../../utils/keyify';

// lodash/debounce was problematic in tests so we use our own simple implementation
const debounce = (cb: (...params: any[]) => void, wait: number) => {
  let timeout: any;
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      timeout = null;
      cb(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export interface PersistProps {
  name: string;
  debounceTime?: number;
  isSessionStorage?: boolean;
  initialValues: Record<string, unknown>;
}

const FormikPersist = ({
  debounceTime = 300,
  isSessionStorage = false,
  name,
  initialValues,
}: PersistProps): null => {
  const isMounted = useIsMounted();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<any>();

  const debouncedSaveForm = React.useMemo(
    () =>
      debounce((data: FormikProps<Record<string, unknown>>) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        if (isSessionStorage) {
          window.sessionStorage.setItem(name, JSON.stringify(data));
        } else {
          window.localStorage.setItem(name, JSON.stringify(data));
        }
      }, debounceTime),
    [debounceTime, isMounted, isSessionStorage, name]
  );

  const saveForm = React.useCallback(
    (data: FormikProps<Record<string, unknown>>) => {
      debouncedSaveForm(data);
    },
    [debouncedSaveForm]
  );

  React.useEffect(() => {
    saveForm(formik);
  }, [formik, saveForm]);

  React.useEffect(() => {
    let timeout: any;

    const storedFormikState = isSessionStorage
      ? window.sessionStorage.getItem(name)
      : window.localStorage.getItem(name);

    const storedFormikStateObject =
      storedFormikState && JSON.parse(storedFormikState);

    if (
      storedFormikStateObject &&
      objectStructureMatches(initialValues, storedFormikStateObject.values)
    ) {
      formik.setFormikState(JSON.parse(storedFormikState));

      // Validate form after setting state
      timeout = setTimeout(() => {
        formik.validateForm();
      });
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const objectStructureMatches = (
  a: Record<string, any>,
  b: Record<string, any>
): boolean => {
  const arrayA = keyify(a);
  const arrayB = keyify(b);

  return isEqual(arrayA.sort(), arrayB.sort());
};

export default FormikPersist;
