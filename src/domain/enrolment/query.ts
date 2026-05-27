import { gql } from 'graphql-tag';

export const QUERY_ENROLMENT = gql`
  fragment enrolmentFields on EnrolmentNode {
    id
    isPartOfCulturalRoute
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
