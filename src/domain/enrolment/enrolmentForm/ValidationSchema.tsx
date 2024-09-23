import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../app/forms/constants';

type EnrolmentFormValidationSchemaProps = {
  minGroupSize?: number;
  maxGroupSize?: number;
  isQueueEnrolment: boolean;
};

export default function getValidationSchema({
  maxGroupSize,
  minGroupSize,
  isQueueEnrolment,
}: EnrolmentFormValidationSchemaProps) {
  return Yup.object().shape({
    hasEmailNotification: Yup.bool().oneOf(
      [true],
      'enrolment:enrolmentForm.validation.hasEmailNotification'
    ),
    isSharingDataAccepted: Yup.bool().oneOf(
      [true],
      'enrolment:enrolmentForm.validation.isSharingDataAccepted'
    ),
    language: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    person: Yup.object().when(
      ['isSameResponsiblePerson'],
      ([isSameResponsiblePerson], schema: Yup.AnyObjectSchema) => {
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
      ['isMandatoryAdditionalInformationRequired'],
      (
        [isMandatoryAdditionalInformationRequired],
        schema: Yup.AnyObjectSchema
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
            minGroupSize &&
            maxGroupSize &&
            (!sizePair ||
              sizePair < 0 ||
              sizePair < minGroupSize ||
              sizePair > maxGroupSize)
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

          if (maxGroupSize && sizePair) {
            // After the field pair is given, count how many seats are left
            // and use that as max limit.
            // The used validation error message will be unique for both the fields.
            return schema.max(maxGroupSize - sizePair, (param) => ({
              max: param.max,
              key: fieldMaxLimitValidationMessage,
            }));
          }

          return schema;
        };

        return schema.shape(
          {
            person: Yup.object().shape({
              name: Yup.string().required(
                VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
              ),
              phoneNumber: Yup.string().required(
                VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
              ),
              emailAddress: Yup.string()
                .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
                .email(VALIDATION_MESSAGE_KEYS.EMAIL),
            }),
            unitName: Yup.string().when(['unitId'], ([unitId], schema) => {
              if (!unitId) {
                return schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED);
              }
              return schema;
            }),
            unitId: Yup.string().when(['unitName'], ([unitName], schema) => {
              if (!unitName) {
                return schema
                  .nullable()
                  .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED);
              }
              return schema.default(null).nullable();
            }),
            groupName: Yup.string().required(
              VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
            ),
            // NOTE: GroupSize is (currently) the amount of children
            groupSize: Yup.number()
              .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
              .when(['amountOfAdult'], ([sizePair], schema) =>
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
              .when(['groupSize'], ([sizePair], schema) =>
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
            preferredTimes: isQueueEnrolment
              ? Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
              : Yup.string(),
            studyLevels: Yup.array()
              .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
              .min(1, VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
          },
          [
            ['groupSize', 'amountOfAdult'],
            ['unitName', 'unitId'],
          ]
        );
      }
    ),
  });
}
