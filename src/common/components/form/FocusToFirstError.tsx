import { useFormikContext } from 'formik';
import React from 'react';

import { invalidFieldClass } from './constants';

const FocusToFirstError: React.FC = () => {
  const { isSubmitting, isValid, isValidating } = useFormikContext();

  React.useEffect(() => {
    if (isSubmitting && !isValidating && !isValid) {
      const element = document.getElementsByClassName(
        invalidFieldClass
      )[0] as HTMLElement;
      if (element) {
        const input = element.getElementsByTagName('input')[0] as HTMLElement;
        if (input) {
          input.focus();
        } else {
          // Dropdown component doesn't have input field so focus to button
          const button = element.getElementsByTagName(
            'button'
          )[0] as HTMLElement;

          if (button) {
            button.focus();
          }
        }
      }
    }
  }, [isSubmitting, isValid, isValidating]);

  return null;
};

export default FocusToFirstError;
