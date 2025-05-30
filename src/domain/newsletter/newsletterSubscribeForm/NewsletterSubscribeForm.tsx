import { Field, Formik, FormikHelpers } from 'formik';
import { Button } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { NewsletterGroupId, NewsletterSubscribeFormFields } from './constants';
import styles from './newsletterSubscribeForm.module.scss';
import getValidationSchema from './ValidationSchema';
import MultiDropdownField from '../../../common/components/form/fields/MultiDropdownField';
import TextInputField from '../../../common/components/form/fields/TextInputField';
import FocusToFirstError from '../../../common/components/form/FocusToFirstError';
import FormGroup from '../../../common/components/form/FormGroup';
import type { I18nNamespace } from '../../../types';
import { translateValue } from '../../../utils/translateUtils';

export const defaultInitialValues: NewsletterSubscribeFormFields = {
  groups: Object.values(NewsletterGroupId),
  firstName: '',
  lastName: '',
  email: '',
};

type Props = {
  initialValues: NewsletterSubscribeFormFields;
  onSubmit: (
    values: NewsletterSubscribeFormFields,
    actions: FormikHelpers<NewsletterSubscribeFormFields>
  ) => void;
};

const NewsletterSubscribeForm: React.FC<Props> = ({
  initialValues = defaultInitialValues,
  onSubmit,
}) => {
  const { t } = useTranslation<I18nNamespace>();

  const validationSchema = getValidationSchema();

  const groupsOptions = Object.entries(NewsletterGroupId).map(
    ([translationKey, groupId]) => ({
      label: translateValue(
        'newsletter:newsletterSubscribeForm.newsletterGroups.',
        translationKey,
        t
      ),
      value: groupId,
    })
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => {
        return (
          <form
            className={styles.newsletterSubscribeForm}
            onSubmit={handleSubmit}
          >
            <FocusToFirstError />
            <FormGroup>
              <Field
                label={t('newsletter:newsletterSubscribeForm.labelGroups')}
                component={MultiDropdownField}
                name="groups"
                options={groupsOptions}
                required
              />
            </FormGroup>
            <FormGroup>
              <div className={styles.rowWith2Columns}>
                <Field
                  label={t('newsletter:newsletterSubscribeForm.labelFirstName')}
                  component={TextInputField}
                  name="firstName"
                  required
                />
                <Field
                  label={t('newsletter:newsletterSubscribeForm.labelLastName')}
                  component={TextInputField}
                  name="lastName"
                  required
                />
              </div>
            </FormGroup>
            <FormGroup>
              <div className={styles.rowWith2Columns}>
                <Field
                  label={t('newsletter:newsletterSubscribeForm.labelEmail')}
                  component={TextInputField}
                  name="email"
                  required
                />
              </div>
            </FormGroup>
            <div className={styles.submitButtonWrapper}>
              <Button type="submit">
                {t('newsletter:newsletterSubscribeForm.buttonSubmit')}
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default NewsletterSubscribeForm;
