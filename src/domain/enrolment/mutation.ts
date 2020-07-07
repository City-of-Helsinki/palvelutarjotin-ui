import qgl from 'graphql-tag';

export const MUTATION_ENROLMENT = qgl`
  mutation EnrolOccurrence($input: EnrolOccurrenceMutationInput!) {
    enrolOccurrence(input: $input) {
      enrolments {
        ...enrolmentFields
      }
    }
  }
`;
