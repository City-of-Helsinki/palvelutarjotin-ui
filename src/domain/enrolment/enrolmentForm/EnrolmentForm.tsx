import { Formik, Field } from 'formik';
import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import CheckboxField from '../../../common/components/form/fields/CheckboxField';
import DropdownField from '../../../common/components/form/fields/DropdownField';
import TextAreaField from '../../../common/components/form/fields/TextAreaField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import FocusToFirstError from '../../../common/components/form/FocusToFirstError';
import FormGroup from '../../../common/components/form/FormGroup';
import { PRIVACY_POLICY_LINKS } from '../../../constants';
import { Language, StudyLevel } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Link } from '../../../i18n';
import { translateValue } from '../../../utils/translateUtils';
import Container from '../../app/layout/Container';
import { ROUTES } from '../../app/routes/constants';
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
        values: { isSameResponsiblePerson },
      }) => {
        return (
          <form className={styles.enrolmentForm} onSubmit={handleSubmit}>
            <FocusToFirstError />
            <Container size="small">
              <h2>{t('enrolment:enrolmentForm.studyGroup.titleNotifier')}</h2>
              <FormGroup>
                <Field
                  labelText={t(
                    'enrolment:enrolmentForm.studyGroup.person.labelName'
                  )}
                  component={TextInputField}
                  name="studyGroup.person.name"
                />
              </FormGroup>
              <FormGroup>
                <Field
                  labelText={t(
                    'enrolment:enrolmentForm.studyGroup.person.labelEmailAddress'
                  )}
                  component={TextInputField}
                  name="studyGroup.person.emailAddress"
                />
              </FormGroup>
              <FormGroup>
                <Field
                  labelText={t(
                    'enrolment:enrolmentForm.studyGroup.person.labelPhoneNumber'
                  )}
                  component={TextInputField}
                  name="studyGroup.person.phoneNumber"
                />
              </FormGroup>
              <FormGroup>
                <Field
                  labelText={t('enrolment:enrolmentForm.studyGroup.labelName')}
                  component={TextInputField}
                  name="studyGroup.name"
                />
              </FormGroup>
              <div className={styles.rowWith2Columns}>
                <FormGroup>
                  <Field
                    helperText={t(
                      'enrolment:enrolmentForm.studyGroup.helperGroupName'
                    )}
                    labelText={t(
                      'enrolment:enrolmentForm.studyGroup.labelGroupName'
                    )}
                    component={TextInputField}
                    name="studyGroup.groupName"
                  />
                </FormGroup>

                <FormGroup>
                  <Field
                    label={t(
                      'enrolment:enrolmentForm.studyGroup.labelStudyLevel'
                    )}
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
                    labelText={t(
                      'enrolment:enrolmentForm.studyGroup.labelGroupSize'
                    )}
                    component={TextInputField}
                    min={0}
                    name="studyGroup.groupSize"
                    type="number"
                  />
                </FormGroup>
                <FormGroup>
                  <Field
                    labelText={t(
                      'enrolment:enrolmentForm.studyGroup.labelAmountOfAdult'
                    )}
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
                  labelText={t(
                    'enrolment:enrolmentForm.studyGroup.labelExtraNeeds'
                  )}
                  component={TextAreaField}
                  name="studyGroup.extraNeeds"
                />
              </FormGroup>

              <h2>{t('enrolment:enrolmentForm.titleResponsiblePerson')}</h2>
              <FormGroup>
                <div className={styles.checkboxWrapper}>
                  <Field
                    label={t(
                      'enrolment:enrolmentForm.labelIsSameResponsiblePerson'
                    )}
                    component={CheckboxField}
                    name="isSameResponsiblePerson"
                  />
                </div>
              </FormGroup>
              {!isSameResponsiblePerson && (
                <>
                  <FormGroup>
                    <Field
                      labelText={t('enrolment:enrolmentForm.person.labelName')}
                      component={TextInputField}
                      name="person.name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      labelText={t(
                        'enrolment:enrolmentForm.person.labelEmailAddress'
                      )}
                      component={TextInputField}
                      name="person.emailAddress"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      labelText={t(
                        'enrolment:enrolmentForm.person.labelPhoneNumber'
                      )}
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
                      label={t(
                        'enrolment:enrolmentForm.labelHasEmailNotification'
                      )}
                      component={CheckboxField}
                      name="hasEmailNotification"
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className={styles.checkboxWrapper}>
                    <Field
                      label={t(
                        'enrolment:enrolmentForm.labelHasSmsNotification'
                      )}
                      component={CheckboxField}
                      name="hasSmsNotification"
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Field
                    label={t('enrolment:enrolmentForm.labelLanguage')}
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
                    label={t(
                      'enrolment:enrolmentForm.labelIsSharingDataAccepted'
                    )}
                    component={CheckboxField}
                    name="isSharingDataAccepted"
                  />
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
