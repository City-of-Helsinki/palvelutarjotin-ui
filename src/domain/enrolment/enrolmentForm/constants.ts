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

export const nameToLabelPath: Record<string, string> = {
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
