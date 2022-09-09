import classNames from 'classnames';
import { Formik, Field, useFormikContext } from 'formik';
import { Button, Checkbox, Notification, IconAngleUp } from 'hds-react';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import CheckboxField from '../../../common/components/form/fields/CheckboxField';
import DropdownField from '../../../common/components/form/fields/DropdownField';
import MultiDropdownField from '../../../common/components/form/fields/MultiDropdownField';
import TextAreaField from '../../../common/components/form/fields/TextAreaField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import UnitPlaceSelectorField from '../../../common/components/form/fields/UnitPlaceSelectorField';
import FormErrorNotification from '../../../common/components/form/FormErrorNotification';
import FormGroup from '../../../common/components/form/FormGroup';
import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import { FORM_NAMES, PRIVACY_POLICY_LINKS } from '../../../constants';
import { Language } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import keyify from '../../../utils/keyify';
import { translateValue } from '../../../utils/translateUtils';
import useStudyLevels from '../../studyLevel/useStudyLevels';
import {
  defaultEnrolmentInitialValues,
  EnrolmentFormFields,
  nameToLabelPath,
} from './constants';
import styles from './enrolmentForm.module.scss';
import getValidationSchema from './ValidationSchema';

export interface Props {
  initialValues?: EnrolmentFormFields;
  enquiry: boolean;
  onSubmit: (values: EnrolmentFormFields) => void;
  submitting: boolean;
  onCloseForm: () => void;
  minGroupSize?: number;
  maxGroupSize?: number;
}

