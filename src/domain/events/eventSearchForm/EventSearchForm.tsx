import { Field, Formik } from 'formik';
import { Button, IconSearch, IconPen } from 'hds-react';
import React from 'react';

import DateInputField from '../../../common/components/form/fields/DateInputField';
import MultiDropdownField from '../../../common/components/form/fields/MultiDropdownField';
import PlaceSelectorField from '../../../common/components/form/fields/PlaceSelectorField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import { EVENT_LANGUAGES } from '../../../constants';
import { useTranslation } from '../../../i18n';
import FilterSummary from '../filterSummary/FilterSummary';
import styles from './eventSearchForm.module.scss';
import { useKeywordOptions } from './useKeywordOptions';

export type EventSearchFormValues = {
  text: string;
  inLanguage: EVENT_LANGUAGES[];
  targetGroups: string[];
  categories: string[];
  additionalCriteria: string[];
  date: Date | null;
  endDate: Date | null;
  places: string[];
  organisation?: string;
};

const defaultInitialValues: EventSearchFormValues = {
  text: '',
  inLanguage: [],
  targetGroups: [],
  categories: [],
  additionalCriteria: [],
  date: null,
  endDate: null,
  places: [],
  organisation: '',
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

  const {
    additionalCriteriaKeywords,
    categoryKeywords,
    targetGroups,
  } = useKeywordOptions();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ handleSubmit, values, resetForm }) => {
        return (
          <form className={styles.eventSearchForm} onSubmit={handleSubmit}>
            <div className={styles.contentWrapper}>
              <div className={styles.textRow}>
                <Field
                  hideLabel
                  name="text"
                  component={TextInputField}
                  label={t('events:search.labelText')}
                  placeholder={t('events:search.placeholderText')}
                />
              </div>
              <div className={styles.filtersRow3}>
                <Field
                  hideLabel
                  name="targetGroups"
                  component={MultiDropdownField}
                  label={t('events:search.labelTargetGroups')}
                  placeholder={t('events:search.labelTargetGroups')}
                  clearButtonAriaLabel={t(
                    'events:search.accessibility.audienceDropdown.clearButtonAriaLabel'
                  )}
                  selectedItemRemoveButtonAriaLabel={t(
                    'events:search.accessibility.audienceDropdown.selectedItemRemoveButtonAriaLabel'
                  )}
                  options={targetGroups}
                />
                <Field
                  hideLabel
                  name="categories"
                  component={MultiDropdownField}
                  label={t('events:search.labelCategories')}
                  placeholder={t('events:search.labelCategories')}
                  clearButtonAriaLabel={t(
                    'events:search.accessibility.categoryDropdown.clearButtonAriaLabel'
                  )}
                  selectedItemRemoveButtonAriaLabel={t(
                    'events:search.accessibility.categoryDropdown.selectedItemRemoveButtonAriaLabel'
                  )}
                  options={categoryKeywords}
                />
                <Field
                  hideLabel
                  name="additionalCriteria"
                  component={MultiDropdownField}
                  label={t('events:search.labelActivities')}
                  placeholder={t('events:search.labelActivities')}
                  clearButtonAriaLabel={t(
                    'events:search.accessibility.activityDropdown.clearButtonAriaLabel'
                  )}
                  selectedItemRemoveButtonAriaLabel={t(
                    'events:search.accessibility.activityDropdown.selectedItemRemoveButtonAriaLabel'
                  )}
                  options={additionalCriteriaKeywords}
                />
              </div>
              <div className={styles.filtersRow4}>
                <Field
                  hideLabel
                  name="inLanguage"
                  component={MultiDropdownField}
                  label={t('events:search.labelLanguage')}
                  placeholder={t('events:search.labelLanguage')}
                  options={languageOptions}
                />
                <Field
                  title={t('events:search.labelPlaces')}
                  component={PlaceSelectorField}
                  showSearch={true}
                  name="places"
                  inputPlaceholder={t('events:search.placeInputPlaceholder')}
                />
                <Field
                  hideLabel
                  name="date"
                  component={DateInputField}
                  labelText={t('events:search.labelDate')}
                  placeholder={t('events:search.labelDate')}
                  maxDate={values.endDate}
                />
                <Field
                  hideLabel
                  name="endDate"
                  component={DateInputField}
                  labelText={t('events:search.labelEndDate')}
                  placeholder={t('events:search.labelEndDate')}
                  minDate={values.date}
                />
              </div>
              <div className={styles.buttonRow}>
                <Button
                  variant="success"
                  fullWidth={true}
                  iconLeft={<IconSearch />}
                  type="submit"
                >
                  {t('events:search.buttonSearch')}
                </Button>
                <FilterSummary filters={initialValues} />
                <div className={styles.clearButtonWrapper}>
                  <Button
                    onClick={() => {
                      resetForm();
                      onClear();
                    }}
                    type="button"
                    variant="supplementary"
                    iconLeft={<IconPen />}
                  >
                    {t('events:search.buttonClear')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default EventSearchForm;
