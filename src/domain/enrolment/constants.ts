export enum ENROLMENT_URL_PARAMS {
  ENROLMENT_CREATED = 'enrolmentCreated',
  QUEUE_CREATED = 'queueCreated',
  EVENT_ID = 'eventId',
  NOTIFICATION_TYPE = 'notificationType',
  OCCURRENCES = 'occurrences',
}

export enum ENROLMENT_ERRORS {
  ENROLMENT_CLOSED_ERROR = 'ENROLMENT_CLOSED_ERROR',
  ENROLMENT_NOT_STARTED_ERROR = 'ENROLMENT_NOT_STARTED_ERROR',
  ENROLMENT_CANCDELLED_ERROR = 'ENROLMENT_CANCELLED_ERROR',
  INVALID_OCCURRENCE_AMOUNT_ERROR = 'INVALID_OCCURRENCE_AMOUNT_ERROR',
  INVALID_STUDY_GROUP_SIZE_ERROR = 'INVALID_STUDY_GROUP_SIZE_ERROR',
  NOT_ENOUGH_CAPACITY_ERROR = 'NOT_ENOUGH_CAPACITY_ERROR',
}
