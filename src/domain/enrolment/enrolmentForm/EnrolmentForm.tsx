import { Formik, Field, useFormikContext } from 'formik';
import { Button, Notification } from 'hds-react';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import CheckboxField from '../../../common/components/form/fields/CheckboxField';
import DropdownField from '../../../common/components/form/fields/DropdownField';
import MultiDropdownField from '../../../common/components/form/fields/MultiDropdownField';
import TextAreaField from '../../../common/components/form/fields/TextAreaField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import FormErrorNotification from '../../../common/components/form/FormErrorNotification';
import FormGroup from '../../../common/components/form/FormGroup';
import { PRIVACY_POLICY_LINKS } from '../../../constants';
import { Language } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import keyify from '../../../utils/keyify';
import { translateValue } from '../../../utils/translateUtils';
import Container from '../../app/layout/Container';
import useStudyLevels from '../../studyLevel/useStudyLevels';
import {
  defaultInitialValues,
  EnrolmentFormFields,
  nameToLabelPath,
} from './constants';
import styles from './enrolmentForm.module.scss';
import ValidationSchema from './ValidationSchema';

interface Props {
  initialValues?: EnrolmentFormFields;
  enquiry: boolean;
  onSubmit: (values: EnrolmentFormFields) => void;
}

const EnrolmentForm: React.FC<Props> = ({
  initialValues = defaultInitialValues,
  enquiry,
  onSubmit,
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
      validationSchema={ValidationSchema}
    >
      {({ errors, handleSubmit, touched, submitCount, values }) => {
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
            noValidate
          >
            <Container size="small">
              <h2>{t('enrolment:enrolmentForm.studyGroup.titleNotifier')}</h2>
              <FormErrorNotification
                errors={errorLabelKeys}
                visible={showErrorNotification}
              />
              <Notification
                className={styles.notification}
                label={t(
                  'enrolment:enrolmentForm.studyGroup.notificationLabel'
                )}
              >
                {t('enrolment:enrolmentForm.studyGroup.notificationText')}
              </Notification>
              <FormGroup>
                <Field
                  labelText={t(nameToLabelPath['studyGroup.person.name'])}
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
                  labelText={t(
                    nameToLabelPath['studyGroup.person.emailAddress']
                  )}
                  component={TextInputField}
                  name="studyGroup.person.emailAddress"
                />
              </FormGroup>
              <FormGroup>
                <Field
                  labelText={t(
                    nameToLabelPath['studyGroup.person.phoneNumber']
                  )}
                  component={TextInputField}
                  name="studyGroup.person.phoneNumber"
                />
              </FormGroup>
              <FormGroup>
                <Field
                  labelText={t(nameToLabelPath['studyGroup.name'])}
                  required
                  aria-required
                  component={TextInputField}
                  name="studyGroup.name"
                />
              </FormGroup>
              <div className={styles.rowWith2Columns}>
                <FormGroup>
                  <Field
                    required
                    aria-required
                    helperText={t(
                      'enrolment:enrolmentForm.studyGroup.helperGroupName'
                    )}
                    labelText={t(nameToLabelPath['studyGroup.groupName'])}
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

              <h2>{t('enrolment:enrolmentForm.studyGroup.titleGroup')}</h2>
              <div className={styles.rowWith2Columns}>
                <FormGroup>
                  <Field
                    labelText={t(nameToLabelPath['studyGroup.groupSize'])}
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
                    labelText={t(nameToLabelPath['studyGroup.amountOfAdult'])}
                    required
                    aria-required
                    component={TextInputField}
                    min={0}
                    name="studyGroup.amountOfAdult"
                    type="number"
                  />
                </FormGroup>
              </div>
              <FormGroup>
                <Field
                  helperText={t(
                    'enrolment:enrolmentForm.studyGroup.helperExtraNeeds'
                  )}
                  labelText={
                    isMandatoryAdditionalInformationRequired
                      ? t(nameToLabelPath['studyGroup.extraNeeds'])
                      : t(nameToLabelPath['studyGroup.extraNeedsOptional'])
                  }
                  component={TextAreaField}
                  name="studyGroup.extraNeeds"
                  required={isMandatoryAdditionalInformationRequired}
                />
              </FormGroup>

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
                      labelText={t(nameToLabelPath['person.name'])}
                      component={TextInputField}
                      name="person.name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      required
                      aria-required
                      labelText={t(nameToLabelPath['person.emailAddress'])}
                      component={TextInputField}
                      name="person.emailAddress"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      labelText={t(nameToLabelPath['person.phoneNumber'])}
                      component={TextInputField}
                      name="person.phoneNumber"
                    />
                  </FormGroup>
                </>
              )}

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

              {errors.isSharingDataAccepted &&
                touched.isSharingDataAccepted && (
                  <ErrorMessage>{t(errors.isSharingDataAccepted)}</ErrorMessage>
                )}
              <FormGroup>
                <p>{t('enrolment:enrolmentForm.infoText2')}</p>
              </FormGroup>

              <div className={styles.submitButtonWrapper}>
                <Button
                  type="submit"
                  className={styles[enquiry ? 'enquiryButton' : 'enrolButton']}
                >
                  {t(
                    `enrolment:enrolmentForm.${
                      enquiry ? 'buttonSubmitEnquiry' : 'buttonSubmit'
                    }`
                  )}
                </Button>
              </div>
            </Container>
          </form>
        );
      }}
    </Formik>
  );
};

const SmsNotificationField: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => {
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

export default EnrolmentForm;
