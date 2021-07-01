import { gql } from 'graphql-tag';

export const QUERY_ENROLMENT = gql`
  fragment enrolmentFields on EnrolmentNode {
    id
    notificationType
    enrolmentTime
    status
    person {
      ...personFields
    }
    studyGroup {
      ...studyGroupFields
    }
  }
`;
