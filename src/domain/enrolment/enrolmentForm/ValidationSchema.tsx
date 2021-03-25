import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../app/forms/constants';

export default Yup.object().shape({
  isSharingDataAccepted: Yup.bool().oneOf(
    [true],
    'enrolment:enrolmentForm.validation.isSharingDataAccepted'
  ),
  language: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  person: Yup.object().when(
    ['isSameResponsiblePerson'],
    (isSameResponsiblePerson: boolean, schema: Yup.ObjectSchema) => {
      return isSameResponsiblePerson
        ? schema
        : schema.shape({
            name: Yup.string().required(
              VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
            ),
            emailAddress: Yup.string()
              .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
              .email(VALIDATION_MESSAGE_KEYS.EMAIL),
          });
    }
  ),
  studyGroup: Yup.object().when(
    [
      'maxGroupSize',
      'minGroupSize',
      'isMandatoryAdditionalInformationRequired',
    ],
    (
      maxGroupSize: number,
      minGroupSize: number,
      isMandatoryAdditionalInformationRequired: boolean,
      schema: Yup.ObjectSchema
    ) => {
      const validateSumOfSizePair = (
        sizePair: number | undefined,
        schema: Yup.NumberSchema,
        totalMinLimitValidationMessage: string,
        fieldMaxLimitValidationMessage: string,
        totalMaxLimitValidationMessage: string
      ): Yup.NumberSchema => {
        // Validate a single field against the total min and max sizes.
        // The used validation error message will be the same for both the fields.
        // This is also preventing negative param.max to occur in validation.
        if (
          !sizePair ||
          sizePair < 0 ||
          sizePair < minGroupSize ||
          sizePair > maxGroupSize
        ) {
          return (
            schema
              // Min-limit is current a gap to minimum group size.
              .min(
                sizePair != null ? minGroupSize - sizePair : minGroupSize,
                () => ({
                  min: minGroupSize,
                  key: totalMinLimitValidationMessage,
                })
              )
              // Max-limit is maximum group size
              .max(maxGroupSize, (param) => ({
                max: param.max,
                key: totalMaxLimitValidationMessage,
              }))
          );
        }

        // After the field pair is given, count how many seats are left
        // and use that as max limit.
        // The used validation error message will be unique for both the fields.
        return schema.max(maxGroupSize - sizePair, (param) => ({
          max: param.max,
          key: fieldMaxLimitValidationMessage,
        }));
      };

      return schema.shape(
        {
          person: Yup.object().shape({
            name: Yup.string().required(
              VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
            ),
            emailAddress: Yup.string()
              .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
              .email(VALIDATION_MESSAGE_KEYS.EMAIL),
          }),
          name: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
          groupName: Yup.string().required(
            VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
          ),
          // NOTE: GroupSize is (currently) the amount of children
          groupSize: Yup.number()
            .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
            .when(
              ['amountOfAdult'],
              (sizePair: number, schema: Yup.NumberSchema) =>
                validateSumOfSizePair(
                  sizePair,
                  schema,
                  VALIDATION_MESSAGE_KEYS.STUDYGROUP_MIN_CHILDREN_WITH_ADULTS,
                  VALIDATION_MESSAGE_KEYS.STUDYGROUP_MAX_WITH_ADULTS,
                  VALIDATION_MESSAGE_KEYS.STUDYGROUP_MAX_CHILDREN_WITH_ADULTS
                )
            ),
          amountOfAdult: Yup.number()
            .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
            .when(['groupSize'], (sizePair: number, schema: Yup.NumberSchema) =>
              validateSumOfSizePair(
                sizePair,
                schema,
                VALIDATION_MESSAGE_KEYS.STUDYGROUP_MIN_CHILDREN_WITH_ADULTS,
                VALIDATION_MESSAGE_KEYS.STUDYGROUP_MAX_WITH_CHILDREN,
                VALIDATION_MESSAGE_KEYS.STUDYGROUP_MAX_CHILDREN_WITH_ADULTS
              )
            ),
          extraNeeds: isMandatoryAdditionalInformationRequired
            ? Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            : Yup.string(),
          studyLevels: Yup.array()
            .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            .min(0),
        },
        [['groupSize', 'amountOfAdult']]
      );
    }
  ),
});
