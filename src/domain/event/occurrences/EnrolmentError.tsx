import { useTranslation } from 'next-i18next';
import * as React from 'react';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import { translateValue } from '../../../utils/translateUtils';
import { ENROLMENT_ERRORS } from '../../enrolment/constants';

interface Props {
  error: ENROLMENT_ERRORS;
}

const EnrolmentError = ({ error }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ErrorMessage>
      {translateValue('enrolment:errors.label.', error, t)}
    </ErrorMessage>
  );
};

export default EnrolmentError;
