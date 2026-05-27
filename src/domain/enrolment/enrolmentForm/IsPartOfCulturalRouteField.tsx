import { Link } from '@city-of-helsinki/react-helsinki-headless-cms';
import { useField } from 'formik';
import { RadioButton, SelectionGroup } from 'hds-react';
import { Trans, useTranslation } from 'next-i18next';
import React from 'react';

import { IsPartOfCulturalRoute, nameToLabelPath } from './constants';
import type { I18nNamespace } from '../../../types';

type Props = {
  formikFieldName: string;
};

/**
 * React component for "Is part of cultural route?" field in the enrolment form,
 * with choices of "No / I don't know" and "Yes".
 */
const IsPartOfCulturalRouteField: React.FC<Props> = ({ formikFieldName }) => {
  const { t } = useTranslation<I18nNamespace>();
  const [field, meta] = useField(formikFieldName);
  const errorText = meta.touched && meta.error ? t(meta.error) : undefined;
  const readMoreUrl = t('enrolment:enrolmentForm.culturalRoute.readMoreUrl');

  return (
    <SelectionGroup
      label={t(nameToLabelPath['isPartOfCulturalRoute'])}
      direction="horizontal"
      required
      aria-required
      errorText={errorText}
      /* @ts-expect-error TS2322 SelectionGroup's types allow only string, but Trans works */
      helperText={
        <Trans
          t={t}
          i18nKey={'enrolment:enrolmentForm.culturalRoute.helperText'}
          components={{ a: <Link href={readMoreUrl} /> }}
        />
      }
    >
      <RadioButton
        id="isPartOfCulturalRoute-noOrUnknown"
        name={field.name}
        value={IsPartOfCulturalRoute.NO_OR_UNKNOWN}
        label={t('enrolment:enrolmentForm.culturalRoute.labelNoOrUnknown')}
        checked={field.value === IsPartOfCulturalRoute.NO_OR_UNKNOWN}
        onChange={field.onChange}
        onBlur={field.onBlur}
      />
      <RadioButton
        id="isPartOfCulturalRoute-yes"
        name={field.name}
        value={IsPartOfCulturalRoute.YES}
        label={t('enrolment:enrolmentForm.culturalRoute.labelYes')}
        checked={field.value === IsPartOfCulturalRoute.YES}
        onChange={field.onChange}
        onBlur={field.onBlur}
      />
    </SelectionGroup>
  );
};

export default IsPartOfCulturalRouteField;