const EnrolmentForm: React.FC<Props> = ({
  initialValues = defaultEnrolmentInitialValues,
  enquiry,
  onSubmit,
  submitting,
  onCloseForm,
  minGroupSize = 10,
  maxGroupSize = 20,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { options: studyLevelOptions } = useStudyLevels();

  const languageOptions = Object.values(Language).map((level) => ({
    label: translateValue('common:languages.', level, t),
    value: level,
  }));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={getValidationSchema({
        minGroupSize: minGroupSize || 1,
        maxGroupSize,
      })}
    >
      {({
        errors,
        handleSubmit,
        touched,
        submitCount,
        values,
        dirty,
        resetForm,
      }) => {
        const {
          isSameResponsiblePerson,
          isMandatoryAdditionalInformationRequired,
        } = values;
        const showErrorNotification = !isEmpty(errors) && !!submitCount;
        const errorLabelKeys = keyify(errors)
          .map((path) => nameToLabelPath[path])
          .filter((i) => i);

        return (
          <form
            className={styles.enrolmentForm}
            onSubmit={handleSubmit}
            data-testid="enrolment-form"
            noValidate
          >
            <FormikPersist
              name={FORM_NAMES.ENROLMENT_FORM}
              initialValues={initialValues}
            />
            <h2>{t('enrolment:enrolmentForm.studyGroup.titleNotifier')}</h2>
            <FormErrorNotification
              errors={errorLabelKeys}
              visible={showErrorNotification}
            />
            <Notification
              className={styles.notification}
              label={t('enrolment:enrolmentForm.studyGroup.notificationLabel')}
            >
              {t('enrolment:enrolmentForm.studyGroup.notificationText')}
            </Notification>
            <button
              onClick={() => resetForm()}
              type="button"
              aria-hidden={!dirty}
              className={classNames(styles.resetFormButton, {
                [styles.resetFormButtonVisible]: dirty,
              })}
            >
              {t('enrolment:enrolmentForm.buttonResetForm')}
            </button>
            <div className={styles.rowWith2Columns}>
              <FormGroup>
                <Field
                  label={t(nameToLabelPath['studyGroup.person.name'])}
                  required
                  aria-required
                  component={TextInputField}
                  name="studyGroup.person.name"
                />
              </FormGroup>
              <FormGroup>
                <Field
                  required
                  aria-required
                  label={t(nameToLabelPath['studyGroup.person.emailAddress'])}
                  component={TextInputField}
                  name="studyGroup.person.emailAddress"
                />
              </FormGroup>
            </div>

            <div className={styles.rowWith2Columns}>
              <FormGroup>
                <Field
                  label={t(nameToLabelPath['studyGroup.person.phoneNumber'])}
                  component={TextInputField}
                  name="studyGroup.person.phoneNumber"
                />
              </FormGroup>
              <FormGroup>
                <UnitField
                  label={t(nameToLabelPath['studyGroup.unitName'])}
                  unitId="studyGroup.unitId"
                  unitName="studyGroup.unitName"
                  unitIdHelperText={t(
                    'enrolment:enrolmentForm.studyGroup.helperUnitId'
                  )}
                  unitIdPlaceholder={t(
                    'enrolment:enrolmentForm.studyGroup.placeholderUnitId'
                  )}
                  unitNameHelperText={t(
                    'enrolment:enrolmentForm.studyGroup.helperUnitName'
                  )}
                  unitNamePlaceholder={t(
                    'enrolment:enrolmentForm.studyGroup.placeholderUnitName'
                  )}
                  showUnitNameLabel={t(
                    'enrolment:enrolmentForm.studyGroup.showUnitNameLabel'
                  )}
                />
              </FormGroup>
            </div>

            <div className={styles.rowWith2Columns}>
              <FormGroup>
                <Field
                  required
                  aria-required
                  helperText={t(
                    'enrolment:enrolmentForm.studyGroup.helperGroupName'
                  )}
                  label={t(nameToLabelPath['studyGroup.groupName'])}
                  component={TextInputField}
                  name="studyGroup.groupName"
                />
              </FormGroup>

              <FormGroup>
                <Field
                  label={t(nameToLabelPath['studyGroup.studyLevels'])}
                  component={MultiDropdownField}
                  required
                  aria-required
                  name="studyGroup.studyLevels"
                  options={studyLevelOptions?.length ? studyLevelOptions : []}
                />
              </FormGroup>
            </div>

            <div className={styles.rowWith2Columns}>
              <div>
                <h2>{t('enrolment:enrolmentForm.studyGroup.titleGroup')}</h2>
                <div className={styles.rowWith2Columns}>
                  <FormGroup>
                    <Field
                      label={t(nameToLabelPath['studyGroup.groupSize'])}
                      required
                      aria-required
                      component={TextInputField}
                      min={0}
                      name="studyGroup.groupSize"
                      type="number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      label={t(nameToLabelPath['studyGroup.amountOfAdult'])}
                      required
                      aria-required
                      component={TextInputField}
                      min={0}
                      name="studyGroup.amountOfAdult"
                      type="number"
                    />
                  </FormGroup>
                </div>
              </div>

              <div>
                <h2>{t('enrolment:enrolmentForm.titleResponsiblePerson')}</h2>
                <FormGroup>
                  <div className={styles.checkboxWrapper}>
                    <Field
                      label={t(nameToLabelPath['isSameResponsiblePerson'])}
                      component={CheckboxField}
                      name="isSameResponsiblePerson"
                    />
                  </div>
                </FormGroup>
                {!isSameResponsiblePerson && (
                  <>
                    <FormGroup>
                      <Field
                        required
                        aria-required
                        label={t(nameToLabelPath['person.name'])}
                        component={TextInputField}
                        name="person.name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Field
                        required
                        aria-required
                        label={t(nameToLabelPath['person.emailAddress'])}
                        component={TextInputField}
                        name="person.emailAddress"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Field
                        label={t(nameToLabelPath['person.phoneNumber'])}
                        component={TextInputField}
                        name="person.phoneNumber"
                      />
                    </FormGroup>
                  </>
                )}
              </div>
            </div>
            <FormGroup>
              <Field
                helperText={t(
                  'enrolment:enrolmentForm.studyGroup.helperExtraNeeds'
                )}
                label={
                  isMandatoryAdditionalInformationRequired
                    ? t(nameToLabelPath['studyGroup.extraNeeds'])
                    : t(nameToLabelPath['studyGroup.extraNeedsOptional'])
                }
                component={TextAreaField}
                name="studyGroup.extraNeeds"
                required={isMandatoryAdditionalInformationRequired}
              />
            </FormGroup>

            <div className={styles.divider} />

            <h2>{t('enrolment:enrolmentForm.titleNotifications')}</h2>
            <div className={styles.rowWith3Columns}>
              <FormGroup>
                <div className={styles.checkboxWrapper}>
                  <Field
                    disabled
                    title={t(
                      'enrolment:enrolmentForm.titleTextHasEmailNotification'
                    )}
                    label={t(nameToLabelPath['hasEmailNotification'])}
                    component={CheckboxField}
                    name="hasEmailNotification"
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className={styles.checkboxWrapper}>
                  <SmsNotificationField
                    name="hasSmsNotification"
                    label={t(nameToLabelPath['hasSmsNotification'])}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <Field
                  label={t(nameToLabelPath['language'])}
                  component={DropdownField}
                  name="language"
                  options={languageOptions}
                />
              </FormGroup>
            </div>
            <FormGroup>
              <p>
                {t('enrolment:enrolmentForm.infoText1')}{' '}
                <a
                  href={PRIVACY_POLICY_LINKS[locale]}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.privacyPolicyLink}
                >
                  {t('common:privacyPolicy')}
                </a>
              </p>
            </FormGroup>
            <FormGroup>
              <div className={styles.checkboxWrapper}>
                <Field
                  label={t(nameToLabelPath['isSharingDataAccepted'])}
                  required
                  aria-required
                  component={CheckboxField}
                  name="isSharingDataAccepted"
                />
                <span className={styles.requiredIndicator}>*</span>
              </div>
            </FormGroup>

            {errors.isSharingDataAccepted && touched.isSharingDataAccepted && (
              <ErrorMessage>{t(errors.isSharingDataAccepted)}</ErrorMessage>
            )}
            <FormGroup>
              <p>{t('enrolment:enrolmentForm.infoText2')}</p>
            </FormGroup>

            <div className={styles.submitButtonWrapper}>
              <Button
                type="submit"
                disabled={submitting}
                className={enquiry ? styles.enquiryButton : styles.enrolButton}
              >
                {enquiry
                  ? t('enrolment:enrolmentForm.buttonSubmitEnquiry')
                  : t('enrolment:enrolmentForm.buttonSubmit')}
              </Button>
              <Button
                onClick={onCloseForm}
                variant="supplementary"
                iconRight={<IconAngleUp />}
              >
                {t('enrolment:enrolmentForm.buttonCancelAndCloseForm')}
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const SmsNotificationField: React.FC<{
  name: string;
  label: string;
}> = ({ name, label }) => {
  const { t } = useTranslation();

  const { values, setFieldValue } = useFormikContext();

  const {
    person: { phoneNumber },
    studyGroup: {
      person: { phoneNumber: studyGroupPhoneNumber },
    },
  } = values as EnrolmentFormFields;

  useEffect(() => {
    if (!(studyGroupPhoneNumber && phoneNumber)) {
      setFieldValue(name, false);
    }
  }, [name, setFieldValue, studyGroupPhoneNumber, phoneNumber]);

  const hasPhoneNumber = () => {
    return !!phoneNumber || !!studyGroupPhoneNumber;
  };

  return (
    <Field
      disabled={!hasPhoneNumber()}
      title={t('enrolment:enrolmentForm.titleTextHasSmsNotification')}
      label={label}
      name={name}
      component={CheckboxField}
    />
  );
};

const UnitField: React.FC<{
  label: string;
  unitId: string;
  unitName: string;
  unitIdHelperText?: string;
  unitIdPlaceholder?: string;
  unitNameHelperText?: string;
  unitNamePlaceholder?: string;
  showUnitNameLabel: string;
}> = ({
  label,
  unitId,
  unitName,
  unitIdHelperText,
  unitIdPlaceholder,
  unitNameHelperText,
  unitNamePlaceholder,
  showUnitNameLabel,
}) => {
  const { values, setFieldValue } = useFormikContext();

  const {
    studyGroup: { unitId: unitIdValue, unitName: unitNameValue },
  } = values as EnrolmentFormFields;

  const isUnitNameGiven = Boolean(!unitIdValue && unitNameValue);

  const [showUnitNameField, setShowUnitNameField] =
    React.useState(isUnitNameGiven);

  const handleShowUnitNameField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setShowUnitNameField(true);
      setFieldValue(unitId, null);
    } else {
      setShowUnitNameField(false);
      setFieldValue(unitName, '');
    }
  };

  return (
    <div className={styles.unitField}>
      {!showUnitNameField ? (
        <Field
          labelText={label}
          disabled={showUnitNameField}
          required={true}
          aria-required
          name={unitId}
          component={UnitPlaceSelectorField}
          helperText={unitIdHelperText}
          placeholder={unitIdPlaceholder}
        />
      ) : (
        <Field
          label={label}
          required
          aria-required
          name={unitName}
          component={TextInputField}
          helperText={unitNameHelperText}
          placeholder={unitNamePlaceholder}
        />
      )}
      <Checkbox
        id="show-studyGroup-unitName"
        label={showUnitNameLabel}
        checked={showUnitNameField}
        onChange={handleShowUnitNameField}
      />
    </div>
  );
};

export default EnrolmentForm;
