import { Field, Formik } from 'formik';
import { Button, IconSearch } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DateInputField from '../../../common/components/form/fields/DateInputField';
import DropdownField from '../../../common/components/form/fields/DropdownField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import { EVENT_LANGUAGES } from '../../../constants';
import Container from '../../app/layout/Container';
import styles from './eventSearchForm.module.scss';

export type EventSearchFormValues = {
  text: string;
  inLanguage: EVENT_LANGUAGES[];
  date: Date | null;
};

const defaultInitialValues: EventSearchFormValues = {
  text: '',
  inLanguage: [],
  date: null,
};

interface Props {
  initialValues?: EventSearchFormValues;
  onClear: () => void;
  onSubmit: (values: EventSearchFormValues) => void;
}

const EventSearchForm = ({
  initialValues = defaultInitialValues,
  onClear,
  onSubmit,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const languageOptions = React.useMemo(
    () =>
      Object.values(EVENT_LANGUAGES).map((language) => ({
        label: t(`common:languages.${language}`),
        value: language,
      })),
    [t]
  );
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ handleSubmit }) => {
        return (
          <form className={styles.eventSearchForm} onSubmit={handleSubmit}>
            <Container className={styles.contentWrapper}>
              <h2>{t('events:search.title')}</h2>
              <div className={styles.textRow}>
                <Field
                  hideLabel
                  name="text"
                  component={TextInputField}
                  label={t('events:search.labelText')}
                  placeholder={t('events:search.placeholderText')}
                />
              </div>
              <div className={styles.filtersRow}>
                <Field
                  hideLabel
                  multiselect
                  name="inLanguage"
                  component={DropdownField}
                  label={t('events:search.labelLanguage')}
                  placeholder={t('events:search.labelLanguage')}
                  options={languageOptions}
                />
                <Field
                  hideLabel
                  name="date"
                  component={DateInputField}
                  labelText={t('events:search.labelDate')}
                  placeholder="Ajankohta"
                />
              </div>
              <div className={styles.buttonRow}>
                <div className={styles.clearButtonWrapper}>
                  <Button
                    onClick={onClear}
                    type="button"
                    variant="supplementary"
                  >
                    {t('events:search.buttonClear')}
                  </Button>
                </div>
                <div>
                  <Button
                    fullWidth={true}
                    iconLeft={<IconSearch />}
                    type="submit"
                  >
                    {t('events:search.buttonSearch')}
                  </Button>
                </div>
              </div>
            </Container>
          </form>
        );
      }}
    </Formik>
  );
};

export default EventSearchForm;
