import gql from 'graphql-tag';

export const QUERY_PERSON = gql`
  fragment studyGroupFields on StudyGroupNode {
    id
    name
    groupSize
    amountOfAdult
    groupName
    studyLevel
    extraNeeds
    person {
      ...personFields
    }
  }
`;
