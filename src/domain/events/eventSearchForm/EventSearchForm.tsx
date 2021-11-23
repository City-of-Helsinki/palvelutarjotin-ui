import classNames from 'classnames';
import { Field, Formik } from 'formik';
import { Button, IconSearch } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import DateInputField from '../../../common/components/form/fields/DateInputField';
import DivisionSelectorField from '../../../common/components/form/fields/DivisionSelectorField';
import MultiDropdownField from '../../../common/components/form/fields/MultiDropdownField';
import PlaceSelectorField from '../../../common/components/form/fields/PlaceSelectorField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import { EVENT_LANGUAGES } from '../../../constants';
import { KEYWORD_QUERY_PARAMS } from '../constants';
import FilterSummary from '../filterSummary/FilterSummary';
import styles from './eventSearchForm.module.scss';
import { useKeywordOptions } from './useKeywordOptions';

export type EventSearchFormValues = {
  text: string;
  inLanguage: EVENT_LANGUAGES[];
  date: Date | null;
  endDate: Date | null;
  places: string[];
  divisions: string[];
  organisation?: string;
  organisationId?: string;
  [KEYWORD_QUERY_PARAMS.TARGET_GROUPS]: string[];
  [KEYWORD_QUERY_PARAMS.CATEGORIES]: string[];
  [KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA]: string[];
};

const defaultEnrolmentInitialValues: EventSearchFormValues = {
  text: '',
  inLanguage: [],
  [KEYWORD_QUERY_PARAMS.TARGET_GROUPS]: [],
  [KEYWORD_QUERY_PARAMS.CATEGORIES]: [],
  [KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA]: [],
  date: null,
  endDate: null,
  places: [],
  divisions: [],
  organisation: '',
  organisationId: '',
};

export enum PanelState {
  Compact,
  Condensed,
  Advanced,
}

interface Props {
  initialValues?: EventSearchFormValues;
  onSubmit: (values: EventSearchFormValues) => void;
  onToggleAdvancedSearch: () => void;
  panelState: PanelState;
}

const EventSearchForm = ({
  initialValues = defaultEnrolmentInitialValues,
  onSubmit,
  onToggleAdvancedSearch,
  panelState,
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

  const handleTextSearchFocus = () => {
    if (panelState === PanelState.Compact) {
      onToggleAdvancedSearch();
    }
  };

  const { additionalCriteriaKeywords, categoryKeywords, targetGroups } =
    useKeywordOptions();

  const isAdvancedSearch = panelState === PanelState.Advanced;
  const isCompactSearch = panelState === PanelState.Compact;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ handleSubmit, values }) => {
        return (
          <form
            className={classNames(styles.eventSearchForm)}
            onSubmit={handleSubmit}
          >
            <div className={styles.contentWrapper}>
              <div className={styles.textRow}>
                <Field
                  hideLabel
                  name="text"
                  onFocus={handleTextSearchFocus}
                  component={TextInputField}
                  className={classNames(styles.searchInput, {
                    [styles.searchInputCompact]: isCompactSearch,
                  })}
                  label={t('events:search.labelText')}
                  placeholder={t('events:search.placeholderText')}
                />
                {isCompactSearch && (
                  <button
                    type="button"
                    className={styles.editSearchButton}
                    onClick={() => onToggleAdvancedSearch()}
                    aria-expanded={false}
                  >
                    {t('events:search.buttonEditSearch')}
                  </button>
                )}
              </div>
              {!isCompactSearch && (
                <div className={styles.filtersRow4}>
                  <Field
                    hideLabel
                    name="targetGroups"
                    className={styles.selectInput}
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
                    title={t('events:search.labelPlaces')}
                    component={PlaceSelectorField}
                    className={styles.selectInput}
                    showSearch={true}
                    name="places"
                    inputPlaceholder={t('events:search.placeInputPlaceholder')}
                  />
                  <Field
                    hideLabel
                    name="date"
                    className={styles.datePicker}
                    component={DateInputField}
                    labelText={t('events:search.labelDate')}
                    placeholder={t('events:search.labelDate')}
                    maxDate={values.endDate}
                  />
                  <Field
                    hideLabel
                    name="endDate"
                    className={styles.datePicker}
                    component={DateInputField}
                    labelText={t('events:search.labelEndDate')}
                    placeholder={t('events:search.labelEndDate')}
                    minDate={values.date}
                  />
                </div>
              )}
              {isAdvancedSearch && (
                <div className={styles.filtersRow4}>
                  <Field
                    hideLabel
                    name="categories"
                    className={styles.selectInput}
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
                    className={styles.selectInput}
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
                  <Field
                    component={DivisionSelectorField}
                    className={styles.selectInput}
                    name="divisions"
                    showSearch={true}
                    title={t('events:search.labelDivisions')}
                    inputPlaceholder={t(
                      'events:search.divisionInputPlaceholder'
                    )}
                  />
                  <Field
                    hideLabel
                    name="inLanguage"
                    className={styles.selectInput}
                    component={MultiDropdownField}
                    label={t('events:search.labelLanguage')}
                    placeholder={t('events:search.labelLanguage')}
                    options={languageOptions}
                  />
                </div>
              )}
              {!isCompactSearch && (
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
                  <div className={styles.buttonsContainer}>
                    <button
                      aria-expanded={isAdvancedSearch}
                      type="button"
                      onClick={() => {
                        onToggleAdvancedSearch();
                      }}
                    >
                      {!isAdvancedSearch
                        ? t('events:search.buttonAdvancedSearch')
                        : t('events:search.buttonHideAdditionalFields')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default EventSearchForm;
