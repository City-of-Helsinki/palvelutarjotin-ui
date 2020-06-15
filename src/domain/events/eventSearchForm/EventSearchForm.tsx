import { Field, Formik } from 'formik';
import { Button, IconSearch } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextInputField from '../../../common/components/form/fields/TextInputField';
import Container from '../../app/layout/Container';
import styles from './eventSearchForm.module.scss';

export type EventSearchFormValues = {
  text: string;
};

const defaultInitialValues: EventSearchFormValues = {
  text: '',
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
                  name="text"
                  component={TextInputField}
                  hideLabel={true}
                  label={t('events:search.labelText')}
                  placeholder={t('events:search.placeholderText')}
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
