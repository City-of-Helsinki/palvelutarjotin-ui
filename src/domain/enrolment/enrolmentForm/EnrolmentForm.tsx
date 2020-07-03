import { Formik, Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextInputField from '../../../common/components/form/fields/TextInputField';
import FormGroup from '../../../common/components/form/FormGroup';
import Container from '../../app/layout/Container';
import styles from './enrolmentForm.module.scss';
import ValidationSchema from './ValidationSchema';

export type EnrolmentFormFields = {
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
    extraNeeds: string;
  };
};

export const defaultInitialValues: EnrolmentFormFields = {
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
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={ValidationSchema}
    >
      {({ handleSubmit }) => {
        return (
          <form className={styles.enrolmentForm} onSubmit={handleSubmit}>
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
            </Container>
          </form>
        );
      }}
    </Formik>
  );
};

export default EnrolmentForm;
