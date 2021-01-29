import { Formik, Field } from 'formik';
import { Button, Notification } from 'hds-react';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import CheckboxField from '../../../common/components/form/fields/CheckboxField';
import DropdownField from '../../../common/components/form/fields/DropdownField';
import TextAreaField from '../../../common/components/form/fields/TextAreaField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import FormErrorNotification from '../../../common/components/form/FormErrorNotification';
import FormGroup from '../../../common/components/form/FormGroup';
import { PRIVACY_POLICY_LINKS } from '../../../constants';
import { Language, StudyLevel } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import keyify from '../../../utils/keyify';
import { translateValue } from '../../../utils/translateUtils';
import Container from '../../app/layout/Container';
import styles from './enrolmentForm.module.scss';
import ValidationSchema from './ValidationSchema';

export type EnrolmentFormFields = {
  hasEmailNotification: boolean;
  hasSmsNotification: boolean;
  isSameResponsiblePerson: boolean;
  isSharingDataAccepted: boolean;
  language: string;
  maxGroupSize: number;
  minGroupSize: number;
  person: {
    name: string;
    phoneNumber: string;
    emailAddress: string;
  };
  studyGroup: {
    person: {
      name: string;
      phoneNumber: string;
      emailAddress: string;
    };
    name: string;
    groupName: string;
    groupSize: string;
    amountOfAdult: string;
    studyLevel: string;
    extraNeeds: string;
  };
};

export const defaultInitialValues: EnrolmentFormFields = {
  hasEmailNotification: false,
  hasSmsNotification: false,
  isSameResponsiblePerson: true,
  isSharingDataAccepted: false,
  language: '',
  maxGroupSize: 0,
  minGroupSize: 0,
  person: {
    name: '',
    phoneNumber: '',
    emailAddress: '',
  },
  studyGroup: {
    person: {
      name: '',
      phoneNumber: '',
      emailAddress: '',
    },
    name: '',
    groupName: '',
    groupSize: '',
    amountOfAdult: '',
    studyLevel: '',
    extraNeeds: '',
  },
};

export const nameToLabelPath: Record<any, string> = {
  'studyGroup.person.name': 'enrolment:enrolmentForm.person.labelName',
  'studyGroup.person.phoneNumber':
    'enrolment:enrolmentForm.person.labelPhoneNumber',
  'studyGroup.person.emailAddress':
    'enrolment:enrolmentForm.person.labelEmailAddress',
  'studyGroup.name': 'enrolment:enrolmentForm.studyGroup.labelName',
  'studyGroup.groupName': 'enrolment:enrolmentForm.studyGroup.labelGroupName',
  'studyGroup.groupSize': 'enrolment:enrolmentForm.studyGroup.labelGroupSize',
  'studyGroup.amountOfAdult':
    'enrolment:enrolmentForm.studyGroup.labelAmountOfAdult',
  'studyGroup.studyLevel': 'enrolment:enrolmentForm.studyGroup.labelStudyLevel',
  'studyGroup.extraNeeds': 'enrolment:enrolmentForm.studyGroup.labelExtraNeeds',
  hasEmailNotification: 'enrolment:enrolmentForm.labelHasEmailNotification',
  hasSmsNotification: 'enrolment:enrolmentForm.labelHasSmsNotification',
  isSameResponsiblePerson:
    'enrolment:enrolmentForm.labelIsSameResponsiblePerson',
  isSharingDataAccepted: 'enrolment:enrolmentForm.labelIsSharingDataAccepted',
  language: 'enrolment:enrolmentForm.labelLanguage',
  'person.name': 'enrolment:enrolmentForm.studyGroup.person.labelName',
  'person.phoneNumber':
    'enrolment:enrolmentForm.studyGroup.person.labelPhoneNumber',
  'person.emailAddress':
    'enrolment:enrolmentForm.studyGroup.person.labelEmailAddress',
};

interface Props {
  initialValues?: EnrolmentFormFields;
  onSubmit: (values: EnrolmentFormFields) => void;
}

const EnrolmentForm: React.FC<Props> = ({
  initialValues = defaultInitialValues,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const studyLevelOptions = Object.values(StudyLevel).map((level) => ({
    label: level.startsWith('GRADE')
      ? t('enrolment:studyLevel.grade_interval', {
          postProcess: 'interval',
          count: Number(level.split('_')[1]),
        })
      : translateValue('enrolment:studyLevel.', level, t),
    value: level,
  }));

  const languageOptions = Object.values(Language).map((level) => ({
    label: translateValue('enrolment:language.', level, t),
    value: level,
  }));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={ValidationSchema}
    >
      {({
        errors,
        handleSubmit,
        touched,
        submitCount,
        values: { isSameResponsiblePerson },
      }) => {
        const showErrorNotification = !isEmpty(errors) && !!submitCount;
        const errorLabelKeys = keyify(errors)
          .map((path) => {
            return nameToLabelPath[path];
          })
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
                  required
                  aria-required
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
                    label={t(nameToLabelPath['studyGroup.studyLevel'])}
                    required
                    aria-required
                    component={DropdownField}
                    name="studyGroup.studyLevel"
                    options={studyLevelOptions}
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
                  labelText={t(nameToLabelPath['studyGroup.extraNeeds'])}
                  component={TextAreaField}
                  name="studyGroup.extraNeeds"
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
                      labelText={t(nameToLabelPath['person.name'])}
                      component={TextInputField}
                      name="person.name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
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
                      label={t(nameToLabelPath['hasEmailNotification'])}
                      component={CheckboxField}
                      name="hasEmailNotification"
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className={styles.checkboxWrapper}>
                    <Field
                      label={t(nameToLabelPath['hasSmsNotification'])}
                      component={CheckboxField}
                      name="hasSmsNotification"
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
                <Button type="submit">
                  {t('enrolment:enrolmentForm.buttonSubmit')}
                </Button>
              </div>
            </Container>
          </form>
        );
      }}
    </Formik>
  );
};

export default EnrolmentForm;
